Application.View.extend({
    name: "home/header",
    settingsView: null,
    settingsState: null,

    events: {
        'click a[data-toggle="aside"]': 'toggleSettings'
    },

    initialize: function() {
        this.settingsState = true;

        // create and prep the settings view
        if (!this.settingsView) {

            this.settingsView = Application.View["settings"] = new Application.Views["home/settings"]({
                el: '#settings', // stick this to the aside element in the DOM
                className: 'effeckt-off-screen-nav'
            });

            this.settingsView.render();

            Application.$el.prepend(this.settingsView.$el);
        }

        return this;
    },

    toggleSettings: function(event) {
        console.log('Toggled Settings - settingsState is ' + this.settingsState);
        console.log(event.target);

        // animate the settings view in
        this.settingsView.toggle(this.settingsState);

        // change the state
        this.settingsState = !this.settingsState;

        _.delay(function() {

            // activate the overlay mask on parent view aka: home or maplist
            this.parent.$('a.overlay').toggleClass('mask');
        }, 200);

        return true;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/header"]()