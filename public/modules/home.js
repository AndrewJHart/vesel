
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
            this.indexView = Application.View["homeIndex"] = new Application.Views["home/home"]({
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

        //if (!this.settingsView) {
        // create settings view
        var mapView = new Application.Views["home/maplist"]({
            className: 'maplist left'
        });
        //}

        // show the settings view
        Application.goto(mapView, {
            page: true,
            toggleIn: 'left'
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

            // activate the overlay mask on parent view (home)
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
Handlebars.templates['home/settings'] = Handlebars.compile('{{!-- {{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n  {{#link \"\" expand-tokens=true class=\"icon icon-left-nav pull-left\"}}{{/link}}\n  <h1 class=\"title\">Settings</h1>\n{{/view}} --}}\n\n<header class=\"bar bar-nav\">\n  <h1 class=\"title\">Settings</h1>\n</header>\n\n<div class=\"content\">\n  <ul class=\"table-view\">\n    <li class=\"table-view-cell\">\n      Item 1\n      <div class=\"toggle\">\n        <div class=\"toggle-handle\"></div>\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      Item 2\n      <div class=\"toggle active\">\n        <div class=\"toggle-handle\"></div>\n      </div>\n    </li>\n    <li class=\"table-view-cell table-view-divider\">Categories</li>\n    <li class=\"table-view-cell\">\n      Item 3\n      <div class=\"toggle\">\n        <div class=\"toggle-handle\"></div>\n      </div>\n    </li>\n  </ul>\n</div>\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-help\"></span>\n    <span class=\"tab-label\">Help</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
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
Handlebars.templates['home/home'] = Handlebars.compile('{{!-- Home View -- represents all the views that are needed to --}}\n{{!-- form the home \"page\" or \"pane\" (which has transitions) --}}\n\n<a href=\"#\" class=\"overlay\"></a>\n\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\"}}\n  {{!-- {{#link \"settings\" expand-tokens=true class=\"icon icon-gear pull-right\"}}{{/link}} --}}\n  <a href=\"#\" class=\"icon icon-gear pull-left toggle-settings\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n<div class=\"bar bar-standard bar-header-secondary\">\n\t<div class=\"segmented-control\">\n\t\t{{#link \"\" expand-tokens=true class=\"control-item active\"}}List View{{/link}}\n\t\t{{#link \"map\" expand-tokens=true class=\"control-item\"}}Map View{{/link}}\n\t\t{{!-- <a class=\"control-item active\">List View</a> --}}\n  \t{{!-- <a class=\"control-item\">Map View</a> --}}\n  </div>\n</div>\n\n{{view collectionView}}\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\"}}\n\t<a class=\"tab-item active\" href=\"#\">\n\t\t<span class=\"icon icon-home\"></span>\n\t\t<span class=\"tab-label\">Home</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#2\">\n\t\t<span class=\"icon icon-person\"></span>\n\t\t<span class=\"tab-label\">Profile</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#3\">\n\t\t<span class=\"icon icon-gear\"></span>\n\t\t<span class=\"tab-label\">Settings</span>\n\t</a>\n{{/view}}');Application.AnimView.extend({
    name: "home/home",
    animateIn: "fadeIn",
    animateOut: "iosFadeLeft",
    collectionView: null,

    events: {
        'click a.overlay.mask': 'hideSettings'
    },

    initialize: function() {
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        this.$el.attr("data-effeckt-page", "home");
        this.$el.attr("data-view-persist", "true");

        return this; // allow chaining
    },

    // Perfect for a unit test that the home view should have onRender()
    beforeRender: function() {
        console.log(this.name + "#beforeRender()");

        // add 
        this.$el.addClass("effeckt-page-active");

        return this; // allow chaining
    },

    hideSettings: function(event) {

        // get the header view by accessing the nested element
        // with header tag and getting its data-view-cid
        // then grab that view from this.children array of objects
        var headerView = this.children[this.$('header.bar').data("view-cid")];

        headerView.toggleSettings(event);
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()
;;
Handlebars.templates['home/list-empty'] = Handlebars.compile('<h1>Home Page home/home\'s subview home/list has an empty collection..</h1>');Handlebars.templates['home/list-item'] = Handlebars.compile('<li id=\"{{id}}\" class=\"table-view-cell media\">\n  <a href=\"#detail/{{id}}\" class=\"navigate-right\">\n    <img class=\"media-object pull-left\" src=\"http://placehold.it/42x42\">\n    <div class=\"media-body\">\n      {{category.name}}\n      <p>{{subject}}</p>\n    </div>\n  </a>\n</li>');Handlebars.templates['home/list'] = Handlebars.compile('{{collection tag=\"ul\" class=\"table-view\"}}');Application.CollectionView.extend({
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
Handlebars.templates['home/maplist'] = Handlebars.compile('{{!-- <header class=\"bar bar-nav\">\n  <h1 class=\"title\">Map List</h1>\n</header> --}}\n\n<a href=\"#\" class=\"overlay\"></a>\n\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\"}}\n  {{!-- {{#link \"settings\" expand-tokens=true class=\"icon icon-gear pull-right\"}}{{/link}} --}}\n  <a href=\"#\" class=\"icon icon-gear pull-left toggle-settings\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n<div class=\"bar bar-standard bar-header-secondary\">\n  <div class=\"segmented-control\">\n    {{#link \"\" expand-tokens=true class=\"control-item\"}}List View{{/link}}\n    {{#link \"map\" expand-tokens=true class=\"control-item active\"}}Map View{{/link}}\n  </div>\n</div>\n\n<div class=\"content\">\n  <ul class=\"table-view\">\n    <li class=\"table-view-cell\">\n      Item 1\n      <div class=\"toggle\">\n        <div class=\"toggle-handle\"></div>\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      Item 2\n      <div class=\"toggle active\">\n        <div class=\"toggle-handle\"></div>\n      </div>\n    </li>\n    <li class=\"table-view-cell table-view-divider\">Categories</li>\n    <li class=\"table-view-cell\">\n      Item 3\n      <div class=\"toggle\">\n        <div class=\"toggle-handle\"></div>\n      </div>\n    </li>\n  </ul>\n</div>\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n  <a class=\"tab-item\" href=\"#3\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
    name: "home/maplist",

    animateIn: 'bounceInDown',
    animateOut: 'slideOutUp'
});

// Instances of this view can be created by calling:
// new Application.Views["home/maplist"]()
;;


  if (vesel['home'] !== module.exports) {
    console.warn("vesel['home'] internally differs from global");
  }
  return module.exports;
}).call(this);
