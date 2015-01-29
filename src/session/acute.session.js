'use strict';

angular.module('acute.session', [])

    .provider('session', function () {

        var CACHE_KEY = 'session';

        this.setCacheKey = function (cacheKey) {
            CACHE_KEY = cacheKey;
        };

        this.$get = ['cache', function (cache) {

            function initSessionInCache() {
                cache[CACHE_KEY] = cache[CACHE_KEY] || {};
            }

            initSessionInCache();

            return Object.create({}, {

                token: {
                    get: function () {
                        return cache[CACHE_KEY].token;
                    },
                    set: function (value) {
                        cache[CACHE_KEY].token = value;
                    }
                },

                user: {
                    get: function () {
                        return cache[CACHE_KEY].user;
                    },
                    set: function (value) {
                        cache[CACHE_KEY].user = value;
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