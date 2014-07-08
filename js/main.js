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
        registerDevice, 
        currentVersion,
        isUpdated;

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
        isUpdated = store.get('isUpdated');
        if (!firstRun || !isUpdated) {

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
            store.set('isUpdated', true);
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
        // todo: refactoring this so it doesnt try a new username each time
        store.set('username', "AnonBRC" + Date.now() + Math.floor(Math.random() * (5000 - 500) + 500));
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
                store.set('uuid', data.id);
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
        if (Application["alerts"]) {
            Application["alerts"].fetch({
                wait: true
            });
        }
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

            // first thing -- set this to first run!! 
            hasRegistered = store.get('has_registered');
            if (!hasRegistered) {
                store.set('has_registered', true);
                // only on successful registration and a first run do we POST
                createUserDeviceAccount();
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

    checkVersion = function() {
        // store the new updated app version
        cordova.getAppVersion().then(function (version) {
            console.log(version);

            // get the current version (if one exists)
            currentVersion = store.get('version');

            if (!currentVersion) {
                // if current version is undefined or null then set it
                store.set('version', version);

                store.set('isUpdated', true);
                isUpdated = true;
            } else {
                // check the current version returned against the local store
                if (currentVersion <= version) {
                    // this is an old version - update it
                    store.set('version', version);
                    store.set('isUpdated', false);
                    isUpdated = false;
                }
            }
        });
    };

    // triggered by cordova when the device is ready
    onDeviceReady = function() {
        // register the device with our server
        registerDevice();

        _.delay(function() {
            // start the app 
            startApp();
        }, 1500);

        console.log('**** END OF DEVICE READY ****');
    };

    // bind listeners for cordova
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('resume', resumeApp, false);
});