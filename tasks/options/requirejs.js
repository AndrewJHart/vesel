var grunt = require('grunt');

module.exports = {
    production: {
        options: {
            baseUrl: 'tmp',
            // mainConfigFile: 'tmp/main.build.js', // wont work :/ see TODO: remove build duplication
            name: '../bower_components/almond/almond',
            include: ['main'],
            exclude: ['coffee-script'],
            stubModules: ['cs'],
            out: 'dist/main.js',
            removeCombined: true,
            findNestedDependencies: true,
            optimize: 'uglify2',
            paths: {
                'jquery': '../bower_components/jquery/jquery',
                'underscore': '../bower_components/underscore/underscore',
                'handlebars': '../bower_components/handlebars/handlebars',
                'backbone': '../bower_components/backbone/backbone',
                'thorax': '../bower_components/thorax/thorax',
                'coffee-script': '../bower_components/coffee-script/index',
                'cs': '../bower_components/require-cs/cs',
                'text': '../bower_components/text/text',
                'hbs': '../bower_components/requirejs-hbs/hbs',
                'mobiscroll': '../js/vendor/mobiscroll',
                'deepmodel': '../bower_components/backbone-deep-model/distribution/deep-model.min',
                'moment': '../bower_components/momentjs/min/moment.min',
                'pusher': '../bower_components/pusher/dist/pusher.min',
                'backsocket': '../bower_components/backbone-websocket/dist/BackSocket',
                'store': '../bower_components/store/store.min',
                'FastClick': '../bower_components/fastclick/lib/fastclick',
                'UAParser': '../bower_components/ua-parser-js/src/ua-parser'
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
        }
    }
};