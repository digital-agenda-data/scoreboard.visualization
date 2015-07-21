/*global App, _, Highcharts */
/*jshint sub:true */

(function() {
"use strict";


App.chart_library['scatter'] = function(view, options) {

    var container = view.el
    $(container).addClass('high-chart');

    var series = App.format_series(
                    options['series'],
                    options['sort'],
                    options['multidim'],
                    options['category_facet'],
                    options['highlights']);

    // sort series by country name
    series = _(series).sortBy('name');
    // create deep copy
    var init_series = JSON.parse(JSON.stringify(series[0]));

    // formatter is lost after stringify
    // TODO: use dataLabels.format = "{point.name}"
    _(init_series).each(function(item){
        item['dataLabels']['formatter'] = function(){
            return this.point.name;
        }
    });

    var viewPortWidth = _.min([$(window).width(), 770]) - 20;
    var chartOptions = {
        chart: {
            renderTo: container,
            defaultSeriesType: 'scatter',
            zoomType: 'xy',
            marginLeft: App.visualization.embedded?80:100,
            marginRight: App.visualization.embedded?20:150,
            marginTop: 30,
            marginBottom: 70,
            height: viewPortWidth-(App.visualization.embedded?0:100),
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
                y: -5
            },
            style: {
                fontSize: '12px',
                color: '#222222'
            }
        },
        title: {
            text: options.titles.title,
            align: 'center',
            x: viewPortWidth/2-(App.visualization.embedded?20:150),
            width: viewPortWidth-(App.visualization.embedded?100:250),
            style: {
                color: '#000000',
                fontFamily: 'Verdana',
                fontWeight: 'bold'
            }
        },
        xAxis: [{
            startOnTick: false,
            endOnTick: false,
            title: {
                enabled: true,
                text: options.titles.xAxisTitle,
                style: {
                    color: '#000000',
                    fontWeight: 'bold',
                    width: viewPortWidth-100
                }
            },
            showLastLabel: true,
            labels: {
                style: {
                    color: '#000000'
                }
             }

        }],
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: options.titles.yAxisTitle,
                style: {
                    color: '#000000',
                    fontWeight: 'bold',
                    width: viewPortWidth-300
                },
                margin: 35
            },
            labels: {
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
            y: 30,
            borderWidth: 1,
            floating: true
        },
        plotOptions: {
            scatter: {
                marker: {
                    // radius:1 // see common.js:App.format_series
                },
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
    view.trigger('chart_ready', series, metadata, options['chart_type']);

    if (options['plotlines']){
        App.add_plotLines(App.chart, series[0], options['plotlines']);
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
            App.chart_controls.chart = App.chart;
            App.chart_controls.update_data(series);
        };
    }


};


})();
