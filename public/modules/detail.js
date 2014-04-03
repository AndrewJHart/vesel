
Vesel['detail'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  Vesel['detail'] = exports;

  /* router : detail */
module.name = "detail";
module.routes = {":id":"index"};
new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        console.log('params sent to detail action from router are ' + params);

        var model = window.alertsCollection.get(params);

        console.log('Do we have a view for detail?');
        console.debug(Application.Views.detailView);

        this.detailView = Application.Views.detailView = new Application.Views["detail/index"]({
            el: '#page2',
            visible: true
        });
        this.detailView.appendTo('body');

        var view = Application.Views.detailView;

        // swap views
        Application.setView(view, {
            transition: function(newView, oldView, append, remove, complete) {
                oldView.retain(Application);

                console.log('Old View:');
                console.debug(oldView);
                console.log('Old Views Element');
                console.debug(oldView.$el);

                console.log('New View:');
                console.debug(newView);
                console.log('New Views Element');
                console.debug(newView.$el);

                if ((oldView !== null && oldView !== undefined) &&
                    (newView !== null && newView !== undefined)) {

                    // make everything happen at once
                    //append(); // append the new view?
                    setTimeout(function() {


                        // slide out the current detail view
                        $(oldView.el).removeClass().addClass('fadeOutLeft animated')
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function() {
                                    $(this).removeClass('fadeOutLeft animated');

                                    append();
                                });

                        // slide in the new detail view
                        $(newView.el).addClass(newView.transitionIn + ' animated')
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function() {
                                    $(this).removeClass(newView.transitionIn + ' animated');

                                    setTimeout(function() {
                                        complete();
                                    }, 300);
                                });


                    }, 0);
                }
            }
        }); // closing setView(...)

        // ****
        // Create a single function that performs animation operations
        // passed to it via params and then triggers callback so thorax
        // can append/remove/complete() the cycle
        // ****

        // append();
        // yourAnimation(function() {
        //     remove();
        //     complete();
        // });
    }
}));
;;
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
;;
Handlebars.templates['detail/index'] = Handlebars.compile('{{#view \"detail/header\" tag=\"header\" className=\"bar bar-nav\" type=\"detail-header\"}}\n  \t<a href=\"#\" class=\"icon icon-left-nav pull-left\"></a>\n  \t<h1 class=\"title\">Details</h1>\n{{/view}}\n<div class=\"content\" data-transition-in=\"{{transitionIn}}\" data-transition-out=\"{{transitionOut}}\">\n\t<div class=\"content-padded\">\n\t  <h4>{{title}}</h4>\n\n\t  <h6>{{#visible}} Visible: {{id}} {{/visible}}</h6>\n\t  <p>Item {{id}} has a visible status of {{visible}}</p>\n\t  <p>{{description}}</p>\n\t  <br>\n\t  <small>{{extra}}</small>\n\t</div>\n</div>\n{{#view \"detail/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"detail-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}}');Application.View.extend({
    name: "detail/index",
    transitionIn: "slideInRight",
    transitionOut: "slideOutRight",
    visible: false,

    initialize: function() {
        console.debug('DetailRegion#index view (detail/index) initialization triggered!. Route worked');

        console.log('Do we have a model?');
        console.log(this.model);

        this.description = "Lorem Ipsum for detail-view " + this.cid;
        this.extra = "Simply extra context data :)";

        console.log('What about context? :)');
        console.log(this.context());

        if (this.visible == true) {
            this.$el.show();
        } else {
            this.$el.hide();
        }

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["detail/index"]()
;;
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
;;


  if (Vesel['detail'] !== module.exports) {
    console.warn("Vesel['detail'] internally differs from global");
  }
  return module.exports;
}).call(this);
