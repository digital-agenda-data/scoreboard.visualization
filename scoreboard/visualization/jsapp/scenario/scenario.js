/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.ScenarioChartView = Backbone.View.extend({

    className: 'highcharts-chart',

    initialize: function(options) {
        this.data_revision = options['data_revision'] || '';
        this.cube_url = options['cube_url'];
        this.model.on('change', this.load_chart, this);
        this.loadstate = options['loadstate'] || new Backbone.Model();
        this.loadstate.on('change', this.load_chart, this);
        this.schema = options['schema'];
        this.scenario_chart = options['scenario_chart'];
        this.multidim_value = [];
        this.dimensions_mapping = {};
        this.multiple_series = options['schema']['multiple_series'];
        this.client_filter = null;
        this.dimension_group_map = _.object(
            _(options['dimensions']).pluck('notation'),
            _(options['dimensions']).pluck('group_notation'));
        _(options.filters_schema).forEach(function(facet) {
            this.dimensions_mapping[facet['name']] = facet['dimension'];
            if(facet['name'] == this.schema['category_facet']) {
                this.client_filter = facet['name'];
            }
        }, this);
        _(options.values_schema).forEach(function(facet) {
            if(facet['multidim_value']) {
                this.multidim_value.push(facet['dimension']);
            }
        }, this);
        this.requests_in_flight = [];
        this.load_chart();
    },

    remove_loading_add_msg: function(txt){
        $("#the-chart").removeClass("loading-small").css({
            'font-size': '1.3em',
            'margin': '30px 0',
            'text-align': 'center'
        }).text(txt);
    },

    render: function() {
        if(this.data) {
            if ( this.data.series.length == 0 ) {
                this.remove_loading_add_msg('No data.');
            } else {
                this.scenario_chart(this, this.data, this.data.meta_data);
            }

        }
    },

    chart_ready: function(){
        this.$el.removeClass('loading-small');
        $("#sharerWrap").show();
    },

    get_meta_data: function(chart_data){
        var meta_data = {};
        chart_data['meta_data'] = meta_data;
        var requests = [];

        _(this.schema['labels']).forEach(function(label_spec, label_name) {
            if (_.chain(this.schema.facets).pluck('name').contains(label_spec.facet).value()){
                var facet_value = this.model.get(label_spec['facet']);
                if ( typeof facet_value == "object" ) {
                    // workaround around multiple values are supported by dimension_labels
                    facet_value = facet_value[0] || "";
                }
                var args = {
                    'dimension': this.dimensions_mapping[label_spec['facet']],
                    'value': facet_value,
                    'rev': this.data_revision
                };
                var ajax = $.getJSON(this.cube_url + '/dimension_labels', args);
                ajax.done(function(data) {
                    meta_data[label_name] = data;
                });
                requests.push(ajax);
            }
        }, this);

        return requests;
    },

    request_datapoints: function(url, args){
        var relevant_args = {}
        _(args).each(function(value, key){
            if (value!='any'){
                var pair = _.object([[key, value]]);
                _(relevant_args).extend(pair);
            }
        });
        App.trim_dimension_group_args(relevant_args, this.dimension_group_map);
        // remove whitelist filters from args
        relevant_args = _(relevant_args).omit(
            _.chain(this.options.filters_schema).where({'type':'whitelist'}).pluck('dimension').value()
        );
        relevant_args = _({rev: this.data_revision}).extend(relevant_args);
        delete relevant_args["__dataset"];
        return $.getJSON(url, relevant_args);
    },

    load_chart: function() {
        _(this.requests_in_flight).forEach(function(req) { req.abort(); });
        this.requests_in_flight = [];
        var incomplete = false;
        var args = {};
        var requests = [];
        _(this.dimensions_mapping).each(function(dimension, filter_name) {
            if(filter_name != this.multiple_series &&
               filter_name != this.client_filter) {
                args[filter_name] = this.model.get(filter_name);
                if(! args[filter_name]) { incomplete = true; }
            }
            if(this.loadstate.get(filter_name)) { incomplete = true; }
        }, this);
        if(incomplete) {
            // not all filters have values
            this.$el.addClass('loading-small');
            this.$el.html("");
            $("#sharerWrap").hide();
            return;
        }
        this.$el.html("");
        if (this.schema['multidim'] > 1){
            args['join_by'] = this.schema.category_facet;
        }
        // category_facet, value and unit-measure always in tooltip
        var tooltip_attributes = ['value', 'unit-measure'];;
        if ( this.schema['tooltips'] ) {
            tooltip_attributes = tooltip_attributes.concat(_.keys(this.schema['tooltips']));
        }
        var category_facet = this.schema.category_facet;
        if (this.multiple_series) {
            tooltip_attributes.push(this.multiple_series);
        }
        var multidim = this.schema['multidim'];
        var category_facet = _(this.schema.facets).findWhere({name:this.schema['category_facet']});
        if ( category_facet ) {
            var highlights = category_facet.highlights;
        }
        var multiple_series = this.multiple_series;
        var chart_data = {
            'tooltip_formatter': function() {
                // TODO: move this function
                var attrs = this.point.attributes;
                var out = '<b>' + attrs[category_facet.name].label + '</b>';
                //out += JSON.stringify(attrs);
                // point value(s) and unit-measure
                if (_.contains(tooltip_attributes, 'value')) {
                    if ( multidim ) {
                        out += '<br><b>x</b>: ';
                        if (attrs['unit-measure'] && App.unit_is_percent(attrs['unit-measure']['x']['notation'])) {
                          // keep only three significant digits
                          out += this.x.toPrecision(3);
                          out += '%';
                        } else {
                          out += Math.round(this.x*10)/10;
                        }
                        out += ' ';
                        if (_.contains(tooltip_attributes, 'unit-measure') && attrs['unit-measure']) {
                            out += attrs['unit-measure']['x'].label;
                        }
                    }
                    out += '<br>';
                    if ( multidim ) {
                        out += '<b>y</b>: ';
                    }
                    var is_percent = false;
                    if ( this.point.isNA ) {
                        out += '<b>' + this.series.name  + '</b><br>';
                        out += '<b>Data not available</b>'
                    } else {
                        // keep only three significant digits
                        var is_percent = false;
                        if (attrs['unit-measure']) {
                            if (multidim) {
                                is_percent = App.unit_is_percent(attrs['unit-measure']['y']['notation']);
                            } else {
                                is_percent = App.unit_is_percent(attrs['unit-measure']['notation']);
                            }
                        }
                        if ( is_percent ) {
                          out += this.y.toPrecision(3);
                          out += '%';
                        } else {
                          if (this.y < 1) {
                            out += Math.round(this.y*1000)/1000;
                          } else if (this.y < 10) {
                            out += Math.round(this.y*100)/100;
                          } else {
                            out += Math.round(this.y*10)/10;
                          }
                        }
                    }
                    out += ' ';
                    if (_.contains(tooltip_attributes, 'unit-measure') && attrs['unit-measure']) {
                        if ( multidim ) {
                            out += attrs['unit-measure']['y'].label;
                        } else {
                            out += attrs['unit-measure'].label;
                        }
                    }
                    if ( multidim == 3 ) {
                        out += '<br><b>z</b>: ';
                        if (attrs['unit-measure'] && App.unit_is_percent(attrs['unit-measure']['z']['notation'])) {
                          // keep only three significant digits
                          out += this.point.z.toPrecision(3);
                          out += '%';
                        } else {
                          out += Math.round(this.point.z*10)/10;
                        }
                        out += ' ';
                        if (_.contains(tooltip_attributes, 'unit-measure') && attrs['unit-measure']) {
                            out += attrs['unit-measure']['z'].label;
                        }
                    }
                }
                // additional attributes
                _(_.without(tooltip_attributes, 'value', 'unit-measure')).each(function(attr) {
                    if ( multidim ) {
                        var dims = ['x', 'y'];
                        if ( multidim == 3 ) {
                            dims.push('z');
                        }
                        _.each(dims, function(dim) {
                            if ( attrs[attr] && typeof attrs[attr][dim] != "undefined" && attrs[attr][dim]) {
                                // values per dim
                                if ( typeof attrs[attr][dim].label != "undefined" && attrs[attr][dim].label ) {
                                    out += '<br><b>' + attr + '-' + dim + '</b>: ' + attrs[attr][dim].label;
                                } else {
                                    out += '<br><b>' + attr + '-' + dim + '</b>: ' + attrs[attr][dim];
                                }
                            } else if ( attrs[attr] && typeof attrs[attr][dim] == "undefined" ) {
                                // common values for all dims
                                if ( dim === dims[0] && typeof attrs[attr].label != "undefined" && attrs[attr].label ) {
                                        out += '<br><b>' + attr + '</b>: ' + attrs[attr].label;
                                }
                                return;
                            }
                        });
                    } else {
                        if ( attrs[attr] && typeof attrs[attr].label != "undefined" ) {
                            if ( attrs[attr].label != null ) {
                                out += '<br><b>' + attr + '</b>: ' + attrs[attr].label;
                            }
                        } else if ( attrs[attr] ) {
                            if ( attrs[attr] != null ) {
                                out += '<br><b>' + attr + '</b>: ' + attrs[attr];
                            }
                        }
                    }
                });

                return out;
            },
            'credits': {
                'href': this.schema['credits'] && this.schema['credits']['link'] || 'http://ec.europa.eu/digital-agenda/en/graphs/',
                'text': this.schema['credits'] && this.schema['credits']['text'] || 'European Commission, Digital Agenda Scoreboard'
            },
            'xlabels_formatter': function() {
                var max_length = 15;
                if (this.value.length > max_length){
                    return this.value.substr(0, max_length) + ' ...';
                }
                return this.value;
            },
            'series_names': {},
            'series_ending_labels': {},
            'plotlines': this.schema['plotlines'] || false,
            'animation': this.schema['animation'] || false,
            'series-legend-label': this.schema['series-legend-label'] || 'none',
            'series-ending-label': this.schema['series-ending-label'] || 'none',
            'series-point-label': this.schema['series-point-label'] || 'none',
            'multiseries': this.multiple_series,
            'category_facet': this.schema['category_facet'],
            'subtype': this.schema.chart_subtype,
            'highlights': highlights,
            'sort': this.schema['sort'],
            'multidim': this.schema['multidim'],
            'chart_type': this.schema['chart_type'],
            'custom_properties': this.schema['custom_properties']
        };

        var multiseries_values = null;
        var data_method = '';
        if (this.schema['multidim'] == 3) {
            data_method = '/datapoints_xyz';
        }
        else if (this.schema['multidim'] == 2) {
            data_method = '/datapoints_xy';
        }
        else if(this.schema['chart_type'] === 'country_profile'){
            args.subtype = this.schema['chart_subtype'];
            // TODO: proper handling of all-values dimensions
            // indicator is a filter because it is the category facet
            args = _.omit(args, 'indicator');
            data_method = '/datapoints_cp';
        }
        else if(this.schema['chart_type'] === 'country_profile_polar'){
            args.subtype = 'bar';
            data_method = '/datapoints_cp';
        }
        else {
            data_method = '/datapoints';
        }
        var datapoints_url = this.cube_url + data_method;

        if (!this.multiple_series) {
            multiseries_values = [null];
            requests.push(this.request_datapoints(datapoints_url, args));
        } else {
            if ( this.multiple_series == 2 ) {
                multiseries_values = ['x', 'y'];
                //this.client_filter = null;

                var xpairs = _.filter(_.pairs(args), function(pair) {return pair[0].substr(0,2) != 'y-'});
                var ypairs = _.filter(_.pairs(args), function(pair) {return pair[0].substr(0,2) != 'x-'});

                _(xpairs).map(function(pair) {
                    if ( pair[0].substr(0,2) == 'x-' ) {
                        pair[0] = pair[0].substr(2)
                    };
                    return;
                });

                _(ypairs).map(function(pair) {
                    if ( pair[0].substr(0,2) == 'y-' ) {
                        pair[0] = pair[0].substr(2)
                    };
                    return;
                });

                var xargs = _.object(xpairs);
                var yargs = _.object(ypairs);

                if ( xargs.__dataset ) {
                    var get_cube_uri = function(dataset, name){
                      var fields = App.visualization.filters_box.filters;
                      var dimension_options = _.findWhere(fields, {name: name}).dimension_options;
                      return _.findWhere(dimension_options, {notation: dataset}).uri;
                    };

                    var xdatacube = get_cube_uri(xargs.__dataset, "x-__dataset");
                    var ydatacube = get_cube_uri(yargs.__dataset, "y-__dataset");

                    requests.push(this.request_datapoints(xdatacube + "/datapoints", xargs));
                    requests.push(this.request_datapoints(ydatacube + "/datapoints", yargs));
                } else {
                    // compatibility with charts that do not user dataset selector
                    requests.push(this.request_datapoints(datapoints_url, xargs));
                    requests.push(this.request_datapoints(datapoints_url, yargs));
                }
            } else {
                var groupby_dimension = this.dimensions_mapping[
                    this.multiple_series];
                multiseries_values = this.model.get(this.multiple_series);
                requests = _(multiseries_values).map(function(value) {
                    args[groupby_dimension] = value;
                    return this.request_datapoints(datapoints_url, args);
                }, this);

                var groupby_facet = _(this.schema.facets).find(function(facet, idx){
                    return facet['name'] == groupby_dimension;
                });
                var labels_args = {
                    'dimension': groupby_dimension,
                    'rev': this.data_revision
                };
                if (groupby_facet){
                    _.chain(groupby_facet.constraints)
                     .values()
                     .each(function(facet){
                        if ( this.model.get(facet) != 'any' ) {
                            _(labels_args).extend(
                                _.object([
                                    [facet, this.model.get(facet)]
                                ])
                            );
                        }
                    }, this);
                }
                var labels_url = '/dimension_options_' + 'xyz'.slice(0, this.schema.multidim);
                if (!this.schema.multidim) {
                    labels_url = '/dimension_options';
                }
                var labels_request = $.getJSON(this.cube_url + labels_url, labels_args);
                var dict = {'short': 'short_label', 'long': 'label', 'none': 'notation'};
                var series_names = 'notation';
                if ( this.schema['series-legend-label'] ) {
                    series_names = dict[this.schema['series-legend-label']] || 'notation';
                }
                var series_ending_labels = 'notation';
                if ( this.schema['series-ending-label'] ) {
                    series_ending_labels = dict[this.schema['series-ending-label']] || 'notation';
                }
                labels_request.done(function(data) {
                    var results = data['options'];
                    chart_data['series_names'] = _.object(
                        _(results).pluck('notation'),
                        _(results).pluck(series_names));
                    chart_data['series_ending_labels'] = _.object(
                        _(results).pluck('notation'),
                        _(results).pluck(series_ending_labels));
                });
                requests.push(labels_request);
            }
        }

        var client_filter_options = [];
        if ( this.client_filter ) {
            client_filter_options = this.model.get(this.client_filter);
        }

        _(this.get_meta_data(chart_data)).forEach(function(req) {
            requests.push(req);
        });

        this.whitelist_dimensions = _.chain(this.options.filters_schema).where({'type':'whitelist'}).pluck('dimension').value();
        // check if we need whitelist
        var that = this;
        if (this.whitelist_dimensions.length > 0) {
            var whitelist_request = $.getJSON(this.cube_url + '/whitelist.json');
            whitelist_request.done(function(data) {
                var result = _(data).map(function(obj) {
                    // pick only whitelisted properties and convert to lowercase
                    var newobj = {}
                    _(that.whitelist_dimensions).each(function(dimension){
                        if (obj[dimension]) {
                          newobj[dimension] = obj[dimension].toLowerCase();
                        }
                    });
                    return newobj;
                })
                that.whitelist_data = result;
            });
            requests.push(whitelist_request);
        }
        if (this.schema['chart_type'] === 'country_profile_polar') {
            // only store the whitelist in App.whitelist
            var whitelist_request = $.getJSON(this.cube_url + '/whitelist.json');
            whitelist_request.done(function(data) {
                App.whitelist = _(data).map(function(obj) {
                  var newobj = {};
                  _(_(obj).pairs()).each(function (item) {
                    if (item[0] == 'name') {
                      newobj['name'] = item[1];
                    } else {
                      newobj[item[0]] = item[1].toLowerCase();
                    }
                  });
                  return newobj;
                });
            });
            requests.push(whitelist_request);
        }

        this.requests_in_flight = requests;

        var ajax_calls = $.when.apply($, requests);
        ajax_calls.done(_.bind(function() {
            var responses = _(arguments).toArray();
            if(requests.length < 2) { responses = [responses]; }

            chart_data['series'] = _(multiseries_values).map(function(value, n) {
                var sample_point, legend_candidates,
                    resp = responses[n],
                    datapoints = resp[0]['datapoints'];
                if(this.client_filter && this.multiple_series != 2 &&
                    (this.schema['chart_type'] !== 'country_profile' && this.schema['chart_type'] !== 'polar')  ) {
                    // filter values based on the multiple select input
                    var dimension = this.dimensions_mapping[this.client_filter];
                    datapoints = _(datapoints).filter(function(item) {
                        return _(client_filter_options).contains(
                            item[dimension]['notation']);
                    }, this);
                }
                // filter based on whitelist
                if (this.whitelist_data) {
                    datapoints = _(datapoints).filter(function(item) {
                        var item_extract = {};
                        _(this.whitelist_dimensions).each(function(dimension) {
                            // extract only the whitelisted properties (in lowercase)
                            item_extract[dimension] = item[dimension]['notation'].toLowerCase();
                        });
                        return _(this.whitelist_data).where(item_extract).length > 0;
                    }, this);
                    if (_(this.options.filters_schema).where({'dimension':'time-period', 'type':'select'}).length > 0) {
                        // filter only latest values for time-period
                        var keys = _.keys(this.whitelist_data[0]);
                        keys.push('time-period');
                        // cannot use _.uniq because we need to keep the most recent value
                        var filtered_datapoints = {};
                        _(datapoints).each(function(item) {
                            var key = _.chain(item).pick(keys).pluck('notation').value();
                            // extract only year (assume the format is: YYYY, YYYY-MM, YYYY-MM-DD etc)
                            key[keys.length-1] = key[keys.length-1].split('-')[0];
                            if (filtered_datapoints[key]) {
                              // there is already another datapoint for the same time-period
                              // keep only most recent, assume date format is comparable
                              if (item['time-period']['notation'] > filtered_datapoints[key]['time-period']['notation']) {
                                  filtered_datapoints[key] = item;
                              }
                            }
                            filtered_datapoints[key] = item;
                        }, this);
                        datapoints = _.values(filtered_datapoints);
                    }
                }
                if ( this.multiple_series == 2 ) {
                    sample_point = datapoints[0];
                    if ( sample_point ) {
                        legend_candidates = _.chain(this.schema.facets)
                            .pluck('dimension')
                            .unshift('indicator')
                            .filter(
                                function(item){
                                    return (sample_point[item] !== undefined
                                        && sample_point[item]['label'] !== undefined);
                                }
                            ).value();
                        chart_data['series_names'][['x', 'y'][n]] =
                            sample_point[legend_candidates[0]]['label'] + ' '
                            + ['(left side)', '(right side)'][n];
                    }
                }

                return {
                    'label': chart_data['series_names'][value],
                    'ending_label': chart_data['series_ending_labels'][value],
                    'notation': value,
                    'data': datapoints
                };
            }, this);
            chart_data['titles'] = _.object(
                _(this.schema.titles).map(function(parts, type){
                    return [type, App.title_formatter(parts,
                                                       chart_data.meta_data)];
                }, this)
            );

            if ( this.model.get('indicator') && this.model.get('unit-measure') ) {
                // enable stacking of breakdowns
                if (this.model.get('unit-measure') == 'pc_' + this.model.get('indicator')) {
                    chart_data['stacked'] = true;
                }
            }

            this.data = chart_data;
            this.render();
        }, this)).fail(function(){
            that.remove_loading_add_msg('Error occured. Please refresh the page.');
        });
    }

});


