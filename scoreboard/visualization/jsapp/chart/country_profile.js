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
        var unit_is_pc = false;
        if(unit && unit.toLowerCase().indexOf('pc_') !== -1){
            unit_is_pc = true;
        }

        if(value > 100){
            value = value.toFixed(0);
            return add_commas(value);
        }else{
            if (unit_is_pc){
                return (value * 100).toFixed(0);
            }
            return value.toFixed(2);
        }
    };


    // Highchart
    var series;
    if(options.subtype === 'bar'){
        series = App.format_series(
                        options['series'],
                        options['sort'],
                        options['multidim'],
                        [false],
                        options['category_facet'],
                        options['highlights']);

        var stack_series = [
            {
                name: 'Under EU average',
                color: '#7dc30f',
                dataLabels: {
                    color: '#000000',
                    enabled: true,
                    align: 'right',
                    crop: false,
                    inside: false,
                    overflow: 'none',
                    x: 50,
                    formatter: function(){
                        if(this.point.y >= 0){
                            var unit = this.point.attributes['unit-measure']['notation'];
                            var res = x_formatter(this.point.original, unit);
                            if(unit && unit.toLowerCase().indexOf('pc_') !== -1){
                                res += '%';
                            }
                            return res;
                        }else{
                            return '';
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
                    formatter: function(){
                        if(this.point.y){
                            var unit = this.point.attributes['unit-measure']['notation'];
                            var res = x_formatter(this.point.original, unit);
                            if(unit && unit.toLowerCase().indexOf('pc_') !== -1){
                                res += '%';
                            }
                            return res;
                        }else{
                            return '';
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

            item.name = '<strong>' + item.attributes.indicator['short-label'] + '</strong>';
            if(item.attributes.breakdown['short-label']){
                item.name += ' - ' + item.attributes.breakdown['short-label'];
            }
            if(item.attributes['unit-measure']['short-label']){
                item.name += ' (in ' + item.attributes['unit-measure']['short-label'] + ')';
            }

            // Fill stack
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

        var chartOptions = {
            chart: {
                renderTo: container,
                defaultSeriesType: 'bar',
                marginTop: 100,
                marginBottom: 100,
                marginLeft: App.isIE78()?600:300,
                marginRight: 60,
                height: 200 + series[0].data.length * 75,
                width: 1100
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
                x: 300,
                width: 750,
                style: {
                    color: '#000000',
                    fontFamily: 'Verdana',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    width: '600'
                }
            },
            subtitle: {
                y:60,
                text: options.titles.subtitle,
                style: {
                    fontFamily: 'Tahoma',
                    fontWeight: 'bold',
                    fontSize: '16px',
                },
                align: 'center',
                width: 600,
                x:300
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: 0,
                    align: 'right',
                    x: -10,
                    style: {
                        color: '#000000',
                        fontFamily: 'Tahoma',
                        fontSize: '10px',
                        width: 270
                    }
                 }
            },
            yAxis: [{
                min: 0,
                tickPositions: [0, 1, 2],
                 labels: {
                    formatter: function() {
                        return ['lowest EU country', 'EU average', 'highest EU country'][this.value];
                    }
                },
                title: {
                    text: options.titles.yAxisTitle,
                    style: {
                        color: '#000000',
                        fontWeight: 'bold'
                    }
                }
            },
            {
                title: {text: null},
                min: 0,
                max: 2,
                tickPositions: [0, 1, 2],
                plotBands: [{
                    color: 'red',
                    width: 2,
                    value: 1,
                    zIndex: 5
                }],
                labels: {
                    formatter: function() {
                        return ['lowest EU country', 'EU average', 'highest EU country'][this.value];
                    }
                },
                opposite:true
            }],
            legend: {
                enabled: true,
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'bottom',
                x: 0,
                y: -30,
                borderWidth: 0
            },
            tooltip: {
                formatter: function(){
                    var unit = this.point.attributes['unit-measure']['notation'];
                    var title = this.point.attributes['unit-measure']['short-label'];
                    var res = 'Original indicator value: ' + x_formatter(this.point.original, unit);
                    if(unit && unit.toLowerCase().indexOf('pc_') === -1){
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
                    stacking: 'normal'
                }
            },
            series: stack_series
        };

        App.set_default_chart_options(chartOptions);
        if (!options['legend']){
            App.disable_legend(chartOptions, options);
        }

        var chart = new Highcharts.Chart(chartOptions);

    // Custom table
    }else{
        series = options['series'];
        App.country_profile = new App.CountryProfileView({
            el: '#' + $(container).attr('id'),
            model: new Backbone.Model(),
            data: series[0].data,
            meta_data: options.meta_data,
            credits: options.credits,
            x_formatter: x_formatter
        });
    }
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
        this.$el.html(
            this.template({
                'ref-area': data['ref-area'].label,
                'credits': this.options.credits,
                'year': data.latest,
                'year-1': data.latest-1,
                'year-2': data.latest-2,
                'year-3': data.latest-3,
                'has-rank': data['has-rank'],
                'EU28': (data.latest >= 2013)?'EU28':'EU27',
                'table': this.table()
            })
        );
    }
});

})();
