new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,

    //-----------------
    // route handlers

    index: function(params) {
        // only instantiate the alerts collection once
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        // only instantiate on the initial run
        if (!this.indexView) {
            // create an instance of the home page-view (AnimView)
            this.indexView = new Application.Views["home/home"]({
                el: '#home',
                className: 'home page',
                collection: this.alerts
            });
        }

        // Tell the root view to render the view and render it as a page w/ animations
        Application.goto(this.indexView, {
            page: true
        });
    },

    settings: function(params) {

        console.debug('*****SETTINGS ROUTE TRIGGERED');
        
        var settingsView = new Application.Views["home/settings"]({
            className: 'settings left'
        });

        Application.goto(settingsView, {
            page: true,
            toggleIn: 'left'
        });
    }
}));