App.GraphControlsView = Backbone.View.extend({

    className: 'chart-controls',

    template: App.get_template('scenario/graph_controls.html'),

    events: {
        'click #toolbar #prev': 'on_prev',
        'click #toolbar #play': 'on_auto_change',
        'click #toolbar #next': 'on_next'
    },

    initialize: function(options) {
        this.chart = options['chart']
        _(this.chart).extend(Backbone.Events);
        this.snapshots_data = options['snapshots_data'];
        this.range = options['range'];
        this.interval = options['interval'];
        this.model.on('change', this.render, this);
        this.model.set({'value': this.snapshots_data.length - 1,
                        'auto': false});
        this.multiseries = options['multiseries'] || false;
        this.plotlines = options['plotlines'] || false;
        this.chart_type = options['chart_type'];
        this.sort = options['sort'];
        this.update_subtitle();
    },

    update_data: function(snapshots_data){
        this.snapshots_data = snapshots_data;
        this.model.set({'value': this.snapshots_data.length - 1});
        this.update_chart();
    },

    update_plotlines: function(new_data){
         if (! this.multiseries){
             new_data = [new_data];
         }
         App.add_plotLines(this.chart, new_data, this.chart_type);
    },

    update_subtitle: function(){
        var subtitle = this.snapshots_data[this.model.get('value')]['ending_label'];
        this.chart.setTitle(null,
                {
                    text: subtitle
                }
        );
    },

    update_chart: function(){
        var new_data = this.snapshots_data[this.model.get('value')];
        _(this.chart.series).each(function(serie, serie_idx){
            _(serie['data']).each(function(item, item_idx){
                var point_data = null;
                if (this.multiseries) {
                    point_data = new_data[serie_idx]['data'][item_idx];
                }
                else {
                    point_data = new_data['data'][item_idx];
                }
                item.update(point_data,
                            false,
                            {duration: 950, easing: 'linear'});
            }, this);
        }, this);
        if (this.plotlines){
            this.update_plotlines(new_data);
        }
        if (this.sort && this.sort.each_series){
            this.chart.xAxis[0].categories =  _(new_data['data']).pluck('name');
        }
        else if(this.sort){
            this.chart.xAxis[0].categories =  _(this.snapshots_data[this.model.get('value')]['data']).pluck('name');
        };
        this.chart.redraw();
        this.update_subtitle();
    },

    on_next: function(){
        if (App.is_touch_device()) {
          App.jQuery('html, body').animate({ scrollTop: App.jQuery(".chart-controls").offset().top-10 }, 1);
        }
        var current_value = this.model.get('value');
        var max = this.snapshots_data.length - 1;
        var next_value = current_value + 1;
        if (next_value > max){
            next_value = 0;
        }
        this.model.set('value', next_value);
        this.update_chart();
    },

    on_prev: function(){
        if (App.is_touch_device()) {
          App.jQuery('html, body').animate({ scrollTop: App.jQuery(".chart-controls").offset().top-10 }, 1);
        }
        var current_value = this.model.get('value');
        var max = this.snapshots_data.length - 1;
        var next_value = current_value - 1;
        if (next_value < 0){
            next_value = max;
        }
        this.model.set('value', next_value);
        this.update_chart();
    },

    on_auto_change: function() {
        var prev = this.model.get('auto');
        var options = this.model.attributes;
        this.model.set('auto', !prev);
        if(options['value'] == this.snapshots_data.length - 1){
            options['auto'] = true;
            options['value'] = 0;
            this.model.set(options);
            this.update_chart();
        }
        if (prev){
            clearInterval(this.interval);
        }
        else{
            this.interval = setInterval(_.bind(function(){
                var idx = options['value'];
                var chart = this.chart;
                if (idx < this.snapshots_data.length){
                    this.update_chart();
                    options['value']+=1;
                }
                else{
                    options['auto'] = false;
                    clearInterval(this.interval);
                    options['value'] = 0;
                    this.model.set(options);
                    this.render();
                }
            }, this), 1000);
        }
    },

    render: function() {
        this.$el.html(this.template(
            { 'auto': this.model.get('auto'), 'is_not_touch_device': !App.is_touch_device() }
        ));
        var prev = this.$el.find('#prev');
        var play = this.$el.find('#play');
        var next = this.$el.find('#next');
        App.plone_jQuery(prev).button({
            text: false,
            icons: {
                primary: "ui-icon-seek-start"
            }
        });
        App.plone_jQuery(play).button({
            text: false,
            icons: {
                primary: this.model.get('auto')?"ui-icon-pause":"ui-icon-play"
            }
        });
        App.plone_jQuery(next).button({
            text: false,
            icons: {
                primary: "ui-icon-seek-end"
            }
        });
    }
});


