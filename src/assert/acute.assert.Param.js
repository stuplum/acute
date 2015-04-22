'use strict';

angular.module('acute.assert.Param', [])

    .factory('Param', function () {

        var Param = (function () {

            var proto;

            function _Param(name, val) {
                /*jshint validthis: true */
                this.v = val;
                this.name = name;
                this._contexts = [null];
            }

            proto = _Param.prototype;

            proto.isObject = function () {
                return this.isTypeOf('object');
            };

            proto.isBoolean = function () {
                return this.isTypeOf('boolean');
            };

            proto.isString = function () {
                return this.isTypeOf('string');
            };

            proto.isNonEmptyString = function () {
                return addContext(this, {
                    fn: isNonEmptyString,
                    msg: 'must be a nonEmpty string'
                });
            };

            function isNonEmptyString(context, v) {
                if (v == null) { return false; }
                return (typeof(v) === 'string') && v.length > 0;
            }

            proto.isNumber = function () {
                return this.isTypeOf('number');
            };

            proto.isFunction = function () {
                return this.isTypeOf('function');
            };


            proto.isTypeOf = function (typeName) {
                return addContext(this, {
                    fn: isTypeOf,
                    typeName: typeName,
                    msg: 'must be a \'' + typeName + '\''
                });
            };

            function isTypeOf(context, v) {

                if (v == null)  {
                    return false;
                }

                return typeof(v) === context.typeName;
            }

            proto.isInstanceOf = function (type, typeName) {

                typeName = typeName || type.prototype._$typeName;

                return addContext(this, {
                    fn: isInstanceOf,
                    type: type,
                    typeName: typeName,
                    msg: 'must be an instance of \'' + typeName + '\''
                });
            };

            function isInstanceOf(context, v) {

                if (v == null) {
                    return false;
                }

                return (v instanceof context.type);
            }

            proto.hasProperty = function (propertyName) {
                return addContext(this, {
                    fn: hasProperty,
                    propertyName: propertyName,
                    msg: 'must have a \'' + propertyName + '\' property'
                });
            };

            function hasProperty(context, v) {
                if (v == null) { return false; }
                return (v[context.propertyName] !== undefined);
            }

            proto.isRequired = function (allowNull) {
                return addContext(this, {
                    fn: isRequired,
                    allowNull: allowNull,
                    msg: 'is required'
                });
            };

            function isRequired(context, v) {
                if (context.allowNull) {
                    return v !== undefined;
                } else {
                    return v != null;
                }
            }

            proto.isOptional = function () {
                return addContext(this, {
                    fn: isOptional,
                    prevContext: null,
                    msg: isOptionalMessage
                });
            };

            function isOptional(context, v) {

                if (v == null) {
                    return true;
                }

                var prevContext = context.prevContext;

                if (prevContext) {
                    return prevContext.fn(prevContext, v);
                } else {
                    return true;
                }
            }

            function isOptionalMessage(context, v) {

                var prevContext = context.prevContext,
                    element     = prevContext ? ' or it ' + getMessage(prevContext, v) : '';

                return 'is optional' + element;
            }

            proto.isNonEmptyArray = function () {
                return this.isArray(true);
            };

            proto.isArray = function (mustNotBeEmpty) {
                return addContext(this, {
                    fn: isArray,
                    mustNotBeEmpty: mustNotBeEmpty,
                    prevContext: null,
                    msg: isArrayMessage
                });
            };

            function isArray(context, v) {

                if (!Array.isArray(v)) {
                    return false;
                }

                if (context.mustNotBeEmpty) {
                    if (v.length === 0) { return false; }
                }

                var prevContext = context.prevContext;
                if (!prevContext) { return true; }

                return v.every(function (v1) {
                    return prevContext.fn(prevContext, v1);
                });
            }

            function isArrayMessage(context, v) {

                var arrayDesc   = context.mustNotBeEmpty ? 'a nonEmpty array' : 'an \'array\'',
                    prevContext = context.prevContext,
                    element     = prevContext ? ' where each element ' + getMessage(prevContext, v) : '';

                return 'must be ' + arrayDesc + element;
            }

            function getMessage(context, v) {

                var msg = context.msg;

                if (typeof(msg) === 'function') {
                    msg = msg(context, v);
                }

                return msg;
            }

            proto.check = function (defaultValue) {

                var ok = exec(this);

                if (ok === undefined) { return; }

                if (!ok) {
                    throw new Error(this.getMessage());
                }

                if (this.v !== undefined) {
                    return this.v;
                } else {
                    return defaultValue;
                }
            };

            function addContext(instance, context) {

                if (instance._context) {

                    var curContext = instance._context;

                    while (curContext.prevContext != null) {
                        curContext = curContext.prevContext;
                    }

                    if (curContext.prevContext === null) {
                        curContext.prevContext = context;
                        // just update the prevContext but don't change the curContext.
                        return instance;
                    } else if (context.prevContext == null) {
                        context.prevContext = instance._context;
                    } else {
                        throw new Error('Illegal construction - use \'or\' to combine checks');
                    }
                }

                return setContext(instance, context);
            }

            function setContext(instance, context) {

                instance._contexts[instance._contexts.length - 1] = context;
                instance._context = context;

                return instance;
            }

            function exec(instance) {

                var contexts = instance._contexts;

                if (contexts[contexts.length - 1] == null) {
                    contexts.pop();
                }

                if (contexts.length === 0) {
                    return undefined;
                }

                return contexts.some(function (context) {
                    return context.fn(context, instance.v);
                });
            }

            proto.getMessage = function () {

                var message = this._contexts.map(function (context) {
                    return getMessage(context, this.v);
                }.bind(this)).join(', or it ');

                return __formatString(this.MESSAGE_PREFIX, this.name) + ' ' + message;
            };

            function __formatString(string) {
                var args = arguments;
                var pattern = new RegExp("%([1-" + (arguments.length - 1) + "])", "g");
                return string.replace(pattern, function (match, index) {
                    return args[index];
                });
            }

            proto.withDefault = function (defaultValue) {
                this.defaultValue = defaultValue;
                return this;
            };

            proto.apply = function (dest) {
                if (this.v !== undefined) {
                    dest[this.name] = this.v;
                } else {
                    if (this.defaultValue !== undefined) {
                        dest[this.name] = this.defaultValue;
                    }
                }
            };

            proto.MESSAGE_PREFIX = 'The \'%1\' parameter';

            return _Param;

        })();

        return Param;
    });