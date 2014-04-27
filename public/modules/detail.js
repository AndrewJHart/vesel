
vesel['detail'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  vesel['detail'] = exports;

  /* router : detail */
module.name = "detail";
module.routes = {":id":"index"};
new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {

        var self = this;

        console.log('params sent to detail action from router are ' + params);

        var model = Application.Collection['alerts'].get(params);
        console.log('model properties from collection are:');
        console.debug(model);

        var view = new Application.Views["detail/index"]({
            className: 'detail right',
            model: model
        });

        Application.goto(view, {
            remove: 'right'
        });
    }
}));
;;
Handlebars.templates['detail/index'] = Handlebars.compile('{{#view \"detail/mask\" tag=\"div\" className=\"contentMask\"}}\n{{/view}}\n{{#view \"detail/header\" tag=\"header\" className=\"bar bar-nav\" type=\"detail-header\"}}\n  \t<a href=\"#\" class=\"icon icon-left-nav pull-left\"></a>\n    <a href=\"\" class=\"icon icon-gear pull-right\"></a>\n  \t<h1 class=\"title\">Details</h1>\n{{/view}}\n<div class=\"content\">\n\t<div class=\"content-padded\">\n\t  <h4>{{subject}}</h4>\n\n\t  <h6>{{#visible}} Visible: {{id}} {{/visible}}</h6>\n\t  <p>Item {{id}} has a visible status of {{visible}}</p>\n\t  <p>{{information}}</p>\n\t  <br>\n\t  <small>{{category.name}}</small>\n\t</div>\n</div>\n{{#view \"detail/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"detail-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}}');Application.AnimView.extend({
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
;;


  if (vesel['detail'] !== module.exports) {
    console.warn("vesel['detail'] internally differs from global");
  }
  return module.exports;
}).call(this);
