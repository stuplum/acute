'use strict';

angular
    .module('acute.string.toDotNotation', ['acute.string.utils'])
    .factory('stringToDotNotation', ['~normalizeAndSeparate', function (normalizeAndSeparate) {

        return function (input) {
            return normalizeAndSeparate(input, '.');
        };
    }]);