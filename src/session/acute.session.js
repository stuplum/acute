'use strict';

angular.module('acute.session', ['acute.clientStore'])

    .provider('session', function () {

        var CACHE_KEY = 'session';

        this.setCacheKey = function (cacheKey) {
            CACHE_KEY = cacheKey;
        };

        this.$get = ['clientStore', function (clientStore) {

            function initSessionInCache() {
                clientStore[CACHE_KEY] = clientStore[CACHE_KEY] || {};
            }

            initSessionInCache();

            return Object.create({}, {

                token: {
                    get: function () {
                        return clientStore[CACHE_KEY].token;
                    },
                    set: function (value) {
                        clientStore[CACHE_KEY].token = value;
                    }
                },

                user: {
                    get: function () {
                        return clientStore[CACHE_KEY].user;
                    },
                    set: function (value) {
                        clientStore[CACHE_KEY].user = value;
                    }
                },

                isActive: { value: function () {
                    return angular.isDefined(this.token);
                } },

                create: { value: function (token, user) {
                    this.token = token;
                    this.user  = user;
                } },

                invalidate: { value: function () {
                    this.token = undefined;
                    this.user  = undefined;
                } }

            });
        }];

    });