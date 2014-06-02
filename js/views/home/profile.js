Application.AnimView.extend({
    name: "home/profile",

    className: "profile",

    // default animations
    animateIn: 'bounceInUp',
    animateOut: 'slideOutDown',

    initialize: function() {
        console.log(this.getViewName() + "#initialize()");

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/profile"]()

// to render, append, and animate the view call:
// Application.goto(view, { page: true });

// You can place the above code in the proper router
// inside of its definition.. something like this:
//
// myRouteHandler: function(params) {
//    // create instance of our view
//	  var view = new Application.Views["home/profile"]({
//	      // pass options to view constructor
//        className: 'class-for-this-view',
//    });
//    
//    Application.goto(view, {
//        // set page to true for animations
//        page: true
//    }); 
// }