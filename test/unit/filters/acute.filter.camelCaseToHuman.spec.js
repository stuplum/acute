describe('acute.filters', function() {

    'use strict';

    describe('acute.filter.camelCaseToHuman', function() {

        beforeEach(function() {
            module('acute.filters');
        });

        it('should reverse an array', inject(function (camelCaseToHumanFilter) {
            expect(camelCaseToHumanFilter('camelCase')).toEqual('Camel Case');
        }));

    });

});
