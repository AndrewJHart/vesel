
vesel['home'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  vesel['home'] = exports;

  /* router : home */
module.name = "home";
module.routes = {"":"index","settings":"settings"};
new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,
    settingsView: null,

    //-----------------
    // route handlers

    index: function(params) {
        // only instantiate the alerts collection once
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] = new Application.Collections["home/alerts"]();

        // only instantiate on the initial run
        if (!this.indexView) {
            // create an instance of the home page-view (AnimView)
            this.indexView = new Application.Views["home/home"]({
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

    settings: function(params) {

        //if (!this.settingsView) {
        // create settings view
        this.settingsView = new Application.Views["home/settings"]({
            //el: '#settings' // stick this to the aside element in the DOM
            className: 'settings right'
        });
        //}

        // show the settings view
        Application.goto(this.settingsView, {
            page: true,
            toggleIn: 'right'
        });
    }
}));
;;
Application.View.extend({
    name: "home/header"
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
Handlebars.templates['home/settings'] = Handlebars.compile('{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n  {{#link \"\" expand-tokens=true class=\"icon icon-left-nav pull-left\"}}{{/link}}\n  <h1 class=\"title\">Settings</h1>\n{{/view}}\n<ul class=\"table-view\">\n  <li class=\"table-view-cell\">\n    Item 1\n    <div class=\"toggle\">\n      <div class=\"toggle-handle\"></div>\n    </div>\n  </li>\n  <li class=\"table-view-cell\">\n    Item 2\n    <div class=\"toggle active\">\n      <div class=\"toggle-handle\"></div>\n    </div>\n  </li>\n  <li class=\"table-view-cell table-view-divider\">Categories</li>\n  <li class=\"table-view-cell\">\n    Item 3\n    <div class=\"toggle\">\n      <div class=\"toggle-handle\"></div>\n    </div>\n  </li>\n</ul>\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n  <a class=\"tab-item\" href=\"#3\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
    name: "home/settings",

    // add classes    
    className: 'settings',

    // add animations
    animateIn: "iosSlideInRight",
    animateOut: "slideOutRight",

    // data-attributes
    // attributes: {
    //     'data-view-persist': 'false'
    // },

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        // todo: bug: if `el` then declaritve properties for
        // attributes and classNames fail on first run
        //this.$el.addClass('right');
        //this.$el.attr('data-view-persist', 'false');

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
        console.log("Alerts Collection initialize triggered.");

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
Handlebars.templates['home/home'] = Handlebars.compile('{{!-- Home View -- represents all the views that are needed to --}}\n{{!-- form the home \"page\" or \"pane\" (which has transitions) --}}\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\"}}\n  {{#link \"settings\" expand-tokens=true class=\"icon icon-gear pull-right\"}}{{/link}}\n  {{!-- <a href=\"#settings\" class=\"icon icon-gear pull-right\"></a> --}}\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n{{view collectionView}}\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\"}}\n\t<a class=\"tab-item active\" href=\"#\">\n\t\t<span class=\"icon icon-home\"></span>\n\t\t<span class=\"tab-label\">Home</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#2\">\n\t\t<span class=\"icon icon-person\"></span>\n\t\t<span class=\"tab-label\">Profile</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#3\">\n\t\t<span class=\"icon icon-gear\"></span>\n\t\t<span class=\"tab-label\">Settings</span>\n\t</a>\n{{/view}}');Application.AnimView.extend({
    name: "home/home",
    animateIn: 'fadeIn',
    animateOut: 'iosFadeLeft',
    collectionView: null,

    initialize: function() {
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        return this; // allow chaining
    },

    // Perfect for a unit test that the home view should have onRender()
    beforeRender: function() {
        console.debug('!Home page-view AnimView::beforeRender() triggered');

        return this; // allow chaining
    },

    afterRender: function() {
        console.debug('!Home page-view AnimView::afterRendered() triggered');

        return this; // allow chaining
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()
;;
Handlebars.templates['home/list-empty'] = Handlebars.compile('<h1>Home Page home/home\'s subview home/list has an empty collection..</h1>');Handlebars.templates['home/list-item'] = Handlebars.compile('<li id=\"{{id}}\" class=\"table-view-cell media\">\n  <a href=\"#detail/{{id}}\" class=\"navigate-right\">\n    <img class=\"media-object pull-left\" src=\"http://placehold.it/42x42\">\n    <div class=\"media-body\">\n      {{category.name}}\n      <p>{{subject}}</p>\n    </div>\n  </a>\n</li>');Handlebars.templates['home/list'] = Handlebars.compile('{{collection tag=\"ul\" class=\"table-view\"}}');Application.CollectionView.extend({
    name: "home/list",
    initOnce: true,
    collection: Application.Collection["alerts"],
    className: 'content',

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
            console.debug('Event *rendered:collection* triggered!');

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
            'rendered': function(event) {
                console.debug('CollectionView@collection:rendered event triggered!');
                console.debug('**CollectionView::collection::rendered event triggered');
                return false;
            }
        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/list"]()
;;


  if (vesel['home'] !== module.exports) {
    console.warn("vesel['home'] internally differs from global");
  }
  return module.exports;
}).call(this);
