Application.AnimView.extend({
    name: "home/home",
    animateIn: "fadeIn",
    animateOut: "iosFadeLeft",
    collectionView: null,

    initialize: function() {
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        this.$el.attr("data-effeckt-page", "home");
        this.$el.attr("data-view-persist", "true");

        return this; // allow chaining
    },

    // Perfect for a unit test that the home view should have onRender()
    beforeRender: function() {
        console.log(this.name + "#beforeRender()");

        // add 
        this.$el.addClass("effeckt-page-active");

        return this; // allow chaining
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()