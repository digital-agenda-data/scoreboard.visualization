/*global App, _ */
/*jshint sub:true */


(function() {
"use strict";

function sort_serie(serie, sort){
    serie = _(serie).sortBy( function(item){
        if (sort.first_serie){
            return _.chain(sort.first_serie)
                    .pluck('name').indexOf(item['name'])
                    .value();
        }
        else{
            if (sort.sort_by == 'value'){
                var value = item['y'];
                if (isNaN(value)){
                    value = 0;
                }
                return sort.order * value;
            }
            if (sort.sort_by == 'label'){
                return item['name'];
            }
        }
    });
    return serie;
};

App.bar_colors = {
    bar_color: "#7FB2F0",
    special_bar_color: "#35478C",
    na_bar_color: "#DDDDDD"
};


App.format_series = function (data, sort, type, percent){
    var multiplicators = _(percent).map(function(pc){
        return pc?100:1;
    });
    if (type=='xy'){
        var countrycolor = function(code) {
            if (_.isNull(App.COUNTRY_COLOR[code])) {
                return '#1C3FFD';
            } else {
                return App.COUNTRY_COLOR[code];
            }
        }


        var label_formatter = function() {
            return this.point.name;
        };

        var series = _(data[0]['data']).map(function(datapoint) {
            var code = datapoint['code'];
            return {
                'name': App.COUNTRY_NAME[code],
                'color': countrycolor(code),
                'data': [{
                    'name': code,
                    'x': datapoint['value']['x'] * multiplicators[0],
                    'y': datapoint['value']['y'] * multiplicators[1]
                }],
                'marker': {
                    'radius': 5,
                    'symbol': 'circle',
                    'states': {
                        hover: {'enabled': true, 'lineColor': 'rgb(100,100,100)'}
                    }
                },
                'dataLabels': {
                    'enabled': true,
                    'x': 16,
                    'y': 4,
                    'formatter': label_formatter
                }
            }
        });
    }else{
        var first_serie = false;
        var extract_data = function(series_item){
            var value = series_item['value'];
            if(percent){
                if (percent[0]){
                    value*=100;
                }
            }
            return _.object([['name', series_item['label']],
                             ['code', series_item['code']],
                             ['y', value]]);
        };

        var labels_collection = []
        var series = _.chain(data).map(function(item){
            var data = _(item['data']).map(extract_data);
            labels_collection = _.chain(item['data']).
                                    pluck('label').
                                    union(labels_collection).
                                    value();
            return _.object(
                    ['name', 'data'],
                    [item['label'], data]);
        }).map(function(item){
            var serie = item['data'];
            _.chain(labels_collection).
                difference(_(serie).pluck('name')).
                each(function(diff_label){
                    _(serie).push(
                        _.object([['name', diff_label],
                                  ['y', null]])
                    );
                });
            if (sort && !first_serie){
                serie = sort_serie(serie, sort);
                first_serie = serie;
            }
            else if (sort){
                    _(sort).extend({'first_serie': first_serie});
                    serie = sort_serie(serie, sort);
            }
            return _.object(
                    ['name', 'data'],
                    [item['name'], serie]);
        }).value();
    }
    return _(series).sortBy('name');

}

})();

