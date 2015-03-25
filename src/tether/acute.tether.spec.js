describe('acute.tether', function () {

    'use strict';

    beforeEach(function () {
        module('acute.tether');

        mockModule('$window', { Tether: sinon.stub() });
    });

    it('should create a tether object from config', inject(function ($window, $tether) {

        $tether({ some: 'config' });

        expect($window.Tether).toHaveBeenCalledWith({ some: 'config' });
    }));

});