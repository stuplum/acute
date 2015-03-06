'use strict';

angular.module('acute.moment', [])

    .value('moment', window.moment)

    .filter('moment', [function () {
        return function momentFilter(momentDate, format) {
            return momentDate.format(format);
        };
    }]);