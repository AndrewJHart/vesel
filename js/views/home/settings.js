Application.AnimView.extend({
    name: "home/settings",

    // add animations
    animateIn: "effeckt-off-screen-nav-left-push",
    animateOut: "effeckt-off-screen-nav-left-push",

    // data-attributes
    // attributes: {
    //     'data-view-persist': 'false'
    // },

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        // todo: bug: if `el` is specified then declaritve properties
        // i.e. attributes and/or classNames, aren't applied on first run
        this.$el.addClass('effeckt-off-screen-nav');
        this.$el.attr('data-view-persist', 'true');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()