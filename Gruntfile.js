/*global module:false*/
module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n\n',

        dirs: {
            src: 'src'
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
                    { dest: '<%= pkg.name %>.js', src: ['<%= dirs.src %>/acute.js', '<%= dirs.src %>/**/acute.*.js', '!<%= dirs.src %>/**/acute.*.spec.js'], nonull: true }
                ]
            }
        },

        uglify: {

            options: {
                banner: '<%= banner %>',
                mangle: {
                    except: ['angular', '_']
                },
                sourceMap: '<%= pkg.name %>.min.js.map'
            },

            prod: {
                files: [
                    { dest: '<%= pkg.name %>.min.js', src: ['<%= pkg.name %>.js'], nonull: true }
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
                    _: true,
                    Showdown: true
                }
            },

            gruntfile: {
                src: 'Gruntfile.js'
            },

            test: {
                options: {
                    unused: false,
                    globals: {
                        angular: true,
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
                        responses: true,
                        isJqueryElement: true,
                        isScope: true
                    }
                },
                src: ['src/**/*.spec.js']
            },

            src: {
                src: ['src/**/*.js', '!src/**/*.spec.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('package', [ 'jshint', 'concat', 'uglify' ]);

    grunt.registerTask('default', [ 'package' ]);
};
