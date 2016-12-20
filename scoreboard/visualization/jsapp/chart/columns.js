/*global App, _, Highcharts */
/*jshint sub:true */
import _ from "underscore";

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


    var viewPortWidth = _.min([$(window).width(), 1130]) - 30;
    var viewPortHeight = _.min([$(window).height()-100, 450]);
    if ( App.visualization.embedded ) {
        viewPortHeight = _.min([$(window).height(), 470]) - 20;
    }

    var titleFontSize = 16;
    if ( viewPortHeight < 450 ) titleFontSize = 14;
    if ( viewPortHeight < 350 ) titleFontSize = 12;
    if ( viewPortWidth < 600 ) titleFontSize = titleFontSize-1;
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
            type: 'column',
            zoomType: App.is_touch_device()?null:'x',
            panning: true,
            pinchType: 'x',
            height: Math.min($(window).height(), 600),
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
                fontFamily: App.font_family,
                fontSize: '12px',
                color: '#222222'
                //width: $(window).width()-10
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
                fontSize: (titleFontSize-1) + 'px'
            },
        },
        xAxis: {
            type: 'category',
            lineColor: '#191919',
            tickColor: '#191919',
            labels: {
                autoRotation: [-45, -90],
                //align: 'right',
                padding: 0,
                //formatter: options['xlabels_formatter'],
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
                align: 'middle',
                style: {
                    color: '#000000',
                    fontFamily: App.font_family,
                    fontSize: (titleFontSize-3) + 'px'
                    // TODO: wrapping does not work whiteSpace: 'normal'
                }
            }
        },
        legend: {
            animation: false,
            layout: 'vertical',
            align: App.width_s()?'center':'right',
            verticalAlign: App.width_s()?'bottom':'top',
            y: 10,
            title: {
                text: 'Legend',
                style: {
                    fontWeight: 'normal',
                    fontFamily: App.font_family
                }
            },
            borderWidth: 0,
            itemStyle: {
                fontSize: '11px',
                fontWeight: 'normal',
                fontFamily: App.font_family,
                width: App.width_s()?viewPortWidth-20:150
            }
        },
        tooltip: {
            animation: false,
            hideDelay: 100,
            formatter: options['tooltip_formatter'],
            useHTML: true
        },
        plotOptions: {
            column: {
                stacking: (options['stacked']?'normal':null),
                events: {
                    legendItemClick: function() {
                        if (App.is_touch_device()) return false;
                    }
                }
            }
        },
        series: init_series
    };

    /*
    if ( App.is_touch_device() ) {
        // enable center on click
        chartOptions.plotOptions.series = {
          point: {
            events: {
              click: function (event) {
                 var xt = App.chart.xAxis[0].getExtremes();
                 var max = event.point.index + Math.round(xt.max-xt.min-1)/2;
                 // keep number of visible points
                 var min = max-xt.max+xt.min;
                 if (max > xt.dataMax) {
                     // shift left
                     min = min - max + xt.dataMax;
                     max = xt.dataMax;
                 }
                 if ( min < xt.dataMin ) {
                     // shift right
                     max = max + xt.dataMin - min;
                     min = xt.dataMin;
                 }
                 App.chart.xAxis[0].setExtremes(min, max);
              }
            }
          }
        }
    }
    */
    // check link for composite charts
    if (typeof this.data.custom_properties != 'undefined') {
      var dai_breakdown_chart = this.data.custom_properties['dai-breakdown-chart'];
      if ( dai_breakdown_chart && !App.visualization.embedded && !App.is_touch_device()) {
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

    if (options['plotlines']){
        App.add_plotLines(App.chart, init_series, options['plotlines']);
    }

    if (options['animation']){
        if(!App.chart_controls){
            App.chart_controls = new App.GraphControlsView({
                model: new Backbone.Model(),
                chart: App.chart,
                snapshots_data: series,
                interval: window.interval_set,
                plotlines: options['plotlines'],
                chart_type: options['plotlines'],
                sort: options['sort']
            });
            $('#the-filters .footer').append(App.chart_controls.$el);
        }else{
            App.chart_controls.chart = App.chart;
            App.chart_controls.update_data(series);
        };
    }
};

})();
