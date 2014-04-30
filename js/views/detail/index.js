Application.AnimView.extend({
    name: "detail/index",
    className: 'detail',
    animateIn: "iosSlideInRight",
    animateOut: "slideOutRight",

    initialize: function() {
        console.log('Detail page-view (detail/index) initialization triggered.');

        this.description = "Lorem Ipsum for detail-view " + this.cid;
        this.extra = "Simply extra context data :)";

        console.log('What about context? :)');
        console.log(this.context());

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["detail/index"]()


//------------------------------
// Standard Thorax.View view's
//
// used for nesting sub-views into an AnimView (or page-view)
// note: you can nest a view without creating a line of javascript 
//       by using the handlebars {{#view}}..content..{{/view}} helper
//

// a div mask for shadow on left side of a div for animating... this
// should not need its own view and will be deprecated soon. 
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