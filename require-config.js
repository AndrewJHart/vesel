/**
 * This is the main entry point for requirejs in this application. This file is
 * used as the second stop in the require.config chain by the following
 * initial require.config calls:
 *
 * - tasks/requirejs.js, used by grunt-contrib-requirejs for production builds
 * - test/index.html used by mocha in the browser and mocha_phantomjs
 * - test/main.karma.js used by the karma test runner
 * - public/index.html used by you while you develop your app
 *
 * In all cases, this file is the __second__ link of the requirejs configuration
 * chain, which is why it does not have a `baseUrl`. The job of this file
 * is to set up paths shared by all consumers of requirejs in this app.
 *
 * When running tests, test/main.js is the next stop, where more paths are
 * defined that are test specific
 *
 */

/**
 * If using karma, change the base path to /base/ which is where karma's built
 * in server serves files from. The file must be included in the files karma
 * is being told to serve in order for requirejs to pick it up. To include
 * and additional file add the file or glob a directory where the file exists
 * in the karma configuration files array. Make sure include is set to false.
 * We don't want to include the file on the page b/c requirejs will take of that
 * and ensure async happens correctly.
 */

var pathPrefix;
if (window.__karma__) {
    pathPrefix = '/base/';
} else {
    pathPrefix = '../';
}

require.config({
    deps: ['main'],
    paths: {
        'jquery': pathPrefix + 'bower_components/jquery/jquery.min',
        'underscore': pathPrefix + 'bower_components/underscore/underscore-min',
        'handlebars': pathPrefix + 'bower_components/handlebars/handlebars',
        'backbone': pathPrefix + 'bower_components/backbone/backbone',
        'thorax': pathPrefix + 'bower_components/thorax/thorax-mobile.min',
        //'coffee-script': pathPrefix + 'bower_components/coffee-script/index',
        //'cs': pathPrefix + 'bower_components/require-cs/cs',
        'text': pathPrefix + 'bower_components/text/text',
        'hbs': pathPrefix + 'bower_components/requirejs-hbs/hbs',
        'mobiscroll': pathPrefix + 'js/vendor/mobiscroll',
        'deepmodel': pathPrefix + 'bower_components/backbone-deep-model/distribution/deep-model.min',
        'moment': pathPrefix + 'bower_components/momentjs/min/moment.min',
        'pusher': pathPrefix + 'bower_components/pusher/dist/pusher.min',
        'backsocket': pathPrefix + 'bower_components/backbone-websocket/dist/BackSocket',
        'store': pathPrefix + 'bower_components/store/store.min',
        'FastClick': pathPrefix + 'bower_components/fastclick/lib/fastclick',
        'UAParser': pathPrefix + 'bower_components/ua-parser-js/src/ua-parser.min'
    },
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
        'backbone': {
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        },
        'underscore': {
            exports: '_'
        },
        'thorax': {
            exports: 'Thorax',
            deps: ['handlebars', 'backbone']
        },
        'mobiscroll': {
            exports: 'mobiscroll'
        },
        'deepmodel': {
            exports: 'deepmodel',
            deps: ['underscore', 'backbone']
        },
        'backsocket': {
            exports: 'BackSocket',
            deps: ['underscore', 'backbone', 'pusher']
        },
        'store': {
            exports: 'store'
        },
        'FastClick': {
            exports: 'FastClick'
        }
    }
});