describe('acute.filters', function() {

    'use strict';

    describe('acute.filter.camelCaseToHuman', function() {

        beforeEach(function() {
            module('acute.filters');
        });

        it('should capitalise and add spaces to camel case text', inject(function (camelCaseToHumanFilter) {
            expect(camelCaseToHumanFilter('camelCase')).toEqual('Camel Case');
        }));

    });

});
