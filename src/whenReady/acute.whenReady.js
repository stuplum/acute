'use strict';

angular.module('acute.whenReady', [])

    .value('whenReady', function whenReady(callback) {
        return function (curr, prev) {
            if (curr !== prev) {
                callback(curr, prev);
            }
        };
    });