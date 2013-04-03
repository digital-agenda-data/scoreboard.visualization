/*global App, Backbone, describe, beforeEach, afterEach, it, expect, sinon */

describe('Float rounder', function() {
    "use strict";

    it('should round tiny values to 4 decimals', function() {
        expect(App.round(0.01234567, 3)).to.equal('0.0123');
        expect(App.round(0.02345678, 3)).to.equal('0.0235');
        expect(App.round(0.03456789, 3)).to.equal('0.0346');
        expect(App.round(0.04000000, 3)).to.equal('0.04');
    });

    it('should round small values to 2 decimals', function() {
        expect(App.round(1.234567, 3)).to.equal('1.23');
        expect(App.round(2.345678, 3)).to.equal('2.35');
        expect(App.round(3.456789, 3)).to.equal('3.46');
        expect(App.round(4.000000, 3)).to.equal('4');
    });

    it('should round large values to 0 decimals', function() {
        expect(App.round(123.4567, 3)).to.equal('123');
        expect(App.round(234.5678, 3)).to.equal('235');
        expect(App.round(345.6789, 3)).to.equal('346');
        expect(App.round(400.0000, 3)).to.equal('400');
    });

});


describe('ChartRouter encoding and decoding', function() {
    "use strict";

    function transmit(value) {
        var router = new App.ChartRouter(new Backbone.Model());
        return router.decode(router.encode(value));
    }

    it('should transmit an empty dict', function() {
        var value = {};
        expect(transmit(value)).to.deep.equal(value);
    });

    it('should transimt some string values', function() {
        var value = {a: 'b', c: 'd'};
        expect(transmit(value)).to.deep.equal(value);
    });

    it('should transmit lists', function() {
        var value = {a: [], b: ['1'], c: ['1', '2', '3']};
        expect(transmit(value)).to.deep.equal(value);
    });

    it('should transmit weird characters in the value', function() {
        var weird = '!@#$%^&*()-=<>,.:"?~`[]{}/|\\\'asdf';
        var value = {a: weird, b: [weird], c: [weird, weird]};
        expect(transmit(value)).to.deep.equal(value);
    });

    it('should return a blank object in case there is an error', function() {
        var router = new App.ChartRouter(new Backbone.Model());
        expect(router.decode('---')).to.deep.equal({});
    });

});
