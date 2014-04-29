module.exports = function (config) {
    config.set({

        basePath: '../../',

        frameworks: ['jasmine', 'sinon'],

        files: [
            'example/js/lib/angular.js',

            'test/lib/angular-mocks.js',
            'test/lib/spec-helper.js',

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

        browsers: ['ChromeCanary', 'Chrome', 'Firefox', 'Safari'],

        singleRun: false
    })
};