'use strict';

angular
    .module('acute.string.toHyphenated', ['acute.string.utils'])
    .factory('stringToHyphenated', ['~normalizeAndSeparate', function (normalizeAndSeparate) {

        return function (input) {
            return normalizeAndSeparate(input, '-');
        };
    }]);