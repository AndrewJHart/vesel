Application.View.extend({
    name: "home/footer",
    type: null,

    initialize: function() {
        console.log('HomeRegion#header view init triggered!');
        console.log('Type of partial is: ' + this.type);

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/footer"]()