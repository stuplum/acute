(function () {

/*! acute - v0.5.0 - 2015-04-22
* Copyright (c) 2015 stuplum <stuplum@gmail.com>; Licensed  */

'use strict';

// Source: src/acute.js
angular.module('acute.utils',  [
    'acute.assert',
    'acute.clientStore',
    'acute.clndr',
    'acute.filters',
    'acute.gravatar',
    'acute.markdown',
    'acute.md5',
    'acute.moment',
    'acute.popover',
    'acute.session',
    'acute.string',
    'acute.tether',
    'acute.tooltip',
    'acute.whenReady'
]);
// Source: src/assert/acute.assert.Param.js
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
// Source: src/assert/acute.assert.assertConfig.js
angular.module('acute.assert.assertConfig', ['acute.assert.Param'])

    .factory('assertConfig', ['Param', function (Param) {

        function _unCurry(f) {
            var call = Function.call;
            return function () {
                return call.apply(f, arguments);
            };
        }

        function _extend(target, source, propNames) {

            var __hasOwnProperty = _unCurry(Object.prototype.hasOwnProperty);

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
                /*jshint validthis: true */
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
// Source: src/assert/acute.assert.assertParam.js
angular.module('acute.assert.assertParam', ['acute.assert.Param'])

    .factory('assertParam', function (Param) {

        return function assertParam(name, val) {
            return new Param(name, val);
        };
    });
// Source: src/assert/acute.assert.js
angular.module('acute.assert', [
    'acute.assert.Param',
    'acute.assert.assertParam',
    'acute.assert.assertConfig'
]);
// Source: src/clientStore/acute.clientStore.js
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
// Source: src/clndr/acute.clndr.js
angular.module('acute.clndr', ['acute.whenReady'])

    .constant('acuteClndrConfig', {})

    .provider('acuteClndrFactory', ['acuteClndrConfig', function (acuteClndrConfig) {

        var config = angular.copy(acuteClndrConfig);

        this.setConfig = function setConfig(key, val) {
            config[key] = val;
        };

        this.$get = function acuteClndrFactory() {

            var clndr;

            function mergeConfig(render) {
                return angular.extend(config, {render: render});
            }

            return {

                create: function (render) {
                    return clndr = angular.element('<div/>').clndr(mergeConfig(render));
                },

                getClndr: function () {
                    return clndr;
                }
            };
        };
    }])

    .controller('AcuteClndrCtrl', ['$scope', 'whenReady', 'acuteClndrFactory', function ($scope, whenReady, acuteClndrFactory) {

        this.back    = function () { acuteClndrFactory.getClndr().back(); };
        this.forward = function () { acuteClndrFactory.getClndr().forward(); };

        $scope.$watchCollection('events', whenReady(function(events) {
            acuteClndrFactory.getClndr().setEvents(events);
        }));
    }])

    .directive('acuteClndr', ['acuteClndrFactory', function (acuteClndrFactory) {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: { events: '=clndrEvents' },
            controller: 'AcuteClndrCtrl',
            link: function link(scope, el, attrs, ctrl, transclude) {
                transclude(scope, function transclude(clone) {
                    el.append(clone);
                    acuteClndrFactory.create(function (clndr) {
                        angular.extend(scope, { clndr: clndr });
                    });
                });
            }
        };
    }]);
// Source: src/filters/acute.filter.camelCaseToHuman.js
angular.module('acute.filter.camelCaseToHuman', []).filter('camelCaseToHuman', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&');
    };
});

// Source: src/filters/acute.filters.js
angular.module('acute.filters', [
    'acute.filter.camelCaseToHuman'
]);

// Source: src/gravatar/acute.gravatar.js
angular.module('acute.gravatar', ['acute.md5'])

    .factory('gravatarService', ['md5', function (md5) {

        return {
            getImageSrc: function (gravatarEmail, attrs) {

                var hash       = md5.createHash(gravatarEmail.toLowerCase()),
                    domain     = attrs.gravatarSecure ? 'https://secure' : 'http://www',
                    size       = attrs.gravatarSize || 40,
                    rating     = attrs.gravatarRating || 'pg',
                    defaultUrl = attrs.gravatarDefault || '404';

                return domain + '.gravatar.com/avatar/' + hash + '?s=' + size + '&r=' + rating + '&d=' + defaultUrl;
            }
        };
    }])

    .directive('acuteGravatar', ['gravatarService', function (gravatarService) {

        return {

            restrict: "AC",

            link: function (scope, el, attrs) {

                scope.$watch(attrs.gravatarEmail, function (gravatarEmail) {

                    if(gravatarEmail) {
                        var emailDefined = (gravatarEmail !== null) && (gravatarEmail !== undefined) && (gravatarEmail !== ''),
                            emailValid   = (null != gravatarEmail.match(/.*@.*\..{2}/));

                        if (emailDefined && emailValid) {
                            el.attr('src', gravatarService.getImageSrc(gravatarEmail, attrs));
                        }
                    }

                });
            }
        };
    }]);
// Source: src/httpStatus/acute.httpStatus.js
angular.module('acute.httpStatus', ['acute.lodash'])

    .value('httpStatuses', [
        { code: 200, name: 'OK' },
        { code: 201, name: 'Created' },
        { code: 204, name: 'No Content' },
        { code: 301, name: 'Moved Permanently' },
        { code: 302, name: 'Found' },
        { code: 400, name: 'Bad Request' },
        { code: 401, name: 'Unauthorized' },
        { code: 403, name: 'Forbidden' },
        { code: 404, name: 'Not Found' },
        { code: 500, name: 'Internal Server Error' },
        { code: 503, name: 'Service Unavailable' }
    ])

    .service('httpStatus', ['_', 'httpStatuses', function (_, httpStatuses) {

        this.getName = function (code) {

            return _.find(httpStatuses, function (status) {
                return status.code === code;
            }).name;
        };

        this.getCode = function (name) {

            return _.find(httpStatuses, function (status) {
                return status.name === name;
            }).code;
        };

    }]);
// Source: src/lodash/acute.lodash.js
angular.module('acute.lodash', []).value('_', window._);
// Source: src/markdown/acute.markdown.js
angular.module('acute.markdown', ['ngSanitize'])

    .provider('markdownParser', function() {

        var opts = {};

        return {

            config: function (newOpts) {
                opts = newOpts;
            },

            $get: function () {
                return new Showdown.converter(opts);
            }
        };
    })

    .directive('acuteMarkdown', ['$sanitize', 'markdownParser', function($sanitize, markdownParser) {

        function sanitizeAndParse(val) {
            return $sanitize(markdownParser.makeHtml(val));
        }

        function hasMarkdown(doNext) {
            return function (newVal) {
                doNext(newVal ? sanitizeAndParse(newVal) : '');
            };
        }

        return {

            restrict: 'AE',

            link: function (scope, element, attrs) {

                function appendHtml(html) {
                    element.html(html);
                }

                if(attrs.acuteMarkdown) {
                    scope.$watch(attrs.acuteMarkdown, hasMarkdown(appendHtml));
                } else {
                    appendHtml(sanitizeAndParse(element.text()));
                }
            }
        };
    }]);
// Source: src/md5/acute.md5.js
angular.module('acute.md5', [])

    .factory('md5', [function () {

        var md5 = {

            createHash: function (str) {

                var xl;

                var rotateLeft = function (lValue, iShiftBits) {
                    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
                };

                var addUnsigned = function (lX, lY) {
                    var lX4, lY4, lX8, lY8, lResult;
                    lX8 = (lX & 0x80000000);
                    lY8 = (lY & 0x80000000);
                    lX4 = (lX & 0x40000000);
                    lY4 = (lY & 0x40000000);
                    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                    if (lX4 & lY4) {
                        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                    }
                    if (lX4 | lY4) {
                        if (lResult & 0x40000000) {
                            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                        } else {
                            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                        }
                    } else {
                        return (lResult ^ lX8 ^ lY8);
                    }
                };

                var _F = function (x, y, z) {
                    return (x & y) | ((~x) & z);
                };
                var _G = function (x, y, z) {
                    return (x & z) | (y & (~z));
                };
                var _H = function (x, y, z) {
                    return (x ^ y ^ z);
                };
                var _I = function (x, y, z) {
                    return (y ^ (x | (~z)));
                };

                var _FF = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };

                var _GG = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };

                var _HH = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };

                var _II = function (a, b, c, d, x, s, ac) {
                    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                    return addUnsigned(rotateLeft(a, s), b);
                };

                var convertToWordArray = function (str) {
                    var lWordCount;
                    var lMessageLength = str.length;
                    var lNumberOfWords_temp1 = lMessageLength + 8;
                    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                    var lWordArray = new Array(lNumberOfWords - 1);
                    var lBytePosition = 0;
                    var lByteCount = 0;
                    while (lByteCount < lMessageLength) {
                        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                        lBytePosition = (lByteCount % 4) * 8;
                        lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                        lByteCount++;
                    }
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                    return lWordArray;
                };

                var wordToHex = function (lValue) {
                    var wordToHexValue = "",
                        wordToHexValue_temp = "",
                        lByte, lCount;
                    for (lCount = 0; lCount <= 3; lCount++) {
                        lByte = (lValue >>> (lCount * 8)) & 255;
                        wordToHexValue_temp = "0" + lByte.toString(16);
                        wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                    }
                    return wordToHexValue;
                };

                var x = [],
                    k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                    S12 = 12,
                    S13 = 17,
                    S14 = 22,
                    S21 = 5,
                    S22 = 9,
                    S23 = 14,
                    S24 = 20,
                    S31 = 4,
                    S32 = 11,
                    S33 = 16,
                    S34 = 23,
                    S41 = 6,
                    S42 = 10,
                    S43 = 15,
                    S44 = 21;

                //str = this.utf8_encode(str);
                x = convertToWordArray(str);
                a = 0x67452301;
                b = 0xEFCDAB89;
                c = 0x98BADCFE;
                d = 0x10325476;

                xl = x.length;
                for (k = 0; k < xl; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                    a = addUnsigned(a, AA);
                    b = addUnsigned(b, BB);
                    c = addUnsigned(c, CC);
                    d = addUnsigned(d, DD);
                }

                var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

                return temp.toLowerCase();
            }

        };

        return md5;

    }]);
