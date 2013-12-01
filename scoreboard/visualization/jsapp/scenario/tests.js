/*global App, Backbone, describe, beforeEach, afterEach, it, expect, sinon */
/*jshint sub:true */

describe('ChartSeriesPreparation', function() {
    "use strict";

    describe('Case: multidimension', function(){

        it('should append missing series', function(){
            var series = [
                {data: [
                        {
                            "ref-area": {
                                "notation": "BE",
                                "label": "Belgium",
                            },
                            "value": 0.3
                        },
                       ],
                 label:'Belgium'},
                {data: [
                        {
                            "ref-area": {
                                "notation": "AT",
                                "label": "Austria",
                            },
                            "value": 0.4808
                        },

                       ],
                 label:'Austria'},
            ];

            var result = App.format_series(series, null, 2, null, 'ref-area');
            expect(result[0][0].name).to.equal('Austria');
            expect(result[0][0].data.length).to.equal(1);
        })

        it('should sort series by label', function(){
            var series = [
                {data: [
                        {
                            "ref-area": {
                                "notation": "BE",
                                "label": "Belgium",
                            },
                            "value": 0.3
                        },
                       ],
                 label:'Belgium'},
                {data: [
                        {
                            "ref-area": {
                                "notation": "AT",
                                "label": "Austria",
                            },
                            "value": 0.4808
                        },

                       ],
                 label:'Austria'},
            ];
            var result = App.format_series(series, null, 2, null, 'ref-area');
            expect(result.length).to.equal(2);
            expect(result[0].length).to.equal(2);
            expect(result[1].length).to.equal(2);
            expect(result[0][0]['name']).equal('Austria');
        });
    });

    it('should return an array of snapshots', function(){
        var series = [
            {data: [],
             label:'2000'},
            {data: [{
                        "ref-area": {
                            "notation": "AT",
                            "label": "Austria",
                            "short-label": "AT",
                            "inner_order": null,
                            "ending_label": "Austria"
                        },
                        "value": 0.4808
                    }],
             label:'2001'},
        ];
        var result = App.format_series(series, null, null, null, 'ref-area');
        expect(result.length).to.equal(2);
        expect(result[1]['data']).to.deep.equal([{
            'name': 'Austria',
            'ending_label': 'Austria',
            'code': 'AT',
            'color': null,
            'order': null,
            'attributes': _(series[1]['data'][0]).omit('value'),
            'y': 0.4808
        }]);
    });

    it('should retain the first serie order when specified', function(){
        var series = [
            {data: [
                    {
                        "ref-area": {
                            "notation": "AT",
                            "label": "Austria",
                        },
                        "value": 2
                    },
                    {
                        "ref-area": {
                            "notation": "BE",
                            "label": "Belgium",
                        },
                        "value": 1
                    }

                   ],
             label:'2000'},
            {data: [
                    {
                        "ref-area": {
                            "notation": "BE",
                            "label": "Belgium",
                        },
                        "value": 2
                    },
                    {
                        "ref-area": {
                            "notation": "AT",
                            "label": "Austria",
                        },
                        "value": 1
                    },

                   ],
             label:'2001'},
        ];

        var sort = _.object(["by", "order", "each_series"],
                            ['value', 1, false]);
        var result = App.format_series(series, sort, null, null, 'ref-area');
        expect(_(result[0].data).pluck('code')).to.deep.equal(['BE', 'AT']);
        expect(_(result[1].data).pluck('code')).to.deep.equal(['BE', 'AT']);

        var sort = _.object(["by", "order", "each_series"],
                            ['value', 1, true]);
        var result = App.format_series(series, sort, null, null, 'ref-area');
        expect(_(result[0].data).pluck('code')).to.deep.equal(['BE', 'AT']);
        expect(_(result[1].data).pluck('code')).to.deep.equal(['AT', 'BE']);

        var sort = _.object(["by", "order", "each_series"],
                            ['category', 1, false]);
        var result = App.format_series(series, sort, null, null, 'ref-area');
        expect(_(result[0].data).pluck('code')).to.deep.equal(['AT', 'BE']);
        expect(_(result[1].data).pluck('code')).to.deep.equal(['AT', 'BE']);

        var sort = _.object(["by", "order", "each_series"],
                            ['category', 1, true]);
        var result = App.format_series(series, sort, null, null, 'ref-area');
        expect(_(result[0].data).pluck('code')).to.deep.equal(['AT', 'BE']);
        expect(_(result[1].data).pluck('code')).to.deep.equal(['AT', 'BE']);
    });

    it('should sort the data in snapshots by category', function(){
        var series = [
            {data: [
                    {
                        "ref-area": {
                            "notation": "BE",
                            "label": "Belgium",
                        },
                        "value": 0.3
                    },
                    {
                        "ref-area": {
                            "notation": "BG",
                            "label": "Bulgaria",
                        },
                        "value": 0.4
                    },

                   ],
             label:'2000'},
            {data: [
                    {
                        "ref-area": {
                            "notation": "BE",
                            "label": "Belgium",
                        },
                        "value": 0.4808
                    },
                    {
                        "ref-area": {
                            "notation": "AT",
                            "label": "Austria",
                        },
                        "value": 0.4808
                    },

                   ],
             label:'2001'},
        ];
        var sort = _.object(["by", "order"],['category', 1]);
        var result = App.format_series(series, sort, null, null, 'ref-area');
        expect(result.length).to.equal(2);
        expect(result[0]['data'][0]['name']).equal('Austria');
    });

    /*it('should sort the series by category', function(){
        var series = [
            {data: [],
             label:'2001'},
            {data: [{
                        "ref-area": {
                            "notation": "AT",
                            "label": "Austria",
                            "ending_label": "Austria",
                            "inner_order": null
                        },
                        "value": 0.4808
                    }],
             label:'2000'},
        ];
        var result = App.format_series(series, null, null, null, 'ref-area');
        expect(_(result).pluck('name')).to.deep.equal(['2000', '2001']);
        expect(result[0]['data']).to.deep.equal([{
            "name": "Austria",
            "ending_label": "Austria",
            'code': 'AT',
            'color': null,
            'order': null,
            'attributes': _(series[1]['data'][0]).omit('value'),
            "y": 0.4808
        }]);
    });*/

    it('should append missing series points with null y values', function(){
        var series = [
            {data: [
                    { "ref-area": {
                          "notation": "DK",
                          "label": "Denmark",
                      },
                      "value": 0.4808
                    },
                    { "ref-area": {
                          "notation": "AT",
                          "label": "Austria",
                      },
                      "value": 0.4808
                    },
                   ],
             label:'2000'},
            {data: [
                    { "ref-area": {
                          "notation": "DK",
                          "label": "Denmark",
                      },
                      "value": 0.4808
                    }
                   ],
             label:'2001'},
            {data: [
                    { "ref-area": {
                          "notation": "DK",
                          "label": "Denmark",
                      },
                      "value": 0.4808
                    },
                    { "ref-area": {
                          "notation": "AT",
                          "label": "Austria",
                      },
                      "value": 0.4808
                    },
                   ],
             label:'2002'}
        ];
        var sort = _.object(["by", "order"],['category', 1]);
        var result = App.format_series(series, sort, null, null, 'ref-area');
        expect(_(_(result).pluck('data')[1]).pluck('y')).to.deep.equal([
            null, 0.4808]);
    })

    it('should return an array of data for each year', function(){
        var series = [
            {data: [],
             label:'2003'},
            {data: [{ "ref-area": {
                          "notation": "AT",
                          "label": "Austria",
                          "ending_label": "AT",
                          "inner_order": 1234
                      },
                        "value": 0.4808
                    }],
             label:'2001'},
        ];
        var result = App.format_series(series, null, null, null, 'ref-area');
        var attributes = _(series[1]['data'][0]).omit('value');
        expect(_(result).pluck('data')).to.deep.equal([
            [{ 'name': 'Austria',
               'ending_label': 'AT',
               'code': 'AT',
               'order': 1234,
               'attributes': attributes,
               'y': null}],
            [{ 'name': 'Austria',
               'ending_label': 'AT',
               'code': 'AT',
               'color': null,
               'order': 1234,
               'attributes': attributes,
               'y': 0.4808}]
        ]);
    });

    it('should multiply the values with 100 when unit is %', function(){
        var series = [
            {data: [{ "ref-area": {
                          "notation": "AT",
                          "label": "Austria",
                      },
                        "value": 0.4808
                    }],
             label:'2001'},
        ];
        var result = App.format_series(series, false, 1, [true], "ref-area");
        expect(result[0]['data'][0]['y']).to.deep.equal(48.08);

        var series = [
            {data: [{ "ref-area": {
                          "notation": "AT",
                          "label": "Austria",
                      },
                        "value": {
                            x: 0.4808,
                            y: 0.4808,
                            z: 0.4808
                        }
                    }],
             label:'2001'},
        ];
        var result = App.format_series(series, false, 3, [true, true, false], "ref-area");
        expect(result[0][0]['data'][0]['x']).to.deep.equal(48.08);
        expect(result[0][0]['data'][0]['y']).to.deep.equal(48.08);
        expect(result[0][0]['data'][0]['z']).to.deep.equal(0.4808);
    });

    it('should compute the values for plot lines (single dimension)', function(){
        // EVEN SERIES
        var series = [
            {data:
                [
                 { 'name': 'Austria',
                   'code': 'AT',
                   'y': 1},
                 { 'name': 'Belgium',
                   'code': 'BE',
                   'y': 0}],
             name: 'serie_name'
            }
        ];
        var chart_type = {x: 'categories', y: 'values'};
        var x_plotline = App.compute_plotLines('x', series, chart_type['x']);
        expect(x_plotline).to.equal(1);
        var y_plotline = App.compute_plotLines('y', series, chart_type['y']);
        expect(y_plotline).to.equal(0.5);

        // ODD SERIES
        _(series[0]['data']).push(
         { 'name': 'Bulgaria',
           'code': 'BG',
           'y': 2});
        var chart_type = {x: 'categories', y: 'values'};
        var x_plotlines = App.add_plotLines('x', series, chart_type['x']);
        expect(x_plotline).to.equal(1);
    });

    it('should compute the values for plot lines (two dimensions)', function(){
        // EVEN SERIES
        var series = [
         { 'name': 'Austria',
           'data': [
              {
                'name': 'AS',
                'x': 1,
                'y': 1
              }
            ]
         },
         { 'name': 'Belgium',
           'data': [
              {
                'name': 'BE',
                'x': 2,
                'y': 2
              }
            ]
         },
        ]
        var chartOptions = {
            xAxis: {
            },
            yAxis: {
            }
        }
        var chart_type = {x: 'values', y: 'values'};
        var x_plotline = App.compute_plotLines('x', series, chart_type['x']);
        expect(x_plotline).to.equal(1.5);
        // ODD SERIES
        _(series).push(
         { 'name': 'Bulgaria',
           'data': [
              {
                'name': 'BG',
                'x': 3,
                'y': 3
              }
            ]
         });
        var chart_type = {x: 'values', y: 'values'};
        var x_plotline = App.compute_plotLines('x', series, chart_type['x']);
        expect(x_plotline).to.equal(2);
        var y_plotline = App.compute_plotLines('y', series, chart_type['y']);
        expect(y_plotline).to.equal(2);

        var chartOptions = {
            xAxis: {
            },
            yAxis: {
            }
        }

        var chart_type = {x: 'values'};
        var x_plotline = App.compute_plotLines('x', series, chart_type['x']);
        expect(x_plotline).to.equal(2);
        var y_plotline = App.compute_plotLines('y', series, chart_type['y']);
        expect(y_plotline).to.equal(2);
    });
});

