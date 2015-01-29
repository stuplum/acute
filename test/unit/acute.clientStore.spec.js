describe('acute.clientStore', function () {

    'use strict';

    beforeEach(module('acute.clientStore'));

    describe('clientStore', function () {

        describe('with empty localStorage', function () {

            beforeEach(function () {
                mockModule('localStorage', {});
            });

            it('should should add properties to local storage', inject(function ($rootScope, localStorage, clientStore) {

                $rootScope.$apply(function () {
                    clientStore.prop = 'new prop';
                });

                expect(clientStore.prop).toEqual('new prop');
                expect(localStorage.clientStore).toBe('{"prop":"new prop"}');
            }));

            it('should should serialize objects into local storage', inject(function ($rootScope, localStorage, clientStore) {

                $rootScope.$apply(function () {
                    clientStore.obj = {prop: 'new prop'};
                });

                expect(clientStore.obj.prop).toBe('new prop');
                expect(localStorage.clientStore).toBe('{"obj":{"prop":"new prop"}}');
            }));

            it('should should serialize multiple properties into local storage', inject(function ($rootScope, localStorage, clientStore) {

                $rootScope.$apply(function () {
                    clientStore.string  = 'new string';
                    clientStore.obj     = { prop: 'new prop' };
                    clientStore.complex = { obj: { prop: 'complex prop' }, string: 'complex string' };
                });

                expect(clientStore.string).toBe('new string');
                expect(clientStore.obj.prop).toBe('new prop');

                expect(clientStore.complex.string).toBe('complex string');
                expect(clientStore.complex.obj.prop).toBe('complex prop');

                expect(localStorage.clientStore).toBe('{"string":"new string","obj":{"prop":"new prop"},"complex":{"obj":{"prop":"complex prop"},"string":"complex string"}}');
            }));
        });

        describe('with populated localStorage', function () {

            beforeEach(function () {
                mockModule('localStorage', { clientStore: '{"prop":"old prop"}' });
            });

            it('should initialise cache from localStorage', inject(function (clientStore) {
                expect(clientStore.prop).toEqual('old prop');
            }));

            it('should should overwrite properties in local storage', inject(function ($rootScope, localStorage, clientStore) {

                $rootScope.$apply(function () {
                    clientStore.prop = 'new prop';
                });

                expect(clientStore.prop).toEqual('new prop');
                expect(localStorage.clientStore).toBe('{"prop":"new prop"}');
            }));

            it('should should serialize objects into local storage', inject(function ($rootScope, localStorage, clientStore) {

                $rootScope.$apply(function () {
                    clientStore.obj = { prop: 'new prop' };
                });

                expect(clientStore.obj.prop).toBe('new prop');
                expect(localStorage.clientStore).toBe('{"prop":"old prop","obj":{"prop":"new prop"}}');
            }));
        });

    });
});