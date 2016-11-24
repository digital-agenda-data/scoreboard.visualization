/*global App, _, chroma, Kartograph */
/*jshint sub:true */

(function ($) {
    'use strict';

    App.chart_library['map'] = function (view, options) {
        var container = view.el;
        var map_div = $('<div/>').addClass('map-chart').addClass('col-lg-12');
        $(container).append(map_div);

        var series = App.format_series(
            options['series'],
            options['sort'],
            options['multidim'],
            options['category_facet'],
            options['highlights']
        );

        var metadata = {
            'chart-title': options.titles.title,
            'chart-subtitle': options.titles.subtitle,
            'chart-xAxisTitle': options.titles.xAxisTitle,
            'chart-yAxisTitle': options.titles.yAxisTitle,
            'source-dataset': options.credits.text,
            'chart-url': document.URL,
            'filters-applied': _(this.model.attributes).pairs()
        };
        var title = options.titles.title;
        var unit = options['meta_data']['unit-measure'];
        var chartMap = new Highcharts.Map(map_div[0], {
            chart: {
                animation: options['animation'],
                height: 800,
                style: {}
            },
            title: {
                text: title
            },
            legend: {
                title: {
                    text: unit && unit.short_label || '',
                    style: {
                        position: 'absolute',
                        transform: 'rotate(-90deg) translate(-150%, -100%)',
                        'font-family': 'Segoe UI, Verdana, Arial, sans-serif',
                    }
                },
                enabled: true,
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'middle'
            },
            mapNavigation: {
                enabled: true
            },
            tooltip: {
                useHTML: true
            },
            colorAxis: {
                tickPixelInterval: 40,
                stops: [
                    [0, '#edf8fb'],
                    [0.05, '#ccece6'],
                    [0.1, '#99d8c9'],
                    [0.2, '#66c2a4'],
                    [0.3, '#41ae76'],
                    [0.5, '#238b45'],
                    [0.8, '#005824'],
                    [1, '#000000']
                ]
            },
            series: [{
                name: title,
                joinBy: ['CNTR_ID', 'code'],
                data: series[0].data,
                mapData: options.jsonmaps['europe'],
                tooltip: {
                    headerFormat: '',
                    pointFormatter: function() {
                        // this ptr bound to point
                        var country_name = this.options.code === 'MK' ? "Macedonia, FYR" : this.options.name;
                        var unit_name = unit && unit.short_label || '';
                        var value_text = App.round(this.value, 3) + ' ' + unit_name;
                        var html = '<span><b>' + country_name + '</b>: <br/>' + value_text + '<br/></span>';
                        return html;
                    }
                }
            }]
        });
        App.chart = chartMap;
        view.trigger('chart_ready', series, metadata);
    }
})(App.jQuery);