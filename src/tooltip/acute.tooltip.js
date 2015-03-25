'use strict';

angular.module('acute.tooltip', ['ng', 'acute.tether'])

    .value('$tooltipConfig', function $tooltipConfig(scope, element, options) {

        var optionsCopy = angular.copy(options, {});

        angular.extend(scope, optionsCopy.scope);

        delete optionsCopy.scope;

        return angular.extend({target: element, scope: scope}, optionsCopy, {tether: scope.tether});
    })

    .provider('$tooltip', function () {

        var defaultTemplateUrl = 'template/acute-tooltip.html';

        this.setDefaultTemplateUrl = function (templateUrl) {
            defaultTemplateUrl = templateUrl;
        };

        var defaultTetherOptions = {
            attachment: 'top middle',
            targetAttachment: 'bottom middle'
        };

        this.setDefaultTetherOptions = function (options) {
            angular.extend(defaultTetherOptions, options);
        };

        this.$get = ['$rootScope', '$animate', '$compile', '$templateCache', '$tether', function $tooltip($rootScope, $animate, $compile, $templateCache, $tether) {

            return function tooltip(options) {

                var scope, element, tether;

                function getTemplate() {
                    return options.template || $templateCache.get(options.templateUrl);
                }

                function getScope() {
                    return options.scope || $rootScope.$new();
                }

                options        = angular.extend({ templateUrl: defaultTemplateUrl }, options);
                options.tether = angular.extend(defaultTetherOptions, options.tether);

                scope   = getScope();
                element = $compile(getTemplate())(scope);

                function attachTether() {

                    var tetherConfig = angular.extend({
                        element: element,
                        target: options.target
                    }, options.tether);

                    tether = $tether(tetherConfig);
                }

                function detachTether() {
                    if (tether) {
                        tether.destroy();
                    }
                }

                function open() {
                    $animate.enter(element, null, options.target);
                    attachTether();
                }

                function close() {
                    $animate.leave(element);
                    detachTether();
                }

                scope.$on('$destroy', close);

                return {
                    element: element,
                    open: open,
                    close: close
                };
            };
        }];
    })

    .provider('$tooltipDirective', function () {

        this.$get = ['$tooltipConfig', '$tooltip', function $tooltipDirective($tooltipConfig, $tooltip) {
            return function tooltipDirective(name, options) {

                return {

                    restrict: 'EA',
                    scope: {
                        content: '@' + name,
                        tether: '=?' + name + 'Tether'
                    },

                    link: function ($scope, $el) {

                        var tooltip = $tooltip($tooltipConfig($scope, $el, options));

                        function mouseEnter() { $scope.$apply(tooltip.open); }
                        function mouseLeave() { $scope.$apply(tooltip.close); }

                        $el.on('mouseenter', mouseEnter);
                        $el.on('mouseleave', mouseLeave);
                    }
                };
            };
        }];
    })

    .directive('acuteTooltip', ['$tooltipDirective', function ($tooltipDirective) {
        return $tooltipDirective('acuteTooltip');
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/acute-tooltip.html', '<div class="acute-tooltip">{{content}}</div>');
    }]);