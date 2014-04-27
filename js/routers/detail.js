new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {

        var self = this;

        console.log('params sent to detail action from router are ' + params);

        var model = Application.Collection['alerts'].get(params);
        console.log('model properties from collection are:');
        console.debug(model);

        var view = new Application.Views["detail/index"]({
            className: 'detail right',
            model: model
        });

        Application.goto(view, {
            remove: 'right'
        });
    }
}));