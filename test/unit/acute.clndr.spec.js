'use strict';

describe('acute.clndr', function () {

    describe('clndrDirective', function () {

        var clndrStub, $clndr;

        beforeEach(module('acute.clndr'));

        beforeEach(function () {

            clndrStub = { setEvents: sinon.stub(), back: sinon.stub(), forward: sinon.stub() };

            mockModule('acuteClndrFactory', {
                create: sinon.stub().returns(clndrStub),
                getClndr: sinon.stub().returns(clndrStub)
            });
        });

        it('should update events when events change', inject(function () {

            $clndr = compileDirective('<acute-clndr clndr-events="events"></acute-clndr>', {$rootScope: {events: []}});

            $clndr.updateScope('events', ['bob']);

            expect(clndrStub.setEvents).toHaveBeenCalledWith(['bob']);

        }));

        it('should create transcluded scope including data from calendar', inject(function (acuteClndrFactory) {

            acuteClndrFactory.create
                .yields({ testData: 'test data' });

            $clndr = compileDirective('<acute-clndr events="events"><span>{{ testData }}</span></acute-clndr>');

            expect($clndr.find('span').text()).toBe('test data');

        }));

        it('should delegate back to clndr.back', inject(function () {

            var ctrl = compileController('AcuteClndrCtrl');

            ctrl.back();

            expect(clndrStub.back).toHaveBeenCalled();

        }));

        it('should delegate forward to clndr.forward', inject(function () {

            var ctrl = compileController('AcuteClndrCtrl');

            ctrl.forward();

            expect(clndrStub.forward).toHaveBeenCalled();

        }));

    });

});