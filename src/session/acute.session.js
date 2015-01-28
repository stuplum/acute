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

                isActive: { value: function () {
                    return angular.isDefined(this.token);
                } },

                create: { value: function (_token_) {
                    this.token = _token_;
                } },

                invalidate: { value: function () {
                    this.token = undefined;
                } }
            });
        }];

    });