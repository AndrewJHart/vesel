Application.View.extend({
    name: "detail/index",
    transitionIn: "slideInRight",
    transitionOut: "slideOutRight",

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