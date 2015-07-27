/*global App, _, Highcharts */
/*jshint sub:true */

(function() {
"use strict";


App.chart_library['country_profile_polar'] = function(view, options) {

    var container = view.el
    $(container).addClass('high-chart');
    var series = App.format_series(
                    options['series'],
                    options['sort'],
                    options['multidim'],
                    options['category_facet'],
                    options['highlights'],
                    false, // animation
                    null, // series_point_label
                    true // ignore percentage unit (do not multiply by 100)
                 );
	// filter items without value (some added automatically in common.js (diffs_collection)
    var max_y = 2; // max radius, by default = 2 (highest eu country)
    _(series).each(function(serie) {
        serie.data = _(serie.data).filter(function(item) {
            if ( item.y && item.y > max_y ) {
                max_y = item.y;
            }
            return item.y != undefined && !isNaN(item.y) && item.y != null;
        });
    });
    // change point names, by default category facet (indicator) is used
    var category_keys = {};
    var category_keys_invert = {};
    var category_names = {};
    var category_tooltips_by_name = {};
    var counter = 1;
    _.map(series, function(elem) {
        _(elem.data).each(function(item){
            var key = [
                item.attributes['indicator'].notation.toLowerCase(),
                item.attributes['breakdown'].notation.toLowerCase(),
                item.attributes['unit-measure'].notation.toLowerCase()
            ];
            if (!category_keys[key]) {
                // category_keys_invert is indexed by x-value
                category_keys_invert[counter] = [
                    '<b>Indicator</b>: ' + item.attributes.indicator.label,
                    '<b>Breakdown</b>: ' + item.attributes.breakdown.label,
                    '<b>Unit</b>: ' + item.attributes['unit-measure'].label];
                // find the preferred label for this category
                var whitelist_item = _.where(App.whitelist, {'indicator':key[0], 'breakdown':key[1], 'unit-measure':key[2]});
                if (whitelist_item[0] && whitelist_item[0]['name']) {
                    category_names[counter] = whitelist_item[0].name;
                } else {
                    category_names[counter] = item.attributes.indicator['short-label'] || item.attributes.indicator.label;
                }
                category_tooltips_by_name[category_names[counter]] = (category_keys_invert[counter]||['']).join('<br>');
                category_keys[key] = counter++;
            }
            item.name = category_keys[key];
            item.title = category_names[category_keys[key]];
        });
    });

    var legendItemWidth = 120;
    var titleFontSize = 16;
    var cp_polar_tooltip_formatter = function() {
        var unit_notation = this.point.attributes['unit-measure']['notation'];
        var original_value = this.point.attributes.original;
        var eu_value = this.point.attributes.eu;
        if ( App.unit_is_percent(unit_notation)) {
            original_value = 100*original_value;
            eu_value = 100*eu_value;
        }
        original_value = original_value.toPrecision(3);
        eu_value = eu_value.toPrecision(3);
        if ( App.unit_is_percent(unit_notation)) {
            original_value = original_value + '%';
            eu_value = eu_value + '%';
        }
        return '<b>' + this.series.name  +
            '</b><br><b>Indicator</b>: ' + this.point.attributes['indicator']['label'] +
            '<br><b>Breakdown</b>: ' + this.point.attributes['breakdown']['label'] +
            '<br><b>Unit</b>: ' + this.point.attributes['unit-measure']['label'] +
            '<br><b>Original indicator value</b>: ' + original_value +
            '<br><b>EU average</b>: ' + eu_value;
    };
    var chartOptions = {
        chart: {
            renderTo: container,
            polar: true,
            type: 'line',
            height: Math.min($(window).height(), 600)
        },
        credits: {
            href: App.is_touch_device()?null:options['credits']['href'],
            text: options['credits']['text'],
            target: '_blank',
            position: {
                align: 'center',
                x: -5,
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
            style: {
                color: '#000000',
                fontWeight: App.width_s()?'normal':'bold'
            }
        },
        subtitle: {
            text: options.titles.subtitle,
            align: 'center',
            style: {
                color: '#000000',
                fontWeight: App.width_s()?'normal':'bold',
                fontSize: (titleFontSize-1) + 'px'
            }
        },
        xAxis: {
            type: 'category',
            tickmarkPlacement: 'on',
            lineColor: '#191919',
            tickColor: '#191919',
            labels: {
                style: {
                    fontWeight: App.width_s()?'normal':'bold',
                    color: '#000000'
                },
                useHTML: true,
                formatter: function() {
                    return category_names[this.value];
                    // tooltips are added using jQuery, see below
                    // var title = (category_keys_invert[this.value]||['']).join('<br>');
                    // return '<span title="' + title + '">'+category_names[this.value]+'</span>'
                }
             },
        },
        yAxis: {
            lineWidth: 0,
            gridLineWidth: 1,
            tickInterval: 1,
            tickPositions: [0, 1, 2, max_y],
            tickColor: '#FF0000',
            showLastLabel: true,
            labels: {
                align: 'center',
                formatter: function() {
                    return ['', 'EU average', 'Highest EU country', ''][this.value];
                },
                style: {
                    color: '#000000',
                    fontWeight: 'normal',
                    fontSize: '10px'
                }
            },
            min: 0,
            max: max_y
        },
        tooltip: {
            animation: false,
            useHTML: true,
            formatter: cp_polar_tooltip_formatter,
            snap: 0
        },
        plotOptions: {
            series: {
                stickyTracking: false,
                events: {
                    legendItemClick: function() {
                        if (App.is_touch_device()) return false;
                    }
                }
            }
        },
        legend: {
            animation: false,
            layout: (App.visualization.embedded || App.width_s())?'horizontal':'vertical',
            align: (App.visualization.embedded || App.width_s())?'center':'right',
            verticalAlign: (App.visualization.embedded || App.width_s())?'bottom':'top',
            x: (App.visualization.embedded || App.width_s())?0:0,
            y: (App.visualization.embedded || App.width_s())?-10:50,
            borderWidth: 0,
            backgroundColor: '#FFF',
            itemMarginBottom: (App.visualization.embedded || App.width_s())?5:0,
            itemStyle: {
                fontWeight: 'normal',
                fontSize: '10px',
                width: legendItemWidth
            }
        },
        series: series
    };

    App.set_default_chart_options(chartOptions);
    App.disable_legend(chartOptions, options);
    App.override_zoom();
    App.chart = new Highcharts.Chart(chartOptions);
    // add tooltips on x-labels using jQuery
    // cannot use labels.formatter because it breaks the png export
    App.jQuery(".highcharts-xaxis-labels > span").each(function() {
        App.jQuery(this).prop("title", category_tooltips_by_name[App.jQuery(this).text()])
    });
    
    var metadata = {
        'chart-title': options.titles.title,
        'chart-subtitle': options.titles.subtitle,
        'chart-xAxisTitle': options.titles.xAxisTitle,
        'chart-yAxisTitle': options.titles.yAxisTitle,
        'source-dataset': options.credits.text,
        'chart-url': document.URL,
        'filters-applied': _(this.model.attributes).pairs()
    };
    view.trigger('chart_ready', series, metadata,
        options['chart_type'] + '_' + options.subtype);
};

})();