describe('ScenarioChartViewParameters', function() {
    "use strict";

    beforeEach(function() {
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeServer();
        this.model = new Backbone.Model();
        this.scenario_chart = new sinon.spy();
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    it('should add a legend', function() {
        var chartOptions = {
            xAxis: {},
            legend: {
                enabled: true
            }
        }
        var options_legend_off = {
            'series-legend-label' : 'none'
        }
        var options_legend_on = {
            'series-legend-label' : 'label'
        }
        App.disable_legend(chartOptions);
        expect(chartOptions.legend.enabled).to.equal(true);
        App.disable_legend(chartOptions, options_legend_on);
        expect(chartOptions.legend.enabled).to.equal(true);
        App.disable_legend(chartOptions, options_legend_off);
        expect(chartOptions.legend.enabled).to.equal(false);
    });

    it('should build dimensions_mapping from received facets schema',
       function() {
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: {},
            scenario_chart: this.scenario_chart,
            filters_schema: [{name: 'indicator', dimension: 'dim1'}]
        });
        expect(chart.dimensions_mapping).to.deep.equal(
            _.object(
                ['indicator'],
                ['dim1'])
        );
    });

    it('should request labels for the right dimension', function(){
        var server = this.sandbox.server;
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: {
                facets: [{name: 'filter1', dimension: 'dim1', label:'Indicator'}],
                labels: {title: {facet: 'filter1'}}
            },
            scenario_chart: this.scenario_chart,
            filters_schema: [{name: 'filter1', dimension: 'dim1'}]
        });
        chart.model.set({'filter1': 'dim1'});
        App.respond_json(server.requests[0], {'datapoints': []});
        var url = server.requests[1].url;
        expect(url).to.have.string('dimension=dim1');
        expect(url).to.have.string('value=dim1');
    });

    it('should render the chart passed as parameter', function() {
        var server = this.sandbox.server;
        var scenario_chart = sinon.spy();
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: {
                facets: []
            },
            scenario_chart: scenario_chart
        });
        App.respond_json(server.requests[0], {'datapoints': []});
        expect(scenario_chart.calledOnce).to.equal(true);
    });

    it('should fetch labels according to init params', function() {
        var server = this.sandbox.server;
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: {
                facets: [{name: 'indicator', dimension: 'dim1', label:'Indicator'}],
                labels: {
                    label1: {facet: 'indicator'},
                    label2: {facet: 'indicator'},
                    label3: {facet: 'indicator'}
                }
            },
            scenario_chart: this.scenario_chart
        });
        App.respond_json(server.requests[0], {'datapoints': []});
        var label_resp = {'label': 'normal_label', 'short_label': 'short_label'};
        App.respond_json(server.requests[1], label_resp);
        App.respond_json(server.requests[2], label_resp);
        App.respond_json(server.requests[3], label_resp);
        expect(chart.data.meta_data.label1).to.deep.equal(label_resp);
        expect(chart.data.meta_data.label2).to.deep.equal(label_resp);
        expect(chart.data.meta_data.label3).to.deep.equal(label_resp);
    });


    it('should fetch labels from the right url according to schema.multidim', function() {
        var server = this.sandbox.server;
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: {
                facets: [{name: 'indicator', dimension: 'dim1', label:'Indicator'}],
                multiple_series: 'country',
                labels: {label1: {facet: 'indicator', field: 'label'}},
                multidim: 1
            },
            filters_schema: [
                {type: 'select',
                 name: 'indicator',
                 label: 'Select one indicator',
                 dimension: 'indicator',
                 constraints: { }
                }
            ],
            values_schema: [
                 {type: 'all-values', dimension: 'dimension1'},
                 {type: 'all-values', dimension: 'value1'}
            ],
            scenario_chart: this.scenario_chart
        });
        this.model.set({
            'indicator': 'ind1'
        });
        var url = server.requests[0].url;
        expect(url.indexOf('dimension_options_x?')).to.not.eql(-1);
        chart.schema.multidim = 2;
        chart.load_chart();
        var url = server.requests[2].url;
        expect(url.indexOf('dimension_options_xy?')).to.not.eql(-1);
        chart.schema.multidim = 3;
        chart.load_chart();
        var url = server.requests[4].url;
        expect(url.indexOf('dimension_options_xyz?')).to.not.eql(-1);
    });


    it('should fetch data using init facet dimensions', function() {
        var server = this.sandbox.server;
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: {
                multiple_series: 'country',
                labels: {label1: {facet: 'indicator', field: 'label'}}
            },
            filters_schema: [
                {type: 'select',
                 name: 'indicator',
                 label: 'Select one indicator',
                 dimension: 'indicator',
                 constraints: { }
                },
                {type: 'select',
                 name: 'country',
                 label: 'Select one indicator',
                 dimension: 'ref-area',
                 constraints: {
                     'indicator': 'indicator'
                 }},
            ],
            values_schema: [
                 {type: 'all-values', dimension: 'dimension1'},
                 {type: 'all-values', dimension: 'value1'}
            ],
            scenario_chart: this.scenario_chart
        });
        this.model.set({
            'indicator': 'ind1',
            'country': ['BE']
        });
        var url = server.requests[0].url;
        var url_param = App.testing.url_param;
        expect(url_param(url, 'indicator')).to.equal('ind1');
        expect(url_param(url, 'ref-area')).to.equal('BE');
    });


    it('should detect percent units of measure', function() {
        var server = this.sandbox.server;
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: {
                multidim: 3,
                facets: [{name: 'indicator', dimension: 'dim1', label:'Indicator'}],
                labels: {label1: {facet: 'indicator', field: 'label'}}
            },
            filters_schema: [
                {type: 'select',
                 name: 'indicator',
                 label: 'Select one indicator',
                 dimension: 'indicator',
                 constraints: { }
                },
                {type: 'select',
                 name: 'x-unit-measure',
                 label: 'Select one indicator',
                 dimension: 'unit-measure',
                 constraints: {
                     'indicator': 'indicator'
                 }},
                {type: 'select',
                 name: 'y-unit-measure',
                 label: 'Select one indicator',
                 dimension: 'unit-measure',
                 constraints: {
                     'indicator': 'indicator'
                 }},
                {type: 'select',
                 name: 'z-unit-measure',
                 label: 'Select one indicator',
                 dimension: 'unit-measure',
                 constraints: {
                     'indicator': 'indicator'
                 }},
            ],
            values_schema: [
                 {type: 'all-values', dimension: 'dimension1'},
                 {type: 'all-values', dimension: 'value1'}
            ],
            scenario_chart: this.scenario_chart
        });
        this.model.set({
            'indicator': 'ind1',
            'x-unit-measure': 'pc_unit',
            'y-unit-measure': 'pcunit',
            'z-unit-measure': 'pc__abc',
        });
        App.respond_json(server.requests[0], {'datapoints': []});
        App.respond_json(server.requests[1], {});
        expect(this.scenario_chart.args[0][1].unit_is_pc).to.deep.equal(
                [true, false, true]);
    });


    it('should fetch all series from an AllValuesFilter', function() {
        var loadstate = new Backbone.Model();
        var filter = new App.AllValuesFilter({
            model: this.model,
            loadstate: loadstate,
            type: 'all-values',
            dimension: 'ref-area',
            name: 'ref-area'
        });
        var chart = new App.ScenarioChartView({
            model: this.model,
            loadstate: loadstate,
            schema: {
                multiple_series: 'ref-area'
            },
            scenario_chart: this.scenario_chart,
            filters_schema: [
                {type: 'all-values', dimension: 'ref-area', name: 'ref-area'}
            ],
            values_schema: [
                {type: 'all-values', dimension: 'value'}
            ]
        });
        var country_options = [{'notation': 'area1'}, {'notation': 'area2'}];
        var url_param = App.testing.url_param;
        var requests = this.sandbox.server.requests;
        expect(requests[0].url).to.have.string('/dimension_options?');
        expect(url_param(requests[0].url, 'dimension')).to.equal('ref-area');
        App.respond_json(requests[0], {'options': country_options});
        expect(url_param(requests[1].url, 'ref-area')).to.equal('area1');
        expect(url_param(requests[2].url, 'ref-area')).to.equal('area2');
    });

    it('should ignore specified values for an AllValuesFilter', function() {
        var loadstate = new Backbone.Model();
        var filter = new App.AllValuesFilter({
            model: this.model,
            loadstate: loadstate,
            type: 'all-values',
            dimension: 'ref-area',
            name: 'ref-area',
            ignore_values: ['area2']
        });
        var chart = new App.ScenarioChartView({
            model: this.model,
            loadstate: loadstate,
            schema: {
                multiple_series: 'ref-area'
            },
            scenario_chart: this.scenario_chart,
            filters_schema: [
                {type: 'all-values', dimension: 'ref-area', name: 'ref-area'}
            ],
            values_schema: [
                {type: 'all-values', dimension: 'value'}
            ]
        });
        var country_options = [{'notation': 'area1'}, {'notation': 'area2'}];
        var url_param = App.testing.url_param;
        var requests = this.sandbox.server.requests;
        App.respond_json(requests[0], {'options': country_options});
        expect(this.model.get('ref-area')).to.deep.equal(['area1']);
    });

});


