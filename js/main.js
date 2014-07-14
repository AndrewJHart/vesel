require([
    'jquery',
    'backbone',
    'views/root',
    'routers/routes',
    'FastClick',
    'helpers'
], function($, Backbone, RootView, Router, FastClick, store) {

    // IIFE to load backbone and app automatically separate from device ready
    (function startApp() {

        // attach fastclick
        FastClick.attach(document.body);

        // start backbone history
        // Backbone.history.start({
        //     pushState: false,
        //     root: '/',
        //     silent: true
        // });

        
        // RootView may use link or url helpers which
        // depend on Backbone history being setup
        // so need to wait to loadUrl() (which will)
        // actually execute the route
        RootView.getInstance(document.getElementById('alerts-feed'));

        // Instantiate the main router
        new Router();

        // This will trigger your routers to start
        // Backbone.history.loadUrl('alerts');
        Backbone.history.start({
            root: '/alerts/huntington/'
        });

    })();
});