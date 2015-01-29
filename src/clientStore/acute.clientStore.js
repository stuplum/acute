'use strict';

angular.module('acute.clientStore', [])

    .value('localStorage', window.localStorage)

    .provider('clientStore', function () {

        var LS_PREFIX = 'clientStore';

        this.setPrefix = function (prefix) {
            LS_PREFIX = prefix;
        };

        this.$get = ['$rootScope', 'localStorage', function ($rootScope, localStorage) {

            var tokenString = localStorage[LS_PREFIX],
                cache       = tokenString ? JSON.parse(tokenString) : {};

            $rootScope.$watch(function () { return cache; }, function () {
                localStorage[LS_PREFIX] = JSON.stringify(cache);
            }, true);

            return cache;
        }];

    });