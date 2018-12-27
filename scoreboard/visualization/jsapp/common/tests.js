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
        expect(App.round(22700001, 3)).to.equal('22700001');
        expect(App.round(22750000, 3)).to.equal('22750000');
    });

});

describe('Plot helper functions', function() {
    "use strict";

    it('should plot', function() {
        var plot_store = null;
        var plot_mock = function(obj) {
            plot_store = obj;
        };
        var chart = {
            xAxis: [
                {junk: 1},
                {
                    xOrY: 'xx',
                    addPlotLine: plot_mock,
                    removePlotLine: function(){},
                }
                ],
            yAxis: [
                {junk: 1},
                {
                    xOrY: 'xx',
                    addPlotLine: plot_mock,
                    removePlotLine: function(){},
                }
                ]
        };
        var series = [];
        var chart_type = {xx: 1};
        App.add_plotLines(chart, series, chart_type);
        expect(plot_store).to.have.property('width').that.is.equal(2);
        expect(plot_store).to.have.property('value').that.is.equal(0);
    });
});

describe('Series helper functions', function() {
   it('should run format_series with total_stacked', function() {
       var
           data = {},
           sort = {total_stacked: true},
           multidim = 1,
           category = 'x',
           highlights = 1,
           animation = false,
           series_point_label = 'point label',
           ignore_percents = false;
       var expected_series = [];

       formated_series = App.format_series(data, sort, multidim, category, highlights, animation, series_point_label, ignore_percents);
       expect(formated_series).to.be.instanceOf(Array);
       expect(formated_series).to.eql(expected_series);
   });
});
