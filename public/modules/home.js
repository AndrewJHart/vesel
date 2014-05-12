
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

    // default route, triggered on / or /#
    index: function(params) {

        // only instantiate the alerts collection once
        if (!this.alerts)
            this.alerts = Application.Collection['alerts'] =
                new Application.Collections["home/alerts"]();

        // only instantiate on the initial run
        if (!this.indexView) {
            // create an instance of the home page-view (AnimView)
            this.indexView = Application.View["homeView"] =
                new Application.Views["home/home"]({
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

    // triggered when route matches /#map
    maplist: function(params) {

        // only create the map view if it hasnt been created yet
        if (!this.mapView) {
            // create map view
            this.mapView = Application.View["mapView"] = new Application.Views["home/maplist"]({
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
    }
}));
;;
Application.View.extend({
    name: "home/header",
    settingsState: null,

    events: {
        'click a[data-toggle="aside"]': 'toggleSettings'
    },

    initialize: function() {
        this.settingsState = true;

        // create and prep the settings view 
        // Note: I'm using Application.View instead of this.settings to check
        // if the settings view has ever been created for good reason: 
        // There can be multiple *instances* of the header-view class and each
        // would create a new settings view (only once per instance but still..)
        // because that instance's var this.settings would be null.. 
        // -----
        // This prevents a click to open settings from list view AND the map
        // view from creating and overwriting more than one single instance of
        // the settings view. 
        // Better Performance, less memory, no confusion with the collection/models
        //
        if (!Application.View["settings"]) {

            Application.View["settings"] = new Application.Views["home/settings"]({
                el: '#settings', // stick this to the aside element in the DOM
                className: 'effeckt-off-screen-nav',
                model: new Application.Model["settings"]()
            });

            Application.View["settings"].render();

            // notice the frameworks prepend call to keep aside at top of markup
            Application.$el.prepend(Application.View["settings"].$el);
        }

        return this;
    },

    toggleSettings: function(event) {
        console.log('Toggled Settings - settingsState is ' + this.settingsState);
        console.log(event.target);

        // animate the settings view in
        Application.View["settings"].toggle(this.settingsState);

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
Handlebars.templates['home/settings'] = Handlebars.compile('<header class=\"bar bar-nav\">\n  <h1 class=\"title\">Settings</h1>\n</header>\n\n<div class=\"content\">\n  <ul class=\"table-view\">\n    <li class=\"table-view-cell\">\n      Item 1\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\"></input>\n      </div>\n    </li>\n    <li class=\"table-view-cell table-view-divider\">Categories</li>\n    <li class=\"table-view-cell\">\n      Police\n      <div class=\"toggle\">\n       <input type=\"checkbox\" {{#enabled}}checked{{/enabled}} class=\"toggle-handle\">\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      Fire\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\" {{#enabled}}checked{{/enabled}}>\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      Traffic\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\" {{#enabled}}checked{{/enabled}}>\n      </div>\n    </li>\n    <li class=\"table-view-cell\">\n      School\n      <div class=\"toggle\">\n        <input type=\"checkbox\" class=\"toggle-handle\" {{#enabled}}checked{{/enabled}}>\n      </div>\n    </li>\n  </ul>\n</div>\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"home-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-info\"></span>\n    <span class=\"tab-label\">Help</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
    name: "home/settings",

    // add animations
    animateIn: "effeckt-off-screen-nav-left-push ",
    animateOut: "effeckt-off-screen-nav-left-push ",

    // model: new Thorax.Model({
    //     category: "Police",
    //     enabled: false
    // }),

    events: {
        'change div.toggle > input[type="checkbox"]': function(event) {
            event.preventDefault();

            console.log("toggle was changed. Target:");
            console.log(event.target);

            // try to get the model
            this.$(event.target).model().set({
                "metadata.0.is_enabled": event.target.checked
            }, {
                silent: true
            });

            console.log(this.$(event.target).model());

            return false;
        }
    },

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        // todo: bug: if `el` is specified then declaritve properties
        // i.e. attributes and/or classNames, aren't applied on first run
        this.$el.addClass('effeckt-off-screen-nav');
        this.$el.attr('data-view-persist', 'true');

        //this.model.url = "http://localhost:8005/api/v1/app/device_settings/";
        this.model.fetch();

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

                // force a DOM redraw for webkit browsers see SO here:
                // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
                self.el.style.display = 'none';

                _.delay(function() {

                    self.el.style.display = 'block';
                }, 0);
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

        // mixin websockets object
        _.extend(this, BackSocket.prototype);

        // instantiate backSocket for websockets on this collection
        if (_.isFunction(this.live)) {
            this.live({
                key: '3fb8e3f49e89f2640bc9',
                channel: 'huh',
                channelSuffix: 'channel',
                messageSuffix: 'message',
                autoListen: true,
                logEvents: true,
                logStats: true,
                filters: {
                    status: 'C'
                }
            });
        }

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
Handlebars.templates['home/home'] = Handlebars.compile('{{!-- Home View -- represents all the views that are needed to --}}\n{{!-- form the home \"page\" or \"pane\" (which has transitions) --}}\n\n<a class=\"overlay\"></a>\n\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\"}}\n    {{!-- {{#link \"settings\" expand-tokens=true class=\"icon icon-gear pull-right\"}}{{/link}} --}}\n    <a class=\"icon icon-bars pull-left\" data-toggle=\"aside\"></a>\n    <h1 class=\"title\">Vesel Framework</h1>\t\n{{/view}}\n\n<div class=\"bar bar-standard bar-header-secondary\">\n\t<div class=\"segmented-control\">\n\t\t{{#link \"\" expand-tokens=true class=\"control-item active\"}}List View{{/link}}\n\t\t{{#link \"map\" expand-tokens=true class=\"control-item\"}}Map View{{/link}}\n  \t</div>\n</div>\n\n{{view collectionView}}\n\n{{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\"}}\n\t<a class=\"tab-item\">\n\t\t<span class=\"icon icon-home\"></span>\n\t\t<span class=\"tab-label\">Home</span>\n\t</a>\n\t{{#link \"profile\" expand-tokens=true class=\"tab-item\"}}\n\t\t<span class=\"icon icon-person\"></span>\n\t\t<span class=\"tab-label\">Profile</span>\n\t{{/link}}\n\t{{#link \"about\" expand-tokens=true class=\"tab-item\"}}\n\t\t<span class=\"icon icon-info\"></span>\n\t\t<span class=\"tab-label\">About</span>\n\t{{/link}}\n{{/view}}');Application.AnimView.extend({
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
Handlebars.templates['home/maplist'] = Handlebars.compile('<a class=\"overlay\"></a>\n\n{{#view \"home/header\" tag=\"header\" className=\"bar bar-nav\"}}\n  <a class=\"icon icon-bars pull-left\" data-toggle=\"aside\"></a>\n  <h1 class=\"title\">Vesel Framework</h1>\n{{/view}}\n\n<div class=\"bar bar-standard bar-header-secondary\">\n  <div class=\"segmented-control\">\n    {{#link \"\" expand-tokens=true class=\"control-item\"}}List View{{/link}}\n    {{#link \"map\" expand-tokens=true class=\"control-item active\"}}Map View{{/link}}\n  </div>\n</div>\n\n<div id=\"mapmain\" class=\"map\">\n</div>\n{{!-- <input id=\"range\" type=\"range\" min=\"0\" max=\"1.0\" step=\"any\" style=\"width: 100%; position: absolute\" /> --}}\n\n{{!-- {{#view \"home/footer\" tag=\"nav\" className=\"bar bar-tab\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#2\">\n    <span class=\"icon icon-person\"></span>\n    <span class=\"tab-label\">Profile</span>\n  </a>\n  <a class=\"tab-item\" href=\"#3\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}} --}}');Application.AnimView.extend({
    name: "home/maplist",

    animateIn: 'bounceInDown',
    animateOut: 'slideOutUp',

    map: null,
    tiles: null,
    primaryLayer: null,
    secondLayer: null,

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

        // Create what parts of the map we can here, like parts that dont
        // depend on the the view rendered and appended to the DOM yet
        // ----
        // Then using instance variables we can ensure the map is only 
        // ever instantiated one time. Note: This did cause a bug because
        // even persisted views were still being rendered and re-appended
        // to the dom each time. This bug also affected the maplist as 
        // the re-rendering each time goofed with the singular instantiation
        // of the map.. the positive It seems like there were no issues with 
        // zombie events due to a delegate events call, but this almost
        // makes the purpose of persisting views moot. Current patch was
        // to add 2 extra methods in base AnimView called hasRendered() 
        // and conservativeRender(). Now the root Application view goto()
        // method checks if the new view hasRendered(): if not, then it
        // renders it and appends to the DOM or its rightful el placeholder.
        // if it hasRendered() true then it simply calls conservativeRender()
        // which triggers ONLY the beforeRender() and afterRender() calls 
        // elminating all further render calls AND no more re-appending 
        // an existing view back to the same el in the DOM again... 
        // ----
        // Huge Win: DOM ops = Expensive and its pointless to re-render
        // a persistant view unless a colleciton/model triggers a change
        // event and that will still work correctly.. :)  

        // tile layer
        this.tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
            attribution: '<a href="http://www.mscns.com" target="_blank">Powered by MSCNS</a>',
            detectRetina: true
        });
        console.log(this.tiles);

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

        console.log(this.getViewName() + "#afterRender()");

        var self = this;

        // // not assigned to var to prevent re-creation of the method each time
        // // this belongs to afterRender.clip() not global
        // clip = _.bind(function() {

        //     // special method for getting swipe area
        //     var nw = map.containerPointToLayerPoint([0, 0]),
        //         se = map.containerPointToLayerPoint(map.getSize()),
        //         clipX = nw.x + (se.x - nw.x) * range.value;

        //     overlay.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';

        // }, this);

        // trigger the leaflet plugin code. Note could use _.delay
        // It is used only to circumvent a known DOM issue, thus the
        // *timing* can be 0ms & works fine or no delay at all since afterRender.

        if (!this.map) {

            var layers = L.control.layers({
                'Satellite': this.tiles,
                'Streets': L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-20v6611k/{z}/{x}/{y}.png', {
                    detectRetina: true
                })
            }); //.addTo(this.map);

            // only create the map once
            this.map = new L.map('mapmain', {
                zoomControl: false, // prevent zoom control from being added (instead of removing it later)
                locateControl: true
            }).addLayer(this.tiles);
            //.setView([38.412, -82.428], 13);

            // this.map = new L.mapbox.map('mapmain', /*'mscnswv.hl37jh6m',*/ {
            //     zoomControl: false,
            //     locateControl: true
            // }).setView([38.412, -82.428], 13);

            // get our primary layer with geoJSON
            this.primaryLayer = L.mapbox.featureLayer()
                .loadURL('http://192.168.1.5:8005/api/app/v1/alert_locations/')
                .addTo(this.map)
                .on('ready', function() {
                    self.primaryLayer.eachLayer(function(l) {
                        return self.map.panTo(l.getLatLng());
                    });
                });

            layers.addTo(self.map);
            this.map.setView([38.412, -82.428], 13);

        } else {
            this.map.on('ready', function() {
                self.primaryLayer.eachLayer(function(levent) {
                    return self.map.panTo(levent.getLatLng());
                });
            });
        }
    },

    // map helpers
    layerSwipe: function(overlay) {
        var self = this,
            range = this.$('#range');

        function clip() {
            console.log('layerSwiper#clip() triggered');

            // special method for getting swipe area
            var nw = self.map.containerPointToLayerPoint([38.412, -82.428]),
                se = self.map.containerPointToLayerPoint(self.map.getSize()),
                clipX = nw.x + (se.x - nw.x) * range.value;

            overlay.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';

        }

        // interesting way to bind an event
        range['oninput' in range ? 'oninput' : 'onchange'] = clip;

        this.map.on('move', clip);

        this.map.setView([38.412, -82.428], 13);

        return this;
    },

    // this view persists but we still need a hook when new route & view come in
    beforeNextViewLoads: function() {
        console.log(this.getViewName() + "#beforeNextViewLoads() helper called");

        // this is no longer the active page
        this.$el.removeClass("effeckt-page-active");

        // unbind the .on ready handler -- its not an obvious glitch and I 
        // am not seeing a bug yet but typically using .on should use .off
        // especially since we can preserve the map by using instance vars
        // and the new AnimView.conservativeRender() method. 
        this.map.off('ready');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/maplist"]()
;;
Application.Collection.extend({
    name: "home/settings",

    url: "http://localhost:8005/api/app/v1/device_settings/gcm/",
    urlRoot: 'http://localhost:8005/api/app/v1/device_settings/gcm/'
});

// Instances of this collection can be created by calling:
// new Application.Collections["home/settings"]()
;;
Application.Model["settings"] = Backbone.DeepModel.extend({
    name: "home/setting",

    urlRoot: 'http://localhost:8005/api/app/v1/device_settings/gcm/',

    // gets the registration id, username, and pass from the user and device
    // then login will generate the api key
    defaults: function() {
        return {
            "device": {
                "registration_id": "bff7506932143c6e16d84b4c95e6bc29e24fd232e4106a53f0105f5f19f51234Droid18",
                "user": {
                    "api_key": {
                        "key": "8b4f5e8edde8842f28dd66210e1c7800fa6b8d87"
                    },
                    "username": "dhart7"
                }
            },
            "global_priority": 1
        }
    },

    url: function() {
        var device = this.get("device.registration_id"),
            //device_registration = device.get("registration_id"),
            user = this.get("device.user"),
            username = this.get("device.user.username"),
            api = this.get("device.user.api_key"),
            key = this.get("device.user.api_key.key");

        console.log('log of model url output.. device=');
        console.log(device);
        console.log("registration is " + device);
        console.log("user:");
        console.log(user);
        console.log("username is: " + username);
        console.log("api:");
        console.log(api);
        console.log("key is: " + key);

        return this.urlRoot + device + "/?username=" + username + "&api_key=" + key;
    }
});

// Instances of this model can be created by calling:
// new Application.Models["home/setting"]()
;;


  if (vesel['home'] !== module.exports) {
    console.warn("vesel['home'] internally differs from global");
  }
  return module.exports;
}).call(this);
