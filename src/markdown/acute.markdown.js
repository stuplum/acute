'use strict';

angular.module('acute.markdown', ['ngSanitize'])

    .provider('markdownParser', function () {

        var opts = {};

        return {

            config: function (newOpts) {
                opts = newOpts;
            },

            $get: function () {
                return new Showdown.converter(opts);
            }
        };
    })

    .directive('acuteMarkdown', function ($sanitize, markdownParser) {

        function sanitizeAndParse(val) {
            return $sanitize(markdownParser.makeHtml(val));
        }

        function hasMarkdown(doNext) {
            return function (newVal) {
                doNext(newVal ? sanitizeAndParse(newVal) : '');
            };
        }

        return {

            restrict: 'AE',

            link: function (scope, element, attrs) {

                function appendHtml(html) {
                    element.html(html);
                }

                if(attrs.acuteMarkdown) {
                    scope.$watch(attrs.acuteMarkdown, hasMarkdown(appendHtml));
                } else {
                    appendHtml(sanitizeAndParse(element.text()));
                }
            }
        };
    });