Application.AnimView.extend({
    name: "detail/index",

    // classes for this view
    className: 'detail',

    // animation properties
    animateIn: "iosSlideInRight",
    animateOut: "slideOutRight",

    // init for detail view
    initialize: function() {
        console.log(this.name + '#initialize');

        this.description = "Lorem Ipsum for detail-view " + this.cid;
        this.extra = "Simply extra context data :)";

        // console.log('What about context for handlebars template? :)');
        // console.log(this.context());

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

Application.View.extend({
    name: "detail/header",
    type: null,

    initialize: function() {
        // console.log('DetailView#header view init triggered!');
        // console.log('Type of partial is: ' + this.type);

        return this;
    }
});


Application.View.extend({
    name: "detail/footer",
    type: null,

    initialize: function() {
        // console.log('DetailView#footer view init triggered!');
        // console.log('Type of partial is: ' + this.type);

        return this;
    }
});