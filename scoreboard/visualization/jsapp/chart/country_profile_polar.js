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
    _(series).each(function(serie) {
        serie.data = _(serie.data).filter(function(item) {
            return item.y != undefined && !isNaN(item.y) && item.y != null;
        });
    });
    // change point names, by default category facet (indicator) is used
    var category_keys = {};
    var category_keys_invert = {};
    var category_names = {};
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
                category_keys[key] = counter++;
            }
            item.name = category_keys[key];
            item.title = category_names[category_keys[key]];
        });
    });

    var has_legend = options['series-legend-label'] && options['series-legend-label'] != 'none';
    var marginTop = 100;
    var viewPortWidth = _.min([$(window).width(), 1130]) - 30;
    var viewPortHeight = _.min([$(window).height()-100, 650]);
    var legendWidth = _.min([viewPortWidth * 0.3, 170]);
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
            marginLeft: 55,
            marginRight: 10 + (has_legend?legendWidth:0),
            marginTop: marginTop,
            marginBottom: 80,
            height: viewPortHeight,
            width: viewPortWidth,
        },
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
                    color: '#000000'
                },
                useHTML: true,
                formatter: function() {
                    var title = (category_keys_invert[this.value]||'').join('<br>');
                    return '<div title="' + title + '">'+category_names[this.value]+'</div>'
                }
             },
        },
        yAxis: {
            lineWidth: 0,
            gridLineWidth: 1,
            tickInterval: 1,
            tickColor: '#FF0000',
            labels: {
                formatter: function() {
                    return ['', 'EU average', ''][this.value];
                },
                style: {
                    fontFamily: 'Tahoma',
                    fontSize: '10px',
                }
            },
            min: 0,
            max: 2
        },
        tooltip: {
            useHTML: true,
            formatter: cp_polar_tooltip_formatter,
            snap: 0
        },
        plotOptions: {
            series: {
                stickyTracking: false
            }
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            // useHTML: true,
            // disabled because IE9 raises SCRIPT5007: Unable to get property 'childNodes'
            // when changing the indicator
            x: 0,
            y: -10,
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
    view.trigger('chart_ready', series, metadata,
        options['chart_type'] + '_' + options.subtype);
};

})();
