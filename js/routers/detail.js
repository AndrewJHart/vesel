// The Detail Page Router/Controller
// ----------------------------------
// note: this segmentation of routers provides the "Controller" 
//       functionality from other frameworks like Rails or Chaplin.js
new(Backbone.Router.extend({
    routes: module.routes,

    // this is the index (aka: show) route handler for the Detail page
    index: function(params) {
        // hoisting 
        var model = null,
            pageView = null;

        // log the route params passed to us
        console.log("detail/index route received :id " + params);

        // use params to get model from our collection
        model = Application.Collection['alerts'].get(params);

        // create the detail page-view that contains the header view,
        // the footer view, and the actual content view nested within
        // using the handlebars "view" helper
        pageView = new Application.Views["detail/index"]({
            className: 'detail right',
            model: model
        });

        // animate to this view and remove the classname 'right'
        // after the view is appended to the DOM but right before 
        // the transition happens. 
        Application.goto(pageView, {
            page: true, // this is its own page/pane so tell app to animate it
            toggleIn: 'right' // remove the class right before animating
        });
    }
}));