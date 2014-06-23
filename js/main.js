require([
    'jquery',
    'underscore',
    'backbone',
    'views/root',
    'routers/routes',
    'FastClick',
    'store',
    'helpers'
], function($, _, Backbone, RootView, Router, FastClick, store) {

    var app,
        cached_token,
        firstRunDemo,
        getCordovaFilePath,
        ajaxServerDelegate,
        resumeApp,
        onDeviceReady,
        firstRun,
        onNotificationAPN,
        registerDevice;

    // IIFE to load backbone and app automatically separate from device ready
    function startApp() {
        // attach fastclick
        FastClick.attach(document.body);

        // start backbone history
        Backbone.history.start({
            pushState: false,
            root: '/',
            silent: true
        });

        // first thing -- set this to first run!! 
        firstRun = store.get('firstRun');
        if (!firstRun) {
            // show the slide view first by pointing backbone to 
            // different route and ensure we only POST once
            createUserDeviceAccount();

            // RootView may use link or url helpers which
            // depend on Backbone history being setup
            // so need to wait to loadUrl() (which will)
            // actually execute the route
            RootView.getInstance(document.body);

            // Instantiate the main router
            new Router();

            // This will trigger your routers to start
            Backbone.history.loadUrl('#intro');

            store.set('firstRun', true);
        } else {
            // RootView may use link or url helpers which
            // depend on Backbone history being setup
            // so need to wait to loadUrl() (which will)
            // actually execute the route
            RootView.getInstance(document.body);

            // Instantiate the main router
            new Router();

            // This will trigger your routers to start
            Backbone.history.loadUrl();

        }

        return;

    }

    // delegate to wrap ajax calls for registering with our server
    function createUserDeviceAccount(token) {
        store.set('username', "AnonBR" + Date.now() + Math.floor(Math.random() * (5000 - 500) + 500));
        store.set('region', 3);

        // we now have a new registration id & need to save it to the server along w/ its related categories
        $.ajax({
            url: 'https://heads-up.herokuapp.com/api/app/v2/device_settings/ios/',
            type: 'POST',
            data: JSON.stringify({
                "device": {
                    "token": store.get('registration_id'),
                    "user": {
                        "username": store.get('username'),
                        "password": Date.now() + Math.floor(Math.random() * (1000 - 1) + 1),
                        "region_set": [{
                            "name": store.get('region')
                        }]
                    }
                },
                "global_priority": 1
            }),
            contentType: 'application/json',
            success: function(data, status) {
                store.set('api_key', data.device.user.api_key.key);
            },
            error: function(xhr, type) {
                console.log('** ERROR ON POST **');
            }
        });
    }

    onNotificationAPN = function(event) {
        if (event.alert) {
            navigator.notification.alert(event.alert);
        }

        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }

        if (event.badge) {
            pushNotification.setApplicationIconBadgeNumber(function(status) {
                console.log(status);
            }, function(status) {
                console.log("error with application badge number..");
                console.log(status);
            }, event.badge);
        }
    };

    // clear badge and push notification center data
    clearBadgeData = function() {

        window.plugins.pushNotification.cancelAllLocalNotifications(function() {
            console.log('Cancelling and clearing all stored apple notifications');
        });
    };

    // Cordova Function Hooks -- observables
    resumeApp = function() {
        // re-sync with the server -- todo: update to only do this when opened by push notification
        if (app) {
            Application["alerts"].fetch({
                wait: true
            });
        }

        //clearBadgeData();
    };

    registerDevice = function() {
        console.log('-----register device triggered.----');

        // local store token?
        cached_token = store.get('registration_id');

        //register this device with apple
        window.plugins.pushNotification.register(function(status) {
            console.log(status);

            // store on global object
            if (cached_token != status) {
                // save it to localstorage
                store.set('registration_id', status);
            }

        }, function(error) {
            console.log('Error handler called with message');
            console.log(error);

        }, {
            "alert": true,
            "badge": true,
            "sound": true
        });
    };

    // triggered by cordova when the device is ready
    onDeviceReady = function() {
        // try to get cached copy of the device UUID for model 
        // just in case nothing has changed on following check to prevent
        // delay with polling in device model for settings view
        // _.delay(function() {
        //     // register device
        //     _.bind(registerDevice(), this);

        // }, 250);

        registerDevice();

        _.delay(function() {
            // start the app 
            startApp();
        }, 350);

        console.log('**** END OF DEVICE READY ****');
    };

    // bind listeners for cordova
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('resume', resumeApp, false);
});