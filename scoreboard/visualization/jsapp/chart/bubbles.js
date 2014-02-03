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

    // sort series by country name
    series = _(series).sortBy('name');
    // create deep copy
    var init_series = JSON.parse(JSON.stringify(series[0]));

    // formatter is lost after stringify
    _(init_series).each(function(item){
        item['dataLabels']['formatter'] = function(){
            return this.point.name;
        }
        item['dataLabels']['x'] = 0;
        item['dataLabels']['y'] = 0;
    });

    var viewPortWidth = _.min([$(window).width(), 780]) - 30;
    var chartOptions = {
        chart: {
            type: 'bubble',
            renderTo: container,
            zoomType: 'xy',
            marginLeft: App.visualization.embedded?80:100,
            marginRight: App.visualization.embedded?20:150,
            marginTop: 70,
            marginBottom: App.visualization.embedded?60:100,
            height: viewPortWidth-(App.visualization.embedded?0:70),
            width: viewPortWidth,
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
            x: viewPortWidth/2-(App.visualization.embedded?20:150),
            width: viewPortWidth-(App.visualization.embedded?100:250),
            align: 'center',
            style: {
                color: '#000000',
                fontWeight: 'bold'
            }
        },
        subtitle: {
            text: options.titles.subtitle,
            x: viewPortWidth/2-(App.visualization.embedded?20:150),
            width: viewPortWidth-(App.visualization.embedded?100:250),
            style: {
                color: '#000000',
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
                    fontWeight: 'bold',
                    width: viewPortWidth-100
                }
            },
            startOnTick: false,
            endOnTick: false,
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
            startOnTick: false,
            endOnTick: false,
            title: {
                text: options.titles.yAxisTitle,
                style: {
                    color: '#000000',
                    fontWeight: 'bold',
                    width: viewPortWidth-200
                },
                margin: 30
            },
            labels: {
                formatter: _.partial(App.tick_labels_formatter,
                                     options.unit_is_pc[1]),
                style: {
                    color: '#000000'
                }
            }
        },
        tooltip: {
            formatter: options['tooltip_formatter'],
            useHTML: true
        },
        legend: {
            enabled: !App.visualization.embedded,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            style: {
                fontFamily: 'Verdana',
                fontSize: '11px'
            },
            x: -5,
            y: 45,
            borderWidth: 1,
            floating: true
        },
        plotOptions: {
            bubble: {
                dataLabels: {
                    enabled: true,
                    color: '#222222',
                    style: {
                        textShadow: '0px'
                    }
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

    App.set_default_chart_options(chartOptions);
    App.override_zoom();
    if (!options['legend']){
        App.disable_legend(chartOptions, options);
    }

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
    view.trigger('chart_ready', series, metadata, options['chart_type']);

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
            App.chart_controls.update_data(series);
        };
    }

};


})();
