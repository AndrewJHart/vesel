Application.View.extend({
    name: "detail/footer",
    type: null,

    initialize: function() {
        console.log('DetailRegion#footer view init triggered!');
        console.log('Type of partial is: ' + this.type);

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["detail/footer"]()