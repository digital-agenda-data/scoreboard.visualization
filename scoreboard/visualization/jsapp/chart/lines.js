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
                    options['category_facet'],
                    options['highlights']);
	_.map(series, function(elem) {
        var lastElem;
        _(elem.data).each(function(item){
            if (item.y != undefined && !isNaN(item.y) && item.y != null) {
                lastElem = item;
            } else {
               item.y = null;
            }
        });
        if (lastElem) {
            _(lastElem).extend({
                dataLabels: {
                  enabled: true,
                  //crop: false,
                  //overflow: 'none',
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
    var viewPortHeight = _.min([$(window).height(), 470]) - 20;

    var titleFontSize = 16;
    if ( viewPortHeight < 450 ) titleFontSize = 14;
    if ( viewPortHeight < 350 ) titleFontSize = 12;
    if ( viewPortWidth < 600 ) titleFontSize = titleFontSize-1;
    if ( viewPortWidth < 450 ) titleFontSize = titleFontSize-2;

    var yAxis = {
        min:0,
        minRange: 1,
        startOnTick: false,
        minPadding: 0.1,
        title: {
            text: typeof(options.titles.yAxisTitle) == 'string'?options.titles.yAxisTitle:options.titles.yAxisTitle[0],
            style: {
                color: '#000000',
                fontFamily: App.font_family,
                fontSize: (titleFontSize-2) + 'px'
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
            max: max_value,
            opposite: true,
            title: {
                text: options.titles.yAxisTitle[1],
                style: {
                    color: '#000',
                    fontFamily: App.font_family,
                    fontSize: (titleFontSize-2) + 'px'
                }
            },
            labels: {
                style: {
                    color: '#000000'
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
            zoomType: App.is_touch_device()?null:'xy',
            height: viewPortHeight
        },
        colors: App.SERIES_COLOR,
        credits: {
            href: App.is_touch_device()?null:options['credits']['href'],
            text: options['credits']['text'],
            position: {
                align: 'right',
                x: -5,
                verticalAlign: 'bottom',
                y: -2
            },
            style: {
                fontSize: '12px',
                color: '#222222'
            }
        },
        title: {
            text: options.titles.title,
            style: {
                color: '#000000',
                fontFamily: App.font_family,
                fontSize: titleFontSize + 'px'
            }
        },
        subtitle: {
            text: options.titles.subtitle,
            style: {
                color: '#000000',
                fontFamily: App.font_family,
                fontSize: (titleFontSize-1) + 'px',
            }
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 3600 * 24 * 1000 * 365,
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
            showLastLabel: false,
            labels: {
                align: 'left',
                style: {
                    color: '#000000'
                },
                x: App.width_s()?5:20
            }
        },
        yAxis: yAxis,
        tooltip: {
            useHTML: true,
            formatter: options['tooltip_formatter'],
            snap: 0
        },
        legend: {
            animation: false,
            layout: 'vertical',
            align: App.width_s()?'center':'right',
            verticalAlign: App.width_s()?'bottom':'top',
            // useHTML: true,
            // useHTML disabled because IE9 raises SCRIPT5007: Unable to get property 'childNodes' when changing the indicator
            y: App.width_s()?null:20,
            title: {
                text: 'Legend',
                style: {
                    fontWeight: 'normal',
                    fontFamily: App.font_family
                }
            },
            borderWidth: 0,
            backgroundColor: '#FFF',
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '11px',
                fontWeight: 'normal',
                fontFamily: App.font_family,
                width: App.width_s()?viewPortWidth-20:150
            }
        },
        plotOptions: {
            series: {
                connectNulls: true,
                stickyTracking: false,
                marker: {
                    fillColor: null,
                    lineWidth: 1,
                    radius: 3,
                    lineColor: null
                }
            }
        },
        series: series
    };

    App.set_default_chart_options(chartOptions);
    App.disable_legend(chartOptions, options);
    App.override_zoom();
    App.chart = new Highcharts.Chart(chartOptions);

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
