define([
    'underscore',
    'anim-view',
    'hbs!templates/root'
], function(_, AnimView, template) {

    // Create the Application object and root View, Application.goto(view) will
    // pass a view to the Root view to be animated or just added to the page..
    // Here we are defining the base Application "root" view class from AnimView
    var RootView = AnimView.extend({

        el: 'body',
        template: template,

        // global events for all or any nested views
        events: {

            // any click event with this data-attr will trigger external url
            'nested click [data-external-url]': function(e) {

                // grab the url to be opened externally from data-external-url attr
                var url = $(e.target).data('external-url');

                console.log(e.originalContext);

                console.log('** Opening url ' + url + ' from event handler for a[data-external-url]');

                // prevent link from opening by default
                e.preventDefault();

                // force cordova to open the link in safari
                window.open(url, '_system', 'location=no');

                // return false just in case
                return false;
            }
        }

    }); // -- end of RootView class definition


    // append an instance method on the rootView object
    var instance;
    RootView.getInstance = function(target) {
        if (!instance) {
            instance = window.Application = new RootView({
                name: 'root', // will use template with name root.handlebars
                el: 'body' // force view attach directly to body vs appending div to it
            });

            instance.appendTo(target || document.body);
        }
        return instance;
    };

    return RootView;
});