Application.AnimView.extend({
    name: "detail/index",
    className: 'detail',
    animateIn: "iosSlideInRight",
    animateOut: "slideOutRight",

    initialize: function() {
        console.debug('DetailRegion#index view (detail/index) initialization triggered!. Route worked');

        console.log('Do we have a model?');
        console.log(this.model);

        this.description = "Lorem Ipsum for detail-view " + this.cid;
        this.extra = "Simply extra context data :)";

        console.log('What about context? :)');
        console.log(this.context());

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["detail/index"]()


// This should be nested or not even a view -- 
Application.View.extend({
    name: "detail/mask",

    initialize: function() {
        console.debug("** ContentMask View loaded");

        return this;
    }
});


Application.View.extend({
    name: "detail/header",
    type: null,

    initialize: function() {
        console.log('DetailView#header view init triggered!');
        console.log('Type of partial is: ' + this.type);

        return this;
    }
});


Application.View.extend({
    name: "detail/footer",
    type: null,

    initialize: function() {
        console.log('DetailView#footer view init triggered!');
        console.log('Type of partial is: ' + this.type);

        return this;
    }
});