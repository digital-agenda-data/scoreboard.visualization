/*global App, _ */
/*jshint sub:true */


(function() {
"use strict";

function sort_serie(serie, sort, category_facet){
    serie = _(serie).sortBy( function(item){
        if (sort.first_serie){
            return _.chain(sort.first_serie)
                    .pluck('name').indexOf(item['name'])
                    .value();
        }
        else{
            if (sort.by == 'value'){
                var value = item['y'];
                if (isNaN(value)){
                    value = 0;
                }
                return sort.order * value;
            }
            if (sort.by == 'category'){
                if (category_facet == 'time-period'){
                    return item['x'];
                } else {
                    return item['name'];
                }
            }
            if (sort.by == 'order'){
                if ( typeof(item['order']) == "string" ) {
                    return parseInt(item['order']);
                };
                if ( typeof(item['order']) == "number" ) {
                    return item['order'];
                };
                return 9999999;
            }
        }
    });
    return serie;
};

App.format_series = function (data, sort, multidim, percent, category, highlights, animation){
    var multiplicators = _(percent).map(function(pc){
        return pc?100:1;
    });
    var countrycolor = function(code) {
        if (_.isNull(App.COUNTRY_COLOR[code])) {
            return '#1C3FFD';
        } else {
            return App.COUNTRY_COLOR[code];
        }
    }
    if (multidim > 1){
        var label_formatter = function() {
            // not really used as each scenario redefines its own formatting
            return this.point.name;
        };

        var all_collection = {}
        var series = _.chain(data).map(function(serie){
            return _.chain(serie['data']).map(function(datapoint) {
                var notation = datapoint[category]['notation'];
                var data = [{
                    'name': notation,
                    'attributes': _(datapoint).omit('value'),
                    'x': datapoint['value']['x'] * multiplicators[0],
                    'y': datapoint['value']['y'] * multiplicators[1]
                }]
                if (multidim == 3){
                    data[0]['z'] = datapoint['value']['z'] * multiplicators[2]
                }
                var output = {
                    'name': datapoint[category]['label'],
                    'code': notation,
                    'color': countrycolor(notation),
                    'data': data,
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
                        'style': {
                            'font-weight': 'normal'
                        },
                        'formatter': label_formatter
                    }
                }
                _.chain(data).
                  each(function(item){
                      var new_serie = _(output).omit('data');
                      new_serie['data'] = [_(data[0]).omit(['x', 'y', 'z'])];
                      _(all_collection).extend(
                        _.object([[item['name'], new_serie]])
                      )
                  }).
                  uniq(all_collection);
                return output
            }).value();
        }).map(function(serie){
            var all_codes = _(all_collection).keys();
            _.chain(all_codes)
             .difference(_(serie).pluck('code'))
             .each(function(diff_code){
                serie.push(all_collection[diff_code]);
             });
            return _(serie).sortBy('name');
        }).value();
    }else{
        var first_serie = false;
        var highlights_counter = {};
        var extract_data = function(series_item){
            var value = series_item['value'];
            var point = _.object([['name', series_item[category]['label']],
                                 ['code', series_item[category]['notation']],
                                 ['order', series_item[category]['inner_order']],
                                 ['ending_label', series_item[category]['ending_label']],
                                 ['attributes', _(series_item).omit('value')],
                                 ['y', value]]);
            var color = null;
            if(_(highlights).contains(series_item[category]['notation'])){
                var code = series_item[category]['notation'];
                var country_color = App.COUNTRY_COLOR[code];
                var scale = new chroma.ColorScale({
                    colors: ['#000000', country_color],
                    limits: [data.length, 0]
                });
                if(!_(highlights_counter).has(code)){
                    highlights_counter[code] = 0;
                }
                var color = scale.getColor(highlights_counter[code]).hex();
                if (! animation) {
                    highlights_counter[code] += 1;
                }
            }
            _(point).extend({ 'color': color });
            return point;
        };

        var diffs_collection = {}
        var series = _.chain(data).map(function(item, key){
            // multiply with 100 for percentages
            _(item['data']).map(function(item) {
                var value = item['value'];
                if ( typeof(value) == "string" ) {
                    value = parseFloat(value);
                }
                if ( multiplicators[key] ) {
                    // multiple_series=2 (multilines)
                    item['value'] = value * multiplicators[key];
                } else {
                    // same unit of measure for all series
                    item['value'] = value * multiplicators[0];
                }
            });
            var data = _(item['data']).map(extract_data);
            _.chain(data).
              each(function(item){
                  _(diffs_collection).extend(
                    _.object([[item['code'], item['attributes']]])
                  )
              }).
              uniq(diffs_collection).
              value();
            return _.object(
                    ['name', 'ending_label', 'notation', 'order', 'color', 'data'],
                    [item['label'], item['ending_label'], item['notation'], item['order'],countrycolor(item['notation']), data]);
        }).map(function(item){
            var serie = item['data'];
            _.chain(diffs_collection).
              keys().
              difference(_(serie).pluck('code')).
              each(function(diff_code){
                  var data = diffs_collection[diff_code][category];
                  var attributes = _.object([[category, data]]);
                  _(serie).push(
                      _.object([['code', data['notation']],
                                ['name', data['label']],
                                ['ending_label', data['ending_label']],
                                ['order', data['inner_order']],
                                ['attributes', attributes],
                                ['y', null]])
                  );
              });
            if (category == 'time-period' || category == 'refPeriod'){
                var date_pattern = /^([0-9]{4})(?:-(?:([0-9]{2})|(?:Q([0-9]){1})|(?:H([0-9]){1})))*$/;
                _(serie).each(function(item){
                    var matches = date_pattern.exec(item['code']);
                    var year = parseInt(matches[1]);
                    var month = parseInt(matches[2]);
                    var day=1;
                    var quarter = parseInt(matches[3]);
                    var half = parseInt(matches[4]);
                    if (!_(quarter).isNaN() && _(month).isNaN()){
                        // YYYY-Q1 .. YYYY-Q4
                        month = (quarter * 3) - 2;
                        day = 15;
                    } else if (!_(half).isNaN() && _(month).isNaN()){
                        // YYYY-H1 .. YYYY-H2
                        month = (half * 6) - 3;
                        day = 1;
                    } else if(!_(month).isNaN()){
                        // expected values are 0-11
                        month = month - 1;
                        day = 15;
                    } else {
                        day = 1;
                        month = 6;
                    }
                    item['x'] = Date.UTC(year, month, day);
                })
            }

            if (sort && !first_serie){
                if ( sort.first_serie ) {
                    sort.first_serie = null;
                }
                serie = sort_serie(serie, sort, category);
                if(!sort.each_series){
                    first_serie = serie;
                }
            }
            else if (sort){
                    _(sort).extend({'first_serie': first_serie});
                    serie = sort_serie(serie, sort, category);
            }

            return _.object(
                    ['name', 'ending_label', 'notation', 'order', 'color', 'data'],
                    [item['name'], item['ending_label'], item['notation'], item['order'], countrycolor(item['notation']), serie]);
        }).value();
    }
    return series;
}

App.compute_plotLines = function compute_plotLines(coord, series, axis_type){
    var values = _.chain(series);
    var map_stage = function(serie){
        if (axis_type == 'categories'){
            var value = null;
            if (serie.length % 2 == 0){
                value = serie.length/2;
            }
            else{
                value = (serie.length-1)/2;
            }
            return _.object([
                ['min', value],
                ['max', value]
            ]);
        }
        else{
            var min =  _.chain(serie).pluck(coord).min().value();
            var max = _.chain(serie).pluck(coord).max().value();
            return _.object([
                ['min', min],
                ['max', max]
            ]);
        }
    };
    var reduce_stage = function(memo, item){
        var min = _([item.min, memo.min]).min();
        var max = _([item.max, memo.max]).max();
        return _.object([
            ['min', min],
            ['max', max]
        ]);
    };
    values = values.pluck('data').map(map_stage).reduce(reduce_stage).value();
    return (values.min + values.max)/2;
}

App.add_plotLines = function(chart, series, chart_type){
    _.chain([chart.xAxis, chart.yAxis]).each(function(item){
        _(item).each(function(axis){
            if (_.chain(chart_type).keys().contains(axis.xOrY).value()){
                axis.removePlotLine('median');
                axis.addPlotLine({
                    value: App.compute_plotLines(axis.xOrY, series, chart_type[axis.xOrY]),
                    width: 2,
                    color: 'red',
                    id: 'median'
                });
            }
        });
    });
}

App.disable_legend = function(chartOptions, options){
    if (options && (!options['series-legend-label'] || options['series-legend-label'] == 'none')){
        var disabled_legend = {
            legend: {enabled: false}
        };
        _(chartOptions).extend(disabled_legend);
    }
}

App.override_zoom = function() {
    Highcharts.Axis.prototype.zoom = function (newMin, newMax) {
        // override default zoom function in order to disable pinch zoom check
        // see this thread http://stackoverflow.com/questions/16796405/how-to-avoid-bad-behavior-zooming-to-areas-outside-the-data-range
		this.displayBtn = newMin !== undefined || newMax !== undefined;
		this.setExtremes( newMin, newMax, false,  undefined,  { trigger: 'zoom' });
		return true;
   };
}

App.set_default_chart_options = function(chartOptions){
    var menuItems = _.rest(Highcharts.getOptions().exporting.buttons.contextButton.menuItems, 2);
    var options = {
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                },
                exportButton: {
                    text: 'Download',
                    // Use only the download related menu items from the default context button
                    menuItems: menuItems
                },
                printButton: {
                    text: 'Print Chart',
                    onclick: function () {
                        this.print();
                    }
                }
            }
        },
        navigation: {
            buttonOptions: {
            }
        }
    }
    _(chartOptions).extend(options);
}


App.tick_labels_formatter = function(max100) {
    if (this.value < 0){
        return null;
    }
    if (max100 && this.value > 100){
        return null;
    }
    return this.value;
}

App.title_formatter = function(parts, meta_data){
    parts = _(parts).map(function(part){
        if(!part.prefix){
            part = _(part).omit('prefix');
        }
        if (!meta_data){
            part.text = part.facet_name + "(" + part.format + ")";
        }
        else if (_(meta_data).has(part.facet_name)){
            part.text = meta_data[part.facet_name][part.format];
        }
        else {
            part.text = '';
        }
        return part;
    });

    var title = '';
    var titleAsArray = [];

    _(parts).each(function(item, idx){
        var prefix = item.prefix || '';
        if (idx > 0 && !parts[idx-1].suffix && !prefix){
            prefix = ' ';
        }
        var suffix = item.suffix || '';
        var part = (item.text != 'Total')?item.text:null;
        if ( item.asArray ) {
            titleAsArray.push(part);
        } else {
            if (part){
                title += (prefix + part + suffix);
            }
        }
    });

    if ( titleAsArray.length != 0 ) { title = titleAsArray };
    
    return title;
}


})();