// Source: src/moment/acute.moment.js
angular.module('acute.moment', [])

    .value('moment', window.moment)

    .filter('moment', [function () {
        return function momentFilter(momentDate, format) {
            return momentDate.format(format);
        };
    }]);
// Source: src/popover/acute.popover.js
angular.module('acute.popover', ['ng', 'acute.tooltip'])

    .provider('$popoverDirective', function () {

        this.$get = ['$timeout', '$tooltipConfig', '$tooltip', function $popoverDirective($timeout, $tooltipConfig, $tooltip) {
            return function popoverDirective(name, options) {

                return {

                    restrict: 'EA',
                    scope: {
                        content: '@' + name,
                        tether: '=?' + name + 'Tether'
                    },

                    link: function ($scope, $el) {

                        var CLOSE_DELAY = 50;

                        var $timer,
                            tooltip = $tooltip($tooltipConfig($scope, $el, options)),
                            $tooltipEl = tooltip.element;

                        function cancelTimer(cb) {
                            return function () {
                                $timeout.cancel($timer);
                                (cb || angular.noop)();
                            };
                        }

                        function open() {
                            $scope.$apply(tooltip.open);
                        }

                        function delay(cb) {
                            return function () {
                                $timer = $timeout(function () {
                                    (cb || angular.noop)();
                                }, CLOSE_DELAY);
                            };
                        }

                        function close() {
                            $scope.$apply(tooltip.close);
                        }

                        $el
                            .on('mouseenter', cancelTimer(open))
                            .on('mouseleave', delay(close));

                        $tooltipEl
                            .on('mouseenter', cancelTimer())
                            .on('mouseleave', delay(close));
                    }
                };
            };
        }];
    })

    .directive('acutePopover', ['$popoverDirective', function ($popoverDirective) {
        return $popoverDirective('acutePopover');
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/acute-popover.html', '<div class="acute-popover">{{content}}</div>');
    }]);
