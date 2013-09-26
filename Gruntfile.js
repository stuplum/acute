/*global module:false*/
module.exports = function(grunt) {

    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n\n',

        dirs: {
            src:      'src',
            build:    'build',
            dist:     'dist/<%= pkg.name %>/<%= pkg.version %>'
        },

        // Task configuration.
        clean: {
            build: { src: './build/' },
            dist:  { src: './dist/' }
        },

        concat: {

            options: {

                banner: '(function () {\n\n<%= banner %>\'use strict\';\n\n',
                footer: '})();',

                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                },

                stripBanners: true
            },

            prod: {
                files: [
                    { dest: '<%= dirs.build %>/<%= pkg.name %>.concat.js', src: ['<%= dirs.src %>/acute.js', '<%= dirs.src %>/**/acute.*.js'], nonull: true }
                ]
            }
        },

        uglify: {

            options: {
                banner: '<%= banner %>',
                mangle: {
                    except: ['angular', '_']
                }
            },

            prod: {
                files: [
                    { dest: '<%= dirs.dist %>/<%= pkg.name %>.min.js', src: ['<%= dirs.build %>/<%= pkg.name %>.concat.js'], nonull: true }
                ]
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globalstrict: true,
                globals: {
                    ATOMIC: true,
                    jQuery: true,
                    angular: true,
                    _: true
                }
            },

            gruntfile: {
                src: 'Gruntfile.js'
            },

            express: {
                src: '<%= dirs.build %>/public/scripts/app/**/*.js'
            },

            app: {
                src: [ '<%= dirs.build %>/app.js', '<%= dirs.build %>/routes/**/*.js' ]
            },

            test: {
                options: {
                    globals: {
                        jQuery: true,
                        describe: true,
                        xdescribe: true,
                        it: true,
                        xit: true,
                        beforeEach: true,
                        afterEach: true,
                        expect: true,
                        compileDirective: true,
                        compileController: true,
                        mockModule: true,
                        module: true,
                        inject: true,
                        setup: true,
                        given: true,
                        when: true,
                        then: true,
                        and: true,
                        cleanup: true,
                        sinon: true,
                        responses: true
                    }
                },
                src: ['test/integration/*.js', 'test/unit/*.js']
            },

            lib: {
                src: ['lib/**/*.js']
            }
        },

        express: {

            options: {
                // Override defaults here
            },

            dev: {
                options: {
                    script: '<%= dirs.build %>/app.js'
                }
            },

            prod: {
                options: {
                    script: '<%= dirs.dist %>/app.js',
                    node_env: 'production'
                }
            },

            test: {
                options: {
                    script: 'path/to/test/server.js'
                }
            }
        },

        open: {

            app: {
                path: 'http://dev.iamatomic.com:3000',
                app: 'Google Chrome'
            },

            hosts : {
                path : '/etc/hosts'
            }
        },

        watch: {
            options: { livereload: true },

            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },

            express: {
                files: [ '<%= dirs.src %>/app.js', '<%= dirs.src %>/routes/**' ],
                tasks: ['package:dev', 'jshint:express', 'express:dev']
            },

            src: {
                files: ['<%= dirs.src %>/public/**', '<%= dirs.src %>/views/**'],
                tasks: ['package:dev', 'jshint:app', 'jshint:test']
            },

            stylus: {
                files: ['<%= dirs.src %>/style/**'],
                tasks: 'package:dev' //stylushint????
            },

            test: {
                files: '<%= jshint.test.src %>',
                tasks: 'jshint:test'
            }

        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-express-server');


    grunt.registerTask('package', [ 'clean', 'concat', 'uglify' ]);

    grunt.registerTask('server', function (env, watch) {
        env = env ? env : 'dev';
        grunt.task.run('express:' + env);
        grunt.task.run('open:app');
        if(watch) { grunt.task.run('watch'); }
    });

    // Run Dev by default
    grunt.registerTask('default', [ 'package' ]);
};
