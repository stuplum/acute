describe('acute.assert', function () {

    'use strict';

    beforeEach(module('acute.assert.assertParam'));

    describe('assert.assertParam', function () {

        beforeEach(function () {
            mockModule('Param', sinon.stub());
        });

        it('should create a new Param', inject(function (Param, assertParam) {

            assertParam('name', 'value');

            expect(Param).toHaveBeenCalledWithExactly('name', 'value');
        }));

        it('should create a new instance of Param', inject(function (assertParam) {

            var param1 = assertParam('name', 'value');
            var param2 = assertParam('name', 'value');

            expect(param1).not.toBe(param2);
        }));

    });

});