describe('acuteMarkdown', function() {

    beforeEach(module('ngSanitize', 'acute.markdown'));

    it('should work as an element', function() {

        var md = compileDirective('<acute-markdown>*hi*</acute-markdown>');

        expect(md.html()).toBe('<p><em>hi</em></p>');
    });

    it('should work as an attribute', function() {

        var md = compileDirective('<div acute-markdown>*hi*</div>');

        expect(md.html()).toBe('<p><em>hi</em></p>');
    });

    it('should work as an attribute with property', inject(function($rootScope) {

        var md = compileDirective('<div acute-markdown="hey"></div>');

        expect(md.html()).toBe('');

        $rootScope.hey = "*hi*";
        $rootScope.$apply();

        expect(md.html()).toBe('<p><em>hi</em></p>');
    }));

    it('should sanitize input', function () {

        var md = compileDirective('<acute-markdown><script>window.dirty = true;</script></acute-markdown>');

        expect(md.html()).toBe('<p>window.dirty = true;</p>');
        expect(window.dirty).toBeUndefined();
    });

});

describe('markdownParserProvider', function () {

    angular
        .module('testModule', [])
        .config(function (markdownParserProvider) {
            markdownParserProvider.config({
                extensions: ['twitter']
            });
        });

    beforeEach(module('ngSanitize', 'acute.markdown', 'testModule'));

    it('should allow extensions', function () {

        var md = compileDirective('<acute-markdown>@twitteruser</acute-markdown>');

        expect(md.html()).toBe('<p><a href="http://twitter.com/twitteruser">@twitteruser</a></p>');
    })
})