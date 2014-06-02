define([
    'underscore',
    'collection'
], function (_, Collection) {

  return Thorax.Collection.extend({
    name: 'alerts',

    url: "https://headsuphuntington.herokuapp.com/api/app/v1/alerts/",
    urlRoot: 'https://headsuphuntington.herokuapp.com/api/app/v1/alerts/',
    _cached: null,

    events: {
        // listen for *add* events and add them to cached collection too
        'add': function(model) {
            this.cached.add(model, {
                merge: true,
                silent: true
            });
        }
    },

    initialize: function() {
        console.log("Alerts Collection#initialize");

        // mixin websockets object
        // _.extend(this, BackSocket.prototype);

        // // instantiate backSocket for websockets on this collection
        // if (_.isFunction(this.live)) {
        //     this.live({
        //         key: '3fb8e3f49e89f2640bc9',
        //         channel: 'huh',
        //         channelSuffix: 'channel',
        //         messageSuffix: 'message',
        //         autoListen: true,
        //         logEvents: true,
        //         logStats: true,
        //         filters: {
        //             status: 'C'
        //         }
        //     });
        // }

        return this;
    },

    // comparator: function(model) {
    //     console.log('comparator triggered');

    //     // format the date while we're sorting (hack - logic should be moved to better function)
    //     var date = moment(model.get('modified_at')).format("llll");

    //     // set the date on the model since we never PUT/POST back on this resource
    //     model.set('modified_at', date, {
    //         silent: true
    //     });

    //     return -model.get('modified_at');
    // },

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
