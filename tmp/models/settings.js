define(['backbone', 'deepmodel'], function(Backbone, DeepModel) {
    // use deep model for nested properties
    return Backbone.DeepModel.extend({
        name: 'settings',

        urlRoot: 'http://localhost:8005/api/app/v1/device_settings/gcm/',

        // gets the registration id, username, and pass from the user and device
        // then login will generate the api key
        defaults: function() {
            return {
                "device": {
                    "registration_id": "bff7506932143c6e16d84b4c95e6bc29e24fd232e4106a53f0105f5f19f51234Droid18",
                    "user": {
                        "api_key": {
                            "key": "8b4f5e8edde8842f28dd66210e1c7800fa6b8d87"
                        },
                        "username": "dhart7"
                    }
                },
                "global_priority": 1
            }
        },

        url: function() {
            var device = this.get("device.registration_id"),
                //device_registration = device.get("registration_id"),
                user = this.get("device.user"),
                username = this.get("device.user.username"),
                api = this.get("device.user.api_key"),
                key = this.get("device.user.api_key.key");

            return this.urlRoot + device + "/?username=" + username + "&api_key=" + key;
        }
    });
});