define(['backbone', 'deepmodel', 'store'], function(Backbone, DeepModel, store) {
    // use deep model for nested properties
    return Backbone.DeepModel.extend({
        name: 'settings',

        urlRoot: 'http://headsupapp.io:8005/api/app/v1/device_settings/ios/',

        // gets the registration id, username, and pass from the user and device
        // then login will generate the api key
        defaults: function() {
            return {
                "device": {
                    "token": store.get('registration_id'),
                    "user": {
                        "api_key": {
                            "key": store.get('api_key')
                        },
                        "username": store.get('username')
                    }
                },
                "global_priority": 1
            }
        },

        url: function() {
            var device = this.get("device.token"),
                //device_registration = device.get("registration_id"),
                user = this.get("device.user"),
                username = this.get("device.user.username"),
                api = this.get("device.user.api_key"),
                key = this.get("device.user.api_key.key");

            return this.urlRoot + device + "/?username=" + username + "&api_key=" + key;
        }
    });
});