'use strict';

angular.module('acute.assert.assertParam', ['acute.assert.Param'])

    .factory('assertParam', function (Param) {

        return function assertParam(name, val) {
            return new Param(name, val);
        };
    });