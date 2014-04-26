Application.AnimView.extend({
    name: "home/home",
    animateIn: 'fadeIn',
    animateOut: 'iosFadeLeft',
    collectionView: null,

    initialize: function() {
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        return this;

    },

    onRender: function() {
        console.log('!HomePageView#onRender() triggered');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()