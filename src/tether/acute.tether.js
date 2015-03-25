'use strict';

angular.module('acute.tether', ['ng'])

    .factory('$tether', ['$window', function ($window) {
        return function $tether(config) {
            return new $window.Tether(config);
        };
    }]);