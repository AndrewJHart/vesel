new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,

    index: function(params) {
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        //if (!this.indexView) {
        this.indexView = new Application.Views["home/index"]({
            el: '#page',
            collection: Application.Collection['alerts']
        });
        //}

        // retain the main collection list view in memory
        Application.retain(this.indexView);

        // This is where we will do our transition work with callbacks
        Application.setView(this.indexView);
    },

    detail: function(params) {
        console.debug('Detail route triggered in wrong router..');
    }
}));