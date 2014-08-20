require([
    'jquery',
    'underscore',
    'backbone',
    'views/root',
    'routers/routes',
    'FastClick',
    'store',
    'UAParser',
    'helpers'
], function($, _, Backbone, RootView, Router, FastClick, store, UAParser) {

    // global app object thats accessible throughout the project for 
    // fixed project parameters like region, title, etc.. 
    window.headsup_params = {
        title: "Heads Up Huntington",
        region: 1,
        userPrefix: "HPD",
        shareURL: "/huntington/",
        debug: false,
        vendor: "ios" // if android set this equal to "gcm"
    };

    // local var hoist; scoped to this module only
    var cached_token,
        resumeApp,
        onDeviceReady,
        firstRun,
        onNotificationAPN,
        registerDevice,
        hasRegistered,
        isUpdated;

    // IIFE to load backbone and app automatically separate from device ready
    (function startApp() {
        // get user agent for device and browser detection
        var parser = new UAParser(),
            uaResults = null,
            os = null,
            osVersion = null;

        // get all the info from the device's user agent
        uaResults = parser.getResult();

        os = uaResults.os.name;
        osVersion = uaResults.os.version;

        // set the device info in local storage
        store.set("OS", os);
        store.set("OSVersion", osVersion);

        // check the device os and version and flag a global true or false
        // this is hacky and horrible, fix it so i dont hate myself
        if (os === 'iOS') {
            // we have iOS so lets check the version to fix old webkit issues
            if (osVersion <= "6.1") {
                // device has old version of safari - hack the settings view animation
                store.set("supportsComplexCSS", false);
            } else {
                store.set("supportsComplexCSS", true);
            }
        } else if (os === 'Android') {
            if (osVersion < "4.4") {
                store.set("supportsComplexCSS", false);
            } else {
                store.set("supportsComplexCSS", true);
            }
        } else {
            // running headless or in the browser e.g. testing
            store.set("supportsComplexCSS", true);
        }

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
    })();

    // delegate to wrap ajax calls for registering with our server
    function createUserDeviceAccount(token) {
        store.set('username', "Anon" + headsup_params.userPrefix + Date.now() + Math.floor(Math.random() * (5000 - 500) + 500));
        store.set('region', headsup_params.region);

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
                // store the server response for the unique identifier & api-key
                store.set('uuid', data.id);
                store.set('api_key', data.device.user.api_key.key);

                // set has_registered to true here.. might be best since callback
                store.set('has_registered', true);
            },
            error: function(xhr, type) {
                console.log('createUserDeviceAccount() Ajax Error callback triggered..');

                // instead of retrying immediately, lets set has_registered to false
                // here and when the app is re-opened it will try again. 
                store.set('has_registered', false);
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
            console.log('fetching updated list of alerts');
            Application["alerts"].fetch({
                wait: true
            });
        } else {
            console.log('*********');
            console.log('Application["alerts"] object is undefined');
            console.log('*********');
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
                // only on successful registration and a first run do we POST
                createUserDeviceAccount();
            }

        }, function(error) {
            console.log('PushPlugin->Register() Error callback triggered..');
            console.log(error);

        }, {
            "alert": true,
            "badge": true,
            "sound": true
        });
    };

    checkVersion = function() {
        // todo: Refactor this to clean it up.. use one local store
        // todo: var e.g. `showIntro` or `showUpdated`

        // store the new updated app version
        cordova.getAppVersion().then(function(version) {
            // get the current version (if one exists)
            var currentVersion = store.get('version');

            if (!currentVersion) {
                // if current version is undefined or null then set it
                store.set('version', version.toString());

                store.set('isUpdated', false);
                isUpdated = false;

                return;
            }

            console.log(currentVersion + ' ' + version);

            // check the current version returned against the local store
            if (currentVersion < version.toString()) {
                // this is an old version - update it
                store.set('version', version.toString());
                store.set('isUpdated', false);
                isUpdated = false;
            }
        });
    };

    // triggered by cordova when the device is ready
    onDeviceReady = function() {

        // register the device with vendor push notification server(s)
        registerDevice();

        // make this method non-blocking
        _.delay(function() {
            // check the app version to determine if the update screen slides show
            checkVersion();
        }, 0);

        _.delay(function() {
            // start the app 
            startApp();
        }, 750);

        console.log('**** END OF DEVICE READY ****');
    };

    // bind listeners for cordova
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('resume', resumeApp, false);
});