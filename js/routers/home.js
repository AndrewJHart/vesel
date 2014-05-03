new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,
    mapView: null,

    //-----------------
    // route handlers

    index: function(params) {
        // only instantiate the alerts collection once
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        // only instantiate on the initial run
        if (!this.indexView) {
            // create an instance of the home page-view (AnimView)
            this.indexView = Application.View["homeIndex"] = new Application.Views["home/home"]({
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

    maplist: function(params) {

        //if (!this.settingsView) {
        // create settings view
        var mapView = new Application.Views["home/maplist"]({
            className: 'maplist left',
            collection: this.alerts
        });
        //}

        // show the settings view
        Application.goto(mapView, {
            page: true,
            toggleIn: 'left'
        });
    }
}));