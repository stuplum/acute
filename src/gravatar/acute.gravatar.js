(function () {

    'use strict';

    angular.module('acute.gravatar', ['acute.md5'])

        .factory('gravatarService', ['md5', function (md5) {

            return {
                getImageSrc: function (gravatarEmail, attrs) {

                    var hash       = md5.createHash(gravatarEmail.toLowerCase()),
                        domain     = attrs.gravatarSecure ? 'https://secure' : 'http://www',
                        size       = attrs.gravatarSize || 40,
                        rating     = attrs.gravatarRating || 'pg',
                        defaultUrl = attrs.gravatarDefault || '404';

                    return domain + '.gravatar.com/avatar/' + hash + '?s=' + size + '&r=' + rating + '&d=' + defaultUrl;
                }
            };
        }])

        .directive('acuteGravatar', ['gravatarService', function (gravatarService) {

            return {

                restrict: "AC",

                link: function (scope, el, attrs) {

                    scope.$watch(attrs.gravatarEmail, function (gravatarEmail) {

                        if(gravatarEmail) {
                            var emailDefined = (gravatarEmail !== null) && (gravatarEmail !== undefined) && (gravatarEmail !== ''),
                                emailValid   = (null != gravatarEmail.match(/.*@.*\..{2}/));

                            if (emailDefined && emailValid) {
                                el.attr('src', gravatarService.getImageSrc(gravatarEmail, attrs));
                            }
                        }

                    });
                }};
        }]);

})();