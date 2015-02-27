'use strict';

angular.module('acute.clndr', ['acute.whenReady'])

    .constant('acuteClndrConfig', {})

    .provider('acuteClndrFactory', ['acuteClndrConfig', function (acuteClndrConfig) {

        var config = angular.copy(acuteClndrConfig);

        this.setConfig = function setConfig(key, val) {
            config[key] = val;
        };

        this.$get = function acuteClndrFactory() {

            var clndr;

            function mergeConfig(render) {
                return angular.extend(config, {render: render});
            }

            return {

                create: function (render) {
                    return clndr = angular.element('<div/>').clndr(mergeConfig(render));
                },

                getClndr: function () {
                    return clndr;
                }
            };
        };
    }])

    .controller('AcuteClndrCtrl', ['$scope', 'whenReady', 'acuteClndrFactory', function ($scope, whenReady, acuteClndrFactory) {

        this.back    = function () { acuteClndrFactory.getClndr().back(); };
        this.forward = function () { acuteClndrFactory.getClndr().forward(); };

        $scope.$watchCollection('events', whenReady(function(events) {
            acuteClndrFactory.getClndr().setEvents(events);
        }));
    }])

    .directive('acuteClndr', ['acuteClndrFactory', function (acuteClndrFactory) {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: { events: '=clndrEvents' },
            controller: 'AcuteClndrCtrl',
            link: function link(scope, el, attrs, ctrl, transclude) {
                transclude(scope, function transclude(clone) {
                    el.append(clone);
                    acuteClndrFactory.create(_.partial(angular.extend, scope));
                });
            }
        };
    }]);