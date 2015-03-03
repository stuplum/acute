module.exports = function (config) {
    config.set({

        basePath: '../../',

        frameworks: ['jasmine', 'sinon', 'radii'],

        files: [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/moment/min/moment.min.js',
            'bower_components/lodash/lodash.js',

            'bower_components/angular/angular.js',
            'bower_components/angular-sanitize/angular-sanitize.js',

            'bower_components/clndr/clndr.min.js',
            'bower_components/showdown/src/showdown.js',
            'bower_components/showdown/src/extensions/*.js',

            'bower_components/angular-mocks/angular-mocks.js',
            'test/lib/jasmine-sinon.js',

            'src/**/*.js',

            'test/unit/**/*.js'
        ],

        exclude: [],

        reporters: ['progress'],

        port: 2020,

        runnerPort: 9100,

        colors: true,

        logLevel: config.LOG_INFO, // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG

        autoWatch: true,

        browsers: ['Chrome', 'Firefox', 'Safari'],

        singleRun: false
    })
};