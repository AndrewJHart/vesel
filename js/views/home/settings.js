Application.View.extend({
    name: "home/settings",
    type: null,
    className: 'settings left',
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()