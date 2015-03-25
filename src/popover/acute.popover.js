'use strict';

angular.module('acute.popover', ['ng', 'acute.tooltip'])

    .provider('$popoverDirective', function () {

        this.$get = ['$timeout', '$tooltipConfig', '$tooltip', function $popoverDirective($timeout, $tooltipConfig, $tooltip) {
            return function popoverDirective(name, options) {

                return {

                    restrict: 'EA',
                    scope: {
                        content: '@' + name,
                        tether: '=?' + name + 'Tether'
                    },

                    link: function ($scope, $el) {

                        var CLOSE_DELAY = 50;

                        var $timer,
                            tooltip = $tooltip($tooltipConfig($scope, $el, options)),
                            $tooltipEl = tooltip.element;

                        function cancelTimer(cb) {
                            return function () {
                                $timeout.cancel($timer);
                                (cb || angular.noop)();
                            };
                        }

                        function open() {
                            $scope.$apply(tooltip.open);
                        }

                        function delay(cb) {
                            return function () {
                                $timer = $timeout(function () {
                                    (cb || angular.noop)();
                                }, CLOSE_DELAY);
                            };
                        }

                        function close() {
                            $scope.$apply(tooltip.close);
                        }

                        $el
                            .on('mouseenter', cancelTimer(open))
                            .on('mouseleave', delay(close));

                        $tooltipEl
                            .on('mouseenter', cancelTimer())
                            .on('mouseleave', delay(close));
                    }
                };
            };
        }];
    })

    .directive('acutePopover', ['$popoverDirective', function ($popoverDirective) {
        return $popoverDirective('acutePopover');
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/acute-popover.html', '<div class="acute-popover">{{content}}</div>');
    }]);