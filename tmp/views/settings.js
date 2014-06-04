define([
  'view',
  'anim-view',
  'models/settings',
  'hbs!templates/settings'
], function(View, AnimView, SettingsModel, template) {

    return AnimView.extend({
        name: "settings",
        template: template,

        // add animations
        animateIn: "effeckt-off-screen-nav-left-push ",
        animateOut: "effeckt-off-screen-nav-left-push ",

        // Single Responsibility Pattern in action 
        settingsState: true, // todo: rename to better variable name

        events: {
            'change div.toggle > input[type="checkbox"]': function(event) {
                var metadataPosition = this.$(event.target).data("meta-position"),
                    property = null,
                    model = this.$(event.target).model();

                event.preventDefault();

                console.log("toggle was changed. Target:");
                console.log(event.target);

                property = "metadata." + metadataPosition + ".is_enabled";

                // try to get the model
                this.model.set(property, event.target.checked, {
                    silent: true
                });

                console.log(this.model);

                this.model.save({}, {
                    wait: true,
                    silent: true
                });
            }
        },

        initialize: function() {
            console.log(this.getViewName() + ' view init triggered!');

            // todo: bug: if `el` is specified then declaritve properties
            // i.e. attributes and/or classNames, aren't applied on first run
            this.$el.addClass('effeckt-off-screen-nav');
            this.$el.attr('data-view-persist', 'true');

            // get the resource from the server
            this.model.fetch();

            return this;
        },

        toggle: function() {
            var self = this;

            console.log('Toggled Settings - settingsState is ' + this.settingsState);
            console.log(event.target);

            if (this.settingsState) {
                // reveal and animate the aside view

                this.$el.addClass(this.animateIn);

                this.$el.on('webkitAnimationEnd transitionend', function() {

                    self.$el.off('webkitAnimationEnd transitionend');
                    // show the aside panel
                    self.$el.addClass("effeckt-show");

                    // force a DOM redraw for webkit browsers see SO here:
                    // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
                    self.el.style.display = 'none';

                    // notice that delay must at least be >= length of animation duration
                    // or the re-draw will break the animation just showing the panel w/o it
                    _.delay(function() {

                        self.el.style.display = 'block';
                    }, 250);
                });
            } else {
                // conceal the aside view and hide

                this.$el.removeClass("effeckt-show");

                this.$el.on('webkitAnimationEnd transitionend', function() {

                    self.$el.off('webkitAnimationEnd transitionend');

                    // remove the class
                    self.$el.removeClass(self.animateOut);
                });
            }

            // set settingsState (visibility) opposite to its current value
            this.settingsState = !this.settingsState;

            return this;
        }

    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()