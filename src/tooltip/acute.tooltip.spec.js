describe('acute.tooltip', function () {

    'use strict';

    beforeEach(module('acute.tooltip'));

    describe('tooltip', function () {

        describe('$tooltipConfig', function () {

            it('should add scope from options to original scope', inject(function ($tooltipConfig) {

                var originalScope = { original: 'scope' };

                $tooltipConfig(originalScope, undefined, { scope: { added: 'property' }});

                expect(originalScope).toEqual({
                    original: 'scope',
                    added: 'property'
                });
            }));

            it('should return the original scope as part of the config', inject(function ($tooltipConfig) {

                var originalScope, config;

                originalScope = { };

                config = $tooltipConfig(originalScope, undefined, { scope: {} });

                expect(config.scope).toBe(originalScope);
            }));

            it('should set the element as target', inject(function ($tooltipConfig) {

                var config = $tooltipConfig({}, 'element', { });

                expect(config.target).toEqual('element');
            }));

            it('should set the tether element from scope as tether on config', inject(function ($tooltipConfig) {

                var config = $tooltipConfig({}, undefined, { scope: { tether: 'tether' } });

                expect(config.tether).toEqual('tether');
            }));
        });

        describe('$tooltip', function () {

            beforeEach(function () {
                mockModule('$tether', sinon.stub());
                mockModule('$animate', { enter: sinon.stub(), leave: sinon.stub() });
            });

            describe('element', function () {

                beforeEach(function () {
                    mockModule('$compile', sinon.stub());
                });

                it('should return the tethered element', inject(function ($compile, $templateCache, $tooltip) {

                    var tooltip, compileStub;

                    // Given:
                    sinon.stub($templateCache, 'get')
                        .withArgs('template/acute-tooltip.html')
                        .returns('template');

                    // And:
                    compileStub = sinon.stub();
                    $compile
                        .withArgs('template')
                        .returns(compileStub);

                    // And:
                    compileStub
                        .withArgs(isScope)
                        .returns('element');

                    // When:
                    tooltip = $tooltip();

                    // Then:
                    expect(tooltip.element).toEqual('element');
                }));

                it('should return the tethered element from optional template', inject(function ($compile, $templateCache, $tooltip) {

                    var tooltip, compileStub;

                    // Given:
                    compileStub = sinon.stub();
                    $compile
                        .withArgs('<div/>')
                        .returns(compileStub);

                    // And:
                    compileStub
                        .withArgs(isScope)
                        .returns('element');

                    // When:
                    tooltip = $tooltip({ template: '<div/>' });

                    // Then:
                    expect(tooltip.element).toEqual('element');

                    // And:
                    expect($templateCache.get).not.toHaveBeenCalled();
                }));
            });

            describe('attach', function () {

                it('should animate on open', inject(function ($animate, $tooltip) {

                    var tooltip = $tooltip({ target: 'target' });

                    tooltip.open();

                    expect($animate.enter).toHaveBeenCalledWith(isJqueryElement, null, 'target');
                }));

                it('should attach tether with default config on open', inject(function ($tether, $tooltip) {

                    var tooltip = $tooltip({ target: 'target' });

                    tooltip.open();

                    expect($tether).toHaveBeenCalledWith({
                        element: isJqueryElement,
                        target: 'target',
                        attachment: 'top middle',
                        targetAttachment: 'bottom middle'
                    });
                }));

                it('should attach tether with external config on open', inject(function ($tether, $tooltip) {

                    var tooltip = $tooltip({
                        target: 'target',
                        tether: {
                            attachment: 'attachment',
                            targetAttachment: 'targetAttachment'
                        }
                    });

                    tooltip.open();

                    expect($tether).toHaveBeenCalledWith({
                        element: isJqueryElement,
                        target: 'target',
                        attachment: 'attachment',
                        targetAttachment: 'targetAttachment'
                    });
                }));
            });

            describe('detach', function () {

                it('should animate on close', inject(function ($animate, $tooltip) {

                    var tooltip = $tooltip({ target: 'target' });

                    tooltip.close();

                    expect($animate.leave).toHaveBeenCalledWith(isJqueryElement);
                }));

                it('should detach tether if attached on close', inject(function ($tether, $tooltip) {

                    var destroyStub, tooltip;

                    // Given:
                    destroyStub = sinon.stub();

                    $tether.returns({ destroy: destroyStub });

                    // And:
                    tooltip = $tooltip({ target: 'target' });

                    // When:
                    tooltip.open();

                    // And:
                    tooltip.close();

                    // Then:
                    expect(destroyStub).toHaveBeenCalled();
                }));

                it('should not detach tether if not attached on close', inject(function ($tether, $tooltip) {

                    var destroyStub, tooltip;

                    // Given:
                    destroyStub = sinon.stub();

                    $tether.returns({ destroy: destroyStub });

                    // And:
                    tooltip = $tooltip({ target: 'target' });

                    // When:
                    tooltip.close();

                    // Then:
                    expect(destroyStub).not.toHaveBeenCalled();
                }));


                it('should detach tether if attached on $destroy', inject(function ($rootScope, $tether, $tooltip) {

                    var destroyStub, tooltip;

                    // Given:
                    destroyStub = sinon.stub();

                    $tether.returns({ destroy: destroyStub });

                    // And:
                    tooltip = $tooltip({ target: 'target' });

                    // When:
                    tooltip.open();

                    // And:
                    $rootScope.$broadcast('$destroy');

                    // Then:
                    expect(destroyStub).toHaveBeenCalled();
                }));

                it('should not detach tether if not attached on $destroy', inject(function ($rootScope, $tether, $tooltip) {

                    var destroyStub;

                    // Given:
                    destroyStub = sinon.stub();

                    $tether.returns({ destroy: destroyStub });

                    // And:
                    $tooltip({ target: 'target' });

                    // When:
                    $rootScope.$broadcast('$destroy');

                    // Then:
                    expect(destroyStub).not.toHaveBeenCalled();
                }));
            });
        });

        describe('acuteTooltip', function () {

            var openStub, closeStub;

            beforeEach(function () {

                openStub  = sinon.stub();
                closeStub = sinon.stub();

                mockModule('$tooltip', sinon.stub());

                mockModule('$tooltipConfig', sinon.stub());
            });

            it('should open tooltip when mouse enters element', inject(function ($tooltip, $tooltipConfig) {

                var $el;

                $tooltip
                    .withArgs('tooltipConfig')
                    .returns({ open: openStub });

                $tooltipConfig
                    .withArgs(isScope, isJqueryElement, undefined)
                    .returns('tooltipConfig');

                $el = compileDirective('<span acute-tooltip="dave">test</span>');

                $el.trigger('mouseenter');

                expect(openStub).toHaveBeenCalled();
            }));

            it('should close tooltip when mouse leaves element', inject(function ($tooltip, $tooltipConfig) {

                var $el;

                $tooltip
                    .withArgs('tooltipConfig')
                    .returns({ close: closeStub });

                $tooltipConfig
                    .withArgs(isScope, isJqueryElement, undefined)
                    .returns('tooltipConfig');

                $el = compileDirective('<span acute-tooltip="dave">test</span>');

                $el.trigger('mouseleave');

                expect(closeStub).toHaveBeenCalled();
            }));
        });

    });

});