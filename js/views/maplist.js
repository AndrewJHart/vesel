
define([
  'anim-view',
  'hbs!templates/maplist'
], function(AnimView, template) {

    return AnimView.extend({ 
        name: "maplist",
        template: template, 

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

            // tile layer
            this.tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
                attribution: '<a href="http://www.mscns.com" target="_blank">Powered by MSCNS</a>',
                detectRetina: true
            });
            console.log(this.tiles);

            return this;
        },

        beforeRender: function() {
            console.log(this.getViewName() + "#beforeRender()");

            // add this as the active page for effeckt.css
            this.$el.addClass("effeckt-page-active");

            return this; // allow chaining
        },

        afterRender: function() {
            console.log(this.getViewName() + "#afterRender()");

            var self = this;

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
                    .loadURL('http://localhost:8005/api/app/v1/alert_locations/')
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

        beforeNextViewLoads: function() {
            // this is no longer the active page
            this.$el.removeClass("effeckt-page-active");

            // unbind the .on ready handler -- its not an obvious glitch and I 
            // am not seeing a bug yet but typically using .on should use .off
            // especially since we can preserve the map by using instance vars
            // and the new AnimView.conservativeRender() method. 
            this.map.off('ready');

            return this;
        },

    });

});
