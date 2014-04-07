new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        this.indexView = new Application.Views["home/index"]({
            el: '#page',
            collection: Application.Collection['alerts']
        });

        // retain the main collection list view in memory
        this.indexView.retain(Application);

        // This is where we will do our transition work with callbacks
        Application.setView(this.indexView);
    },

    detail: function(params) {
        console.debug('Detail route triggered in wrong router..');
    }
}));