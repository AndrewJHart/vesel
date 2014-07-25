define([
    'underscore',
    'anim-view',
    'hbs!templates/root'
], function(_, AnimView, template) {

    // Create the Application object and root View, Application.goto(view) will
    // pass a view to the Root view to be animated or just added to the page..
    // Here we are defining the base Application "root" view class from AnimView
    var RootView = AnimView.extend({

        el: 'body',
        template: template,

        goto: function(view, options) {
            var options = options || {},
                previous = this.currentPage || null, // cache current view
                next = view; // cache new view too

            // internal remove function to 
            // a) ensure we adhere to thorax structure
            // b) clean-up child views 
            // c) undelegate events
            var remove = _.bind(function() {
                if (previous) {
                    console.debug('RootView.goto.remove() was triggered w/ context view');
                    console.debug(this.name + " is removing: " + previous.name);

                    previous.$el && previous.$el.remove();

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
                // Standard transitions from page view to page view happen here

                // check for a previous view before trying anything
                if (previous) {
                    previous.transitionOut(options, function() {

                        // only remove the old view if its not the Home view
                        if (previous.$el.data('view-persist') == true) {

                            // this view does not get removed
                            console.debug("Previous view " + previous.getViewName() + " has data-view-persist attr equal to true - not removing!");

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

                            // remove the previous view (copied from LayoutView)
                            remove();

                            // allow user to trigger actions post-removal w/ this hook
                            if (_.isFunction(previous.afterRemove)) {
                                previous.afterRemove();
                            }
                        }
                    });
                }


                // if the new view has not already been rendered once
                // then render it and append it the dom. Otherwise we were 
                // performing 2 wasteful ops here: rendering again.. but 
                // more importantly: appending an existing view to an 
                // existing DOM that has the same view...
                // This works because persistent views still exist so 
                // hasRendered will return the same value, whereas non-persistant
                // views, like detail, were removed and hasRendered will be true.
                if (!next.hasRendered()) {

                    // render the new view as a page
                    next.render({
                        page: true
                    });

                    // append new view to the body (the el for this root view)
                    this.$el.append(next.$el);
                } else {

                    // persistent view has been rendered once so we call 
                    // conservative render to trigger pre & post render hooks only  
                    next.conservativeRender();
                }

                // animate the new view 
                next.transitionIn(options);

            } else { // this view is not a page/pane so apply no transitions

                // check for a previous view before acting
                if (previous) {
                    if (previous.$el.data('view-persist') == true) {

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

    }); // -- end of RootView class definition


    // append an instance method on the rootView object
    var instance;
    RootView.getInstance = function(target) {
        if (!instance) {
            instance = window.Application = new RootView({
                name: 'root', // will use template with name root.handlebars
                el: 'body' // force view attach directly to body vs appending div to it
            });

            instance.appendTo(target || document.body);
        }
        return instance;
    };

    return RootView;
});