App.AnnotationsView = Backbone.View.extend({

    template: App.get_template('scenario/annotations.html'),

    initialize: function(options) {
        this.data_revision = options['data_revision'] || '';
        this.cube_url = options['cube_url'];
        this.schema = options['schema'];
        this.dimensions_mapping = _.object(
            _(this.schema['facets']).pluck('name'),
            _(this.schema['facets']).pluck('dimension')
        );
        this.model.on('change', this.render, this);
        this.description = $('#parent-fieldname-description').detach();
        this.render();
    },

    render: function() {
        var data = [];
        var requests = [];
        var annotations = this.schema['annotations'] || {};
        _(annotations['filters']).each(function(filter, key) {
            var args = {};
            args['dimension'] = this.dimensions_mapping[filter.name];
            var facet_values = this.model.get(filter.name);
            if(!_(facet_values).isArray()){
                facet_values = [facet_values];
            }
            _(facet_values).each(function(value){
                args['value'] = value;
                if(! args['value']) {
                    return;
                }
                args['rev'] = this.data_revision;
                var url = this.cube_url + '/dimension_value_metadata';
                requests.push(
                    $.getJSON(url, args, function(resp) {
                        data.push(resp);
                        _(resp).extend({filter_name: filter.name});
                    })
                );
            }, this);
        }, this);
        var ajax_calls = $.when.apply($, requests);
        ajax_calls.done(_.bind(function() {
            // handler for metadata (annotations) requests
            this.$el.empty();
            var chart_description = this.description.html();
            var section_title = this.schema['annotations'] &&
              this.schema['annotations']['title'] ||
              'Definition and scopes:';
            if ( this.schema.annotations && this.schema.annotations.notes ) {
                chart_description = this.schema.annotations.notes;
            }
            if(data && data.length > 0) {
                var blocks_order = _(annotations.filters).pluck('name');
                var blocks = _.chain(data).sortBy(function(item){
                    return _(blocks_order).indexOf(item['filter_name']);
                }).map(function(item){
                    var facet_name = item['filter_name'];
                    var facet = _(this.schema.facets).find(function(item){
                        return item['name'] == facet_name
                    });
                    return _(item).extend({
                        "filter_label": facet.label
                    });
                }, this).value();
            }
            var context = {
                 "description": chart_description,
                 "section_title": section_title,
                 "indicators_details_url": this.cube_url + '/indicators',
                 "blocks": blocks
            };
            this.trigger('metadata_ready', context);
            this.$el.html(this.template(context));
        }, this));
    }

});

