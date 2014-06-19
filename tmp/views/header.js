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

            return this;
        },

        toggleSettings: function(event) {
            // animate the settings view in

            return true;
        }
    });
});

// Instances of this view can be created by calling:
// new Application.Views["home/header"]()