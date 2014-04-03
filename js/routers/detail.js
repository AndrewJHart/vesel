new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        console.log('params sent to detail action from router are ' + params);

        var model = window.alertsCollection.get(params);
        console.log('model properties from collection are:');
        console.debug(model);

        var view = new Application.Views["detail/index"]({
            el: '#page2',
            visible: true,
            model: model
        });
        view.appendTo('body');  // apend the view to the body now?

        //var view = Application.Views.detailView;

        // swap views
        Application.setView(view, {
            transition: function(newView, oldView, append, remove, complete) {
                oldView.retain(Application);

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

                    // make everything happen at once
                    //append(); // append the new view?
                    setTimeout(function() {


                        // slide out the current detail view
                        $(oldView.el).removeClass().addClass('fadeOutLeft animated')
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function() {
                                    append();

                                    $(this).removeClass('fadeOutLeft animated');

                                    //append();
                                });

                        // slide in the new detail view
                        $(newView.el).addClass(newView.transitionIn + ' animated')
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function() {
                                    $(this).removeClass(newView.transitionIn + ' animated');

                                    complete();
                                    
                                    // setTimeout(function() {
                                    //     complete();
                                    // }, 300);
                                });


                    }, 0);
                }
            }
        }); // closing setView(...)

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