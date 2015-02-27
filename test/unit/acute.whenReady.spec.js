describe('acute.whenReady', function () {

    'use strict';

    beforeEach(module('acute.whenReady'));

    describe('whenReady', function () {

        it('should not call callback when values are undefined', inject(function (whenReady) {

            var readyFunc, callback = sinon.stub();

            readyFunc = whenReady(callback);

            readyFunc(undefined, undefined);

            expect(callback).not.toHaveBeenCalled();
        }));

        it('should call callback when current value is defined', inject(function (whenReady) {

            var readyFunc, callback = sinon.stub();

            readyFunc = whenReady(callback);

            readyFunc('curr', undefined);

            expect(callback).toHaveBeenCalledWithExactly('curr', undefined);
        }));

        it('should call callback when values are defined', inject(function (whenReady) {

            var readyFunc, callback = sinon.stub();

            readyFunc = whenReady(callback);

            readyFunc('curr', 'prev');

            expect(callback).toHaveBeenCalledWithExactly('curr', 'prev');
        }));

    });

});