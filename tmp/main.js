require([
    'jquery',
    'backbone',
    'views/root',
    'routers/routes',
    'store',
    'helpers'
], function($, Backbone, RootView, Router, store) {

    var app,
        cached_token,
        firstRunDemo,
        pushNotification,
        getCordovaFilePath,
        ajaxServerDelegate,
        resumeApp,
        onDeviceReady,
        firstRun;


    // store copy on local object
    pushNotification = window.plugins.pushNotification;

    // IIFE to load backbone and app automatically separate from device ready
    (function startApp() {
        // start backbone history
        Backbone.history.start({
            pushState: false,
            root: '/',
            silent: true
        });

        // RootView may use link or url helpers which
        // depend on Backbone history being setup
        // so need to wait to loadUrl() (which will)
        // actually execute the route
        RootView.getInstance(document.body);

        // Instantiate the main router
        new Router();

        // This will trigger your routers to start
        Backbone.history.loadUrl();

        console.log('App Started....');

    })();

    // delegate to wrap ajax calls for registering with our server
    function ajaxServerDelegate(token) {
        // we now have a new registration id & need to save it to the server along w/ its related categories
        $.ajax({
            url: 'https://headsuphuntington.herokuapp.com/api/app/v1/device_settings/ios/',
            type: 'POST',
            data: JSON.stringify({
                "categories": [{
                    "id": 1,
                    "name": "Police"
                }, {
                    "id": 2,
                    "name": "Fire"
                }, {
                    "id": 3,
                    "name": "School"
                }, {
                    "id": 4,
                    "name": "Traffic"
                }, {
                    "id": 5,
                    "name": "Utilities"
                }, {
                    "id": 6,
                    "name": "Other"
                }, {
                    "id": 9,
                    "name": "Health"
                }],
                "device": {
                    "token": token
                }
            }),
            contentType: 'application/json',
            success: function(data, status) {
                console.log('Zepto Success Handler triggered for POST to reg_id to server!');
                console.log('Zepto Posted to server! Status Code of: ' + status);
            },
            error: function(xhr, type) {
                console.log('****AJAX ERROR');
            }
        });
    }

    // loads local settings & checks if first run etc...
    function getLocalSettings() {
        // var firstRun = store.get('firstRun');
        firstRun = store.get('firstRun');
        console.debug('****FirstRun is equal to: ' + firstRun);

        if (firstRun) {
            window.gAppFirstRun = firstRun;
        } else {
            window.gAppFirstRun = true;
            store.set('firstRun', 'false');
        }
    }

    // method to get to root assets path on android or iOS
    getCordovaFilePath = function() {
        var path = window.location.pathname;
        path = path.substr(path, path.length - 10); // -10 for index.html
        return 'file://' + path;
    };

    // clear badge and push notification center data
    clearBadgeData = function() {
        // if handle to push notifications is good then relieve the notifications center of its data
        pushNotification.setApplicationIconBadgeNumber(0, function(status) {
            console.log('Reset the badge icons')
        });
        pushNotification.cancelAllLocalNotifications(function() {
            console.log('Cancelling and clearing all stored apple push notifications');
        });
    };

    // Cordova Function Hooks -- observables
    resumeApp = function() {
        // re-sync with the server -- todo: update to only do this when opened by push notification
        if (app) {
            console.log('Resuming.....');
            Application["alerts"].fetch({
                wait: true
            });
        }

        //clearBadgeData();
    };

    // triggered by cordova when the device is ready
    onDeviceReady = function() {
        console.log('device ready');

        // try to get cached copy of the device UUID for model 
        // just in case nothing has changed on following check to prevent
        // delay with polling in device model for settings view
        cached_token = store.get('registration_id');

        if (cached_token) {
            window.registration_id = cached_token;
        }

        // register this device with apple
        pushNotification.register(function(status) {
            // store on global object
            if (window.registration_id == status) {
                console.log('Registration from localstore matches token - no action');

                return;
            } else {
                window.registration_id = status;

                // save it to localstorage
                store.set('registration_id', status);

                // then post over SSL to server
                ajaxServerDelegate(status);
            }
        }, function(error) {
            console.log('Error handler called with message');
            console.log(error);
        }, {
            alert: true,
            badge: true,
            sound: true
        });

        console.log('******* END OF DEVICE READY *******');
    };

    // bind listeners for cordova
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('resume', resumeApp, false);
});