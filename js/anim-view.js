// The main Animating view base class/object definition. 
// All Views that require animation should extend AnimView in their
// object definition. 

define(['underscore', 'thorax'], function (_, Thorax) {

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
    }
  });  // -- end of Animation View base class definition

  //return AnimView;

});  // end of module