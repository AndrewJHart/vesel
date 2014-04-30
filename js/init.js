// The main Animating view base class/object definition. 
// All Views that require animation should extend AnimView in their
// object definition. 
var AnimView = window.AnimView = Thorax.View.extend({

    template: null,

    // base render class that checks whether the the view is to be a 'page' 
    // aka meant for transitions; This does some setup work by applying the
    // proper class(es), then triggering the 
    render: function(options) {

        // as part of refactor, show the current instance of the view using render
        console.log('AnimView::Render triggered for the ' + this.name + ' View with cid: ' + this.cid);

        options = options || {};

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
        console.debug('*!*!*! Thorax.View rendering taking over!*!* for view ' + this.name);
        Thorax.View.prototype.render.apply(this, arguments);

        // Trigger any additional or special rendering a user may require
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
                    console.debug('Callback triggered on event transitionend for TransitionIn');
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

        view.$el.toggleClass(toggle).addClass(view.animateOut + ' animated');
        view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend', function() {

            view.$el.removeClass(view.animateOut + ' animated').hide();


            if (_.isFunction(callback)) {
                callback(); // hard to track bug! He's binding to transitionend each time transitionOut called 
                // resulting in the callback being triggered callback * num of times transitionOut
                // has executed
                console.debug('Callback triggered on event transitionend for TransitionOut');
            }
        });

    }
});


// Create the Application object and root View, Application.goto(view) will
// pass a view to the Root view to be animated or just added to the page..
// Here we are defining the base Application "root" view class from AnimView
var RootView = AnimView.extend({

    el: 'body',
    template: null,

    goto: function(view, options) {
        var options = options || {},
            previous = this.currentPage || null, // cache current view
            next = view; // cache new view too

        // internal remove function to a) ensure we adhere to thorax 
        // structure b) clean-up child views c) undelegate events, etc..
        remove = _.bind(function() {
            if (previous) {
                previous.$el && previous.$el.remove();

                // event broadcast -- useless the way thorax has done this.
                // todo: deprecate and refactor by extending Bacbkone.events
                //       and trigger namespaced view events like 
                //       "From:Root:deactivated" or something clean.
                triggerLifecycleEvent.call(previous, 'deactivated', options);

                // use inherited method to trigger thorax helper for cleaning
                // up and removing any nested or child views
                this._removeChild(previous);
            }
        }, this);

        if (options.aside === true) {
            // do a little work for effeckt right now

            // use the animate in to add classes
            next.render({
                page: false
            });

            this.$el.append(next.$el);

            next.$el.toggleClass(next.animateAside);

            // assign the new view as the current view for next execution of goto
            this.currentPage = next;

            return;
        }

        // if this is a page then animate it
        if (options.page === true) {

            // check for a previous view before trying anything
            if (previous) {
                previous.transitionOut(options, function() {

                    // only remove the old view if its not the Home view
                    if (previous.$el.data('view-name') == 'home/home' ||
                        previous.$el.attr('data-view-persist') == 'true') {

                        // this view does not get removed
                        console.debug('*Previous view ' + previous.name + ' has data-view-persist="true" and will not be removed from the DOM');
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

            // render the new view as a page
            next.render({
                page: true
            });

            // append new view to the body (the el for this root view)
            this.$el.append(next.$el);

            // animate the new view 
            next.transitionIn(options);

        } else { // this view is not a page/pane so apply no animations

            // check for a previous view before acting
            if (previous) {
                if (previous.$el.data('view-name') == 'home/home' || 
                    previous.$el.data('view-persist') == 'true') {

                    // just for debug output, will remove 
                    console.log('*Previous view has data-view-persist=true so its not being removed from the DOM');
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
                page: false
            });

            // append new view to the body (or the el for the root view)
            this.$el.append(next.$el);
        }

        // assign the new view as the current view for next execution of goto
        this.currentPage = next;
    },

    // --------------------------
    // internal methods (private)

});
// end base "class" definition of the root view


// -------------------- TODO ----------------------------------
// todo: refactor this or track down whether it is even needed
// 
// only called by the core LayoutView and defined outside of the
// layoutView object itself, this seems to broadcast events to 
// all of the children associated with the current view instance..
// update: this = the layout view instance -- so this is broadcasting
//          the events to currentView and/or oldView
function triggerLifecycleEvent(eventName, options) {
    options = options || {};
    options.target = this;
    this.trigger(eventName, options);

    console.log('triggerLifecycleEvent::Who am I and who are my children?');
    console.log('I am: ');
    console.debug(this.name || this);
    console.log('and my children are:');
    console.debug(this.children);
    console.log('and the event im sharing is');
    console.debug(eventName);

    _.each(this.children, function(child) {
        console.debug(child);
        child.trigger(eventName, options);
    });
}


//--------------------------------------------
// create the application root view instance
// 
var Application = window.Application = new RootView({
    name: 'root', // will use template with name root.handlebars
    el: 'body' // force view attach directly to body vs appending div to it
});

// Alias the special hashes for naming consistency with the
// rest of the Thorax registry objects i.e. Application.Views["folder/file"]
Application.templates = Thorax.templates;
Application.Views = Thorax.Views;
Application.Models = Thorax.Models;
Application.Collections = Thorax.Collections;

// Allows load:end and load:start events to propagate
// to the application object
Thorax.setRootObject(Application);

// This configures our Application object with values
// from the lumbar config, then sets it as the exported
// value from the base module.
_.extend(Application, module.exports);

// make init.js return Application, i.e. var app = require(init);
// makes the app variable equal to the root Application object
module.exports = Application;

// This call is required but does nothing currently.. Thorax issue
Application.initBackboneLoader(Application, function(type, module) {
    // You have failed to load the module. Let the world know.
});

// on DOM ready config history state, render & append root view, etc..
$(function() {
    // Application and other templates included by the base
    // Application may want to use the link and url helpers
    // which use hasPushstate, etc.. 
    //e.g. {{#link url="model.id" expand-tokens="true"}}click me{{/link}}

    // order of ops here is:
    // setup history, then render, then dispatch backbone to load url
    Backbone.history.start({
        pushState: false,
        root: '/',
        silent: true
    });

    // TODO: can remove after this is fixed:
    // https://github.com/walmartlabs/lumbar/issues/84
    Application.template = Thorax.templates.application;

    // Append the root view to the DOM
    // (the root view's appendTo auto-triggers the render() method)
    Application.appendTo('body');

    // tell backbone to go...
    Backbone.history.loadUrl();
});