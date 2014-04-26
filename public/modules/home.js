
vesel['home'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  vesel['home'] = exports;

  /* router : home */
module.name = "home";
module.routes = {"":"index"};
new(Backbone.Router.extend({
    routes: module.routes,
    alerts: null,
    indexView: null,

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
    }
}));
;;
Handlebars.templates['home/index-empty'] = Handlebars.compile('<h1>Home Region view home/index is empty..</h1>');Handlebars.templates['home/index-item'] = Handlebars.compile('<li id=\"{{id}}\" class=\"table-view-cell media mbsc-lv-item\">\n  <a href=\"#{{id}}\" class=\"navigate-right\">\n    <img class=\"media-object pull-left\" src=\"http://placehold.it/42x42\">\n    <div class=\"media-body\">\n      {{category.name}}\n      <p>{{subject}}</p>\n    </div>\n  </a>\n</li>');Handlebars.templates['home/index'] = Handlebars.compile('{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n  <a class=\"icon icon-gear pull-right\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n<div class=\"content\" data-transition-in=\"{{transitionIn}}\" data-transition-out=\"{{transitionOut}}\">\n\t{{#collection tag=\"ul\" class=\"table-view\" }}\n\t\t{{! Content from the list item (index-item) template auto-inserted here :) }}\n</div>\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n\t<a class=\"tab-item active\" href=\"#\">\n\t\t<span class=\"icon icon-home\"></span>\n\t\t<span class=\"tab-label\">Home</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#2\">\n\t\t<span class=\"icon icon-person\"></span>\n\t\t<span class=\"tab-label\">Profile</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#3\">\n\t\t<span class=\"icon icon-gear\"></span>\n\t\t<span class=\"tab-label\">Settings</span>\n\t</a>\n{{/view}}');// main collection view for the list and list items
Application.CollectionView.extend({
    name: "home/index",
    transitionIn: 'fadeIn',
    transitionOut: 'iosFadeLeft',
    initOnce: true,

    events: {
        'ready': function(options) {
            var collectionView,
                collection;

            console.log(options);

            // check that options are legit
            if (options.target) {
                collectionView = options.target;
                collection = options.target.collection;
            } else {
                alert('error');
                return false;
            }

            // create the nice listview stuffs
            collectionView.$("ul.table-view").mobiscroll().listview({
                theme: 'ios7',
                actions: [{
                    icon: 'link',
                    action: function(li, inst) {
                        notify('Linked', inst.settings.context);
                    }
                }, {
                    icon: 'star3',
                    action: function(li, inst) {
                        notify('Rated', inst.settings.context);
                    }
                }, {
                    icon: 'tag',
                    action: function(li, inst) {
                        notify('Tagged', inst.settings.context);
                    }
                }, {
                    icon: 'download',
                    action: function(li, inst) {
                        notify('Downloaded', inst.settings.context);
                    }
                }, ]
            });

            collectionView.ensureRendered();

            return false;
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

            collectionView.$("ul.table-view").mobiscroll().listview({
                theme: 'ios7',
                actions: [{
                    icon: 'link',
                    action: function(li, inst) {
                        notify('Linked', inst.settings.context);
                    }
                }, {
                    icon: 'star3',
                    action: function(li, inst) {
                        notify('Rated', inst.settings.context);
                    }
                }, {
                    icon: 'tag',
                    action: function(li, inst) {
                        notify('Tagged', inst.settings.context);
                    }
                }, {
                    icon: 'download',
                    action: function(li, inst) {
                        notify('Downloaded', inst.settings.context);
                    }
                }, ]
            });


            // collectionView.$("ul.table-view").mobiscroll().listview({
            //     stages: [{
            //         percent: -20,
            //         color: 'red',
            //         icon: 'remove',
            //         text: 'Remove',
            //         action: function(li, inst, index) {
            //             // get the model id  (params) from DOM
            //             var model = null,
            //                 domModel = null,
            //                 params = $(li).attr('id');

            //             console.log('***TESTING $.model vs selector of id..(long way)');

            //             domModel = collectionView.$(li).model();

            //             // (for readability) see model come
            //             model = collection.get(params);

            //             if (model === domModel) {
            //                 // log it
            //                 console.debug('*MODELS ARE THE SAME! NEAT!');
            //             } else {
            //                 console.debug("*MODELS ARE NOT THE SAME?");
            //                 console.log(model);
            //                 console.log(domModel);
            //             }

            //             // prior to remove
            //             console.log('Removing li ' + li + ' with model id ' + params);

            //             // see list item go
            //             //inst.remove(li);

            //             // see model go
            //             collection.remove(model); // should trigger re-render

            //             // see spot log
            //             console.debug('Removed model: ' + model.toJSON() + ' from collection');

            //             return false;
            //         }
            //     }, {
            //         percent: 20,
            //         color: 'green',
            //         icon: 'tag',
            //         text: 'Tag',
            //         action: function(li, inst, index) {
            //             console.debug('Tagged that Motherfucker!');

            //             return false;
            //         }
            //     }],
            //     theme: 'ios7'
            // });

            // Add or look for an event "finished" so we can re-render for mobi-scroll
            // or find another way about initializing the plugin 
            // if (collectionView.initOnce) {
            //     collectionView.initOnce = false;
            //     collection.trigger('finished:render');
            // }
            //collection.trigger('finished:render');
            return false;
        },

        // nested collection listeners
        collection: {
            'finished:render': function() {
                console.debug('***Finished Rendering event triggered successfully');

                this.render();
            },
            'rendered': function(event) {
                event.preventDefault();
                event.stopPropagation();
                console.debug('**CollectionView::collection::rendered event triggered');
                return false;
            }
        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/index"]()

// home layout view
// Application.View.extend({
//     name: "home/layout"
// });
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
        console.log('HomeRegion#header view init triggered!');
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
Handlebars.templates['home/home'] = Handlebars.compile('{{!-- Home View -- represents all the views that are needed to --}}\n{{!-- form the home \"page\" or \"pane\" (which has transitions) --}}\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n  <a class=\"icon icon-gear pull-right\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n{{view collectionView}}\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n\t<a class=\"tab-item active\" href=\"#\">\n\t\t<span class=\"icon icon-home\"></span>\n\t\t<span class=\"tab-label\">Home</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#2\">\n\t\t<span class=\"icon icon-person\"></span>\n\t\t<span class=\"tab-label\">Profile</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#3\">\n\t\t<span class=\"icon icon-gear\"></span>\n\t\t<span class=\"tab-label\">Settings</span>\n\t</a>\n{{/view}}');Application.AnimView.extend({
    name: "home/home",
    animateIn: 'fadeIn',
    animateOut: 'iosFadeLeft',
    collectionView: null,

    initialize: function() {
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        return this;

    },

    onRender: function() {
        console.log('!HomePageView#onRender() triggered');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()
;;
Handlebars.templates['home/list-empty'] = Handlebars.compile('<h1>Home Region view home/index is empty..</h1>');Handlebars.templates['home/list-item'] = Handlebars.compile('<li id=\"{{id}}\" class=\"table-view-cell media\">\n  <a href=\"#{{id}}\" class=\"navigate-right\">\n    <img class=\"media-object pull-left\" src=\"http://placehold.it/42x42\">\n    <div class=\"media-body\">\n      {{category.name}}\n      <p>{{subject}}</p>\n    </div>\n  </a>\n</li>');Handlebars.templates['home/list'] = Handlebars.compile('{{collection tag=\"ul\" class=\"table-view\"}}');Application.CollectionView.extend({
    name: "home/list",
    initOnce: true,
    collection: Application.Collection["alerts"],
    className: 'content',

    events: {
        'ready': function(options) {
            var collectionView,
                collection;

            console.debug('**Logging options for ready event on collectionView');
            console.log(options);

            // check that options are legit
            if (options.target) {
                collectionView = options.target;
                collection = options.target.collection;
            }

            // create the nice listview stuffs
            // collectionView.$el.mobiscroll().listview({
            //     theme: 'ios7',
            //     actions: [{
            //         icon: 'link',
            //         action: function(li, inst) {
            //             notify('Linked', inst.settings.context);
            //         }
            //     }, {
            //         icon: 'star3',
            //         action: function(li, inst) {
            //             notify('Rated', inst.settings.context);
            //         }
            //     }, {
            //         icon: 'tag',
            //         action: function(li, inst) {
            //             notify('Tagged', inst.settings.context);
            //         }
            //     }, {
            //         icon: 'download',
            //         action: function(li, inst) {
            //             notify('Downloaded', inst.settings.context);
            //         }
            //     }, ]
            // });

            //collectionView.ensureRendered();

            return false;
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

            // try delaying this?
            _.delay(function() {
                //if (!window.initOnce) {
                //  window.initOnce = true;

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
                // }
            }, 0);

            return false;
        },

        // nested collection listeners
        collection: {
            'render': function() {
                console.debug('***Finished Rendering event triggered successfully');

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
