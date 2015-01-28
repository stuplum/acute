describe('acute.session', function () {

    'use strict';

    beforeEach(module('acute.session'));

    describe('session', function () {

        beforeEach(function () {
            mockModule('cache', {session: {}});
        });

        it('should initialise session token to undefined', inject(function (session) {
            expect(session.token).toBeUndefined();
        }));

        it('should initialise session token from cache', inject(function (cache, session) {

            cache.session.token = 'from cache';

            expect(session.token).toBe('from cache');
        }));

        describe('isActive', function () {

            it('should be false when token is undefined', inject(function (session) {
                expect(session.isActive()).toBeFalsy();
            }));

            it('should be true when token is defined', inject(function (session) {

                session.token = 'a token';

                expect(session.isActive()).toBeTruthy();
            }));
        });

        describe('create', function () {

            it('should add token to session', inject(function (cache, session) {

                session.create('a,session,token');

                expect(session.token).toBe('a,session,token');
                expect(cache.session.token).toBe('a,session,token');
            }));

            it('should overwrite an existing token', inject(function (cache, session) {

                cache.session.token = 'an old token';

                session.create('a,session,token');

                expect(session.token).toBe('a,session,token');
            }));

        });

        describe('invalidate', function () {

            it('should remove the active token', inject(function (session) {

                session.token = 'active token';

                session.invalidate();

                expect(session.token).toBeUndefined();
            }));

        });
    });

});