/*global App, _, Highcharts */
/*jshint sub:true */

(function() {
"use strict";

App.chart_library['columns'] = function(view, options) {

    var container = view.el
    $(container).addClass('high-chart');
    var series = App.format_series(
                    options['series'],
                    options['sort'],
                    options['multidim'],
                    options['category_facet'],
                    options['highlights'],
                    options['animation'],
                    options['series-point-label']);
    // add N/A labels for missing values
    var dataLabels = {
        enabled: true,
        align: 'center',
        verticalAlign: 'top',
        x: 0,
        y: -10,
        format: 'N/A'
    };
    _(series).each(function(serie) {
        _(serie.data).map(function(point){
            if ( point.y == null || isNaN(point.y) ) {
                point.isNA = true;
                point.dataLabels = dataLabels;
                point.y = 0;
            } else {
                point.isNA = false;
                point.dataLabels = null;
            }
        });
    });

    var init_series = series;
    var max_value = null;
    if (options['animation']){
        series = _(series).sortBy('name');
        init_series = JSON.parse(JSON.stringify(series.slice(-1)));
        // find max value of all series
        _(series).each(function(serie){
            _(serie.data).each(function(item){
                if (!max_value || item.y > max_value ) {
                    max_value = item.y;
                }
            });
        });
    }


    var has_legend = options['series-legend-label'] && options['series-legend-label'] != 'none';
    var viewPortWidth = _.min([$(window).width(), 1130]) - 30;
    var legendWidth = _.min([viewPortWidth * 0.3, 170]);
    var viewPortHeight = _.min([$(window).height()-100, 450]);
    if ( App.visualization.embedded ) {
        viewPortHeight = _.min([$(window).height(), 470]) - 20;
    }

    var titleFontSize = 16;
    if ( viewPortHeight < 450 ) titleFontSize = 14;
    if ( viewPortHeight < 350 ) titleFontSize = 12;
    if ( viewPortWidth < 600 ) titleFontSize = titleFontSize-1;
    var marginTop = 100;
    if ( App.visualization.embedded ) {
        if ( options.titles.title ) {
            marginTop = 10 + 20 * Math.ceil(options.titles.title.length / 60);
        } else {
            marginTop = 20;
        }
    }
    // set predefined colors
    var colors = [];
    _(series).each(function(item, index) {
        if ( App.PREDEFINED_COLORS[item['notation']] ) {
            colors.push(App.PREDEFINED_COLORS[item['notation']]);
        } else {
            colors.push(App.SERIES_COLOR[index]);
        }
    });

    var chartOptions = {
        chart: {
            renderTo: container,
            defaultSeriesType: 'column',
            zoomType: 'y',
            marginLeft: 55,
            marginRight: 10 + (has_legend?legendWidth:0),
            marginTop: marginTop,
            marginBottom: 80,
            height: viewPortHeight,
            width: viewPortWidth,
            events: {
                load: function(event) {
                    view.trigger('chart_load', {
                        'chart': this,
                        'series': init_series,
                        'options': options
                    });
                }
            }
        },
        colors: colors,
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
            width: viewPortWidth - 60,
            y: App.visualization.embedded ? 5 : 35,
            style: {
                color: '#000000',
                fontFamily: 'Verdana',
                fontWeight: 'bold',
                fontSize: titleFontSize + 'px'
            }
        },
        subtitle: {
            text: options.titles.subtitle,
            style: {
                color: '#000000',
                fontWeight: 'bold',
                fontFamily: 'Verdana',
                fontSize: (titleFontSize-1) + 'px'
            },
            align: 'left',
            x: 45,
            y: marginTop-15
        },
        xAxis: {
            type: 'category',
            lineColor: '#191919',
            tickColor: '#191919',
            labels: {
                rotation: -45,
                align: 'right',
                formatter: options['xlabels_formatter'],
                style: {
                    color: '#000000',
                    width: 700
                }
             }
        },
        yAxis: {
            min: 0,
            max: max_value,
            title: {
                text: options.titles.yAxisTitle,
                style: {
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize: (titleFontSize-2) + 'px'
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: viewPortWidth - legendWidth - 15,
            y: App.visualization.embedded ? 35 : 70,
            borderWidth: 0,
            backgroundColor: '#FFF',
            width: 170,
            itemMarginBottom: 5,
            itemStyle: {
                fontFamily: 'Verdana',
                fontSize: '11px',
                width: legendWidth - 30
            }
        },
        tooltip: {
            formatter: options['tooltip_formatter'],
            useHTML: true
        },
        plotOptions: {
            column: {
                stacking: (options['stacked']?'normal':null)
            }
        },
        series: init_series
    };

    // check link for composite charts
    if (typeof this.data.custom_properties != 'undefined') {
      var dai_breakdown_chart = this.data.custom_properties['dai-breakdown-chart'];
      if ( dai_breakdown_chart) {
        chartOptions.plotOptions.series = {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                var pathItems = window.location.pathname.split('/');
                pathItems[pathItems.length - 1] = dai_breakdown_chart;
                window.location = pathItems.join('/') + '#chart={"indicator":"'+this.series.options.notation+'"}';
              }
            }
          }
        }
      }
    }
    
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

    if (options['plotlines']){
        App.add_plotLines(chart, init_series, options['plotlines']);
    }

    if (options['animation']){
        if(!App.chart_controls){
            App.chart_controls = new App.GraphControlsView({
                model: new Backbone.Model(),
                chart: chart,
                snapshots_data: series,
                interval: window.interval_set,
                plotlines: options['plotlines'],
                chart_type: options['plotlines'],
                sort: options['sort']
            });
            $('#the-filters .footer').append(App.chart_controls.$el);
        }else{
            App.chart_controls.chart = chart;
            App.chart_controls.update_data(series);
        };
    }
};

})();
