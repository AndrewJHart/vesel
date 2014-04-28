Application.AnimView.extend({
    name: "home/home",
    animateIn: 'fadeIn',
    animateOut: 'iosFadeLeft',
    collectionView: null,

    initialize: function() {
        this.collectionView = new Application.Views["home/list"]({
            collection: this.collection
        });

        return this; // allow chaining
    },

    // Perfect for a unit test that the home view should have onRender()
    beforeRender: function() {
        console.debug('!Home page-view AnimView::beforeRender() triggered');

        return this; // allow chaining
    },

    afterRender: function() {
        console.debug('!Home page-view AnimView::afterRendered() triggered');

        return this; // allow chaining
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()