var BaseDialogView = Backbone.View.extend({

    id: 'add-comment',
    className: '',
    form_action: '',
    template: App.get_template('scenario/modal_comment.html'),

    events: {
        'click #btn-submit': 'submit',
        'click #btn-cancel': 'cancel'
    },

    initialize: function() {
        _(this).bindAll();
        this.form_action = this.options.form_action;
    },

    validate: function() {
        var self = this;
        var form = this.$el.find('form');

        var title = form.find('#title').attr('value');
        var title_error = App.jQuery('#title_error');

        if (title.length <= 0) {
            title_error.text('Title required!');
            return false;
        } else {
            title_error.text('');
        }
    },

    submit: function() {
        var self = this;
        var form = this.$el.find('form');

        if (self.validate() === false) {
            return false
        }

        var text = form.find('#text').attr('value');
        var chart_title = $('#the-chart').find(".highcharts-title").text()
        var origin = App.jQuery('<a>', {
            'href': window.location.href,
            'text': chart_title,
            'target' : '_blank'
        });
        text = text + '<p> This comment is related to chart ' + origin[0].outerHTML + '</p>';

        var action = form.attr('action');
        var formData = form.serializeArray();

        for (var i=0; i<formData.length; i++) {
            if (formData[i].name === 'text') {
                formData[i].value = text;
            }
        }

        var submit_btn = form.find('#btn-submit');
        formData.push({ name: submit_btn.attr('name'),
                        value: submit_btn.attr('value') });

        form.on('submit', function(){
            App.jQuery.post(action, formData, function(data) {
                if(data.indexOf('incorrect-captcha-sol') > -1) {
                    App.jQuery('#captcha_error').text('Invalid recaptcha solution');
                    Recaptcha.reload();
                } else {
                    var board_url = action.split('add_conversation_form')[0];
                    self.submitted(board_url);
                }
            });
              return false;
           });
    },

    cancel: function() {
        this.$el.dialog('destroy').remove();
        Recaptcha.destroy();
        return false;
    },

    submitted: function(board_url){
        var self = this;
        var result = App.jQuery('<div>');
        var msg_text;

        if (App.jQuery('body').hasClass('userrole-authenticated')) {
            msg_text = 'Message submitted! You can access the discussion board ';
        } else {
            msg_text = 'Your comment has been submitted for approval. In the meantime you can view other comments ';
        }

        var msg = App.jQuery('<span>', {
            'text': msg_text
        });
        var board_link = App.jQuery('<a>', {
            'href': board_url,
            'text': 'here'
        });
        var ok_btn = $('<button/>', {
            text: 'OK',
            click: function () { self.$el.dialog('close'); }
        });
        result.append(msg);
        result.append(board_link);
        this.$el.empty();
        this.$el.append(result);
        this.$el.append(ok_btn);
    },

    render: function() {
        var self = this;
        this.$el.html(this.template()).dialog({width: 600,
                                               title: 'Add comment',
                                               close: function(event, ui)
                                                    {
                                                        self.cancel();
                                                    }
                                                });
        this.$el.find('form').attr('action', this.form_action);
        self.recaptcha = App.jQuery.get('@@captcha_pub', function(data) {
            Recaptcha.create(data,
                "captcha_field",
                {
                  theme: "red",
                  callback: Recaptcha.focus_response_field
                });
        });
    },
 });

