define([
    'anim-view',
    'models/settings',
    'hbs!templates/fallback-settings',
    'store'
], function(AnimView, SettingsModel, template, store) {

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
            var self = this;

            console.log(this.getViewName() + ' view init triggered!');

            setTimeout(function() {
                // get the resource from the server
                self.model.fetch({
                    success: function(model, response, options) {
                        console.log('Settings Fetched! %s %s -- %s', model, response, options);

                        // we have the settings, hide the loading gif
                        self.$('#ajax-loader').hide();
                    },
                    error: function(model, response, options) {
                        console.debug('!!!! Error fetching settings %s %s %s', model, response, options);
                    }
                });

            }, 1500);

            // tell vesel to persist this view on the page view stack instead of destroying it
            this.$el.attr("data-view-persist", "true");

            return this;
        }

    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()