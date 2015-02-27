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
            parentScope,
            config = _config_ || {};

        if (config.parentScope) {
            parentScope = config.parentScope;
            delete config.parentScope;
        }

        function createEl(el) {

            var $el = angular.element(el);

            if(parentScope) {
                _.each(parentScope, function (ctrl, name) {
                    var controllerName = ['$', name, 'Controller'].join('');
                    $el.data(controllerName, ctrl);
                });
            }

            return $el;
        }

        inject(function($rootScope, $compile) {

            angular.extend($rootScope, config.$rootScope || {});

            compiledEl = $compile(createEl(_el_))($rootScope);

            compiledEl.updateScope = function (k, v) {
                compiledEl.scope()[k] = v;
                compiledEl.scope().$apply();
            };

            $rootScope.$digest();
        });

        return compiledEl;
    };

})(window);