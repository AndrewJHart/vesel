Application.AnimView.extend({
    name: "home/settings",

    // add animations
    animateIn: "effeckt-off-screen-nav-left-push ",
    animateOut: "effeckt-off-screen-nav-left-push ",

    // model: new Thorax.Model({
    //     category: "Police",
    //     enabled: false
    // }),

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
            model.set(
                property, event.target.checked, {
                    silent: true
                });

            console.log(model);

            model.save();

            return false;
        }
    },

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        // todo: bug: if `el` is specified then declaritve properties
        // i.e. attributes and/or classNames, aren't applied on first run
        this.$el.addClass('effeckt-off-screen-nav');
        this.$el.attr('data-view-persist', 'true');

        //this.model.url = "http://localhost:8005/api/v1/app/device_settings/";
        this.model.fetch();

        return this;
    },

    toggle: function(settingsState) {
        var self = this;

        if (settingsState) {
            console.log('settingsState = true, settings view animating...');

            this.$el.addClass(this.animateIn);

            this.$el.on('webkitAnimationEnd transitionend', function() {

                self.$el.off('webkitAnimationEnd transitionend');
                // show the aside panel
                self.$el.addClass("effeckt-show");

                // force a DOM redraw for webkit browsers see SO here:
                // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
                self.el.style.display = 'none';

                _.delay(function() {

                    self.el.style.display = 'block';
                }, 0);
            });
        } else {

            this.$el.removeClass("effeckt-show");

            this.$el.on('webkitAnimationEnd transitionend', function() {

                self.$el.off('webkitAnimationEnd transitionend');

                // remove the class
                self.$el.removeClass(self.animateOut);
            });
        }

        return this;
    }

});

// Instances of this view can be created by calling:
// new Application.Views["home/settings"]()