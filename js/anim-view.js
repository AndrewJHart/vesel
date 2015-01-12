// The main Animating view base class/object definition. 
// All Views that require animation should extend AnimView in their
// object definition. 

define(['underscore', 'thorax'], function(_, Thorax) {

    return AnimView = window.AnimView = Thorax.View.extend({

        template: null,
        wasRendered: false,

        // base render class that checks whether the the view is to be a 'page' 
        // aka meant for transitions; This does some setup work by applying the
        // proper class(es), then triggering the 
        render: function(options) {

            // as part of refactor, show the current instance of the view using render
            console.log("Rendering " + this.getViewName() + " ID " + this.cid + " - render inherited from base class(AnimView)");

            // get existing options or init empty object
            options = options || {};

            // is this a "page-view" view?
            if (options.page === true) {
                this.$el.addClass('page');
            }

            // --------------------------------------------------
            // NOTE: Refactoring may be required for the before and after Render 
            // NOTE: hooks.. They are blocking -- meaning that improper use or 
            // NOTE: or configure of beforeRender hook can cause a lengthy delay
            // NOTE: before the base Thorax.View.render() method gets called...
            // NOTE: however, if its non-blocking/asyncronous then Thorax.View.render()
            // NOTE: could complete before the beforeRender() method is complete..
            // NOTE: Solutions: using $.deffered to trigger render on .done() or
            // NOTE: possibly chaining like this.beforeRender().render()..? Another
            // NOTE: safe option is using a closure and triggering render() as 
            // NOTE: a callback too the``` beforeRender method..


            // BeforeRender Hook for users (devs) to handle special cases like jQuery
            // plugin instantiation, etc.. before the view & template are rendered
            if (_.isFunction(this.beforeRender)) {
                // trigger whatever current/caller view's beforeRender() method
                this.beforeRender();
            }

            // call the parent render since we're overriding it in thorax
            // console.debug('*!*!*! Thorax.View rendering taking over!*!* for view ' + this.name);
            Thorax.View.prototype.render.apply(this, arguments);
            // console.debug('Finshed');

            // Trigger any additional or special rendering a user may require
            if (_.isFunction(this.afterRender)) {
                // trigger whatever current/caller view's onRender() method
                this.afterRender();
            }

            if (!this.wasRendered) {
                this.wasRendered = true;
            }

            return this;
        },

        conservativeRender: function() {
            //  Hook before the view & template are rendered
            if (_.isFunction(this.beforeRender)) {
                // trigger whatever current/caller view's beforeRender() method
                this.beforeRender();
            }

            // Trigger any additional post-render cases for users (devs)
            // to handle special cases like jQuery plugin instantiation, etc..
            if (_.isFunction(this.afterRender)) {
                // trigger whatever current/caller view's onRender() method
                this.afterRender();
            }

            return this;
        },

        // pre-rendering allows us to create the view, call it w/ any options
        // and trigger post render hooks still triggered but does not interfere 
        // with the animations for future renders. Performance boost!
        // NOTE: This does not trigger the pre-render() hook method for good reason
        preRender: function(options) {

            // get existing options or init empty object
            options = options || {};

            // is this a "page-view" view?
            if (options.page === true) {
                this.$el.addClass('page');
            }

            // is this view preprended or appended to the DOM?
            if (options.attachType) {
                console.debug('AnimView-> Shared Prototype method preRender()');
                console.debug('AttachType is: ' + options.attachType);
            }

            if (options.display) {
                this.$el.css('display', display);
            } else {
                this.$el.hide();
            }

            // call the parent render since we're overriding it in thorax
            Thorax.View.prototype.render.apply(this, arguments);

            // Trigger any additional or special rendering a user may require
            if (_.isFunction(this.afterRender)) {
                // trigger whatever current/caller view's onRender() method
                this.afterRender();
            }

            if (!this.wasRendered) {
                this.wasRendered = true;
            }

            return this;
        },

        transitionIn: function(options, callback) {
            var view = this,
                toggle = options.toggleIn || ''; // init toggle as empty classname


            var transitionIn = function() {

                view.$el.toggleClass(toggle).show().addClass(view.animateIn + ' animated');
                view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend', function() {

                    view.$el.removeClass(view.animateIn + ' animated');

                    if (_.isFunction(callback)) {
                        callback();
                    }
                });

            };

            // setting the page class' css to position: fixed; obviates the need
            // for this and still allows transitions to work perfectly
            _.delay(transitionIn, 0);
        },

        transitionOut: function(options, callback) {

            var view = this,
                toggle = options.toggleOut || '';

            // otherwise operate standard transitions        
            view.$el.toggleClass(toggle).addClass(view.animateOut + ' animated');
            view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend', function() {

                view.$el.removeClass(view.animateOut + ' animated').hide();


                if (_.isFunction(callback)) {
                    callback(); // hard to track bug! He's binding to transitionend each time transitionOut called 
                    // resulting in the callback being triggered callback * num of times transitionOut
                    // has executed
                }
            });
        },

        // ----------------------------
        // view helpers for subclasses

        // Getter method for seeing if this view has been rendered once
        // check if this view has been rendered before 
        // views that persist don't need to be re-appended to the DOM
        // and earlier version of goto doesnt remove a view if data-view-persist
        // but it still always appends the view to the DOM. I dont know if this
        // is triggering re-rendering or not so only one way to find out
        hasRendered: function() {
            return this.wasRendered;
        },

        // get *just* the view's filename without path & extension
        getViewName: function() {
            // split the default moduleName/module format and
            // pop the last value off of the newly created array
            return this.name; //.split('/').pop();
        },

        // get *just* the moduleName aka: the "path" w/o the filename
        getModuleName: function() {
            // same as above but use shift() to get 1st value from array
            return this.name.split('/').shift();
        },

        // get current view's filename with extension
        getFileName: function() {
            return this.name.split('/').pop() + '.js';
        },

        // get current view's full path w/ filename & extension
        getFullPath: function() {
            return "/js/views/" + this.name + ".js";
        },

        // hook and delegate to base remove
        onRemove: function() {

            if (_.isFunction(this.onClose)) {
                this.onClose();
            }

            if (_.isFunction(this.remove)) {
                Thorax.View.prototype.remove.apply(this, arguments);

                if (this.model)
                    this.model.unbind();

                if (this.collection)
                    this.collection.unbind();

                this.remove();
            }
        },

        // ----------------------------
        // internal management methods 

        // Broadcast events and trigger events on the current
        // view and all of its children -- can be used to manage
        // events for the duration of the RootView for extra managment
        triggerLifecycleEvent: function(eventName, options) {
            options = options || {};
            options.target = this;

            // trigger the event
            this.trigger(eventName, options);

            _.each(this.children, function(child) {
                // trigger event in each child view too
                child.trigger(eventName, options);
            });
        },

        goto: function(view, options) {
            var options = options || {},
                attachType = options.attachType || "append",
                previous = this.currentPage || null, // cache current view
                next = view; // cache new view too

            // is this view appended or prepended to the DOM?? 
            console.log('Attaching view ' + next.getViewName() + ' to DOM using attachType of: ' + attachType);

            // internal remove function to a) ensure we adhere to thorax 
            // structure b) clean-up child views c) undelegate events, etc..
            var remove = _.bind(function() {
                if (previous) {
                    console.debug('RootView.goto.remove() was triggered w/ context view');
                    console.debug(this.name + " is removing: " + previous.name);

                    previous.$el && previous.$el.remove();

                    // TODO: trigger onClose() for the previous view if it exists

                    // event broadcast -- useless the way thorax has done this.
                    // todo: deprecate and refactor by extending Bacbkone.events
                    //       and trigger namespaced view events like 
                    //       "From:Root:deactivated" or something clean.
                    //triggerLifecycleEvent.call(previous, 'deactivated', options);
                    previous.triggerLifecycleEvent('deactivated', options);

                    // use inherited method to trigger thorax helper for cleaning
                    // up and removing any nested or child views
                    this._removeChild(previous);
                }
            }, this);


            if (options.page === true) {
                // Standard transitions from view to view happen here

                // check for a previous view before trying anything
                if (previous) {

                    // Animate the previous view based on its animateOut property
                    // and pass it this function as a callback, after the animation
                    // has completed, so we can remove & destroy the previous view.
                    previous.transitionOut(options, function() {

                        // save the previous view's DOM el & state entirely
                        // if it has a `data-view-persist` attribute = true
                        if (previous.$el.data('view-persist') == true) {

                            // this view does not get removed
                            console.debug("Previous view " + previous.getViewName() + "'s data-view-persist is true - not removing!");

                            // although this view is not removed, provide a hook for 
                            // a user to perform cleanup, remove classes, etc.. before
                            // the next view is animated in. E.g. This hook is great for
                            // removing the effeckt-page-active class from home-vew before
                            // the map-view is rendered so that settings toggle works w/ map
                            // view too. :) :) 
                            if (_.isFunction(previous.beforeNextViewLoads)) {
                                previous.beforeNextViewLoads();
                            }
                        } else {
                            // allow user to cleanup actions pre-removal w/ this hook
                            if (_.isFunction(previous.beforeRemove)) {
                                previous.beforeRemove();
                            }

                            // allow user cleanup by defining onRemove callback
                            if (_.isFunction(previous.onRemove)) {
                                previous.onRemove();
                            }

                            // remove the previous view (copied from LayoutView)
                            // remove();

                            // allow user to trigger actions post-removal w/ this hook
                            if (_.isFunction(previous.afterRemove)) {
                                previous.afterRemove();
                            }
                        }
                    });
                }


                // if the new view has not already been rendered before
                // then render it and append it the dom. Otherwise were 
                // performing 2 wasteful ops here: rendering again.. but 
                // more importantly: appending an existing view to an 
                // existing DOM that has the same view...
                // This works because persistent views still exist so 
                // hasRendered will return the same value, whereas non-persistant
                // views, like detail, were removed and hasRendered will be false.
                if (!next.hasRendered()) {

                    // render the new view as a page
                    next.render({
                        page: true
                    });

                    // attach the new view to the DOM element belonging to 
                    // (this) the base page view manager aka: root view
                    if (attachType) {
                        // NOTE: attachType = "append" or "prepend"
                        this.$el[attachType](next.$el);
                    } else {
                        // default to append'ing the view to DOM
                        this.$el.append(next.$el);
                    }

                } else {
                    // persisting view has already been rendered once so 
                    // call a *conservative render* to trigger hooks only  
                    next.conservativeRender();
                }

                // animate the new view 
                // next.transitionIn(options);

                // animate the new view 
                next.transitionIn(options, function() {
                    // if a previous view does exist & is disposable then drop it.
                    if (previous) {
                        // on transition new view in delete any disposable views
                        if (!previous.$el.data('view-persist')) {

                            // allow user to cleanup actions pre-removal w/ this hook
                            if (_.isFunction(previous.beforeRemove)) {
                                previous.beforeRemove();
                            }

                            // allow user cleanup by defining onRemove callback
                            if (_.isFunction(previous.onRemove)) {
                                previous.onRemove();
                            }

                            // remove the previous view (copied from LayoutView)
                            remove();

                            // allow user to trigger actions post-removal w/ this hook
                            if (_.isFunction(previous.afterRemove)) {
                                previous.afterRemove();
                            }
                        }
                    }
                });

            } else { // this view is not a page/pane so apply no transitions

                // check for a previous view before acting
                if (previous) {
                    if (previous.$el.data('view-name') == 'home/home' ||
                        previous.$el.data('view-persist') == true) {

                        // even though no anim, persisting views still need callback
                        // before they are "closed" or removed from screen
                        if (_.isFunction(previous.beforeNextViewLoads)) {
                            previous.beforeNextViewLoads();
                        }

                    } else {

                        // allow user to cleanup actions pre-removal w/ this hook
                        if (_.isFunction(previous.beforeRemove)) {
                            previous.beforeRemove();
                        }

                        // remove the previous view, its children, & publish event
                        remove();

                        // allow user to trigger actions post-removal w/ this hook
                        if (_.isFunction(previous.afterRemove)) {
                            previous.afterRemove();
                        }
                    }
                }

                // render the new view
                next.render({
                    page: true // its still a "page view" just no transition hooks
                });

                // append new view to the body (or the el for the root view)
                this.$el.append(next.$el);
            }

            // assign the new view as the current view for next execution of goto
            this.currentPage = next;
        }
    }); // -- end of Animation View base class definition

    //return AnimView;

}); // end of module