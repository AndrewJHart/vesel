Application.AnimView.extend({
    name: "home/settings",

    // add animations
    animateIn: "effeckt-off-screen-nav-left-push ",
    animateOut: "effeckt-off-screen-nav-left-push ",

    initialize: function() {
        console.log('HomeRegion#settings view init triggered!');

        // todo: bug: if `el` is specified then declaritve properties
        // i.e. attributes and/or classNames, aren't applied on first run
        this.$el.addClass('effeckt-off-screen-nav');
        this.$el.attr('data-view-persist', 'true');

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