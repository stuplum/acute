'use strict';

angular.module('acute.string', [
    'acute.string.toCamelCase',
    'acute.string.toHyphenated',
    'acute.string.toDotNotation'
]);

angular.module('acute.string.utils', []).service('~normalizeAndSeparate', function () {

    function camelToHyphen(string) {
        return string.replace(/([a-z\d])([A-Z])/g, '$1-$2');
    }

    function replaceSpaces(string) {
        return string.split(' ').join('-');
    }

    function replaceNonAlphaNumeric(string, separator) {
        return string.replace(/\W/g, separator);
    }

    return function normalizeAndSeparate(input, separator) {

        var normalized;

        normalized = camelToHyphen(input);
        normalized = replaceSpaces(normalized);
        normalized = replaceNonAlphaNumeric(normalized, separator);

        return normalized.toLowerCase();
    };

});