
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
Handlebars.templates['home/index-empty'] = Handlebars.compile('<h1>Home Region view home/index is empty..</h1>');Handlebars.templates['home/index-item'] = Handlebars.compile('<li id=\"item{{id}}\" class=\"table-view-cell media\">\n  <a href=\"#{{id}}\" class=\"navigate-right\">\n    <img class=\"media-object pull-left\" src=\"http://placehold.it/42x42\">\n    <div class=\"media-body\">\n      Item {{id}}\n      <p>{{title}} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore. Lorem ipsum dolor sit amet.</p>\n    </div>\n  </a>\n</li>');Handlebars.templates['home/index'] = Handlebars.compile('{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n  <a class=\"icon icon-gear pull-right\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n<div class=\"content\" data-transition-in=\"{{transitionIn}}\" data-transition-out=\"{{transitionOut}}\">\n\t{{#collection item-view=\"AlertsItemView\" tag=\"ul\" class=\"table-view\" }}\n\t\t{{! Content from the list item (index-item) template auto-inserted here :) }}\n\t{{/collection}}\n</div>\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n\t<a class=\"tab-item active\" href=\"#\">\n\t\t<span class=\"icon icon-home\"></span>\n\t\t<span class=\"tab-label\">Home</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#2\">\n\t\t<span class=\"icon icon-person\"></span>\n\t\t<span class=\"tab-label\">Profile</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#3\">\n\t\t<span class=\"icon icon-gear\"></span>\n\t\t<span class=\"tab-label\">Settings</span>\n\t</a>\n{{/view}}\n\n<div id=\"page2\" style=\"display:none\"></div>');// main collection view for the list and list items
Application.CollectionView.extend({
    name: "home/index",
    transitionIn: 'fadeIn',
    transitionOut: 'fadeOut',

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

// home layout view
Application.View.extend({
    name: "home/layout"
});

;;
Application.View.extend({
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
Application.View.extend({
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
Handlebars.templates['home/settings'] = Handlebars.compile('<ul class=\"table-view\">\n  <li class=\"table-view-cell\">\n    Item 1\n    <div class=\"toggle\">\n      <div class=\"toggle-handle\"></div>\n    </div>\n  </li>\n  <li class=\"table-view-cell\">\n    Item 2\n    <div class=\"toggle active\">\n      <div class=\"toggle-handle\"></div>\n    </div>\n  </li>\n  <li class=\"table-view-cell table-view-divider\">Categories</li>\n  <li class=\"table-view-cell\">\n    Item 3\n    <div class=\"toggle\">\n      <div class=\"toggle-handle\"></div>\n    </div>\n  </li>\n</ul>');Application.View.extend({
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
