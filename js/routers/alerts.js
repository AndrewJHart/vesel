// Router / Controller for the main Alerts module
new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        this.alerts = new Application.Collection([{
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
        }]);

        this.indexView = new Application.Views["alerts/index"]({
            collection: this.alerts
        });

        // retain the main collection list view in memory
        this.indexView.retain();

        // This is where we will do our transition work with callbacks
        Application.setView(this.indexView, {
            transition: function(newView, oldView, append, remove, complete) {

                console.log('New View:');
                console.debug(newView);
                console.log('New Views Element');
                console.debug(newView.$el);

                if (oldView !== null && oldView !== undefined) {
                    append(); // append the view now

                    console.log('Old View:');
                    console.debug(oldView);
                    console.log('Old Views Element');
                    console.debug(oldView.$el);

                    setTimeout(function() {
                        // slide out the old view (detail view)
                        $('.content', oldView.el).removeClass('sliding left').addClass('sliding').addClass('right')

                        // fade in the list view
                        $('.content', newView.el).removeClass('fade out').addClass('fade').addClass('in');

                        setTimeout(function() {
                            remove();
                            complete();
                        }, 300);
                    }, 0);
                } else {
                    console.debug('First run so no oldView exists yet...');
                    append();
                    complete();
                }

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
        });
    },

    detail: function(params) {
        console.log('params sent to detail action from router are ' + params);
        console.log(params);

        var model = this.alerts.get(params);

        console.log('logging model...');
        console.log(model);

        if (model === null || model === undefined) {
            model = {
                id: 4,
                title: 'ListItem Element 4 (not in collection)',
                visible: true
            };
        }

        var view = new Application.Views["alerts/detail"]({
            model: model
        });

        // swap views
        Application.setView(view, {
            transition: function(newView, oldView, append, remove, complete) {
                console.log('Old View:');
                console.debug(oldView);
                console.log('Old Views Element');
                console.debug(oldView.$el);

                console.log('New View:');
                console.debug(newView);
                console.log('New Views Element');
                console.debug(newView.$el);

                if ((oldView !== null && oldView !== undefined) &&
                    (newView !== null && newView !== undefined)) {

                    append(); // append the new view?

                    setTimeout(function() {
                        // slide out the current detail view
                        $('.content', oldView.el).removeClass('fade out').addClass('fade in');

                        // slide in the new detail view
                        $('.content', newView.el).removeClass('sliding left').addClass('sliding').addClass('left');

                        setTimeout(function() {
                            remove();
                            complete();
                        }, 300);
                    }, 0);
                }

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
        });
    }
}));