describe('acute.httpStatus', function () {

    'use strict';

    beforeEach(module('acute.httpStatus'));

    describe('httpStatus', function () {

        var scenarios;

        scenarios = [
            {code: 200, name: 'OK'},
            {code: 201, name: 'Created'},
            {code: 204, name: 'No Content'},
            {code: 301, name: 'Moved Permanently'},
            {code: 302, name: 'Found'},
            {code: 400, name: 'Bad Request'},
            {code: 401, name: 'Unauthorized'},
            {code: 403, name: 'Forbidden'},
            {code: 404, name: 'Not Found'},
            {code: 500, name: 'Internal Server Error'},
            {code: 503, name: 'Service Unavailable'}
        ];

        scenarios.forEach(function (scenario) {

            it('should return the value by code', inject(function (httpStatus) {
                expect(httpStatus.getName(scenario.code)).toEqual(scenario.name);
            }));
        });

        scenarios.forEach(function (scenario) {

            it('should return the code by value', inject(function (httpStatus) {
                expect(httpStatus.getCode(scenario.name)).toEqual(scenario.code);
            }));
        });
    });

});