Application.Model["settings"] = Backbone.DeepModel.extend({
    name: "home/setting",

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

        // console.log('log of model url output.. device=');
        // console.log(device);
        // console.log("registration is " + device);
        // console.log("user:");
        // console.log(user);
        // console.log("username is: " + username);
        // console.log("api:");
        // console.log(api);
        // console.log("key is: " + key);

        return this.urlRoot + device + "/?username=" + username + "&api_key=" + key;
    }
});

// Instances of this model can be created by calling:
// new Application.Models["home/setting"]()