// Source: src/session/acute.session.js
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
// Source: src/string/acute.string.js
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
// Source: src/string/acute.string.toCamelCase.js
angular
    .module('acute.string.toCamelCase', ['acute.string.utils'])
    .factory('stringToCamelCase', ['~normalizeAndSeparate', function (normalizeAndSeparate) {

        function hyphenToCamel(string) {
            return string.toLowerCase().replace(/-(.)/g, function (match, group1) {
                return group1.toUpperCase();
            });
        }

        return function(input) {
            return hyphenToCamel(normalizeAndSeparate(input, '-'));
        };
    }]);
// Source: src/string/acute.string.toDotNotation.js
angular
    .module('acute.string.toDotNotation', ['acute.string.utils'])
    .factory('stringToDotNotation', ['~normalizeAndSeparate', function (normalizeAndSeparate) {

        return function (input) {
            return normalizeAndSeparate(input, '.');
        };
    }]);
// Source: src/string/acute.string.toHyphenated.js
angular
    .module('acute.string.toHyphenated', ['acute.string.utils'])
    .factory('stringToHyphenated', ['~normalizeAndSeparate', function (normalizeAndSeparate) {

        return function (input) {
            return normalizeAndSeparate(input, '-');
        };
    }]);
// Source: src/tether/acute.tether.js
angular.module('acute.tether', ['ng'])

    .factory('$tether', ['$window', function ($window) {
        return function $tether(config) {
            return new $window.Tether(config);
        };
    }]);
