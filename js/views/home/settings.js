Application.AnimView.extend({
    name: "home/settings",

    // add classes    
    className: 'settings',

    // add animations
    animateIn: "iosSlideInRight",
    animateOut: "slideOutRight",

    // data-attributes
    // attributes: {
    //     'data-view-persist': 'false'
    // },

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        // todo: bug: if `el` then declaritve properties for
        // attributes and classNames fail on first run
        //this.$el.addClass('right');
        //this.$el.attr('data-view-persist', 'false');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()