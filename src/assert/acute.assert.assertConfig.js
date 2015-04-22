'use strict';

angular.module('acute.assert.assertConfig', ['acute.assert.Param'])

    .factory('assertConfig', ['Param', function (Param) {

        function _extend(target, source, propNames) {

            var __hasOwnProperty = __unCurry(Object.prototype.hasOwnProperty);

            function __unCurry(f) {
                var call = Function.call;
                return function () {
                    return call.apply(f, arguments);
                };
            }

            if (!source) { return target; }

            if (propNames) {
                propNames.forEach(function (propName) {
                    target[propName] = source[propName];
                });
            } else {
                for (var propName in source) {
                    if (__hasOwnProperty(source, propName)) {
                        target[propName] = source[propName];
                    }
                }
            }

            return target;
        }

        var ConfigParam = (function () {

            var proto;

            function _ConfigParam(config) {
                if (typeof(config) !== 'object') {
                    throw new Error('Configuration parameter should be an object, instead it is a: ' + typeof(config));
                }
                this.config = config;
                this.params = [];
            }

            proto = _ConfigParam.prototype;

            proto.whereParam = function (propName) {

                var param;

                function checkAll(params) {
                    params.forEach(function (param) {
                        param.check();
                    });
                }

                function applyAll(params, dest) {

                    checkAll(params);

                    params.forEach(function (param) {
                        param.apply(dest);
                    });
                }

                param = new Param(propName, this.config[propName]);

                _extend(param, {

                    whereParam: function (propName) {
                        return this.whereParam(propName);
                    }.bind(this),

                    checkAll: function () {
                        checkAll(this.params);
                    }.bind(this),

                    applyAll: function (dest) {
                        applyAll(this.params, dest);
                    }.bind(this)
                });

                param.parent = this;

                this.params.push(param);

                return param;
            };

            return _ConfigParam;

        })();

        return function assertConfig(config) {
            return new ConfigParam(config);
        };

    }]);