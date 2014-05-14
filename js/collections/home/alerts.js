Application.Collection.extend({
    name: "home/alerts",

    url: "https://headsuphuntington.herokuapp.com/api/app/v1/alerts/",
    urlRoot: 'https://headsuphuntington.herokuapp.com/api/app/v1/alerts/',

    initialize: function() {
        console.log("Alerts Collection#initialize");

        // mixin websockets object
        _.extend(this, BackSocket.prototype);

        // instantiate backSocket for websockets on this collection
        if (_.isFunction(this.live)) {
            this.live({
                key: '3fb8e3f49e89f2640bc9',
                channel: 'huh',
                channelSuffix: 'channel',
                messageSuffix: 'message',
                autoListen: true,
                logEvents: true,
                logStats: true,
                filters: {
                    status: 'C'
                }
            });
        }

        return this;
    },

    comparator: function(model) {
        console.log('comparator triggered');
        return -model.get('id');
    }
});

// Instances of this collection can be created by calling:
// new Application.Collections["home/alerts"]()