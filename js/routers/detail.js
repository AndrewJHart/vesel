new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        console.log('params sent to detail action from router are ' + params);

        var model = window.alertsCollection.get(params);

        console.log('logging model...');
        console.log(model);

        if (model === null || model === undefined) {
            model = {
                id: 4,
                title: 'ListItem Element 4 (not in collection)',
                visible: true
            };
        }

        var view = new Application.Views["detail/index"]({
            model: model
        });

        // swap views
        Application.setView(view);
        // , {
        //     transition: function(newView, oldView, append, remove, complete) {
        //         console.log('Old View:');
        //         console.debug(oldView);
        //         console.log('Old Views Element');
        //         console.debug(oldView.$el);

        //         console.log('New View:');
        //         console.debug(newView);
        //         console.log('New Views Element');
        //         console.debug(newView.$el);

        //         if ((oldView !== null && oldView !== undefined) &&
        //             (newView !== null && newView !== undefined)) {

        //             append(); // append the new view?

        //             setTimeout(function() {
        //                 // slide out the current detail view
        //                 $('.content', oldView.el).removeClass('fade out').addClass('fade in');

        //                 // slide in the new detail view
        //                 $('.content', newView.el).removeClass('sliding left').addClass('sliding').addClass('left');

        //                 setTimeout(function() {
        //                     remove();
        //                     complete();
        //                 }, 300);
        //             }, 0);
        //         }

        // ****
        // Create a single function that performs animation operations
        // passed to it via params and then triggers callback so thorax
        // can append/remove/complete() the cycle
        // ****

        // append();
        // yourAnimation(function() {
        //     remove();
        //     complete();
        // });
    }
}));