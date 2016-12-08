/*global $, App, _, Highcharts, Backbone */
/*jshint sub:true */

(function() {
"use strict";

App.chart_library['country_profile'] = function(view, options) {

    var container = view.el
    $(container).addClass('high-chart');
    $(container).parent().addClass('country-profile');

    var add_commas = function(nStr){
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };

    var x_formatter = function(value, unit){
        try{
            value.toFixed(2);
        }catch(err){
            return '-';
        }
        if(value > 100){
            value = value.toFixed(0);
            return add_commas(value);
        }else{
            if (App.unit_is_percent(unit)){
                return (value * 100).toFixed(0);
            }
            return value.toFixed(2);
        }
    };

    var series;
    if(options.subtype === 'table'){
        // simple HTML table
        series = options['series'];
        App.country_profile = new App.CountryProfileView({
            el: '#' + $(container).attr('id'),
            model: new Backbone.Model(),
            data: series[0].data,
            meta_data: options.meta_data,
            credits: options.credits,
            x_formatter: x_formatter
        });
    } else {
        series = App.format_series(
                        options['series'],
                        options['sort'],
                        options['multidim'],
                        options['category_facet'],
                        options['highlights'],
                        false, // animation
                        null, // series_point_label
                        true);

        var stack_series = [
            {
                name: 'Under EU average',
                color: '#7dc30f',
                dataLabels: {
                    enabled: true,
                    align: 'right',
                    crop: false,
                    inside: false,
                    overflow: 'none',
                    x: 50,
                    style: {
                        color: '#000000',
                        fontFamily: 'Verdana',
                        fontSize: '12px'
                    },
                    formatter: function(){
                      if(this.point.y >= 0) {
                        var unit = this.point.attributes['unit-measure']['notation'];
                        return x_formatter(this.point.original, unit) + (App.unit_is_percent(unit)?'%':'');
                      }
                    }
                },
                data: []
            },
            {
                name: 'Above EU average',
                color: '#436b06',
                dataLabels: {
                    color: '#000000',
                    enabled: true,
                    align: 'right',
                    inside: false,
                    crop: false,
                    overflow: 'none',
                    x: 50,
                    style: {
                        color: '#000000',
                        fontFamily: 'Verdana',
                        fontSize: '12px'
                    },
                    formatter: function(){
                      if (this.point.y > 0) {
                        var unit = this.point.attributes['unit-measure']['notation'];
                        return x_formatter(this.point.original, unit) + (App.unit_is_percent(unit)?'%':'');
                      }
                    }
                },
                data: []
            }
        ];
        // Update series with new values
        _(series[0].data).forEach(function(item){
            item.eu = item.attributes.eu;
            //item.rank = item.attributes.rank;
            item.original = item.attributes.original;

            var parts = [{prefix: '', facet_name:'indicator', format:'short-label', suffix: ''},
                {prefix: ' - ', facet_name:'breakdown', format:'short-label'},
                {prefix: ' (in ', facet_name:'unit-measure', format:'short-label', suffix: ')'}];
            var meta_data = {
                'indicator': item.attributes['indicator'],
                'breakdown': item.attributes['breakdown'],
                'unit-measure': item.attributes['unit-measure']
            };
            item.name = App.title_formatter(parts, meta_data);

            // Create two stacked series (Above EU average / Below EU average)
            // Always one of them has y=0
            var fake;
            if(item.original > item.eu){
                stack_series[1].data.push(item);
                fake = $.extend({}, item);
                fake.y = 0;
                stack_series[0].data.push(fake);
            }else{
                stack_series[0].data.push(item);
                fake = $.extend({}, item);
                fake.y = 0;
                stack_series[1].data.push(fake);
            }
        });

        var viewPortWidth = _.min([$(window).width(), 1130]) - 30;
        var labelsWidth = _.min([viewPortWidth * 0.6, 300]);
        if ( App.isIE78() && !App.visualization.embedded ) {
            labelsWidth = 600;
        }
        //var viewPortHeight = _.min([$(window).height()-250, 250 + series[0].data.length * 45]);
        var viewPortHeight = 250 + series[0].data.length * 45;
        var hasScroll = viewPortHeight>$(window).height();

        var titleFontSize = 16;
        if ( viewPortHeight < 450 ) titleFontSize = 14;
        if ( viewPortHeight < 350 ) titleFontSize = 12;
        if ( viewPortWidth < 600 ) titleFontSize = titleFontSize-1;

        var chartOptions = {
            chart: {
                renderTo: container,
                defaultSeriesType: 'bar',
                marginLeft: labelsWidth,
                marginRight: 50,
                height: viewPortHeight,
                width: hasScroll?($(window).width()-50):null
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
                    fontFamily: App.font_family,
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
                type: 'category',
                labels: {
                    style: {
                        color: '#000000',
                        fontFamily: App.font_family,
                        fontSize: '11px',
                        textOverflow: "none"
                    }
                 }
            },
            yAxis: [{
                min: 0,
                title: {text: ''},
                tickPositions: [0, 1, 2],
                labels: {
                    formatter: function() {
                        return ['lowest EU country', 'EU average', 'highest EU country'][this.value];
                    },
                    style: {
                        fontFamily: App.font_family,
                        fontSize: '10px'
                    }
                },
              },
              {
                opposite:true,
                plotBands: [{ color: 'red', width: 2, value: 1, zIndex: 6 }],
                min: 0,
                title: {text: ''},
                tickPositions: [0, 1, 2],
                labels: {
                    formatter: function() {
                        return ['lowest EU country', 'EU average', 'highest EU country'][this.value];
                    },
                    style: {
                        fontFamily: App.font_family,
                        fontSize: '10px'
                    }
                },
            }],
            legend: {
                enabled: true,
                animation: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                title: {
                    text: 'Legend',
                    style: {
                        fontWeight: 'normal',
                        fontFamily: App.font_family
                    }
                },
                itemStyle: {
                    fontSize: '11px',
                    fontWeight: 'normal',
                    fontFamily: App.font_family,
                    width: App.width_s()?viewPortWidth-20:150
                }
            },
            tooltip: {
                animation: false,
                useHTML: true,
                hideDelay: 100,
                formatter: function(){
                    var unit = this.point.attributes['unit-measure']['notation'];
                    var title = this.point.attributes['unit-measure']['short-label'];
                    var res = 'Original indicator value: ' + x_formatter(this.point.original, unit);
                    if ( !App.unit_is_percent(unit)) {
                        res += ' ';
                    }
                    if(title){
                        res += ' ' + title;
                    }
                    return res;
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    events: {
                        legendItemClick: function() {
                            if (App.is_touch_device()) return false;
                        }
                    },
                },
                bar: { pointWidth: 25 }
            },
            series: stack_series
        };

        App.set_default_chart_options(chartOptions);
        App.chart = new Highcharts.Chart(chartOptions);
    }
    // hide zoom button on mobile devices
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
    view.trigger('chart_ready', series, metadata,
        options['chart_type'] + '_' + options.subtype)
};

App.CountryProfileView = Backbone.View.extend({

    template: App.get_template('chart/country_profile.html'),

    initialize: function(options) {
        this.options = $.extend({}, options);
        this.render();
    },

    table: function(){
        var table = [];
        var self = this;
        var latest = this.options.data.latest;
        var format = self.options.x_formatter;

        _(this.options.data.table).forEach(function(item, key){
            var row = {};
            row.order = 999999;
            if ( typeof(item['inner_order']) == "string" ) {
              row.order = parseInt(item['inner_order']);
            } else if ( typeof(item['inner_order']) == "number" ) {
              row.order = item['inner_order'];
            }
            row.name = key;
            row.title = '<strong>' + item.indicator + '</strong> - '
                + item.breakdown + ' (in ' + item['unit-measure'] +
                ')';
            row.hasRank = self.options.data['has-rank'];
            row.rank = item.rank || '-';
            row.eu = format(item.eu, item.unit);
            row.year = format(item[latest], item.unit);
            row.year1 = format(item[latest - 1], item.unit);
            row.year2 = format(item[latest - 2], item.unit);
            row.year3 = format(item[latest - 3], item.unit);
            table.push(row);
        });
        return _(table).sortBy('order');
    },

    render: function(){

        var data = this.options.data;
        var viewPortWidth = _.min([$(window).width(), 1130])-30;
        var viewPortHeight = _.min([$(window).height()-100, 450]);

        var font_size = 11;
        if ( App.visualization.embedded ) {
            viewPortHeight = _.min([$(window).height(), 470]) - 20;
            if     (viewPortWidth<200)  font_size = 9;
            else if(viewPortWidth<400)  font_size = 10;
            else                        font_size = 11;
        }

        this.$el.html(
            this.template({
                'ref-area': data['ref-area'].label,
                'credits': this.options.credits,
                'year': data.latest,
                'year-1': data.latest-1,
                'year-2': data.latest-2,
                'year-3': data.latest-3,
                'font_size': font_size,
                'is-embedded': App.visualization.embedded,
                'has-rank': data['has-rank'],
                'EU28': (data.latest >= 2013)?'EU28':'EU27',
                'table': this.table()
            })
        );
    }
});

})();
