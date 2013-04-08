/*global App, _, Highcharts */
/*jshint sub:true */

(function() {
"use strict";

var t = -1;
var bar_color = "#7FB2F0";
var special_bar_color = "#35478C";
var na_bar_color = "#DDDDDD";

function get_tick_data(input){
    input = _(input).sortBy('label');
    t += 1;
    if (t >= input.length) { t = 0; }
    var data = _(input).pluck('data');
    var out = _(data[t]).pluck('value');
    return out
};

App.get_snapshots = function(series, x_series){
    var out = _(series).map(
            function(item){
                var notations = [];
                if(item['data'].length != 0){
                    notations = _(item['data']).pluck('ref-area');
                }
                var diff = _.difference(_(x_series).keys(), notations);
                var data = item['data'];
                _(diff).each(function(notation){
                    this['data'].push({
                        'ref-area': notation,
                        'ref-area-label': x_series[notation] + '(N/A)',
                        'value': 'n/a'
                    });
                }, item);
                return { 'label': item['label'],
                         'data': _(data).sortBy('ref-area') }
            }
        );
    return _(out).sortBy('label');
}

App.chart_library['evolution_columns'] = function(container, options, meta_data) {
    var x_series = {};
    _(_(options['series']).max(
        function(item){
            return item['data'].length;
        }
    )['data']).map(function(item){
        x_series[item["ref-area"]] = item['ref-area-label']
    });
    var time_snapshots = App.get_snapshots(options['series'], x_series);
    var series = time_snapshots[0]['data'];
    var country_names = _(x_series).values().sort();
    var values = _(series).map(
        function(item){
            var result = item['value'] * 100;
            if (item['ref-area'] === "EU27"){
                return {'y': result,
                        'color': special_bar_color}
            }
            else{
                return result;
            }
    });

    var chartOptions = {
        chart: {
            zoomType: 'y',
            renderTo: container,
            defaultSeriesType: 'column',
            marginBottom: 150,
            events: {
                load: function() {
                    var morph = _.bind(function(){
                        _(get_tick_data(time_snapshots)).each(function(value, n){
                            if (isNaN(value)){
                                this.series[0].data[n].update(
                                    { color: na_bar_color },
                                    false,
                                    {duration: 950, easing: 'linear'}
                                )
                            }
                            else{
                                var color = bar_color;
                                var current_label = this.series[0].data[n].category;
                                if (x_series['EU27'] == current_label){
                                    color = special_bar_color;
                                };
                                this.series[0].data[n].update(
                                    { "color": color,
                                      "y": value * 100 },
                                    false,
                                    {duration: 950, easing: 'linear'}
                                );
                            }
                        }, this);
                        this.setTitle(null, {text: time_snapshots[t]['label']});
                        this.redraw();
                    }, this);
                    setInterval(morph, 1000);
                }
            }
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
            text: meta_data['x_title'],
            style: {
                color: '#000000',
                fontWeight: 'bold',
                fontSize:'1.2em',
                width: '700'
            }
        },
        subtitle: {
            text: meta_data['year_text'],
            align: 'left'

        },
        xAxis: {
            categories: country_names,
            labels: {
                rotation: -45,
                align: 'right',
                formatter: options['xlabels_formatter'],
                style: {
                    color: '#000000',
                }
             }
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: meta_data['y_title'],
                style: {
                    color: '#000000',
                    fontWeight: 'bold'
                }
            }
        },
        legend: {
            enabled:false
        },
        tooltip: {
            formatter: options['tooltip_formatter']
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [
            {
                name: options['indicator_label'],
                color: bar_color,
                data: values,
                animation: false
            }
        ]
    };

    var chart = new Highcharts.Chart(chartOptions);
};

})();
