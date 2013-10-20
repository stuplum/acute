(function () {

    'use strict';

    angular.module('acute.gravatar', ['acute.md5'])

        .factory('gravatarService', ['md5', function (md5) {

            return {
                getImageSrc: function (email, attrs) {

                    var hash       = md5.createHash(email.toLowerCase()),
                        domain     = attrs.secure ? 'https://secure' : 'http://www',
                        size       = attrs.size || 40,
                        rating     = attrs.rating || 'pg',
                        defaultUrl = attrs.default || '404';

                    return domain + '.gravatar.com/avatar/' + hash + '?s=' + size + '&r=' + rating + '&d=' + defaultUrl;
                }
            };
        }])

        .directive('acuteGravatar', ['gravatarService', function (gravatarService) {

            return {

                restrict: "AC",

                link: function (scope, el, attrs) {

                    scope.$watch(attrs.email, function (email) {

                        if(email) {
                            var emailDefined = (email !== null) && (email !== undefined) && (email !== ''),
                                emailValid   = (null != email.match(/.*@.*\..{2}/));

                            if (emailDefined && emailValid) {
                                el.attr('src', gravatarService.getImageSrc(email, attrs));
                            }
                        }

                    });
                }};
        }]);

})();