// Source: src/tooltip/acute.tooltip.js
angular.module('acute.tooltip', ['ng', 'acute.tether'])

    .value('$tooltipConfig', function $tooltipConfig(scope, element, options) {

        var optionsCopy = angular.copy(options, {});

        angular.extend(scope, optionsCopy.scope);

        delete optionsCopy.scope;

        return angular.extend({target: element, scope: scope}, optionsCopy, {tether: scope.tether});
    })

    .provider('$tooltip', function () {

        var defaultTemplateUrl = 'template/acute-tooltip.html';

        this.setDefaultTemplateUrl = function (templateUrl) {
            defaultTemplateUrl = templateUrl;
        };

        var defaultTetherOptions = {
            attachment: 'top middle',
            targetAttachment: 'bottom middle'
        };

        this.setDefaultTetherOptions = function (options) {
            angular.extend(defaultTetherOptions, options);
        };

        this.$get = ['$rootScope', '$animate', '$compile', '$templateCache', '$tether', function $tooltip($rootScope, $animate, $compile, $templateCache, $tether) {

            return function tooltip(options) {

                var scope, element, tether;

                function getTemplate() {
                    return options.template || $templateCache.get(options.templateUrl);
                }

                function getScope() {
                    return options.scope || $rootScope.$new();
                }

                options        = angular.extend({ templateUrl: defaultTemplateUrl }, options);
                options.tether = angular.extend(defaultTetherOptions, options.tether);

                scope   = getScope();
                element = $compile(getTemplate())(scope);

                function attachTether() {

                    var tetherConfig = angular.extend({
                        element: element,
                        target: options.target
                    }, options.tether);

                    tether = $tether(tetherConfig);
                }

                function detachTether() {
                    if (tether) {
                        tether.destroy();
                    }
                }

                function open() {
                    $animate.enter(element, null, options.target);
                    attachTether();
                }

                function close() {
                    $animate.leave(element);
                    detachTether();
                }

                scope.$on('$destroy', close);

                return {
                    element: element,
                    open: open,
                    close: close
                };
            };
        }];
    })

    .provider('$tooltipDirective', function () {

        this.$get = ['$tooltipConfig', '$tooltip', function $tooltipDirective($tooltipConfig, $tooltip) {
            return function tooltipDirective(name, options) {

                return {

                    restrict: 'EA',
                    scope: {
                        content: '@' + name,
                        tether: '=?' + name + 'Tether'
                    },

                    link: function ($scope, $el) {

                        var tooltip = $tooltip($tooltipConfig($scope, $el, options));

                        function mouseEnter() { $scope.$apply(tooltip.open); }
                        function mouseLeave() { $scope.$apply(tooltip.close); }

                        $el.on('mouseenter', mouseEnter);
                        $el.on('mouseleave', mouseLeave);
                    }
                };
            };
        }];
    })

    .directive('acuteTooltip', ['$tooltipDirective', function ($tooltipDirective) {
        return $tooltipDirective('acuteTooltip');
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/acute-tooltip.html', '<div class="acute-tooltip">{{content}}</div>');
    }]);
// Source: src/whenReady/acute.whenReady.js
angular.module('acute.whenReady', [])

    .value('whenReady', function whenReady(callback) {
        return function (curr, prev) {
            if (curr !== prev) {
                callback(curr, prev);
            }
        };
    });})();