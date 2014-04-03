Application.View.extend({
    name: "detail/header",
    type: null,

    initialize: function() {
        console.log('DetailRegion#header view init triggered!');
        console.log('Type of partial is: ' + this.type);

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["detail/header"]()