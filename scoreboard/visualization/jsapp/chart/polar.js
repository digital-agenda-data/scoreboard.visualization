/*global App, _, Highcharts */
/*jshint sub:true */

(function() {
"use strict";


App.chart_library['polar'] = function(view, options) {

    var container = view.el
    $(container).addClass('high-chart');
    var series = App.format_series(
                    options['series'],
                    options['sort'],
                    options['multidim'],
                    options['category_facet'],
                    options['highlights']);
	_.map(series, function(elem) {
        _(elem.data).each(function(item){
            if (item.y == undefined || isNaN(item.y)) {
               item.y = null;
            }
        });
    });

    var yAxis = {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
    };

    var has_legend = options['series-legend-label'] && options['series-legend-label'] != 'none';
    var marginTop = 100;
    var viewPortWidth = _.min([$(window).width(), 1130]) - 30;
    var viewPortHeight = _.min([$(window).height()-100, 650]);
    var legendWidth = _.min([viewPortWidth * 0.3, 170]);
    var titleFontSize = 16;
    var chartOptions = {
        chart: {
            renderTo: container,
            polar: true,
            type: 'line',
            marginLeft: 55,
            marginRight: 10 + (has_legend?legendWidth:0),
            marginTop: marginTop,
            marginBottom: 80,
            height: viewPortHeight,
            width: viewPortWidth, 
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
            },
            style: {
                fontSize: '12px',
                color: '#222222'
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
            x: 45,
            y: marginTop-20,
            style: {
                color: '#000000',
                fontFamily: 'Verdana',
                fontSize: (titleFontSize-1) + 'px',
                fontWeight: 'bold'
            }
        },
        xAxis: {
            type: 'category',
            tickmarkPlacement: 'on',
            lineColor: '#191919',
            tickColor: '#191919',
            labels: {
                style: {
                    color: '#000000',
                }
             }
        },
        yAxis: yAxis,
        tooltip: {
            animation: false,
            useHTML: true,
            hideDelay: 100,
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
