Application.Collection.extend({
    name: "home/alerts",

    url: "https://headsuphuntington.herokuapp.com/api/app/v1/alerts/",
    urlRoot: 'https://headsuphuntington.herokuapp.com/api/app/v1/alerts/',

    initialize: function() {
        console.log("Alerts Collection#initialize");

        // todo: connect with backSocket.js for pusher websockets support
        //	 then think about making it open source for others as backbone plugin

        return this;
    }
});

// Instances of this collection can be created by calling:
// new Application.Collections["home/alerts"]()