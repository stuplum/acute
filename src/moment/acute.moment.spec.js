describe('acute.moment', function () {

    'use strict';

    beforeEach(function () {
        module('acute.moment');
    });

    it('should expose global moment object', inject(function (moment) {
        expect(moment()._isAMomentObject).toBeTruthy();
    }));

    it('should format a moment date object', inject(function (moment, momentFilter) {
        expect(momentFilter(moment(0), 'MMM')).toEqual('Jan');
    }));

});