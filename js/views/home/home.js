Application.AnimView.extend({
    name: "home/home",
    animateIn: "fadeIn",
    animateOut: "iosFadeLeft",
    collectionView: null,

    events: {
        'click a.overlay.mask': 'hideSettings'
    },

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
    },

    hideSettings: function(event) {

        // get the header view by accessing the nested element
        // with header tag and getting its data-view-cid
        // then grab that view from this.children array of objects
        var headerView = this.children[this.$('header.bar').data("view-cid")];

        headerView.toggleSettings(event);
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()