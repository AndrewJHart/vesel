Application.View.extend({
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