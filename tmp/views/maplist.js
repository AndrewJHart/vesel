define([
    'anim-view',
    //'L',
    //'locate',
    'hbs!templates/maplist'
], function(AnimView, /*L,*/ /* L.Control.Locate, */ template) {

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
            // add this as the active page for effeckt.css
            this.$el.addClass("effeckt-page-active");

            return this; // allow chaining
        },

        afterRender: function() {
            var self = this;

            if (!this.map) {

                var layers = L.control.layers({
                    'Streets': this.tiles,
                    'Satellite': L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png', {
                        detectRetina: true
                    })
                });

                // only create the map once
                this.map = new L.map('mapmain', {
                    zoomControl: false, // prevent zoom control from being added (instead of removing it later)
                    locateControl: true
                }).addLayer(this.tiles);

                // get our primary layer with geoJSON
                this.primaryLayer = L.mapbox.featureLayer()
                    .loadURL('https://headsuphuntington.herokuapp.com/api/app/v2/alert_locations/')
                    .addTo(this.map)
                    .on('ready', function() {
                        self.primaryLayer.eachLayer(function(l) {
                            // set our icons and pan to the huntington area
                            l.setIcon(L.icon(l.feature.properties.icon));
                            return self.map.panTo(l.getLatLng());
                        });
                    });

                layers.addTo(self.map);
                this.map.setView([38.412, -82.428], 13);

            } else {
                this.map.on('ready', function() {
                    self.primaryLayer.eachLayer(function(levent) {
                        // set our icons and pan to the huntington area
                        l.setIcon(L.icon(l.feature.properties.icon));
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