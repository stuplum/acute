describe('acute.session', function () {

    'use strict';

    beforeEach(module('acute.session'));

    describe('session', function () {

        beforeEach(function () {
            mockModule('clientStore', {session: {}});
        });

        it('should initialise session token to undefined', inject(function (session) {
            expect(session.token).toBeUndefined();
        }));

        it('should initialise session user to undefined', inject(function (session) {
            expect(session.user).toBeUndefined();
        }));

        it('should initialise session token from clientStore', inject(function (clientStore, session) {

            clientStore.session.token = 'token from clientStore';

            expect(session.token).toBe('token from clientStore');
        }));

        it('should initialise session user from clientStore', inject(function (clientStore, session) {

            clientStore.session.user = 'user from clientStore';

            expect(session.user).toBe('user from clientStore');
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

            it('should add token to session', inject(function (clientStore, session) {

                session.create('a,session,token');

                expect(session.token).toBe('a,session,token');
                expect(clientStore.session.token).toBe('a,session,token');
            }));

            it('should add user to session', inject(function (clientStore, session) {

                session.create('bovvered', 'a,session,user');

                expect(session.user).toBe('a,session,user');
                expect(clientStore.session.user).toBe('a,session,user');
            }));

            it('should overwrite an existing token', inject(function (clientStore, session) {

                clientStore.session.token = 'an old token';

                session.create('a,session,token');

                expect(session.token).toBe('a,session,token');
            }));

            it('should overwrite an existing user', inject(function (clientStore, session) {

                clientStore.session.user = 'an old user';

                session.create('menocare', 'a,session,user');

                expect(session.user).toBe('a,session,user');
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