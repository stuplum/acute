describe('acute.string', function() {

    'use strict';

    describe('acute.string.toHyphenated', function() {

        var scenarios = [
            { it: 'should be part of the utils package',        package: 'acute.utils' },
            { it: 'should be part of the string package',       package: 'acute.string' },
            { it: 'should be part of the toHyphenated package', package: 'acute.string.toHyphenated' }
        ];

        scenarios.forEach(function (scenario) {

            it(scenario.it, function () {

                module(scenario.package);

                expect(function () { inject(function (stringToHyphenated) { /* injected service */ }); }).not.toThrow();
            });
        });

        describe('stringToHyphenated', function () {

            beforeEach(function () {
                module('acute.string.toHyphenated');
            });

            var scenarios = [
                { it: 'should format "class" as "class"', string: 'class', expected: 'class' },
                { it: 'should format "Class" as "class"', string: 'Class', expected: 'class' },
                { it: 'should format "SomeClass" as "some-class"', string: 'SomeClass', expected: 'some-class' },
                { it: 'should format "someClass" as "some-class"', string: 'someClass', expected: 'some-class' },
                { it: 'should format "some class" as "some-class"', string: 'some class', expected: 'some-class' },
                { it: 'should format "Some Class" as "some-class"', string: 'Some Class', expected: 'some-class' },
                { it: 'should format "some Class" as "some-class"', string: 'some Class', expected: 'some-class' },
                { it: 'should format "Some class" as "some-class"', string: 'Some class', expected: 'some-class' },
                { it: 'should format "Some/Class" as "some-class"', string: 'Some/Class', expected: 'some-class' },

                { it: 'should format "SomeOtherClass" as "some-other-class"', string: 'SomeOtherClass', expected: 'some-other-class'},
                { it: 'should format "someOtherClass" as "some-other-class"', string: 'someOtherClass', expected: 'some-other-class'},
                { it: 'should format "some other class" as "some-other-class"', string: 'some other class', expected: 'some-other-class'},
                { it: 'should format "Some Other Class" as "some-other-class"', string: 'Some Other Class', expected: 'some-other-class'},
                { it: 'should format "some other Class" as "some-other class"', string: 'some other Class', expected: 'some-other-class'},
                { it: 'should format "Some Other class" as "some-other-class"', string: 'Some Other class', expected: 'some-other-class'},
                { it: 'should format "Some/Other/Class" as "some-other-class"', string: 'Some/Other/Class', expected: 'some-other-class'}
            ];

            scenarios.forEach(function (scenario) {

                it(scenario.it, inject(function (stringToHyphenated) {
                    expect(stringToHyphenated(scenario.string)).toBe(scenario.expected);
                }));
            });

        });

    });

});