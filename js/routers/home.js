new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,

    //-----------------
    // route handlers

    index: function(params) {
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        // only instantiate on the initial run
        if (!this.indexView) {

            this.indexView = new Application.Views["home/home"]({
                el: '#home',
                className: 'home page',
                collection: this.alerts
            });
        }

        Application.goto(this.indexView, {
            page: true
        });
    }
}));