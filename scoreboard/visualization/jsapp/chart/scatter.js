/*global App, _, Highcharts */
/*jshint sub:true */
import _ from "underscore";

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

    var legendItemWidth = 120;
    var marginRight = (App.visualization.embedded || App.width_s())?0:(30+legendItemWidth);
    var marginLeft = 100;
    var marginTop = 30;
    var marginBottom = 90;
    var viewPortSize = _.min([700,
        ($(window).width()-marginRight-marginLeft-20),  // 20 to avoid a scrollbar
        ($(window).height()-marginTop-marginBottom)
    ]);
    var chartOptions = {
        chart: {
            renderTo: container,
            defaultSeriesType: 'scatter',
            zoomType: App.is_touch_device()?null:'xy',
            marginLeft: marginLeft,
            marginRight: marginRight,
            marginTop: marginTop,
            marginBottom: marginBottom,
            height: viewPortSize+marginTop+marginBottom,
            width: viewPortSize+marginLeft+marginRight,
            ignoreHiddenSeries: false
        },
        credits: {
            href: App.is_touch_device()?null:options['credits']['href'],
            text: options['credits']['text'],
            target: '_blank',
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
            align: 'center',
            style: {
                color: '#000000',
                fontWeight: 'normal'
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
                    fontWeight: App.width_s()?'normal':'bold',
                    width: viewPortSize
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
                    fontWeight: App.width_s()?'normal':'bold'
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
            animation: false,
            hideDelay: 100,
            useHTML: true,
            formatter: options['tooltip_formatter'],
            snap: 0
        },
        legend: {
            animation: false,
            enabled: !App.visualization.embedded && !App.width_s(),
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            style: {
                fontSize: '11px'
            },
            itemStyle: {
                fontSize: '11px',
                fontWeight: 'normal'
            },
            itemWidth: legendItemWidth-20,
            x: 0,
            y: marginTop,
            borderWidth: 1
        },
        plotOptions: {
            series: {
                stickyTracking: false
            },
            scatter: {
                marker: {
                    // radius:1 // see common.js:App.format_series
                },
                dataLabels: {
                    // see common.js:App.format_series
                },
                events: {
                    legendItemClick: function() {
                        if (App.is_touch_device()) return false;
                    }
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
    // hide zoom button on mobile devices (default zoom in is enough)
    App.jQuery('#highcharts_zoom_in').hide();

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
