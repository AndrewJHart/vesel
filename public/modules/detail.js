
vesel['detail'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  vesel['detail'] = exports;

  /* router : detail */
module.name = "detail";
module.routes = {"detail/:id":"index"};
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
        console.debug('params sent to the Detail Controller/Router are ' + params);

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
;;
Handlebars.templates['detail/index'] = Handlebars.compile('{{#view \"detail/mask\" tag=\"div\" className=\"contentMask\"}}\n{{/view}}\n{{#view \"detail/header\" tag=\"header\" className=\"bar bar-nav\" type=\"detail-header\"}}\n  \t{{#link \"\" expand-tokens=true class=\"icon icon-left-nav pull-left\"}}{{/link}}\n    <a href=\"\" class=\"icon icon-gear pull-right\"></a>\n  \t<h1 class=\"title\">Details</h1>\n{{/view}}\n<div class=\"content\">\n\t<div class=\"content-padded\">\n\t  <h4>{{subject}}</h4>\n\n\t  <h6>{{#visible}} Visible: {{id}} {{/visible}}</h6>\n\t  <p>Item {{id}} has a visible status of {{visible}}</p>\n\t  <p>{{information}}</p>\n\t  <br>\n\t  <small>{{category.name}}</small>\n\t</div>\n</div>\n{{#view \"detail/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"detail-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
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
;;


  if (vesel['detail'] !== module.exports) {
    console.warn("vesel['detail'] internally differs from global");
  }
  return module.exports;
}).call(this);
