define([
    'underscore',
    'anim-view',
    'hbs!templates/detail'
], function(_, AnimView, template) {

    return AnimView.extend({
        name: "detail",
        template: template,

        // classes for this view
        className: 'detail',

        // animation properties
        animateIn: "iosSlideInRight",
        animateOut: "slideOutRight",

        events: {
            'click a.toggle-share': function(event) {
                var alert, message, post_msg, post_title, subject;

                event.preventDefault();

                post_msg = this.model.get('information');
                subject = this.model.get('subject');
                post_title = "Heads Up! " + subject;

                message = {
                    title: post_title,
                    text: post_msg,
                    url: "http://headsupapp.io/beckley/alerts/#detailIphone/" + this.model.get('id') + "/"
                };

                window.socialmessage.send(message);

                return false;
            }
        },

        // init for detail view
        initialize: function() {
            // check that we have an ID for the map of this alert or nullify it
            this.mapUUID = (this.model.get('map').id || null);

            // load the tiles only if we have a map for this alert
            if (this.mapUUID) {
                // tile layer
                this.tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.il5b6d5o/{z}/{x}/{y}.png', {
                    attribution: '<a href="http://www.mscns.com" target="_blank">Powered by MSCNS</a>',
                    detectRetina: true
                });
            }

            return this;
        },

        afterRender: function() {
            var self = this,
                primaryLayer,
                layers;

            // only load the detail map view if delegate created a map point for it
            if (this.mapUUID) {
                layers = L.control.layers({
                    'Satellite': this.tiles,
                    'Streets': L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
                        detectRetina: true
                    })
                });

                _.delay(function() {
                    // only create the map once
                    self.map = new L.map('single-map', {
                        zoomControl: false, // prevent zoom control from being added (instead of removing it later)
                        locateControl: false
                    }).addLayer(self.tiles);

                    // get our primary layer with geoJSON from the alert_locations/pk/ resource
                    // notice that our api uses the pk / id of the Alert and not the pk / id of the map
                    primaryLayer = L.mapbox.featureLayer()
                        .loadURL('https://heads-up.herokuapp.com/api/app/v2/alert_locations/' + self.model.get('id') + '/')
                        .addTo(self.map)
                        .on('ready', function() {
                            primaryLayer.eachLayer(function(l) {
                                // set our icons and pan to the huntington area
                                l.setIcon(L.icon(l.feature.properties.icon));
                                return self.map.panTo(l.getLatLng());
                            });
                        });

                    layers.addTo(self.map);

                    self.map.setView([37.788,-81.117],15) // hancock

                }, 250);
            }

            return this;
        },

        onClose: function() {
            if (this.map && this.mapUUID) {
                this.map.off('ready');

                _.delay(function() {
                    delete this.map;
                    delete this.tiles;
                }.bind(this), 0);

            }

            return this;
        }
    });

});