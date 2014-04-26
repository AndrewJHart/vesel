new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,
    detailView: null,

    initialize: function(options) {
        console.log('routers/home#initialize triggered');

        // get alerts collection on init since it persists
        //this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();


        return this; // chaining
    },

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

        Application.goto(this.indexView);
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