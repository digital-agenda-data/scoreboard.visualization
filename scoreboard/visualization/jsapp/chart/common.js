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
                if (isNaN(value) || value == null){
                    value = 0;
                }
                return sort.order * value;
            }
            if (sort.by == 'category'){
                if (_.contains(App.TIME_PERIOD_DIMENSIONS, category_facet)){
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

App.sort_by_total_stacked = function (series, sort){
  // compute stacked value
  var total_stacked = {};
  _(series).each(function(serie) {
    _(serie.data).each(function(point) {
        if (!total_stacked[point.code]) {
          total_stacked[point.code] = { code: point.code, y: 0};
        }
        if (point.y ) {
          total_stacked[point.code].y += point.y;
        }
    });
  });
  var sorted_codes = _.chain(total_stacked)
    .sortBy(function(item) { return sort.order * item.y})
    .pluck('code')
    .value();
  // now sort all series
  _(series).each(function(serie) {
    serie.data = _(serie.data).sortBy( function(point){
        return sorted_codes.indexOf(point.code);
    });
  });
}

App.format_series = function (data, sort, multidim, category, highlights, animation, series_point_label, ignore_percents){
    // ignore_percents is only used by the country profile => multidim = 0
    var countrycolor = function(code) {
        if (_.isNull(App.COUNTRY_COLOR[code]) || _.isUndefined(App.COUNTRY_COLOR[code])) {
            return null;
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
                    'x': datapoint['value']['x'] *
                        (datapoint['unit-measure']?App.multiplicator(datapoint['unit-measure']['x']['notation']):1),
                    'y': datapoint['value']['y'] *
                        (datapoint['unit-measure']?App.multiplicator(datapoint['unit-measure']['y']['notation']):1)
                }]
                if (multidim == 3){
                    data[0]['z'] = datapoint['value']['z'] *
                        (datapoint['unit-measure']?App.multiplicator(datapoint['unit-measure']['z']['notation']):1);
                }
                var output = {
                    'name': datapoint[category]['label'],
                    'code': notation,
                    'color': countrycolor(notation),
                    'data': data,
                    'marker': {
                        'radius': App.visualization.embedded?3:5,
                        'symbol': 'circle',
                        'states': {
                            hover: {'enabled': true, 'lineColor': 'rgb(100,100,100)'}
                        }
                    },
                    'dataLabels': {
                        'enabled': true,
                        'style': {
                            color: '#000000',
                            fontWeight: 'normal',
                            fontSize: '10px',
                            fontFamily: App.font_family
                        },
                        'formatter': label_formatter
                    }
                };
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
        // not multidim
        var first_serie = false;
        var series_counter = {};
        var extract_data = function(series_item){
            var value = series_item['value'];
            var dict = {'short': 'short-label', 'long': 'label', 'none': 'label', 'notation': 'notation'};
            var point_names_from = 'label';
            if ( series_point_label ) {
                point_names_from = dict[series_point_label] || 'label';
            }
            var point_name = series_item[category][point_names_from] || series_item[category]['notation'];
            var point = _.object([['name', series_item[category][point_names_from]],
                                 ['code', series_item[category]['notation']],
                                 ['order', series_item[category]['inner_order']],
                                 ['ending_label', series_item[category]['ending_label']],
                                 ['attributes', _(series_item).omit('value')],
                                 ['y', value]]);
            var color = null;
            if(_(highlights).contains(series_item[category]['notation'])){
                var code = series_item[category]['notation'];
                var base_color;
                if ( data.length > 1 && !animation ) {
                  // for multiple series use the color of the series as base color
                  if(!_(series_counter).has(code)){
                    series_counter[code] = 0;
                  }
                  base_color = App.SERIES_COLOR[series_counter[code]++] || '#63b8ff';
                } else {
                  // for single series use the color of the country as base color
                  base_color = App.COUNTRY_COLOR[code] || '#63b8ff';
                }
                var scale = new chroma.ColorScale({
                    colors: ['#000000', base_color],
                    limits: [3, 0]
                });
                var color = scale.getColor(1).hex();
            }
            _(point).extend({ 'color': color });
            return point;
        };

        var diffs_collection = {}
        var series = _.chain(data).map(function(item, key){
            // multiply with 100 for percentages unless ignore_percents is true
            if (!ignore_percents) {
                _(item['data']).map(function(item) {
                    var value = item['value'];
                    if ( typeof(value) == "string" ) {
                        value = parseFloat(value);
                    }
                    item['value'] = value * (item['unit-measure']?App.multiplicator(item['unit-measure']['notation']):1);
                });
            }
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
                  // append missing points
                  // code duplicated here in order to re-create object['name']
                  var dict = {'short': 'short-label', 'long': 'label', 'none': 'label', 'notation': 'notation'};
                  var point_names_from = 'label';
                  if ( series_point_label ) {
                      point_names_from = dict[series_point_label] || 'label';
                  }
                  var point_name = data[point_names_from] || data['notation'];
                  _(serie).push(
                      _.object([['code', data['notation']],
                                ['name', point_name],
                                ['ending_label', data['ending_label']],
                                ['order', data['inner_order']],
                                ['attributes', attributes],
                                // if y is null, column is not displayed
                                ['y', null]])
                  );
              });
            if (_.contains(App.TIME_PERIOD_DIMENSIONS, category)){
                var date_pattern = /^([0-9]{4})(?:-(?:([0-9]{2})|(?:Q([0-9]){1})|(?:H([0-9]){1})))*$/;
                _(serie).each(function(item){
                    var matches = date_pattern.exec(item['code']);
                    var year = parseInt(matches[1]);
                    var month = parseInt(matches[2]);
                    var day=1;
                    var quarter = parseInt(matches[3]);
                    var half = parseInt(matches[4]);
                    /* month is shifted 6 month before because of the 'fake' ticks
                    // year label is displayed at 01.01.YYYY, but we want users to think
                    // that there is the center of the year */
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

            if ( sort && !sort.total_stacked ) {
                // only sort one by one if sort.total_stacked is not set
                if (!first_serie){
                    if ( sort.first_serie ) {
                        sort.first_serie = null;
                    }
                    serie = sort_serie(serie, sort, category);
                    if(!sort.each_series){
                        // if each_series is not set, the order of the first serie is kept
                        first_serie = serie;
                    }
                }
                else {
                    // rest of series, beginning with #2
                    _(sort).extend({'first_serie': first_serie});
                    serie = sort_serie(serie, sort, category);
                }
            }
            return _.object(
                    ['name', 'ending_label', 'notation', 'order', 'color', 'data'],
                    [item['name'], item['ending_label'], item['notation'], item['order'], countrycolor(item['notation']), serie]);
        }).value();
    }
    if ( sort && sort.total_stacked ) {
      // sort again all series, based on the total stacked value
      App.sort_by_total_stacked(series, sort);
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
    if (series.length > 0 ) {
      values = values.pluck('data').map(map_stage).reduce(reduce_stage).value();
      return (values.min + values.max)/2;
    } else return 0;
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
    if (options && (!options['series-legend-label'] || options['series-legend-label'] == 'none' ||
        chartOptions && chartOptions.series.length < 2)){
        var disabled_legend = {
            legend: {enabled: false}
        };
        _(chartOptions).extend(disabled_legend);
        // if the name of the single series is not a total, show it in chart title/subtitle
        if (chartOptions.series[0].notation && !_.contains(App.notation_totals, chartOptions.series[0].notation)) {
          if (!chartOptions.subtitle.text || chartOptions.subtitle.text == '') {
              // use chart subtitle instead of legend, if not used
            chartOptions.subtitle.text = chartOptions.series[0].name;
          } else {
              var title = chartOptions.title.text || '';
              // use chart title instead of legend
              chartOptions.title.text = title + ' - ' + chartOptions.series[0].name;
          }
        }
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
    Highcharts.setOptions({ chart: { style: { fontFamily: App.font_family }}});
    _(chartOptions).extend({
        navigation: {
            buttonOptions: {
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                }
            }
        }
    });
/* print and download buttons moved to share panel
    var menuItems = _.rest(Highcharts.getOptions().exporting.buttons.contextButton.menuItems, 2);
    if ( ! App.visualization.embedded ) {
        _(chartOptions).extend({
            exporting: {
                buttons: {
                    contextButton: {
                        enabled: false
                    },
                    exportButton: {
                        text: 'Download image',
                        // Use only the download related menu items from the default context button
                        menuItems: menuItems,
                        theme: {
                          'stroke-width': 1,
                          stroke: '#99C1D2',
                          fill: '#BEE0F0',
                          r: 3,
                         states: {
                             hover: {
                                 stroke: '#7CA8BB',
                                 fill: '#94C5DB'
                             },
                             select: {
                                 stroke: '#7CA8BB',
                                 fill: '#94C5DB'
                             }
                          }
                        }
                    },
                    printButton: {
                        text: 'Print chart',
                        theme: {
                          'stroke-width': 1,
                          stroke: '#398439',
                          fill: '#449D44',
                          r: 3,
                         states: {
                             hover: {
                                 stroke: '#0A710A',
                                 fill: '#2A862A'
                             },
                             select: {
                                 stroke: '#0A710A',
                                 fill: '#2A862A'
                             }
                          }
                        },
                        onclick: function () {
                            this.print();
                        }
                    }
                }
            }
        });
    }
*/
}

App.title_formatter = function(parts, meta_data){
    parts = _(parts).map(function(part){
        if(!part.prefix){
            part = _(part).omit('prefix');
        }
        //part.text = '';
        if (!meta_data){
            part.text = part.facet_name + "(" + part.format + ")";
        } else if (_(meta_data).has(part.facet_name)) {
            // todo: configurable list of notations for totals
            if ( meta_data[part.facet_name]['notation'] &&
                 _.contains(App.notation_totals, meta_data[part.facet_name]['notation'])) {
              part.text = null;
            } else {
              part.text = meta_data[part.facet_name][part.format];
            }
        }
        return part;
    });

    var title = '';
    var titleAsArray = [];

    _(parts).each(function(item, idx){
        if (item.text) {
          if ( item.asArray ) {
            titleAsArray.push(item.text);
          } else {
            var prefix = item.prefix || '';
            if (idx > 0 && !parts[idx-1].suffix && !prefix){
                prefix = ' ';
            }
            var suffix = item.suffix || '';
            title += (prefix + item.text + suffix);
          }
        }
    });

    if ( titleAsArray.length != 0 ) { title = titleAsArray };
    
    return title;
}


})();

