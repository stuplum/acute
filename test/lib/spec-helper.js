(window.jasmine) && (function(window) {

    window.mockModule = function(name, value) {

        module(function($provide) {
            $provide.value(name, value);
        });
    };

    window.compileController = function(ctrlName, _$scope_) {

        var ctrl, $scope;

        inject(function(_$rootScope_, _$controller_) {
            $scope = _$scope_ || _$rootScope_.$new();
            ctrl = _$controller_(ctrlName, { $scope: $scope });
            ctrl.$scope = function() { return $scope };
        });

        return ctrl;
    };

    window.compileDirective = function(_el_, _config_) {

        var compiledEl,
            config = _config_ || {};

        inject(function($rootScope, $compile) {

            angular.extend($rootScope, config.$rootScope || {});

            compiledEl = $compile(angular.element(_el_))($rootScope);

            $rootScope.$digest();
        });

        return compiledEl;
    };

})(window);