Application.AnimView.extend({
    name: "home/settings",

    // add classes    
    className: 'settings',

    // add animations
    animateIn: "iosSlideInRight",
    animateOut: "slideOutRight",

    // data-attributes
    attributes: {
        'data-view-persist': 'true'
    },

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        this.$el.attr('data-view-persist', 'true');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()