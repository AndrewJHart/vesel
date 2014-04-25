
vesel['home'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  vesel['home'] = exports;

  /* router : home */
module.name = "home";
module.routes = {"":"index",":id":"detail"};
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
;;
Handlebars.templates['home/index-empty'] = Handlebars.compile('<h1>Home Region view home/index is empty..</h1>');Handlebars.templates['home/index-item'] = Handlebars.compile('<li id=\"{{id}}\" class=\"table-view-cell media mbsc-lv-item\">\n  <a href=\"#{{id}}\" class=\"navigate-right\">\n    <img class=\"media-object pull-left\" src=\"http://placehold.it/42x42\">\n    <div class=\"media-body\">\n      {{category.name}}\n      <p>{{subject}}</p>\n    </div>\n  </a>\n</li>');Handlebars.templates['home/index'] = Handlebars.compile('{{!-- <div id=\"home\" class=\"page\"> --}}\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\" type=\"home-header\"}}\n  <a class=\"icon icon-gear pull-right\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n<div class=\"content\" data-transition-in=\"{{transitionIn}}\" data-transition-out=\"{{transitionOut}}\">\n\t{{#collection item-view=\"AlertsItemView\" tag=\"ul\" class=\"table-view\" }}\n\t\t{{! Content from the list item (index-item) template auto-inserted here :) }}\n\t{{/collection}}\n</div>\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n\t<a class=\"tab-item active\" href=\"#\">\n\t\t<span class=\"icon icon-home\"></span>\n\t\t<span class=\"tab-label\">Home</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#2\">\n\t\t<span class=\"icon icon-person\"></span>\n\t\t<span class=\"tab-label\">Profile</span>\n\t</a>\n\t<a class=\"tab-item\" href=\"#3\">\n\t\t<span class=\"icon icon-gear\"></span>\n\t\t<span class=\"tab-label\">Settings</span>\n\t</a>\n{{/view}}\n{{!-- </div> --}}\n\n{{!-- <div id=\"detail\" class=\"page\"></div> --}}');// main collection view for the list and list items
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
                return;
            }

            // create the nice listview stuffs
            collectionView.$("ul.table-view").mobiscroll().listview({
                stages: [{
                    percent: -20,
                    color: 'red',
                    icon: 'remove',
                    text: 'Remove',
                    action: function(li, inst, index) {
                        // get the model id  (params) from DOM
                        var model = null,
                            domModel = null,
                            params = $(li).attr('id');

                        console.log('***TESTING $.model vs selector of id..(long way)');

                        domModel = collectionView.$(li).model();

                        // (for readability) see model come
                        model = collection.get(params);

                        if (model === domModel) {
                            // log it
                            console.debug('*MODELS ARE THE SAME! NEAT!');
                        } else {
                            console.debug("*MODELS ARE NOT THE SAME?");
                            console.log(model);
                            console.log(domModel);
                        }

                        // prior to remove
                        console.log('Removing li ' + li + ' with model id ' + params);

                        // see list item go
                        //inst.remove(li);

                        // see model go
                        collection.remove(model); // should trigger re-render

                        // see spot log
                        console.debug('Removed model: ' + model.toJSON() + ' from collection');

                        return false;
                    }
                }, {
                    percent: 20,
                    color: 'green',
                    icon: 'tag',
                    text: 'Tag',
                    action: function(li, inst, index) {
                        console.debug('Tagged that Motherfucker!');

                        return false;
                    }
                }],
                theme: 'ios7'
            });

            collection.trigger("finished:render");
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

            collectionView.$("ul.table-view").mobiscroll().listview({
                theme: 'ios7',
                actions: [
                    { icon: 'link', action: function (li, inst) { notify('Linked', inst.settings.context); } },
                    { icon: 'star3', action: function (li, inst) { notify('Rated', inst.settings.context); } },
                    { icon: 'tag', action: function (li, inst) { notify('Tagged', inst.settings.context); } },
                    { icon: 'download', action: function (li, inst) { notify('Downloaded', inst.settings.context); } },
                ]
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
            'change': function() {
                console.debug('CollectionView::collection::change triggered');
            },
            'remove': function() {
                console.debug('CollecitonView::collection::remove Triggered');

                // this refers to the view :) :)  very handy..
                this.render();
            },
            'finished:render': function() {
                console.debug('***Finished Rendering event triggered successfully');

                this.render();
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
  urlRoot: "https://headsuphuntington.herokuapp.com/api/app/v1/alerts/",

  initialize: function() {
  	console.debug("Alerts Collection initialize triggered.");

  	// refactored to prevent duplicate fetching
  	//this.fetch({ wait: true });

  	return this;
  }
});

// Instances of this collection can be created by calling:
// new Application.Collections["home/alerts"]()
;;
Application.Model.extend({
  name: "home/alert", 

  //urlRoot: 'https://headsuphuntington.herokuapp.com/api/app/v1/alerts/',

  initialize: function() {
  	console.debug("Alert Model initialize triggered.");

  	return this;
  }
});

// Instances of this model can be created by calling:
// new Application.Models["home/alert"]()
;;


  if (vesel['home'] !== module.exports) {
    console.warn("vesel['home'] internally differs from global");
  }
  return module.exports;
}).call(this);
