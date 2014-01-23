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
            if (item.y != undefined) {
                lastElem = item;
            }
        });
        if (lastElem) {
            _(lastElem).extend({
                dataLabels: {
                  enabled: true,
                  crop: false,
                  overflow: 'none',
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

    var viewPortWidth = _.min([$(window).width(), 1130]) - 30;
    var legendWidth = _.min([viewPortWidth * 0.25, 250]);
    var viewPortHeight = _.min([$(window).height()-100, 450]);
    if ( App.visualization.embedded ) {
        viewPortHeight = _.min([$(window).height(), 470]) - 20;
    }

    var titleFontSize = 16;
    if ( viewPortHeight < 450 ) titleFontSize = 14;
    if ( viewPortHeight < 350 ) titleFontSize = 12;
    if ( viewPortWidth < 600 ) titleFontSize = titleFontSize-1;

    var yAxis = {
        min:0,
        //max: options['unit_is_pc'][0]?100:null,
        minRange: 1,
        startOnTick: false,
        minPadding: 0.1,
        title: {
            text: typeof(options.titles.yAxisTitle) == 'string'?options.titles.yAxisTitle:options.titles.yAxisTitle[0],
            style: {
                color: '#000000',
                fontSize: (titleFontSize-4) + 'px',
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
        var max_value = null;
        if ( options.titles.yAxisTitle[0] == options.titles.yAxisTitle[1] ) {
            // if same unit, set a common max value
            _(series).each(function(serie){
                _(serie.data).each(function(item){
                    if (!max_value || item.y > max_value ) {
                        max_value = item.y;
                    }
                });
            });
            yAxis['max'] = max_value;
        }
        var yAxis = [yAxis];
        yAxis.push({
            min:0,
            //max: options['unit_is_pc'][1]?100:null,
            max: max_value,
            opposite: true,
            title: {
                text: options.titles.yAxisTitle[1],
                //text: 'second series',
                style: {
                    color: '#000',
                    fontSize: (titleFontSize-4) + 'px',
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

    var has_legend = options['series-legend-label'] && options['series-legend-label'] != 'none';
    var marginTop = 100;
    if ( App.visualization.embedded ) {
        if ( options.titles.title ) {
            marginTop = 20 + 30 * Math.floor(options.titles.title.length / 100);
        } else {
            marginTop = 20;
        }
    }
    var chartOptions = {
        chart: {
            renderTo: container,
            type: 'spline',
            zoomType: 'y',
            marginLeft: 55,
            marginRight: 70 + (has_legend?legendWidth:0),
            marginTop: marginTop,
            marginBottom: 50,
            height: viewPortHeight,
            width: viewPortWidth
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
            align: "center",
            x: viewPortWidth/2-25,
            width: viewPortWidth - 50,
            y: App.visualization.embedded ? 5 : 35,
            style: {
                color: '#000000',
                fontFamily: 'Verdana',
                fontSize: titleFontSize + 'px',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: options.titles.subtitle,
            align: "left",
            x: 25,
            y: App.visualization.embedded ? 50 : 90,
            style: {
                color: '#000000',
                fontFamily: 'Verdana',
                fontSize: (titleFontSize-2) + 'px',
                fontWeight: 'bold'
            }
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 3600 * 24 * 1000 * 365,
            //minorTickInterval: 3600 * 24 * 1000 * 365 / 2,
            minorGridLineWidth: 0,
            minorTickWidth: 1,
            lineColor: '#191919',
            tickColor: '#191919',
            minorTickColor: '#191919',
            minorTickLength: 5,
            dateTimeLabelFormats: {
                day: '%Y',
                month: '%Y',
                year: '%Y'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            labels: {
                align: 'left',
                style: {
                    color: '#000000',
                },
                x: 10
            }
        },
        yAxis: yAxis,
        tooltip: {
            useHTML: true,
            formatter: options['tooltip_formatter']
            // style is set from external css
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            // useHTML: true,
            // disabled because IE9 raises SCRIPT5007: Unable to get property 'childNodes'
            // when changing the indicator
            x: viewPortWidth - legendWidth - 15,
            y: 100,
            borderWidth: 0,
            backgroundColor: '#FFF',
            itemMarginBottom: 5,
            itemStyle: {
                fontFamily: 'Verdana',
                fontSize: '10px',
                width: legendWidth - 30
            }
        },
        plotOptions: {
            series: {
                connectNulls: true,
                marker: {
                    fillColor: null,
                    lineWidth: 1,
                    radius: 3,
                    lineColor: null
                }
            }
        },
        series: series,
    };

    App.set_default_chart_options(chartOptions);
    App.disable_legend(chartOptions, options);
    App.override_zoom();
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
