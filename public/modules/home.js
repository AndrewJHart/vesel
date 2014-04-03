
Vesel['home'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  Vesel['home'] = exports;

  /* router : home */
module.name = "home";
module.routes = {"":"index"};
new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        this.alerts = window.alertsCollection = new Application.Collection([{
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
        }, {
            id: 4,
            title: 'ListItem Element 4',
            visible: true
        }]);

        this.indexView = new Application.Views["home/index"]({
            el: '#page',
            collection: this.alerts
        });

        // retain the main collection list view in memory
        this.indexView.retain(Application);

        // This is where we will do our transition work with callbacks
        Application.setView(this.indexView);
    },

    detail: function(params) {
        console.debug('Detail route triggered in wrong router..');
    }
}));
;;
Handlebars.templates['home/index-empty'] = Handlebars.compile('<h1>Home Region view home/index is empty..</h1>');Handlebars.templates['home/index-item'] = Handlebars.compile('<li id=\"item{{id}}\" class=\"table-view-cell media\">\n  <a href=\"#{{id}}\" class=\"navigate-right\">\n    <img class=\"media-object pull-left\" src=\"http://placehold.it/42x42\">\n    <div class=\"media-body\">\n      Item {{id}}\n      <p>{{title}} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore. Lorem ipsum dolor sit amet.</p>\n    </div>\n  </a>\n</li>');Handlebars.templates['home/index'] = Handlebars.compile('{{view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n\n<div class=\"content\" data-transition-in=\"{{transitionIn}}\" data-transition-out=\"{{transitionOut}}\">\n\t{{#collection item-view=\"AlertsItemView\" tag=\"ul\" class=\"table-view\" }}\n\t\t{{! Content from the list item (index-item) template auto-inserted here :) }}\n\t{{/collection}}\n</div>\n\n{{view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}');Application.CollectionView.extend({
    name: "home/index",
    transitionIn: 'fadeIn',
    transitionOut: 'fadeOutLeft',

    events: {
        'click .table-view-cell': function(event) {
            console.debug('Clicked table cell in home/index CollectionView');
        },

        // nested collection listeners
        collection: {
            'all': function() {
                console.debug('HomeRegion#index view CollectionView::events::collection listener was triggered!');
            }
        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/index"]()
;;
Handlebars.templates['home/header'] = Handlebars.compile('  <a class=\"icon icon-left-nav pull-left\"></a>\n  <a class=\"icon icon-compose pull-right\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n');Application.View.extend({
    name: "home/header",
    type: null,

    initialize: function() {
        console.log('HomeRegion#header view init triggered!');
        console.log('Type of partial is: ' + this.type);

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/header"]()
;;
Handlebars.templates['home/footer'] = Handlebars.compile('  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2/\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n  <a class=\"tab-item\" href=\"#\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n');Application.View.extend({
    name: "home/footer",
    type: null,

    initialize: function() {
        console.log('HomeRegion#footer view init triggered!');
        console.log('Type of partial is: ' + this.type);

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/footer"]()
;;
Handlebars.templates['home/settings'] = Handlebars.compile('');Application.View.extend({
    name: "home/settings",
    type: null,

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()
;;


  if (Vesel['home'] !== module.exports) {
    console.warn("Vesel['home'] internally differs from global");
  }
  return module.exports;
}).call(this);
