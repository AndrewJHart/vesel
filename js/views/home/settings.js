Application.AnimView.extend({
    name: "home/settings",

    // add animations
    animateAside: "effeckt-off-screen-nav-left-push effeckt-show",
    animateIn: "",
    animateOut: "",

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

        //this.$el.addClass("effeckt-off-screen-nav-left-push effeckt-show");

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()