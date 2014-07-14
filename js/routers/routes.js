define([
    'backbone',
    'views/root',
    'views/home',
    'views/header',
    'views/footer',
    'views/maplist',
    'views/detail',
    'views/profile',
    'views/slides',
    'collections/alerts',
    'models/alerts'
], function(Backbone, RootView, HomeView, HeaderView, FooterView, MapView, DetailView, ProfileView, SlidesView, AlertsCollection, AlertModel) {
    return Backbone.Router.extend({
        routes: {
            "": "Iphone",            // this is what will be loaded when the landing page is loaded 
            "alerts": "home",      // this is what will be loaded when a user goes to the /alerts   # had to chop off the s becuase of the collection name
            "intro": "intro",
            ":id": "detail",
            "map": "maplist",
            "about": "about",
            "profile": "profile"
        },

        // ----------
        // properties

        alerts: null,
        indexView: null,
        mapView: null,

        // ------
        // methods

        initialize: function() {
            // create the header and footer views so we can nest them within templates
            this.headerView = new HeaderView();
            this.footerView = new FooterView();

            return this;
        },

        // default route, triggered on /alerts or /#alerts
        // in this case will render the app on the scrapable page 
        home: function(params) {
            // grab the url 
            console.log("this is the index function url: " + this.routes[Backbone.history.fragment]);

            // only instantiate the alerts collection once
            if (!this.alerts) {
                this.alerts = Application["alerts"] = new AlertsCollection();
            }

            // only instantiate on the initial run
            if (!this.indexView) {
                // create an instance of the home page-view (AnimView)
                this.indexView =
                    new HomeView({
                        el: '#home',
                        className: 'home page',
                        collection: this.alerts
                    });
            }

            // Tell the root view to render the view and render it as a page w/ animations
            Application.goto(this.indexView, {
                page: true
            }); // alternative RootView.getInstance().setView(view);

            return this;
        },


        intro: function() {
            console.log('Intro route Triggered! ----------');

            var introView = null;

            introView = new SlidesView();

            Application.goto(introView, {
                page: true
            }); 

            return this;
        },

        detail: function(params) {

            // hoisting 
            var model = null,
                pageView = null;

            // log the route params passed to us
            console.log("detailIphone/index route received :id " + params);


            if (this.alerts) {
                // collection has already been loaded so use it to pull the model
                model = Application["alerts"].get(params);
            } else {
                // get the model from the pk passed in by the django template instead
                model = new AlertModel({
                    id: window.detail_pk
                });
                
                model.fetch({
                    wait: true
                });
            }

            // create the detail page-view that contains the header view,
            // the footer view, and the actual content view nested within
            // using the handlebars "view" helper
            pageView = new DetailView({
                className: 'detail right',
                model: model
            });

            // animate to this view and remove the classname 'right'
            // after the view is appended to the DOM but right before 
            // the transition happens. 
            Application.goto(pageView, {
                page: true, // this is its own page/pane so tell app to animate it
                toggleIn: 'right' // remove the class right before animating
            });

            return this;
        },

        // triggered when route matches /#map
        maplist: function(params) {

            // only create the map view if it hasnt been created yet
            if (!this.mapView) {
                // create map view
                this.mapView = new MapView({
                    el: '#map',
                    className: 'maplist'
                    // -- can use a new collection for locations 
                    // or make the call directly w/ leaflet
                    //collection: this.alerts
                });
            }

            // show the settings view
            Application.goto(this.mapView, {
                page: true
            });

            return this;
        },

        profile: function(params) {
            console.log('Profile route triggered');

            var profileView = new ProfileView();

            Application.goto(profileView, {
                page: true // this is its own page/pane so tell app to animate it
            });

            return this;
        }
    });
});