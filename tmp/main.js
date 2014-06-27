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
        firstRun;

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

            console.log("the app has been started");

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

    }

    // delegate to wrap ajax calls for registering with our server
    function createUserDeviceAccount(token) {
        store.set('username', "AnonBRC" + Date.now() + Math.floor(Math.random() * (5000 - 500) + 500));
        store.set('region', 3);

        // we now have a new registration id & need to save it to the server along w/ its related categories
        $.ajax({
            url: 'https://heads-up.herokuapp.com/api/app/v2/device_settings/gcm/',
            type: 'POST',
            data: JSON.stringify({
                "device": {
                    "registration_id": store.get('registration_id'),
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

    // handler for push notifications
    window.notifyGCMglobal = function onNotificationGCM(e) {
        var ls_x = null;

        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    window.registration_id = e.regid;
                    console.debug("Regid " + e.regid);
                    
                    // get existing registration id if present or query the server to check
                    //var local_id = localStorage.getItem('registration_id');
                    var local_id = store.get('registration_id');

                    // store on global object
                    if (local_id != e.regid) {
                     
                        // save it to localstorage
                        store.set('registration_id', e.regid);
                    }


                    // check that local storage was able to pull an existing value
                    if (local_id !== null || local_id !== undefined) {
                      console.debug('Has localstorage cached copy of registration id equal to: ' + local_id);

                      if (local_id == e.regid) {
                        console.debug('Registration ID is a match to one retrieved from google! No need for action!');
                      } else {
                        console.debug('Reg ID is not a match to the one received -- POSTING new one to server');

                        // update global reference
                        window.registration_id = e.regid;

                        // update the local storage reference
                        //ls_x = localStorage.setItem('registration_id', e.regid);
                        ls_x = store.set('registration_id', e.regid);

                        // log it
                        console.debug('localStorage setItem call returned: '+ls_x);

                        // we now have a new registration id & need to save it to the server along w/ its related categories
                        // call ajax delegate
                        createUserDeviceAccount(e.regid);
                      }
                    } else {
                      // inform us about current state
                      console.debug('*No localstorage or no item cached in the localstorage yet!*');
                      console.debug('registration id = '+e.regid);

                      // save the registration id to local storage
                      //ls_x = localStorage.setItem('registration_id', e.regid);
                      store.set('registration_id', e.regid);

                      // we now have a new registration id & need to save it to the server along w/ its related categories
                      createUserDeviceAccount(e.regid);
                    }
                    
                    console.debug('***CHECK ITEM FOR MATCHING REGISTRATION IDS****');
                    //var key = localStorage.getItem('registration_id');
                    var key = store.get('registration_id');
                    console.debug('Value from localStorage is: '+key+'  compare to real reg_id is: '+e.regid);
                } else {
                  console.debug('*****ERROR, NO REGISTRATION_ID RECEIVED ON case "registered:" in notifyGCMglobal. Trying Local store');
                  window.registration_id = store.get('registration_id');
                }
                break;

            case 'message':
                var sound,
                    mmedia;
                // this is the actual push notification. its format depends on the data model from the push server
                app.dispatcher.currentController.view.collection.fetch({wait: true});
                console.debug('CGM Push Received in AppView. Message is: '+e.message);
                console.debug('GCM Push Recieved and sound file is: '+e.soundname);

                // cache sound & check for validity
                sound = (e.soundname || 'headsup.wav');

                mmedia = new window.Media(getCordovaFilePath()+sound);
                mmedia.play();
                break;

            case 'soundname':
                var sound,
                    mmedia;
                console.debug('GCM Received soundwave payload! '+e.soundname);

                sound = (e.soundname || 'headsup.wav');

                mmedia = new window.Media(getCordovaFilePath()+sound);
                mmedia.play();
                break;

            case 'error':
                console.debug('GCM error = ' + e.message || e.msg);
                break;

            default:
                console.log(e);
                console.debug('An unknown GCM event has occurred -- Logging to debug');
                break;
        }
    };


    // method to get to root assets path on android or iOS
    getCordovaFilePath = function() {
        var path = window.location.pathname;
        path = path.substr(path, path.length - 10); // -10 for index.html
        return 'file://' + path;
    };

    // clear badge and push notification center data
    clearBadgeData = function() {
        // if handle to push notifications is good then relieve the notifications center of its data
        window.plugins.pushNotification.setApplicationIconBadgeNumber(0, function(status) {
            console.log('Reset the badge');
            console.log(status);
        });
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

        // clearBadgeData();
    };

    // triggered by cordova when the device is ready
    onDeviceReady = function() {
        // try to get cached copy of the device UUID for model 
        // just in case nothing has changed on following check to prevent
        // delay with polling in device model for settings view
        cached_token = store.get('registration_id');

        window.plugins.pushNotification.register(function(status) { 
            console.log('-----success on register callback');
            console.log(status); 

        }, function(err) { 
            console.log('Error handler called with message during registration');
            console.log(err);
        }, {
            "senderID": "872006452889", 
            "ecb": "notifyGCMglobal"
        });

        _.delay(function() {
            // start the app 
            startApp();
        }, 1000);
    };

    // bind listeners for cordova
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('resume', resumeApp, false);
});