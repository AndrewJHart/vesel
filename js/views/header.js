define([
    'underscore',
    'view',
    'views/settings',
    'models/settings'
    // 'hbs!templates/header'
], function(_, View, SettingsView, SettingsModel /*, template*/ ) {

    return View.extend({
        name: "header",
        //template: template,

        events: {
            // 'click a[data-toggle="aside"]': 'toggleSettings'
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
            if (!Application["settings"]) {

                _.delay(function() {
                    // SRP pattern at its finest. The settings view is created & nested here
                    // but ALL FUNCTIONS that are responsible for its state are managed by
                    // the settings view itself internally e.g. toggle, settingsState
                    // The header only acts as an *event mediator* here
                    Application["settings"] = new SettingsView({
                        el: '#settings', // stick this to the aside element in the DOM
                        className: 'effeckt-off-screen-nav',
                        model: new SettingsModel()
                    });

                    Application["settings"].render();

                    // notice the frameworks prepend call to keep aside at top of markup
                    Application.$el.prepend(Application["settings"].$el);

                }, 1500);
            }

            return this;
        },

        toggleSettings: function(event) {
            // animate the settings view in
            Application["settings"].toggle();

            _.delay(function() {

                // activate the overlay mask on parent view aka: home or maplist
                this.parent.$('a.overlay').toggleClass('mask');
            }, 200);

            return true;
        }
    });
});

// Instances of this view can be created by calling:
// new Application.Views["home/header"]()