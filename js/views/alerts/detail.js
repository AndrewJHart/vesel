// detail view for alerts collection
Application.View.extend({
    name: "alerts/detail",
    transitionIn: "slideInRight",
    transitionOut: "slideOutRight",

    initialize: function() {
        console.debug('View alerts/detail initialization triggered!. Route worked');

        console.log('Do we have a model?');
        console.log(this.model);

        this.description = "Lorem Ipsum for detail-view " + this.cid;
        this.extra = "Simply extra context data :)";

        console.log('What about context? :)');
        console.log(this.context());

        return this;
    }
});