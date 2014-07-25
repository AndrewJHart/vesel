define([
    'view',
    'anim-view',
    'models/settings',
	'hbs!templates/fallback-settings',
    'store'
], function(View, AnimView, SettingsModel, template, store) {

    return AnimView.extend({
        name: "fallback-settings",
        template: template,

        // add animations
        animateIn: "rotateInUpLeft",
        animateOut: "rotateOutUpRight",

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


                property = "metadata." + metadataPosition + ".is_enabled";

                if ($(event.target).hasClass('active')) {
                    state = true;
                } else {
                    state = false;
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

            'touchend div.toggle > div.toggle-handle': function(event) {
                var metadataPosition = this.$(event.target).data("meta-position"),
                    property = null,
                    model = this.$(event.target).model(),
                    state = null;


                property = "metadata." + metadataPosition + ".is_enabled";

                if ($(event.target).parent().hasClass('active')) {
                    state = true;
                } else {
                    state = false;
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

            return this;
        }

    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()