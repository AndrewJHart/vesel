require([
    'jquery',
    'backbone',
    'views/root',
    'routers/routes',
    'FastClick',
    'store',
    'helpers'
], function($, Backbone, RootView, Router, FastClick, store) {

    var app,
        cached_token,
        firstRunDemo,
        getCordovaFilePath,
        ajaxServerDelegate,
        resumeApp,
        onDeviceReady,
        firstRun;

    // IIFE to load backbone and app automatically separate from device ready
    (function startApp() {

        // attach fastclick
        FastClick.attach(document.body);

        // // start backbone history
        Backbone.history.start({
            pushState: false,
            root: '/product/alerts/',
            silent: true
        });


        // RootView may use link or url helpers which
        // depend on Backbone history being setup
        // so need to wait to loadUrl() (which will)
        // actually execute the route
        RootView.getInstance(document.getElementById('alerts-feed'));

        // Instantiate the main router
        var router = new Router();

        // This will trigger your routers to start

        router.navigate('' + window.detail_pk + '', {
            trigger: true
        });
        //Backbone.history.loadUrl('detail');
        // Backbone.history.start();

    })();
});