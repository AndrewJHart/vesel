new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        this.alerts = window.alertsCollection = new Application.Collection([{
            id: 1,
            title: 'ListItem Element 1',
            visible: true
        }, {
            id: 2,
            title: 'ListItem Element 2',
            visible: true
        }, {
            id: 3,
            title: 'ListItem Element 3',
            visible: false
        }, {
            id: 4,
            title: 'ListItem Element 4',
            visible: true
        }]);

        this.indexView = new Application.Views["home/index"]({
            el: '#page',
            collection: this.alerts
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