describe('ScenarioChartView', function() {
    "use strict";

    beforeEach(function() {
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeServer();
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    function setup_scenario() {
        this.scenario_chart = this.sandbox.spy();

        this.model = new Backbone.Model();
        this.chart = new App.ScenarioChartView({
            model: this.model,
            schema: {
                facets: [{name: 'time-period', dimension: 'dim1', label:'period'}],
                labels: {extra_label: {facet: 'time-period', field: 'label'}}
            },
            filters_schema: [
                {name: 'indicator',
                 label: 'Select indicator',
                 dimension: 'dim1',
                },
                {name: 'unit-measure',
                 label: 'Select unit of measure',
                 dimension: 'dim2',
                },
                {name: 'time-period',
                 label: 'Select period',
                 dimension: 'dim3',
                }
            ],
            values_schema: [
                {type: 'all-values', dimension: 'ref-area'},
                {type: 'all-values', dimension: 'value'}
            ],
            scenario_chart: this.scenario_chart
        });
        this.model.set({
            'indicator-group': 'qq',
            'indicator': 'asdf',
            'time-period': '2002',
            'breakdown-group': 'total',
            'breakdown': 'ind_total',
            'unit-measure': 'pc_ind'
        });
    }

    it('should update year text according to selection', function(){
        setup_scenario.apply(this);
        var server = this.sandbox.server;
        this.model.set({'time-period': '2003'});
        App.respond_json(server.requests[2], {'datapoints': []});
        App.respond_json(server.requests[3],
            {'label': 'Year 2003', 'short_label': 'lbl 2'});
        expect(this.scenario_chart.calledOnce).to.equal(true);
        expect(this.chart.data.meta_data['extra_label']).to.deep.equal(
            {'label': 'Year 2003', 'short_label': 'lbl 2'});
    });

    it('should fetch data from server', function() {
        setup_scenario.apply(this);
        var server = this.sandbox.server;
        var url = server.requests[0].url;
        expect(url).to.have.string(App.URL + '/datapoints?');
        var url_param = App.testing.url_param;
        expect(url_param(url, 'indicator')).to.equal('asdf');
        expect(url_param(url, 'time-period')).to.equal('2002');
    });

    it('should render chart with the data received', function() {
        setup_scenario.apply(this);
        var server = this.sandbox.server;
        var ajax_data = [{'ref-area': {'notation': 'AU', 'label': "Austria"}, 'value': 0.18},
                         {'ref-area': {'notation': 'BE', 'label': "Belgium"}, 'value': 0.14}];

        App.respond_json(server.requests[0], {'datapoints': ajax_data});
        App.respond_json(server.requests[1],
            {'label': 'request 2', 'short_label': 'lbl 2'});
        expect(this.scenario_chart.calledOnce).to.equal(true);
        var call_args = this.scenario_chart.getCall(0).args;
        expect(call_args[0]).to.equal(this.chart);
        expect(call_args[1]['series'][0]['data']).to.deep.equal(ajax_data);
    });

    it('should make a single data query and then filter in JS', function() {
        var scenario_chart = sinon.spy();
        var model = new Backbone.Model();
        var chart = new App.ScenarioChartView({
            model: model,
            schema: {category_facet: 'filter3'},
            scenario_chart: scenario_chart,
            filters_schema: [
                {name: 'filter1', dimension: 'dim1'},
                {name: 'filter2', dimension: 'dim2'},
                {name: 'filter3', dimension: 'dim3'}
            ],
            values_schema: [
                {type: 'all-values', dimension: 'dim4'}
            ]
        });
        model.set({'filter1': 'f1v',
                   'filter2': 'f2v',
                   'filter3': ['f3a', 'f3c']});

        var requests = this.sandbox.server.requests;
        var url0 = requests[0].url;
        expect(requests.length).to.equal(1);
        expect(url0).to.have.string('/datapoints?');
        expect(App.testing.url_param(url0, 'dim3')).to.equal(null);

        App.respond_json(requests[0], {datapoints: [
            {dim3: {'notation': 'f3a', lbl: 'a'}, value: 13},
            {dim3: {'notation': 'f3b', lbl: 'b'}, value: 22},
            {dim3: {'notation': 'f3c', lbl: 'c'}, value: 10}
        ]});

        var series = scenario_chart.getCall(0).args[1]['series'];
        expect(series.length).to.equal(1);
        expect(series[0]['data'][0]['value']).to.equal(13);
        expect(series[0]['data'][1]['value']).to.equal(10);
        expect(series[0]['data'].length).to.equal(2);
    });

    describe('title formatter', function() {
        it('should avoid sticking parts together', function() {
            var parts = [
                {facet_name: 'ind', prefix: null, format: "short_label"},
                {facet_name: 'brk', format: "label"}
            ];
            var meta_data = {
                ind: {'label': 'label1', 'short_label': 'short1'},
                brk: {'label': 'label2', 'short_label': 'short2'},
            }
            var title = App.title_formatter(parts, meta_data);
            expect(title).to.equal('short1 label2');
        });

        it('should allow prefix and suffix for the first title part', function() {
            var parts = [
                {facet_name: 'ind', prefix: '(', suffix: ')', format: "short_label"},
            ];
            var meta_data = {
                ind: {'label': 'label1', 'short_label': 'short1'}
            }
            var title = App.title_formatter(parts, meta_data);
            expect(title).to.equal('(short1)');
        });

        it('should use the specified prefix', function() {
            var parts = [
                {facet_name: 'ind', format: 'label'},
                {prefix: '-', facet_name: 'brk', format: 'label'}
            ];
            var meta_data = {
                ind: {'label': 'label1', 'short_label': 'short1'},
                brk: {'label': 'label2', 'short_label': 'short2'},
            }
            var title = App.title_formatter(parts, meta_data);
            expect(title).to.equal('label1-label2');
        });

        it('should use the specified suffix', function() {
            var parts = [
                {facet_name: 'ind', format: 'label'},
                {suffix: '-', facet_name: 'brk', format: 'label'}
            ];
            var meta_data = {
                ind: {'label': 'label1', 'short_label': 'short1'},
                brk: {'label': 'label2', 'short_label': 'short2'},
            }
            var title = App.title_formatter(parts, meta_data);
            expect(title).to.equal('label1 label2-');
        });

        it('should ignore "Total" with prefix', function() {
            var parts = [
                {facet_name: 'ind', format: 'short_label'},
                {prefix: '-', facet_name: 'brk'}
            ];
            var meta_data = {
                ind: {'label': 'label1', 'short_label': 'short1'},
                brk: {'label': 'label2', 'short_label': 'short2'},
            }
            var title = App.title_formatter(parts, meta_data);
            expect(title).to.equal('short1');
        });

        it('should ignore "Total" without prefix', function() {
            var parts = [
                {facet_name: 'ind', format: 'short_label'},
                {facet_name: 'brk'}
            ];
            var meta_data = {
                ind: {'label': 'label1', 'short_label': 'short1'},
                brk: {'label': 'label2', 'short_label': 'short2'},
            }
            var title = App.title_formatter(parts, meta_data);
            expect(title).to.equal('short1');
        });
    })
});


describe('AnnotationsView', function() {
    "use strict";

    beforeEach(function() {
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeServer();
        this.model = new Backbone.Model();
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    it('should request meta data according to init params', function(){
        this.model.set({
            'indicator': 'ind1',
            'unit-measure': 'unit1'
        });
        var server = this.sandbox.server;
        var view = new App.AnnotationsView({
            cube_url: App.URL,
            data_revision: 'one',
            model: this.model,
            field: 'indicator',
            schema: {
                facets: [{name: 'indicator', dimension: 'dim1', label:'Indicator'},
                         {name: 'unit-measure', dimension: 'dim2', label: 'Unit of measure'}],
                annotations: {
                    source: '/test_view',
                    filters: [{name: 'unit-measure', part: 'note'},
                              {name: 'indicator', part: 'label'} ]
                }
            }
        });

        var template = this.sandbox.spy(view, 'template');

        var data_unit = {
          "definition": "definition",
          "label": "label_unit",
          "note": "note",
          "short_label": "short_label"
        }
        App.respond_json(server.requests[0], data_unit);

        var data_indicator = {
            definition: "definition",
            note: "note",
            short_label: "short label",
            source_definition: "source definition",
            source_label: "source label",
            source_notes: "source notes",
            source_url: "http://source/url/"
        };
        App.respond_json(server.requests[1], data_indicator);

        _(data_indicator).extend({
            filter_name: "indicator",
            filter_label: "Indicator",
        });

        _(data_unit).extend({
            "filter_name": "unit-measure",
            "filter_label": "Unit of measure",
        });

        var data = {'blocks': [data_unit, data_indicator]}
        expect(template.calledOnce).to.equal(true);
        expect(template.getCall(0).args[0]['blocks']).to.deep.equal(data['blocks']);
    });

    it('should render the template with the right metadata', function(){
        this.model.set({
            'indicator': 'ind1',
            'abc': 'unit1'
        });
        var server = this.sandbox.server;
        var view = new App.AnnotationsView({
            cube_url: App.URL,
            model: this.model,
            schema: {
                facets: [{name: 'indicator', dimension: 'dim1', label:"label1"},
                         {name: 'abc', dimension: 'dim2', label:"label2"}],
                annotations: {
                        source: '/test_view',
                        filters: [{name: 'indicator', part: 'label'},
                                  {name: 'abc', part: 'label'}]
                }
            }
        });

        var template = this.sandbox.spy(view, 'template');

        var data_1 = {
          "title": "Label of x-axis",
          "definition": "definition",
          "label": "label_1",
          "note": "note",
          "short_label": "short_label"
        };

        var data_2 = {
          "title": "Label of y-axis",
          "definition": "definition",
          "label": "label_2",
          "note": "note",
          "short_label": "short_label"
        };

        App.respond_json(server.requests[0], data_1);
        App.respond_json(server.requests[1], data_2);

        _(data_1).extend({
          "filter_name": "indicator",
          "filter_label": "label1"
        })

        _(data_2).extend({
          "filter_name": "abc",
          "filter_label": "label2"
        })

        var data = {'blocks': [data_1, data_2]};

        expect(template.calledOnce).to.equal(true);
        expect(template.getCall(0).args[0]['blocks']).to.deep.equal(data['blocks']);
    });

});
