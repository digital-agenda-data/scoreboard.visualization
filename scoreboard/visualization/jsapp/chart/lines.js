/*global App, _, Highcharts */
/*jshint sub:true */

(function() {
"use strict";


App.chart_library['lines'] = function(view, options) {

    var container = view.el
    $(container).addClass('high-chart');
    var series = App.format_series(
                    options['series'],
                    options['sort'],
                    options['multidim'],
                    options['unit_is_pc'],
                    options['category_facet'],
                    options['highlights']);
	_.map(series, function(elem) {
        var lastElem;
        _(elem.data).each(function(item){
            if (item.y) {
                lastElem = item;
            }
        });
        if (lastElem) {
            _(lastElem).extend({
                dataLabels: {
                  enabled: true,
                  crop: false,
                  x: 3,
                  align: 'left',
                  verticalAlign: 'middle',
                  formatter: function() {
                    if (options['series-ending-label'] == 'long') {
                        return this.series.options.ending_label;
                    } else if (options['series-ending-label'] == 'short') {
                        return this.series.options.notation;
                    }
                    return "";
                  }
                }
            });
        }
    });

    var yAxis = {
        min:0,
        max: options['unit_is_pc'][0]?100:null,
        title: {
            text: typeof(options.titles.yAxisTitle) == 'string'?options.titles.yAxisTitle:options.titles.yAxisTitle[0],
            style: {
                color: '#000000',
                fontWeight: 'bold'
            }
        },
        labels: {
            style: {
                color: '#000000'
            }
        }
    };
    
    if ( this.multiple_series == 2 ) {
        var yAxis = [yAxis];
        yAxis.push({
            min:0,
            max: options['unit_is_pc'][1]?100:null,
            opposite: true,
            title: {
                text: options.titles.yAxisTitle[1],
                //text: 'second series',
                style: {
                    color: '#000',
                    fontWeight: 'bold'
                }
            },
            labels: {
                style: {
                    color: '#000'
                }
            }
        });
        _(series).forEach(function(item, index) {
            item['yAxis'] = index;
        });
    }

    var chartOptions = {
        chart: {
            renderTo: container,
            type: 'spline',
            zoomType: 'y',
            marginLeft: 100,
            marginRight: 270,
            marginTop: 120,
            marginBottom: 50,
            height: 450,
            width: 1100
        },
        colors: App.SERIES_COLOR,
        credits: {
            href: options['credits']['href'],
            text: options['credits']['text'],
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -2
            }
        },
        title: {
            text: options.titles.title,
            align: "left",
            x: 40,
            y: 40,
            style: {
                color: '#000000',
                fontWeight: 'bold',
            }
        },
        subtitle: {
            text: options.titles.subtitle,
            align: "left",
            x: 40,
            y: 90,
            style: {
                color: '#000000',
                fontWeight: 'bold',
            }
        },
        xAxis: {
            type: 'datetime',
            maxZoom: 3600 * 24 * 1000 * 182,
            dateTimeLabelFormats: {
                month: '%Y-%m'
            },
            labels: {
                style: {
                    color: '#000000'
                }
             }
        },
        yAxis: yAxis,
        tooltip: {
            formatter: options['tooltip_formatter'],
            style: {
                width:400
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: 10,
            y: 80,
            borderWidth: 0,
            itemStyle: {
                width: 200
            }
        },
        plotOptions: {
            series: {
                connectNulls: true,
                marker: {
                    fillColor: null,
                    lineWidth: 4,
                    lineColor: null
                }
            }
        },
        series: series,
    };

    App.set_default_chart_options(chartOptions);
    App.disable_legend(chartOptions, options);

    var chart = new Highcharts.Chart(chartOptions);

    var metadata = {
        'chart-title': options.titles.title,
        'chart-subtitle': options.titles.subtitle,
        'chart-xAxisTitle': options.titles.xAxisTitle,
        'chart-yAxisTitle': options.titles.yAxisTitle,
        'source-dataset': options.credits.text,
        'chart-url': document.URL,
        'filters-applied': _(this.model.attributes).pairs()
    };
    view.trigger('chart_ready', series, metadata);

};

})();
