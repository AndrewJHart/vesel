require([
    'jquery',
    'backbone',
    'views/root',
    'routers/routes',
    'helpers',
], function($, Backbone, RootView, Router) {
    $(function() {
        Backbone.history.start({
            pushState: false,
            root: '/',
            silent: true
        });

        // RootView may use link or url helpers which
        // depend on Backbone history being setup
        // so need to wait to loadUrl() (which will)
        // actually execute the route
        RootView.getInstance(document.body);

        // Instantiate the main router
        new Router();

        // This will trigger your routers to start
        Backbone.history.loadUrl('/');
    });
});