new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,
    mapView: null,

    //-----------------
    // route handlers

    // default route, triggered on / or /#
    index: function(params) {

        // only instantiate the alerts collection once
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        // only instantiate on the initial run
        if (!this.indexView) {
            // create an instance of the home page-view (AnimView)
            this.indexView = Application.View["homeView"] = new Application.Views["home/home"]({
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

    // triggered when route matches /#map
    maplist: function(params) {

        // only create the map view if it hasnt been created yet
        if (!this.mapView) {
            // create map view
            this.mapView = Application.View["mapView"] = new Application.Views["home/maplist"]({
                el: '#map',
                className: 'maplist'
                // -- can use a new collection for locations 
                // or make the call directly w/ leaflet
                //collection: this.alerts
            });
        }

        // show the settings view
        Application.goto(this.mapView, {
            page: true
        });
    }
}));