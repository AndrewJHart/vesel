new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,
    detailView: null,

    initialize: function(options) {
        console.log('routers/home#initialize triggered');

        // get alerts collection on init since it persists
        //this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();
        

        return this;  // chaining
    },

    //-----------------
    // route handlers

    index: function(params) {
        if (!this.alerts && !Application.Collection['alerts'])
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        // if (!this.indexView) {
        this.indexView = new Application.Views["home/index"]({
            el: '#home',
            className: 'page is-visible',
            collection: this.alerts
        });
        // }

        // retain the main collection list view in memory
        Application.retain(this.indexView);
        //this.indexView.retain(Application);

        // This is where we will do our transition work with callbacks
        Application.setView(this.indexView);
    },

    detail: function(params) {
        var self = this;

        console.log('params sent to detail action from router are ' + params);

        var model = Application.Collection['alerts'].get(params);
        console.log('model properties from collection are:');
        console.debug(model);

        var view = new Application.Views["detail/index"]({
            el: '#detail',
            visible: false,
            model: model
        });
        //view.appendTo('body'); // apend the view to the body or page2 now?


        // swap views
        Application.setView(view, {
            transition: function(newView, oldView, append, remove, complete) {
                append();

                self.animHelper(function() {
                    complete();
                });
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
    },

    //------------------
    // helper methods
    animHelper: function(callback) {
        console.log('animHelper triggered for view transitions!');
        // do stuff 
        console.log('Old View:');
        console.debug(oldView);

        console.log('New View:');
        console.debug(newView);


        if ((oldView !== null && oldView !== undefined) &&
            (newView !== null && newView !== undefined)) {

            // make everything happen at once
            //append(); // append the new view?
            _.delay(function() {

                // slide out the current detail view
                $(oldView.el).addClass(oldView.transitionOut + ' animated')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                        function() {
                            // append();

                            $(this).removeClass(oldView.transitionOut + ' animated');

                            //append();
                        });


                // slide in the new detail view
                $(newView.el).show().addClass(newView.transitionIn + ' animated')
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                        function() {
                            $(this).removeClass(newView.transitionIn + ' animated');

                            //complete();
                        });

            }, 20);
        }

        // then trigger cb
        if (_.isFunction(callback)) {
            callback();
        }
    }


}));