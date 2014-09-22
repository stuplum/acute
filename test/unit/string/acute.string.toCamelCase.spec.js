describe('acute.string', function() {

    'use strict';

    describe('acute.string.toCamelCase', function() {

        beforeEach(function() {
            module('acute.string.toCamelCase');
        });

        var scenarios = [
            { it: 'should format "class" as "class"',          string: 'class',      expected: 'class' },
            { it: 'should format "Class" as "class"',          string: 'Class',      expected: 'class' },
            { it: 'should format "SomeClass" as "someClass"',  string: 'SomeClass',  expected: 'someClass' },
            { it: 'should format "someClass" as "someClass"',  string: 'someClass',  expected: 'someClass' },
            { it: 'should format "some class" as "someClass"', string: 'some class', expected: 'someClass' },
            { it: 'should format "Some Class" as "someClass"', string: 'Some Class', expected: 'someClass' },
            { it: 'should format "some Class" as "someClass"', string: 'some Class', expected: 'someClass' },
            { it: 'should format "Some class" as "someClass"', string: 'Some class', expected: 'someClass' },
            { it: 'should format "Some/Class" as "someClass"', string: 'Some/Class', expected: 'someClass' },

            { it: 'should format "SomeOtherClass" as "someOtherClass"',   string: 'SomeOtherClass',   expected: 'someOtherClass'},
            { it: 'should format "someOtherClass" as "someOtherClass"',   string: 'someOtherClass',   expected: 'someOtherClass'},
            { it: 'should format "some other class" as "someOtherClass"', string: 'some other class', expected: 'someOtherClass'},
            { it: 'should format "Some Other Class" as "someOtherClass"', string: 'Some Other Class', expected: 'someOtherClass'},
            { it: 'should format "some other Class" as "someOtherClass"', string: 'some other Class', expected: 'someOtherClass'},
            { it: 'should format "Some Other class" as "someOtherClass"', string: 'Some Other class', expected: 'someOtherClass'},
            { it: 'should format "Some/Other/Class" as "someOtherClass"', string: 'Some/Other/Class', expected: 'someOtherClass'}
        ];

        scenarios.forEach(function (scenario) {

            it(scenario.it, inject(function (stringToCamelCase) {
                expect(stringToCamelCase(scenario.string)).toBe(scenario.expected);
            }));
        });

    });

});