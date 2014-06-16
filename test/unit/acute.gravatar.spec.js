describe('acute.gravatar', function() {

    'use strict';
    
    var template, $avatar;

    beforeEach(function() {

        module('acute.gravatar');

        template = '<img acute-gravatar data-gravatar-email="email" data-gravatar-size="120" data-gravatar-rating="pg" data-gravatar-default="404" />';

        $avatar = compileDirective(template, { $rootScope: { email: 'hash@me.com' } });
    });

    it('should add md5 of the email address', function () {

        var imageSrc = $avatar.attr('src');

        expect(imageSrc).toContain('47a03410a9c27bf9b4669a7e97930e9a');
    });

    it('should add size parameter of 120 pixels', function () {

        var imageSrc = $avatar.attr('src');

        expect(imageSrc).toContain('s=120');
    });

    it('should add a rating parameter of PG', function () {

        var imageSrc = $avatar.attr('src');

        expect(imageSrc).toContain('r=pg');
    });

    it('should add a default image parameter of 404', function () {

        var imageSrc = $avatar.attr('src');

        expect(imageSrc).toContain('d=404');
    });

    it('should not throw error if email is undefined', function () {
        expect(function() { compileDirective(template, { $rootScope: { email: undefined } }); }).not.toThrow();
    });

});