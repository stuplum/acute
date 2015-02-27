describe('acute.md5', function () {

    'use strict';

    beforeEach(module('acute.md5'));

    describe('md5', function () {

        it('should be defined', inject(function (md5) {
            expect(md5).toBeDefined();
        }));

    });

});