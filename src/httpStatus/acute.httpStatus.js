'use strict';

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