
vesel['detail'] = (function() {
  var module = {exports: {}};
  var exports = module.exports;
  vesel['detail'] = exports;

  /* router : detail */
module.name = "detail";
module.routes = {};
new(Backbone.Router.extend({
    routes: module.routes,

    index: function(params) {
        console.log('params sent to detail action from router are ' + params);

        var model = Application.Collection['alerts'].get(params);
        console.log('model properties from collection are:');
        console.debug(model);

        var view = new Application.Views["detail/index"]({
            el: '#page2',
            visible: true,
            model: model
        });
        view.appendTo('body'); // apend the view to the body or page2 now?


        // swap views
        Application.setView(view, {
            transition: function(newView, oldView, append, remove, complete) {
                //oldView.retain(Application);
                //Application.retain(oldView);

                console.log('Old View:');
                console.debug(oldView);

                console.log('New View:');
                console.debug(newView);


                if ((oldView !== null && oldView !== undefined) &&
                    (newView !== null && newView !== undefined)) {

                    // make everything happen at once
                    //append(); // append the new view?
                    setTimeout(function() {

                        // slide out the current detail view
                        $(oldView.el).removeClass().addClass(oldView.transitionOut + ' animated')
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function() {
                                    // append();

                                    $(this).removeClass(oldView.transitionOut + ' animated');

                                    //append();
                                });


                        // slide in the new detail view
                        $(newView.el).show().addClass(newView.transitionIn + ' animated')
                            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function() {
                                    $(this).removeClass(newView.transitionIn + ' animated');

                                    complete();
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
Handlebars.templates['detail/index'] = Handlebars.compile('{{#view \"detail/mask\" tag=\"div\" className=\"contentMask\"}}\n{{/view}}\n{{#view \"detail/header\" tag=\"header\" className=\"bar bar-nav\" type=\"detail-header\"}}\n  \t<a href=\"#\" class=\"icon icon-left-nav pull-left\">Back</a>\n    <a href=\"\" class=\"icon icon-gear pull-right\"></a>\n  \t<h1 class=\"title\">Details</h1>\n{{/view}}\n<div class=\"content\" data-transition-in=\"{{transitionIn}}\" data-transition-out=\"{{transitionOut}}\">\n\t<div class=\"content-padded\">\n\t  <h4>{{title}}</h4>\n\n\t  <h6>{{#visible}} Visible: {{id}} {{/visible}}</h6>\n\t  <p>Item {{id}} has a visible status of {{visible}}</p>\n\t  <p>{{description}}</p>\n\t  <br>\n\t  <small>{{extra}}</small>\n\t</div>\n</div>\n{{#view \"detail/footer\" tag=\"nav\" className=\"bar bar-tab\" type=\"detail-footer\"}}\n  <a class=\"tab-item active\" href=\"#\">\n    <span class=\"icon icon-home\"></span>\n    <span class=\"tab-label\">Home</span>\n  </a>\n  <a class=\"tab-item\" href=\"#\">\n    <span class=\"icon icon-gear\"></span>\n    <span class=\"tab-label\">Settings</span>\n  </a>\n{{/view}}');Application.View.extend({
    name: "detail/index",
    transitionIn: "iosSlideInRight",
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

        if (this.visible) {
            this.$el.addClass('is-visible');
            console.log('Detail layout visible on initialize()');
        } else {
            this.$el.removeClass('is-visible');
            console.log('Detail Layout hidden on initialize()');
        }

        return this;
    },

    isVisible: function(state) {
        if (state) {
            console.debug('DetailLayout#index-view.isVisible triggered. state = ' + state);

            this.visible = state;

            return this.$el.css({
                'display': state
            });
        }

        return this.visible;
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
