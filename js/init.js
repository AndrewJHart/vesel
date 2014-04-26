// Create the Application object, Application.setView() will
// place a view inside the {{layout-element}} in
// templates/application.handlebars
var AnimView = window.AnimView = Thorax.View.extend({

    template: null,

    initialize: function() {
        console.debug('AnimView base class initialize triggered');

        return this;
    },

    // base render class that checks whether the the view is to be a 'page' 
    // aka meant for transitions; This is somewhat of an anti-pattern in that 
    // each view inheriting from this will have to trigger this render method 
    // with a 'super' call. A better remedy is to provide a check for a method
    // like onRender() and trigger it with correct context so that views which
    // inherit from this can provide an onRender() method for any additional 
    // rendering logic specific to that view. 
    render: function(options) {

        // as part of refactor, show the current instance of the view using render
        console.debug('Render triggered for the ' + this.name + ' View with cid: ' + this.cid);

        options = options || {};

        if (options.page === true) {
            this.$el.addClass('page');
        }

        // From comment above, refactoring to use onRender() instead of override
        if (_.isFunction(this.onRender)) {
            // trigger whatever current/caller view's onRender() method
            this.onRender();
        }

        // call the parent render since we're overriding it in thorax
        Thorax.View.prototype.render.apply(this, arguments);

        return this;
    },

    transitionIn: function(callback) {

        var view = this;

        var transitionIn = function() {

            view.$el.show().addClass(view.animateIn + ' animated');
            view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend', function() {

                view.$el.removeClass(view.animateIn + ' animated');

                if (_.isFunction(callback)) {
                    callback();
                    console.log('Callback triggered on transitionend for TransitionIn method');
                }
            });
        };

        // setting the page class' css to position: fixed; obviates the need
        // for this and still allows transitions to work perfectly since pos
        // is absolute during animation 
        _.delay(transitionIn, 0);
    },

    transitionOut: function(callback) {

        var view = this;

        view.$el.addClass(view.animateOut + ' animated');
        view.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd animationend', function() {

            view.$el.removeClass(view.animateOut + ' animated').hide();

            if (_.isFunction(callback)) {
                callback(); // hard to track bug! He's binding to transitionend each time transitionOut called 
                // resulting in the callback being triggered callback * num of times transitionOut
                // has executed
                console.log('Callback triggered on transitionend for TransitionOut method');
            }
        });

    }
});


// define the base Application "root" view class
var RootView = AnimView.extend({

    el: 'body',
    template: null,

    goto: function(view) {

        // cache the current view and the new view
        var previous = this.currentPage || null;
        var next = view;

        if (previous) {
            previous.transitionOut(function() {
                // only remove the old view if its not the Home view
                if (previous.$el.data('view-name') == 'home/home') {
                    console.log('*******Previous view is Home; not removing for it should persist');
                } else {
                    // otherwise cleanup all other views since we dont want them to persist
                    previous.remove();
                }
            });
        }

        next.render({
            page: true
        }); // render the next view
        this.$el.append(next.$el); // append the next view to the body (the el for this root view)
        next.transitionIn();
        this.currentPage = next;
    }
});


// create our application root view instance
var Application = window.Application = new RootView({
    name: 'root',
    el: 'body'
});

// Alias the special hashes for naming consistency
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
module.exports = Application;

Application.initBackboneLoader(Application, function(type, module) {
    // You have failed to load the module. Let the world know.
});

$(function() {
    // Application and other templates included by the base
    // Application may want to use the link and url helpers
    // which use hasPushstate, etc. so setup history, then
    // render, then dispatch
    Backbone.history.start({
        pushState: false,
        root: '/',
        silent: true
    });
    // TODO: can remove after this is fixed:
    // https://github.com/walmartlabs/lumbar/issues/84
    Application.template = Thorax.templates.application;
    Application.appendTo('body');
    Backbone.history.loadUrl();
});