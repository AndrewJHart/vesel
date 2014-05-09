
vesel['home'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  vesel['home'] = exports;

  /* router : home */
module.name = "home";
module.routes = {"":"index","map":"maplist"};
new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,
    mapView: null,

    //-----------------
    // route handlers

    index: function(params) {
        // only instantiate the alerts collection once
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        // only instantiate on the initial run
        if (!this.indexView) {
            // create an instance of the home page-view (AnimView)
            this.indexView = Application.View["homeView"] = new Application.Views["home/home"]({
                el: '#home',
                className: 'home page',
                collection: this.alerts
            });
        }

        // Tell the root view to render the view and render it as a page w/ animations
        Application.goto(this.indexView, {
            page: true
        });
    },

    maplist: function(params) {

        if (!this.mapView) {
            // create map view
            this.mapView = Application.View["mapView"] = new Application.Views["home/maplist"]({
                el: '#map',
                className: 'maplist' // left'
                // -- can use a new collection for locations 
                // or make the call directly w/ leaflet
                //collection: this.alerts
            });
        }

        // show the settings view
        Application.goto(this.mapView, {
            page: true
            //,
            //toggleIn: 'left'
        });
    }
}));
;;
Application.View.extend({
    name: "home/header",
    settingsView: null,
    settingsState: null,

    events: {
        'click .toggle-settings': 'toggleSettings'
    },

    initialize: function() {
        this.settingsState = true;

        // create and prep the settings view
        if (!this.settingsView) {

            this.settingsView = Application.View["settings"] = new Application.Views["home/settings"]({
                el: '#settings', // stick this to the aside element in the DOM
                className: 'effeckt-off-screen-nav'
            });

            this.settingsView.render();

            Application.$el.prepend(this.settingsView.$el);
        }

        return this;
    },

    toggleSettings: function(event) {
        console.log('Toggled Settings - settingsState is ' + this.settingsState);
        console.log(event.target);

        // animate the settings view in
        this.settingsView.toggle(this.settingsState);

        // change the state
        this.settingsState = !this.settingsState;

        _.delay(function() {

            // activate the overlay mask on parent view aka: home or maplist
            this.parent.$('a.overlay').toggleClass('mask');
        }, 200);

        return true;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/header"]()
;;
Application.View.extend({
    name: "home/footer"
});

// Instances of this view can be created by calling:
// new Application.Views["home/footer"]()
;;
Handlebars.templates['home/settings'] = Handlebars.compile('{{!-- {{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n  {{#link \"\" expand-tokens=true class=\"icon icon-left-nav pull-left\"}}{{/link}}\n  <h1 class=\"title\">Settings</h1>\n{{/view}} --}}\n\n<header class=\"bar bar-nav\">\n  <h1 class=\"title\">Settings</h1>\n</header>\n\n<div class=\"content\">\n  <ul class=\"table-view\">\n    <li class=\"table-view-cell\">\n      Item 1\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\"></input>\n      </div>\n    </li>\n    <li class=\"table-view-cell table-view-divider\">Categories</li>\n    <li class=\"table-view-cell\">\n      Police\n      <div class=\"toggle active\">\n        <input type=\"checkbox\" class=\"toggle-handle\"></input>\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      Fire\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\"></input>\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      Traffic\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\"></input>\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      School\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\"></input>\n      </div>\n    </li>\n  </ul>\n</div>\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-help\"></span>\n    <span class=\"tab-label\">Help</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
    name: "home/settings",

    // add animations
    animateIn: "effeckt-off-screen-nav-left-push ",
    animateOut: "effeckt-off-screen-nav-left-push ",

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        // todo: bug: if `el` is specified then declaritve properties
        // i.e. attributes and/or classNames, aren't applied on first run
        this.$el.addClass('effeckt-off-screen-nav');
        this.$el.attr('data-view-persist', 'true');

        return this;
    },

    toggle: function(settingsState) {
        var self = this;

        if (settingsState) {
            console.log('settingsState = true, settings view animating...');

            this.$el.addClass(this.animateIn);

            this.$el.on('webkitAnimationEnd transitionend', function() {

                self.$el.off('webkitAnimationEnd transitionend');
                // show the aside panel
                self.$el.addClass("effeckt-show");
            });
        } else {

            this.$el.removeClass("effeckt-show");

            this.$el.on('webkitAnimationEnd transitionend', function() {

                self.$el.off('webkitAnimationEnd transitionend');

                // remove the class
                self.$el.removeClass(self.animateOut);
            });
        }

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()
;;
Application.Collection.extend({
    name: "home/alerts",

    url: "https://headsuphuntington.herokuapp.com/api/app/v1/alerts/",
    urlRoot: 'https://headsuphuntington.herokuapp.com/api/app/v1/alerts/',

    initialize: function() {
        console.log("Alerts Collection#initialize");

        // refactored to prevent duplicate fetching
        //this.fetch({ wait: true });

        return this;
    }
});

// Instances of this collection can be created by calling:
// new Application.Collections["home/alerts"]()
;;
Application.Model.extend({
    name: "home/alert"
});

// Instances of this model can be created by calling:
// new Application.Models["home/alert"]()
;;
Handlebars.templates['home/home'] = Handlebars.compile('{{!-- Home View -- represents all the views that are needed to --}}\n{{!-- form the home \"page\" or \"pane\" (which has transitions) --}}\n\n<a class=\"overlay\"></a>\n\n{{#view \"home/header\" tag=\"header\" className=\"topcoat-navigation-bar topcoat-grid__row huh_navigation middle\"}}\n    {{!-- {{#link \"settings\" expand-tokens=true class=\"icon icon-gear pull-right\"}}{{/link}} --}}\n    <div class=\"topcoat-navigation-bar__item topcoat-grid__column--2\">\n        <a href=\"#\" class=\"topcoat-button--quiet button-prev hide\">\n          <span class=\"ion-ios7-arrow-left ionicon\"></span>\n        </a>\n      </div>\n      <div class=\"topcoat-navigation-bar__item topcoat-grid__column--auto center\">\n          <h1 class=\"topcoat-navigation-bar__title\">Heads Up Huntington</h1>\n      </div>\n      <div class=\"topcoat-navigation-bar__item  topcoat-grid__column--2\">\n        <a class=\"topcoat-button--quiet button settings toggle-settings\">\n          <span class=\"ion-ios7-gear ionicon\"></span>\n        </a>\n      </div>\n  \t</div>\n{{!--     <a class=\"icon icon-bars pull-left \"></a>\n    <h1 class=\"title\">Vesel Framework</h1>\t --}}\n{{/view}}\n<div class=\"topcoat-button-bar full-width\">\n   <div class=\"topcoat-button-bar__item\">\n     <button class=\"topcoat-button-bar__button full-width\">   \n        {{#link \"\" expand-tokens=true class=\"control-item active\"}}List View{{/link}}\n     </button>\n   </div>\n   <div class=\"topcoat-button-bar__item\">\n     <button class=\"topcoat-button-bar__button full-width\">\n        {{#link \"map\" expand-tokens=true class=\"control-item\"}}Map View{{/link}}\n     </button>\n   </div>\n</div>\n{{!-- <div class=\"bar bar-standard bar-header-secondary\">\n\t<div class=\"segmented-control\">\n\t\t{{#link \"\" expand-tokens=true class=\"control-item active\"}}List View{{/link}}\n\t\t{{#link \"map\" expand-tokens=true class=\"control-item\"}}Map View{{/link}}\n  \t</div>\n</div> --}}\n\n{{view collectionView}}\n\n{{#view \"home/footer\" tag=\"nav\" className=\"footer huh_navigation topcoat-tab-bar full\"}}\n     <label class=\"topcoat-tab-bar__item topcoat-navigation-bar__line-height\">\n       <input type=\"radio\" name=\"topcoat\">\n       <button class=\"topcoat-tab-bar__button full\">\n         <span class=\"ion-home ionicon middle\"></span>\n       </button>\n     </label>\n     <label class=\"topcoat-tab-bar__item topcoat-navigation-bar__line-height\">\n       <input type=\"radio\" name=\"topcoat\">\n       <button class=\"topcoat-tab-bar__button full\">\n         <span class=\"ion-map ionicon middle\"></span>\n       </button>\n     </label>\n      <label class=\"topcoat-tab-bar__item topcoat-navigation-bar__line-height\">\n       <input type=\"radio\" name=\"topcoat\">\n       <button class=\"topcoat-tab-bar__button full\">\n         <span class=\"ion-ios7-information-outline ionicon middle\"></span>\n       </button>\n     </label>\n{{/view}}');Application.AnimView.extend({
    name: "home/home",

    animateIn: "fadeIn",
    animateOut: "iosFadeLeft",
    collectionView: null,

    events: {
        'click a.overlay.mask': function(event) {

            // get reference to the nested header view using its data-view-cid
            var headerView = this.children[this.$("header").data("view-cid")];

            // call the "home/header" view method to trigger aside reveal
            // forward the event data on to the header view too.
            headerView.toggleSettings(event);

            return false;
        }
    },

    initialize: function() {
        // instantiate the CollectionView to create the nested list
        // & list-item views with the Alerts collection/resource data
        // as the list-item template context. The Emmet equivalent for
        // this structure would be something like:  ul>li*(alerts.length)
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        this.$el.attr("data-effeckt-page", "home");
        this.$el.attr("data-view-persist", "true");

        return this; // allow chaining
    },

    // Perfect for a unit test that the home view should have onRender()
    beforeRender: function() {
        console.log(this.getViewName() + "#beforeRender()");

        // add this as the active page for effeckt.css
        this.$el.addClass("effeckt-page-active");

        return this; // allow chaining
    },

    // this view persists but we still need a hook when new route & view come in
    beforeNextViewLoads: function() {
        console.log(this.getViewName() + "#beforeNextViewLoads() helper called");

        // this is no longer the active page
        this.$el.removeClass("effeckt-page-active");

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()
;;
Handlebars.templates['home/list-empty'] = Handlebars.compile('<h1>Home Page home/home\'s subview home/list has an empty collection..</h1>');Handlebars.templates['home/list-item'] = Handlebars.compile('<li id=\"{{id}}\" class=\"\">\n\t<a href=\"#detail/{{id}}\" class=\"navigate-right\"></a>\n\t<div class=\"topcoat-grid__row\">\n\t\t<div class=\"col-25 col-center {{category.name}}__bg \">\n\t\t\t<div class=\"li-cat__container\">\n\t\t\t\t<span class=\"{{category.name}} cat\"></span>\n\t\t\t\t<h2 class=\"li-cat__title\">{{category.name}}</h2>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"col-75\">\n\t\t\t<p class=\"li-summary\"> {{ subject }}</p>\n\t\t\t<div class=\"li-date__container\">\n\t\t\t\t<p class=\"li-date\">Posted: May 8th, 4:00PM</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</li>');Handlebars.templates['home/list'] = Handlebars.compile('{{collection tag=\"ul\" class=\"topcoat-list list\"}}');Application.CollectionView.extend({
    name: "home/list",

    // this view holds ref to our 'Alerts' collection from server
    collection: Application.Collection["alerts"],

    // view represents the content area of its parent, the Home page-view
    className: 'content',

    // declaritive events for the view + nested declaritive events for collection
    events: {
        'ready': function(options) {
            var collection = null,
                collectionView = null;

            console.log('******************** Nested CollectionView home/list event ready was triggered!');

            // check that options are legit
            if (options.target) {
                console.debug('**Logging options for ready event on collectionView');
                console.log(options);
                collectionView = options.target;

                if (options.target.collection)
                    collection = options.target.collection;
            }

            return false;
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event "rendered:collection"');

            // refactoring this may work without the delay call...
            _.delay(function() {
                // initialize the mobiscroll listview plugin
                collectionView.$('ul').mobiscroll().listview({
                    theme: 'ios7',
                    swipe: 'right',
                    actions: {
                        right: [{
                            icon: 'link',
                            action: function(li, inst) {
                                alert('Linked', inst.settings.context);
                            }
                        }, {
                            icon: 'star3',
                            action: function(li, inst) {
                                alert('Rated', inst.settings.context);
                            }
                        }, {
                            icon: 'tag',
                            action: function(li, inst) {
                                alert('Tagged', inst.settings.context);
                            }
                        }, {
                            icon: 'download',
                            action: function(li, inst) {
                                alert('Downloaded', inst.settings.context);
                            }
                        }, ]
                    }
                });
            }, 0);

            return false;
        },

        // nested collection listeners
        collection: {
            'vesel:rendered': function() {
                console.log('Special vesel:rendered event triggered on the alerts collection');

                this.ensureRendered();
            },
            'change': function() {
                console.log('CollectionView.collection received a change event!');

                // trigger a re-render just for testing -- this is wasteful in production
                this.render();
            }
        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/list"]()
;;
Handlebars.templates['home/maplist'] = Handlebars.compile('{{!-- <header class=\"bar bar-nav\">\n  <h1 class=\"title\">Map List</h1>\n</header> --}}\n\n<a class=\"overlay\"></a>\n\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\"}}\n  <a class=\"icon icon-gear pull-left toggle-settings\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n<div class=\"bar bar-standard bar-header-secondary\">\n  <div class=\"segmented-control\">\n    {{#link \"\" expand-tokens=true class=\"control-item\"}}List View{{/link}}\n    {{#link \"map\" expand-tokens=true class=\"control-item active\"}}Map View{{/link}}\n  </div>\n</div>\n\n<div id=\"mapmain\" class=\"map\">\n</div>\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n  <a class=\"tab-item\" href=\"#3\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
    name: "home/maplist",

    animateIn: 'bounceInDown',
    animateOut: 'slideOutUp',

    events: {
        'click a.overlay.mask': function(event) {

            // get reference to the nested header view using its data-view-cid
            var headerView = this.children[this.$("header").data("view-cid")];

            // call the "home/header" view method to trigger aside reveal
            // forward the event data on to the header view too.
            headerView.toggleSettings(event);

            return false;
        }
    },

    initialize: function() {

        // map list view can have settings aside toggle so 
        // we need to apply data-effeckt-page = true attribute
        this.$el.attr("data-effeckt-page", "home");
        this.$el.attr("data-view-persist", "true");

        return this;
    },

    // Perfect for a unit test that the home view should have onRender()
    beforeRender: function() {
        console.log(this.getViewName() + "#beforeRender()");

        // add this as the active page for effeckt.css
        this.$el.addClass("effeckt-page-active");

        return this; // allow chaining
    },

    afterRender: function() {

        // trigger the leaflet plugin code. Note use of _.delay
        // It is used only to circumvent a known DOM issue, thus the
        // *timing* can be 0ms & works fine. 
        _.delay(function() {

            var featureLayer,
                mapboxTiles,
                mapview;

            mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
                attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Powered by MSCNS</a>'
            });

            mapview = new L.map('mapmain', {
                doubleClickZoom: false
            }).addLayer(mapboxTiles).setView([38.412, -82.428], 14).on('dblclick', function(e) {
                console.log('Double Click event triggered.. returning expected results for now.');
                return mapview.setView(e.latlng, mapview.getZoom() + 1);
            });

            featureLayer = L.mapbox.featureLayer().
            loadURL('http://127.0.0.1:8005/api/app/v1/alert_locations/').
            addTo(mapview).on('ready', function() {
                featureLayer.eachLayer(function(l) {
                    return mapview.panTo(l.getLatLng());
                });
            });
        }, 0);
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/maplist"]()
;;


  if (vesel['home'] !== module.exports) {
    console.warn("vesel['home'] internally differs from global");
  }
  return module.exports;
}).call(this);
