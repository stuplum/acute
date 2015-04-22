describe('acute.assert', function () {

    'use strict';

    beforeEach(module('acute.assert.assertConfig'));

    describe('assert.assertConfig', function () {

        var asserted;

        it('should throw an error if object being asserted is not of type object', inject(function (assertConfig) {
            expect(function () { assertConfig('not object'); }).toThrow('Configuration parameter should be an object, instead it is a: string');
        }));

        describe('whereParam', function () {

            it('should not throw an error if chained params are valid', inject(function (assertConfig) {

                var config = { someString: 'string', anotherString: 'string' };

                expect(function () {
                    assertConfig(config)
                        .whereParam('someString').isString()
                        .whereParam('anotherString').isString()
                        .checkAll();
                }).not.toThrow();

            }));

            it('should throw an error if one chained param is invalid', inject(function (assertConfig) {

                var config = { someOptional: 123, someString: 'string' };

                expect(function () {
                    assertConfig(config)
                        .whereParam('someOptional').isOptional().isString()
                        .whereParam('someString').isString()
                        .checkAll();
                }).toThrow('The \'someOptional\' parameter is optional or it must be a \'string\'');

            }));

            it('should throw 1 error if all chained params are invalid', inject(function (assertConfig) {

                var config = { invalid: 123, alsoInvalid: [] };

                expect(function () {
                    assertConfig(config)
                        .whereParam('invalid').isString()
                        .whereParam('alsoInvalid').isString()
                        .checkAll();
                }).toThrow('The \'invalid\' parameter must be a \'string\'');

            }));
        });

        describe('applyAll', function () {

            it('should apply params to destination if params are valid', inject(function (assertConfig) {

                var source      = { someProperty: 'someValue', anotherProperty: 123 },
                    destination = {};

                assertConfig(source)
                    .whereParam('someProperty').isString()
                    .whereParam('anotherProperty').isNumber()
                    .applyAll(destination);

                expect(destination).toEqual(source);
                expect(destination).not.toBe(source);
            }));
        });
    });

});