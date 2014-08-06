define([
    'anim-view',
    'models/settings',
    'hbs!templates/fallback-settings'
], function(AnimView, SettingsModel, template) {

    return AnimView.extend({
        name: "fallback-settings",
        template: template,

        // add animations
        animateIn: "zoomInLeft",
        animateOut: "zoomOutLeft",

        events: {
            'change form > #global_priority': function(event) {
                event.preventDefault();

                this.model.set('global_priority', Number(event.target.value), {
                    silent: true
                });

                this.model.save({}, {
                    wait: true,
                    silent: true
                });
            },

            'click div.toggle': function(event) {
                var metadataPosition = this.$(event.target).data("meta-position"),
                    property = null,
                    model = this.$(event.target).model(),
                    state = null;

                event.preventDefault();


                property = "metadata." + metadataPosition + ".is_enabled";

                if ($(event.target).hasClass('active')) {
                    state = false;
                } else {
                    state = true;
                }

                // try to get the model
                this.model.set(property, state, {
                    silent: true
                });

                this.model.save({}, {
                    wait: true,
                    silent: true
                });
            },

            'touchstart div.toggle > .toggle-handle': function(event) {
                var metadataPosition = this.$(event.target).data("meta-position"),
                    property = null,
                    model = this.$(event.target).model(),
                    state = null;

                event.preventDefault();

                property = "metadata." + metadataPosition + ".is_enabled";

                if ($(event.target).parent().hasClass('active')) {
                    state = false;
                } else {
                    state = true;
                }

                // try to get the model
                this.model.set(property, state, {
                    silent: true
                });


                this.model.save({}, {
                    wait: true,
                    silent: true
                });
            }
        },

        initialize: function() {
            console.log(this.getViewName() + ' view init triggered!');

            // get the resource from the server
            this.model.fetch();

            // tell vesel to persist this view on the page view stack instead of destroying it
            this.$el.attr("data-view-persist", "true");

            return this;
        }

    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()