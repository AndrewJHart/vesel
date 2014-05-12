Application.View.extend({
    name: "home/header",
    settingsState: null,

    events: {
        'click a[data-toggle="aside"]': 'toggleSettings'
    },

    initialize: function() {
        this.settingsState = true;

        // create and prep the settings view 
        // Note: I'm using Application.View instead of this.settings to check
        // if the settings view has ever been created for good reason: 
        // There can be multiple *instances* of the header-view class and each
        // would create a new settings view (only once per instance but still..)
        // because that instance's var this.settings would be null.. 
        // -----
        // This prevents a click to open settings from list view AND the map
        // view from creating and overwriting more than one single instance of
        // the settings view. 
        // Better Performance, less memory, no confusion with the collection/models
        //
        if (!Application.View["settings"]) {

            Application.View["settings"] = new Application.Views["home/settings"]({
                el: '#settings', // stick this to the aside element in the DOM
                className: 'effeckt-off-screen-nav',
                model: new Application.Model["settings"]()
            });

            Application.View["settings"].render();

            // notice the frameworks prepend call to keep aside at top of markup
            Application.$el.prepend(Application.View["settings"].$el);
        }

        return this;
    },

    toggleSettings: function(event) {
        console.log('Toggled Settings - settingsState is ' + this.settingsState);
        console.log(event.target);

        // animate the settings view in
        Application.View["settings"].toggle(this.settingsState);

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