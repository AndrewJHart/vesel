module.exports = function(grunt) {
    var port = 8000,
        publicDir = './public',
        jsDir = publicDir + '/modules',
        lumbarFile = './lumbar.json',
        hostname = 'localhost';

    grunt.file.mkdir(publicDir);
    grunt.file.mkdir(jsDir);

    grunt.initConfig({
        // create a static webserver
        connect: {
            server: {
                options: {
                    hostname: hostname,
                    base: publicDir,
                    port: port
                }
            }
        },
        lumbar: {
            // performs an initial build so when tests
            // and initial open are run, code is built
            init: {
                build: lumbarFile,
                output: jsDir
            },
            // a long running process that will watch
            // for updates, to include another long
            // running task such as "watch", set
            // background: true
            watch: {
                background: true,
                watch: lumbarFile,
                output: jsDir
            }
        },
        // allows files to be opened when the
        // Thorax Inspector Chrome extension
        // is installed
        thorax: {
            inspector: {
                background: true,
                editor: "subl",
                paths: {
                    views: "./js/views",
                    models: "./js/models",
                    collections: "./js/collections",
                    templates: "./templates"
                }
            }
        },

        // live reload alternative
        reload: {
            port: 6001,
            proxy: {
                host: hostname,
                port: port // should match server.port config
            }
        },

        watch: {
            options: {
                livereload: true,
            },
            all: {
                files: [
                    // grunt watch only needs to monitor public folder
                    // since lubmar watches rest and compiles them to public
                    // otherwise we get multiple reloads lol
                    './public/**/*.*',
                    './templates/**/*.handlebars'
                ]
            },
        }
    });

    grunt.registerTask('open-browser', function() {
        var open = require('open');
        open('http://' + hostname + ':' + port);
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('thorax-inspector');
    grunt.loadNpmTasks('lumbar');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-reload');

    // run grunt dev  for everything plus live-reload
    grunt.registerTask('dev', [
        'ensure-installed',
        'thorax:inspector',
        'lumbar:init',
        'connect:server',
        'open-browser',
        'lumbar:watch',
        'watch'
    ]);

    // run grunt or grunt default for standard build w/o livereload
    grunt.registerTask('default', [
        'ensure-installed',
        'thorax:inspector',
        'lumbar:init',
        'connect:server',
        'open-browser',
        'lumbar:watch'
    ]);
};