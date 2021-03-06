define([
    'underscore',
    'collection',
    'moment',
    'backsocket'
], function(_, Collection, moment, BackSocket) {

    return Thorax.Collection.extend({
        name: 'alerts',

        url: "https://heads-up.herokuapp.com/api/app/v2/alerts/?region=1",
        urlRoot: 'https://heads-up.herokuapp.com/api/app/v2/alerts/?region=1',
        _cached: null,

        events: {
            // listen for *add* events and add them to cached collection too
            'add': function(model) {
                this.cached.add(model, {
                    merge: true,
                    silent: true
                });

                this.trigger('add'); // propagate
            }
        },

        initialize: function() {
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
            // format the date while we're sorting (hack - logic should be moved to better function)
            var originalTimestamp = model.get('modified_at'),
                date = moment(originalTimestamp).format("llll");

            // set the date on the model since we never PUT/POST back on this resource
            model.set('modified_at', date, {
                silent: true
            });

            return -date;
        },

        filterBy: function(key, value) {
            var filteredCollection;

            if (!this.cached)
                this.cached = $.extend(true, {}, this);

            if (key === "category") {
                if (value !== "all") {
                    filteredCollection = this.getCategory(value);
                } else {
                    filteredCollection = this.cached.models;
                }
            }

            // reset the collection to show filtered models
            this.reset(filteredCollection);

            return this;
        },

        getCategory: function(name) {
            // reset the state of the collection back to its original with all models
            this.reset(this.cached.models);

            // iterate and return models that contain the matching category name
            return _.filter(this.models, function(model) {
                var category = model.get('category').name.toLowerCase();
                return category == name.toLowerCase();
            });
        }
    });

});