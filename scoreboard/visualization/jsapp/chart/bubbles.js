/*global App, _, Highcharts */
/*jshint sub:true */

(function() {
"use strict";


App.chart_library['bubbles'] = function(view, options) {

    var container = view.el
    $(container).addClass('high-chart');

    var series = App.format_series(
                    options['series'],
                    options['sort'],
                    options['multidim'],
                    options['unit_is_pc'],
                    options['category_facet'],
                    options['highlights']);

    var init_series = JSON.parse(JSON.stringify(series[0]));

    // formatter is lost after stringify
    _(init_series).each(function(item){
        item['dataLabels']['formatter'] = function(){
            return this.point.name;
        }
        item['dataLabels']['x'] = 0;
        item['dataLabels']['y'] = 0;
    });

    var chartOptions = {
        chart: {
            type: 'bubble',
            renderTo: container,
            zoomType: 'xy',
            marginLeft: 100,
            marginRight: 150,
            marginTop: 70,
            marginBottom: 100,
            height: 670,
            width: 750,
            ignoreHiddenSeries: false
        },
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
            align: 'center',
            style: {
                color: '#000000',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: options.titles.subtitle,
            style: {
                color: '#000000',
                width: 600,
                fontWeight: 'bold'
            }
        },
        xAxis: [{
            minPadding: 0.1,
            maxPadding: 0.1,
            title: {
                enabled: true,
                text: options.titles.xAxisTitle,
                style: {
                    color: '#000000',
                    width: 500,
                    fontWeight: 'bold'
                }
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            labels: {
                formatter: _.partial(App.tick_labels_formatter,
                                     options.unit_is_pc[0]),
                style: {
                    color: '#000000'
                }
             }

        }],
        yAxis: {
            minPadding: 0.1,
            maxPadding: 0.1,
            title: {
                text: options.titles.yAxisTitle,
                style: {
                    color: '#000000',
                    fontWeight: 'bold',
                    width: 500
                },
                 margin: 30
            },
            labels: {
                formatter: _.partial(App.tick_labels_formatter,
                                     options.unit_is_pc[1]),
                style: {
                    color: '#000000',
                }
            }
        },
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
            y: 30,
            borderWidth: 0
        },
        plotOptions: {
            bubble: {
                dataLabels: {
                    enabled: true,
                    color: '#555555'
                }
            },
            scatter: {
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                }
            }
        },
        series: init_series
    };

    if (!options['legend']){
        App.disable_legend(chartOptions, options);
    }

    var chart = new Highcharts.Chart(chartOptions);

    view.trigger('chart_ready', series, options['chart_type']);

    if (options['plotlines']){
        App.add_plotLines(chart, series[0], options['plotlines']);
    }


    if (options['animation']){
        if(!App.chart_controls){
            App.chart_controls = new App.GraphControlsView({
                model: new Backbone.Model(),
                chart: chart,
                snapshots_data: series,
                interval: window.interval_set,
                multiseries: options['multiseries'],
                plotlines: options['plotlines'],
                chart_type: options['plotlines']
            });
            $('#the-filters .footer').append(App.chart_controls.$el);
        }else{
            App.chart_controls.chart = chart;
            App.chart_controls.snapshots_data = series;
            App.chart_controls.update_chart();
        };
    }

};


})();
