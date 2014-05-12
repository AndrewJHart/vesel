Application.Collection.extend({
    name: "home/settings",

    url: "http://localhost:8005/api/app/v1/device_settings/gcm/",
    urlRoot: 'http://localhost:8005/api/app/v1/device_settings/gcm/'
});

// Instances of this collection can be created by calling:
// new Application.Collections["home/settings"]()