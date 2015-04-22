describe('acute.assert', function () {

    'use strict';

    beforeEach(module('acute.assert.Param'));

    describe('assert.Param', function () {

        describe('isObject', function () {

            it('should not throw exception if param is an object', inject(function (Param) {

                expect(function () {
                    new Param('SomeObject', {}).isObject().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is not an object', inject(function (Param) {

                expect(function () {
                    new Param('SomeObject', 'not an object').isObject().check();
                }).toThrow('The \'SomeObject\' parameter must be a \'object\'');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('missing param', undefined).isOptional().isObject().check();
                }).not.toThrow();
            }));

            it('should throw exception if optional param is not an object', inject(function (Param) {

                expect(function () {
                    new Param('not object', 123).isOptional().isObject().check();
                }).toThrow('The \'not object\' parameter is optional or it must be a \'object\'');
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('SomeObject', undefined).isObject().check();
                }).toThrow('The \'SomeObject\' parameter must be a \'object\'');
            }));
        });

        describe('isBoolean', function () {

            it('should not throw exception if param is a boolean', inject(function (Param) {

                expect(function () {
                    new Param('booleanParam', false).isBoolean().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is not a boolean', inject(function (Param) {

                expect(function () {
                    new Param('booleanParam', 123).isBoolean().check();
                }).toThrow('The \'booleanParam\' parameter must be a \'boolean\'');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('booleanParam', undefined).isOptional().isBoolean().check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('booleanParam', undefined).isBoolean().check();
                }).toThrow();
            }));
        });

        describe('isString', function () {

            it('should not throw exception if param is a string', inject(function (Param) {

                expect(function () {
                    new Param('stringParam', 'string').isString().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is not a string', inject(function (Param) {

                expect(function () {
                    new Param('stringParam', 123).isString().check();
                }).toThrow('The \'stringParam\' parameter must be a \'string\'');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('stringParam').isOptional().isString().check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param({}).isString().check();
                }).toThrow();
            }));
        });

        describe('isNonEmptyString', function () {

            it('should not throw exception if param is a string', inject(function (Param) {

                expect(function () {
                    new Param('stringParam', 'string').isNonEmptyString().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is an empty string', inject(function (Param) {

                expect(function () {
                    new Param('stringParam', '').isNonEmptyString().check();
                }).toThrow('The \'stringParam\' parameter must be a nonEmpty string');
            }));

            it('should throw an exception if param is not a string', inject(function (Param) {

                expect(function () {
                    new Param('stringParam', 123).isNonEmptyString().check();
                }).toThrow('The \'stringParam\' parameter must be a nonEmpty string');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('stringParam', undefined).isOptional().isNonEmptyString().check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('stringParam', undefined).isNonEmptyString().check();
                }).toThrow();
            }));
        });

        describe('isNumber', function () {

            it('should not throw exception if param is a number', inject(function (Param) {

                expect(function () {
                    new Param('numberParam', 123).isNumber().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is not a number', inject(function (Param) {

                expect(function () {
                    new Param('numberParam', 'not a number').isNumber().check();
                }).toThrow('The \'numberParam\' parameter must be a \'number\'');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('numberParam', undefined).isOptional().isNumber().check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('numberParam', undefined).isNumber().check();
                }).toThrow();
            }));
        });

        describe('isFunction', function () {

            it('should not throw exception if param is a function', inject(function (Param) {

                expect(function () {
                    new Param('functionParam', function () {
                    }).isFunction().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is not a function', inject(function (Param) {

                expect(function () {
                    new Param('functionParam', 'not a function').isFunction().check();
                }).toThrow('The \'functionParam\' parameter must be a \'function\'');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('functionParam', undefined).isOptional().isFunction().check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('functionParam', undefined).isFunction().check();
                }).toThrow();
            }));
        });

        describe('isInstanceOf', function () {

            var instanceOne, instanceTwo;

            function InstanceOne() {
            }

            function InstanceTwo() {
            }

            InstanceTwo.prototype._$typeName = '__InstanceTwo';

            beforeEach(function () {
                instanceOne = new InstanceOne();
                instanceTwo = new InstanceTwo();
            });

            it('should not throw exception if param is instance of another class', inject(function (Param) {

                expect(function () {
                    new Param('instanceParam', instanceOne).isInstanceOf(InstanceOne).check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is not an instance of another class', inject(function (Param) {

                expect(function () {
                    new Param('instanceParam', instanceOne).isInstanceOf(InstanceTwo, 'InstanceTwo').check();
                }).toThrow('The \'instanceParam\' parameter must be an instance of \'InstanceTwo\'');
            }));

            it('should throw an exception if param is not an instance of another class', inject(function (Param) {

                expect(function () {
                    new Param('instanceParam', instanceOne).isInstanceOf(InstanceTwo).check();
                }).toThrow('The \'instanceParam\' parameter must be an instance of \'__InstanceTwo\'');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('instanceParam', undefined).isOptional().isInstanceOf(InstanceOne).check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('instanceParam', undefined).isInstanceOf(InstanceOne).check();
                }).toThrow();
            }));
        });

        describe('isRequired', function () {

            it('should not throw exception if required param exists', inject(function (Param) {

                expect(function () {
                    new Param('requiredParam', 'required').isRequired().check();
                }).not.toThrow();
            }));

            it('should throw an exception if required param does not exist', inject(function (Param) {

                expect(function () {
                    new Param('requiredParam', undefined).isRequired().check();
                }).toThrow('The \'requiredParam\' parameter is required');
            }));
        });

        describe('isArray', function () {

            it('should not throw exception if param is an array', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', []).isArray().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is not an array', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', 'not an array').isArray().check();
                }).toThrow('The \'arrayParam\' parameter must be an \'array\'');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', undefined).isOptional().isArray().check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', undefined).isArray().check();
                }).toThrow();
            }));
        });

        describe('isNonEmptyArray', function () {

            it('should not throw exception if param is an array', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', ['a value']).isNonEmptyArray().check();
                }).not.toThrow();
            }));

            it('should throw an exception if param is an empty array', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', []).isNonEmptyArray().check();
                }).toThrow('The \'arrayParam\' parameter must be a nonEmpty array');
            }));

            it('should throw an exception if param is not an array', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', 'not an array').isNonEmptyArray().check();
                }).toThrow('The \'arrayParam\' parameter must be a nonEmpty array');
            }));

            it('should not throw exception if optional param is missing', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', undefined).isOptional().isNonEmptyArray().check();
                }).not.toThrow();
            }));

            it('should throw exception if param is missing', inject(function (Param) {

                expect(function () {
                    new Param('arrayParam', undefined).isNonEmptyArray().check();
                }).toThrow();
            }));
        });

        describe('hasProperty', function () {

            it('should not throw exception if param has a named property', inject(function (Param) {

                expect(function () {
                    new Param('propertyParam', { dave: true }).hasProperty('dave').check();
                }).not.toThrow();
            }));

            it('should throw an exception if param does not have a named property', inject(function (Param) {

                expect(function () {
                    new Param('propertyParam', { dave: true }).hasProperty('chaz').check();
                }).toThrow('The \'propertyParam\' parameter must have a \'chaz\' property');
            }));
        });

        describe('apply', function () {

            it('should apply param to destination if param is valid', inject(function (Param) {

                var destination = {};

                new Param('someProperty', 'someValue').isString().apply(destination);

                expect(destination.someProperty).toEqual('someValue');
            }));

            it('should apply a default value if value is undefined', inject(function (Param) {

                var destination = {};

                new Param('someProperty').withDefault('someDefaultValue').isString().apply(destination);

                expect(destination.someProperty).toEqual('someDefaultValue');
            }));
        });

    });
});