Application.AnimView.extend({
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
            attribution: '<a href="http://www.mscns.com" target="_blank">Powered by MSCNS</a>'
        });

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

        // trigger the leaflet plugin code. Note could use _.delay
        // It is used only to circumvent a known DOM issue, thus the
        // *timing* can be 0ms & works fine or no delay at all since afterRender.

        if (!this.map) {
            // only create the map once
            this.map = new L.map('mapmain', {
                zoomControl: false, // prevent zoom control from being added (instead of removing it later)
                locateControl: true
            }).addLayer(this.tiles).setView([38.412, -82.428], 13);

            this.primaryLayer = L.mapbox.featureLayer().
            loadURL('http://192.168.1.5:8005/api/app/v1/alert_locations/').
            addTo(this.map).on('ready', function() {
                self.primaryLayer.eachLayer(function(l) {
                    return self.map.panTo(l.getLatLng());
                });
            });
        } else {
            this.map.on('ready', function() {
                self.primaryLayer.eachLayer(function(levent) {
                    return self.map.panTo(levent.getLatLng());
                });
            });
        }
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