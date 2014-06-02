define([
  'anim-view',
  'views/list',
  'hbs!templates/home'
], function(AnimView, ListView, template) {

    return AnimView.extend({
        name: "home",
        template: template,
        
        animateIn: "fadeIn",
        animateOut: "bounceOutLeft",
        collectionView: null,

        events: {
            'click a.overlay.mask': function(event) {

                // get reference to the nested header view using its data-view-cid
                var headerView = this.children[this.$("header").data("view-cid")];

                // call the "home/header" view method to trigger aside reveal
                // forward the event data on to the header view too.
                headerView.toggleSettings(event);

                return false;
            }
        },

        initialize: function() {
            // instantiate the CollectionView to create the nested list
            // & list-item views with the Alerts collection/resource data
            // as the list-item template context. The Emmet equivalent for
            // this structure would be something like:  ul>li*(alerts.length)
            this.collectionView = new ListView({
                collection: this.collection
            });

            this.$el.attr("data-effeckt-page", "home");
            this.$el.attr("data-view-persist", "true");

            return this; // allow chaining
        },

        // Perfect for a unit test that the home view should have onRender()
        beforeRender: function() {
            console.log(this.getViewName() + "#beforeRender()");

            // add this as the active page for effeckt.css
            this.$el.addClass("effeckt-page-active");

            return this; // allow chaining
        },

        // this view persists but we still need a hook when new route & view come in
        beforeNextViewLoads: function() {
            console.log(this.getViewName() + "#beforeNextViewLoads() helper called");

            // this is no longer the active page
            this.$el.removeClass("effeckt-page-active");

            return this;
        }
    }); // -- end of home view definition

}); // end of Module definition
