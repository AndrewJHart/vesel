define(['backbone', 'deepmodel', 'store'], function(Backbone, DeepModel, store) {
    // use deep model for nested properties
    return Backbone.DeepModel.extend({
        name: 'settings',

        urlRoot: 'https://heads-up.herokuapp.com/api/app/v2/device_settings/ios/',

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
                        "region_set": [{
                            "name": store.get('region')
                        }],
                        "username": store.get('username'),
                    }
                },
                "global_priority": 1,
                "id": store.get('uuid')
            }
        },

        url: function() {
            var device = this.get("device.token"),
                user = this.get("device.user"),
                username = this.get("device.user.username"),
                api = this.get("device.user.api_key"),
                key = this.get("device.user.api_key.key"),
                uid = this.get("id");

            return this.urlRoot + uid + "/?username=" + username + "&api_key=" + key;
        }
    });
});