App.ShareOptionsView = Backbone.View.extend({

    events: {
        'click #highcharts_zoom_in': 'highcharts_zoom_in',
        'click #highcharts_zoom_reset': 'highcharts_zoom_reset',
        'click #highcharts_print': 'highcharts_print',
        'click #highcharts_download': 'highcharts_download',
        'click #highcharts_download_svg': 'highcharts_download_svg',
        'click #highcharts_download_local': 'highcharts_download_local',
        'click #csv': 'request_csv',
        'click #excel': 'request_excel',
        'click #embed': 'request_embed',
        'click #view_comments': 'request_forum',
        'click #comment': 'request_comment'
    },

    template: App.get_template('scenario/share.html'),

    initialize: function(options) {
        this.url = App.SCENARIO_URL;
        this.related = $('#viewlet-below-content-body').detach();
        this.form = App.jQuery('<form>', {
            'action': App.URL + '/export.csv',
            'target': '_top',
            'method': 'POST'
        });
        this.svg_form = App.jQuery('<form>', {
            'id': 'svg2pngform',
            'action': App.URL + '/svg2png',
            'target': '_top',
            'method': 'POST'
        });
        App.jQuery(this.svg_form).append(
            App.jQuery('<input>', {
                'name': 'svg',
                'type': 'hidden'
            }
        ));
        var tokens = window.location.pathname.split("/");
        var filename = tokens[tokens.length-1];
        App.jQuery(this.svg_form).append(
            App.jQuery('<input>', {
                'name': 'filename',
                'type': 'hidden',
                'value': filename
            }
        ));
        this.render();
    },

    request_csv: function(ev){
        ev.preventDefault();
        App.jQuery('input[name="format"]', this.form).remove();
        this.$el.find('form').submit();
    },

    request_excel: function(ev){
        ev.preventDefault();
        App.jQuery('input[name="format"]', this.form).remove();
        App.jQuery(this.$el.find('form')).append(
            App.jQuery('<input>', {
                'name': 'format',
                'value': 'xls',
                'type': 'hidden'
            }
        )).submit();
    },

    request_embed: function(ev){
        ev.stopPropagation();
        window.location.href = window.location.pathname + "/embedded" + window.location.hash;
        return false;
    },

    highcharts_print: function(ev){
        ev.stopPropagation();
        App.chart.print();
    },

    highcharts_enable_zoom: function(zoom_type) {
        if (!App.chart.options.chart.zoomType) {
            App.chart.options.chart.zoomType = zoom_type;
            App.chart = new Highcharts.Chart(App.chart.options);
            App.jQuery('#highcharts_zoom_in').hide();
            App.jQuery('#highcharts_zoom_reset').show();
        }
    },

    highcharts_zoom_in: function(ev){
        // custom button only visible in touchscreen devices
        ev.stopPropagation();
        if (App.chart.options.chart.type == 'column') {
            this.highcharts_enable_zoom('x');
            App.chart.xAxis[0].setExtremes(App.chart.xAxis[0].getExtremes().dataMin, Math.ceil(App.chart.xAxis[0].getExtremes().max/2));
        } else if (App.chart.options.chart.type == 'spline') {
            this.highcharts_enable_zoom('xy');
        }
        App.jQuery('html, body').animate({ scrollTop: App.jQuery("#the-chart").offset().top }, 1);
    },
    
    highcharts_zoom_reset: function(ev){
        ev.stopPropagation();
        if (App.chart.options.chart.zoomType) {
            // disable zoom and recreate chart
            App.chart.options.chart.zoomType = null;
            App.chart = new Highcharts.Chart(App.chart.options);
            App.jQuery('#highcharts_zoom_in').show();
            App.jQuery('#highcharts_zoom_reset').hide();
        }
        App.chart.zoomOut();
        //App.chart.xAxis[0].setExtremes(null, null);
        //App.chart.yAxis[0].setExtremes(null, null);
        App.jQuery('html, body').animate({ scrollTop: App.jQuery("#the-chart").offset().top }, 1);
    },
    
    highcharts_download: function(ev){
        ev.stopPropagation();
        var chartdiv = $(".highcharts-container");
        if (chartdiv && App.chart.options && App.chart.options.exporting) {
            //var minwidth = Math.min($(window).width(), 1200);
            var minwidth = $(chartdiv).width();
            if (App.chart.options.chart.polar) {
                minwidth = 1200;
            } else if (App.chart.options.yAxis[0].title.text) {
                var ytitle_lines = App.chart.options.yAxis[0].title.text.split('<br>');
                _(ytitle_lines).each(function(line) {
                    minwidth =  Math.max(minwidth, 7 * line.length);
                });
            }
            App.chart.options.exporting.sourceWidth = minwidth;
            App.chart.options.exporting.sourceHeight = minwidth*chartdiv.height()/chartdiv.width();
        }
        App.jQuery('input[name="svg"]', this.svg_form).attr('value', App.chart.getSVG());
        // appendTo body to make it work in Internet Explorer
        this.svg_form.attr('action', App.URL + '/svg2png');
        this.svg_form.appendTo('body').submit().remove();
        //this.svg_form.submit();
    },

    highcharts_download_svg: function(ev){
        ev.stopPropagation();
        var chartdiv = $(".highcharts-container");
        if (chartdiv && App.chart.options && App.chart.options.exporting) {
            App.chart.options.exporting.sourceWidth = 1280;
            App.chart.options.exporting.sourceHeight = 1280*chartdiv.height()/chartdiv.width();
            App.jQuery('input[name="svg"]', this.svg_form).attr('value', App.chart.getSVG());
            // appendTo body to make it work in Internet Explorer
            this.svg_form.attr('action', App.URL + '/export.svg');
            this.svg_form.appendTo('body').submit().remove();
        }
    },

    highcharts_download_local: function(ev){
        ev.stopPropagation();
        var chartdiv = $(".highcharts-container");
        if (chartdiv && App.chart.options && App.chart.options.exporting) {

           var minwidth = $(chartdiv).width();
            if (App.chart.options.chart.polar) {
                minwidth = 1200;
            } else if (App.chart.options.yAxis[0].title.text) {
                var ytitle_lines = App.chart.options.yAxis[0].title.text.split('<br>');
                _(ytitle_lines).each(function(line) {
                    minwidth =  Math.max(minwidth, 7 * line.length);
                });
            }
            App.chart.options.exporting.sourceWidth = minwidth;
            App.chart.options.exporting.sourceHeight = minwidth*chartdiv.height()/chartdiv.width();
            App.chart.options.exporting.scale = 1;
            var tokens = window.location.pathname.split("/");
            App.chart.options.exporting.filename = tokens[tokens.length-1];
            App.chart.exportChartLocal({},{chart:{events:{load: function(event) {}  }}} );
        } else {
            App.jQuery('input[name="svg"]', this.svg_form).attr('value', App.chart.getSVG());
            // appendTo body to make it work in Internet Explorer
            this.svg_form.attr('action', App.URL + '/svg2png');
            this.svg_form.appendTo('body').submit().remove();
        }
    },

    get_forum_url: function() {
        var dataset_path = App.URL.split(window.location.origin)[App.URL.split(window.location.origin).length-1];
        var forum = dataset_path.split('/')[dataset_path.split('/').length-1];
        var forum_url = portal_url + '/board/' + forum;
        return forum_url;
    },

    request_forum: function(ev){
        ev.stopPropagation();
        window.location.replace(this.get_forum_url());
        return false;
    },

    request_comment: function(ev){
        ev.stopPropagation();
        var forum_url = this.get_forum_url();
        var form_action = forum_url + '/add_conversation_form';
        var modal_form = new BaseDialogView({form_action: form_action});
        modal_form.render();
        return false;
    },

    metadata_ready: function(annotations){
        App.jQuery('input[name="annotations"]', this.form).remove();
        App.jQuery(this.form).append(App.jQuery('<input>', {
            'name': 'annotations',
            'value': JSON.stringify(annotations),
            'type': 'hidden'
        }));
    },

    chart_ready: function(series, metadata, chart_type){
        App.jQuery('input[name="chart_data"]', this.form).remove();
        App.jQuery(this.form).append(App.jQuery('<input>', {
            'name': 'chart_data',
            'value': JSON.stringify(series),
            'type': 'hidden'
        }));
        App.jQuery('input[name="metadata"]', this.form).remove();
        App.jQuery(this.form).append(App.jQuery('<input>', {
            'name': 'metadata',
            'value': JSON.stringify(metadata),
            'type': 'hidden'
        }));
        App.jQuery('input[name="chart_type"]', this.form).remove();
        App.jQuery(this.form).append(App.jQuery('<input>', {
            'name': 'chart_type',
            'value': chart_type,
            'type': 'hidden'
        }));
    },

    render: function() {
        this.$el.html(this.template({
            'related': this.related.html(),
            'zoomEnabled': App.is_touch_device()
        }));
        App.jQuery(this.form).appendTo(this.$el);
        if ( window.addthis) {
            window.addthis.toolbox('.addthis_toolbox', {}, {url: this.url});
        }
    },

    update_url: function(new_url) {
        this.url = new_url;
        this.render();
    }

});


App.main = function() {
    if(App.chart_config.chart_entry_point) {
        // obsolete bootstrapping method
        // still used for country profile
        // (see samples country_profile_bar.js, country_profile_table.js)
        eval(App.chart_config.chart_entry_point)();
    }
    else {
        App.create_visualization($('#scenario-box')[0], App.chart_config);
    }
};


})(App.jQuery);
