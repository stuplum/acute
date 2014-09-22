'use strict';

angular
    .module('acute.string.toCamelCase', ['acute.string.utils'])
    .factory('stringToCamelCase', ['~normalizeAndSeparate', function (normalizeAndSeparate) {

        function hyphenToCamel(string) {
            return string.toLowerCase().replace(/-(.)/g, function (match, group1) {
                return group1.toUpperCase();
            });
        }

        return function(input) {
            return hyphenToCamel(normalizeAndSeparate(input, '-'));
        };
    }]);