Application.AnimView.extend({
    name: "home/maplist",

    animateIn: 'bounceInDown',
    animateOut: 'slideOutUp',

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

        // trigger the leaflet plugin code. Note use of _.delay
        // It is used only to circumvent a known DOM issue, thus the
        // *timing* can be 0ms & works fine. 
        _.delay(function() {

            var featureLayer,
                mapboxTiles,
                mapview;

            mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
                attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Powered by MSCNS</a>'
            });

            mapview = new L.map('mapmain', {
                doubleClickZoom: false
            }).addLayer(mapboxTiles).setView([38.412, -82.428], 14).on('dblclick', function(e) {
                console.log('Double Click event triggered.. returning expected results for now.');
                return mapview.setView(e.latlng, mapview.getZoom() + 1);
            });

            featureLayer = L.mapbox.featureLayer().
            loadURL('http://127.0.0.1:8005/api/app/v1/alert_locations/').
            addTo(mapview).on('ready', function() {
                featureLayer.eachLayer(function(l) {
                    return mapview.panTo(l.getLatLng());
                });
            });
        }, 0);
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/maplist"]()