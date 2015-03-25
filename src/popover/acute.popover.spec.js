describe('acute.popover', function () {

    'use strict';

    beforeEach(module('acute.popover'));

    describe('acutePopover', function () {

        var openStub, closeStub;

        beforeEach(function () {

            openStub  = sinon.stub();
            closeStub = sinon.stub();

            mockModule('$tooltip', sinon.stub());

            mockModule('$tooltipConfig', sinon.stub());
        });

        it('should open popover when mouse enters element', inject(function ($tooltip, $tooltipConfig) {

            var $el, $tooltipEl;

            $tooltipEl = angular.element('<div/>');

            $tooltip
                .withArgs('tooltipConfig')
                .returns({ open: openStub, element: $tooltipEl });

            $tooltipConfig
                .withArgs(isScope, isJqueryElement, undefined)
                .returns('tooltipConfig');

            $el = compileDirective('<span acute-popover="dave">test</span>');

            $el.trigger('mouseenter');

            expect(openStub).toHaveBeenCalled();
        }));

        it('should close tooltip when mouse leaves element', inject(function ($timeout, $tooltip, $tooltipConfig) {

            var $el, $tooltipEl;

            $tooltipEl = angular.element('<div/>');

            $tooltip
                .withArgs('tooltipConfig')
                .returns({ close: closeStub, element: $tooltipEl });

            $tooltipConfig
                .withArgs(isScope, isJqueryElement, undefined)
                .returns('tooltipConfig');

            $el = compileDirective('<span acute-popover="dave">test</span>');

            $el.trigger('mouseleave');

            $timeout.flush();

            expect(closeStub).toHaveBeenCalled();
        }));

        it('should cancel close on tooltip when mouse leaves element and enters popover element', inject(function ($timeout, $tooltip, $tooltipConfig) {

            var $el, $tooltipEl;

            // Given: A tooltip DOM element
            $tooltipEl = angular.element('<div/>');

            // And:
            $tooltip
                .withArgs('tooltipConfig')
                .returns({ close: closeStub, element: $tooltipEl });

            // And:
            $tooltipConfig
                .withArgs(isScope, isJqueryElement, undefined)
                .returns('tooltipConfig');

            // When: the popover is initialised
            $el = compileDirective('<span acute-popover="dave">test</span>');

            // And: the mouse leaves the element with the popover applied
            $el.trigger('mouseleave');

            // And: the mouse hovers over the tooltip element
            $tooltipEl.trigger('mouseenter');

            $timeout.flush();

            // Then:
            expect(closeStub).not.toHaveBeenCalled();
        }));

        it('should close tooltip when mouse leaves tooltip element', inject(function ($timeout, $tooltip, $tooltipConfig) {

            var $tooltipEl = angular.element('<div/>');

            $tooltip
                .withArgs('tooltipConfig')
                .returns({ close: closeStub, element: $tooltipEl });

            $tooltipConfig
                .withArgs(isScope, isJqueryElement, undefined)
                .returns('tooltipConfig');

            compileDirective('<span acute-popover="dave">test</span>');

            $tooltipEl.trigger('mouseleave');

            $timeout.flush();

            expect(closeStub).toHaveBeenCalled();
        }));
    });

});