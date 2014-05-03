Application.AnimView.extend({
    name: "home/maplist",

    animateIn: 'bounceInDown',
    animateOut: 'slideOutUp',

    afterRender: function() {

        setTimeout(function() {
            // return function() {
            var featureLayer, mapboxTiles, mapview;

            mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/mscnswv.hl37jh6m/{z}/{x}/{y}.png', {
                attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Im fucking awesome</a>'
            });

            mapview = new L.map('mapmain', {
                doubleClickZoom: false
            }).addLayer(mapboxTiles).setView([38.412, -82.428], 14).on('dblclick', function(e) {
                console.log('this is some bs charles');
                return mapview.setView(e.latlng, mapview.getZoom() + 1);
            });

            featureLayer = L.mapbox.featureLayer().
            loadURL('http://127.0.0.1:8005/api/app/v1/alert_locations/').
            addTo(mapview).on('ready', function() {
                featureLayer.eachLayer(function(l) {
                    return mapview.panTo(l.getLatLng());
                });
                // setTimeout(function() {
                //     return featureLayer.loadURL('http://127.0.0.1:8005/api/app/v1/alert_locations/');
                // }, 2000);
            });
            // };
        }, 400);
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/maplist"]()