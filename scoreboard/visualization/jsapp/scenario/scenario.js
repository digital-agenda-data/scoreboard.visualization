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
                var args = {
                    'dimension': this.dimensions_mapping[label_spec['facet']],
                    'value': this.model.get(label_spec['facet']),
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
        relevant_args = _({rev: this.data_revision}).extend(relevant_args);
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
        var unit_is_pc = [];
        if(this.schema['multidim'] == 3){
            args['join_by'] = this.schema.category_facet;
            var units = [this.model.get('x-unit-measure') || '',
                         this.model.get('y-unit-measure') || '',
                         this.model.get('z-unit-measure') || '']
        }
        else if(this.schema['multidim'] == 2){
            args['join_by'] = this.schema.category_facet;
            var units = [this.model.get('x-unit-measure') || '',
                         this.model.get('y-unit-measure') || '']
        }
        else if(this.schema['multiple_series'] == 2){
            var units = [this.model.get('x-unit-measure') || '',
                         this.model.get('y-unit-measure') || '']
        } else {
            var units = [this.model.get('unit-measure') || ''];
        }
        _(units).each(function(unit){
            var evaluation = false
            if (unit && unit.length > 3 && unit.substring(0,3).toLowerCase() == 'pc_' ){
                evaluation = true;
            }
            unit_is_pc.push(evaluation);
        });
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
                var attrs = this.point.attributes;
                var out = '<b>' + attrs[category_facet.name].label + '</b>';
                // point value(s) and unit-measure
                if (_.contains(tooltip_attributes, 'value')) {
                    if ( multidim ) {
                        out += '<br><b>x</b>: ' + Math.round(this.x*10)/10;
                        if (unit_is_pc[0]) out += '%';
                        out += ' ';
                        if (_.contains(tooltip_attributes, 'unit-measure') && attrs['unit-measure']) {
                            out += attrs['unit-measure']['x'].label;
                        }
                    }
                    out += '<br>';
                    if ( multidim ) {
                        out += '<b>y</b>: ';
                    }
                    out += Math.round(this.y*10)/10;
                    if ( multidim ) {
                        if (unit_is_pc[1]) out += '%';
                    } else {
                        // no multidim, but may be multi-lines
                        var series_is_pc = unit_is_pc[0];
                        if (typeof unit_is_pc[this.series.index] != 'undefined') {
                            series_is_pc = unit_is_pc[this.series.index];
                        }
                        if (series_is_pc) {
                            out += '%';
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
                        out += '<br><b>z</b>: ' + Math.round(this.point.z*10)/10;
                        if (unit_is_pc[2]) out += '%';
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
            'series_ending_labels': {}, 'unit_is_pc': unit_is_pc,
            'plotlines': this.schema['plotlines'] || false,
            'animation': this.schema['animation'] || false,
            'series-legend-label': this.schema['series-legend-label'] || 'none',
            'series-ending-label': this.schema['series-ending-label'] || 'none',
            'multiseries': this.multiple_series,
            'category_facet': this.schema['category_facet'],
            'subtype': this.schema.chart_subtype,
            'highlights': highlights,
            'sort': this.schema['sort'],
            'multidim': this.schema['multidim'],
            'chart_type': this.schema['chart_type']
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

                requests.push(this.request_datapoints(datapoints_url, xargs));
                requests.push(this.request_datapoints(datapoints_url, yargs));
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

        this.requests_in_flight = requests;

        var that = this;

        var ajax_calls = $.when.apply($, requests);
        ajax_calls.done(_.bind(function() {
            var responses = _(arguments).toArray();
            if(requests.length < 2) { responses = [responses]; }

            chart_data['series'] = _(multiseries_values).map(function(value, n) {
                var sample_point, legend_candidates,
                    resp = responses[n],
                    datapoints = resp[0]['datapoints'];
                if(this.client_filter && (this.schema['chart_type'] !== 'country_profile') && this.multiple_series != 2 ) {
                    var dimension = this.dimensions_mapping[this.client_filter];
                    datapoints = _(datapoints).filter(function(item) {
                        return _(client_filter_options).contains(
                            item[dimension]['notation']);
                    }, this);
                }

                if ( this.multiple_series == 2 ) {
                    sample_point = datapoints[0];
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
                    text: subtitle,
                    style: {
                        fontWeight: 'bold',
                        fontSize: '20px'
                    }

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
            { 'auto': this.model.get('auto') }
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
            if(data != []) {
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
                var chart_description = this.description.html();
                if ( this.schema.annotations && this.schema.annotations.notes ) {
                    chart_description = this.schema.annotations.notes;
                }
                var section_title = this.schema['annotations'] &&
                  this.schema['annotations']['title'] ||
                  'Definition and scopes:';
                var context = {
                     "description": chart_description,
                     "section_title": section_title,
                     "indicators_details_url": this.cube_url + '/indicators',
                     "blocks": blocks
                };
                this.trigger('metadata_ready', context);
                this.$el.html(this.template(context));
            }
            else {
                this.$el.empty();
            }
        }, this));
    }

});

App.ShareOptionsView = Backbone.View.extend({

    events: {
        'click #csv': 'request_csv',
        'click #excel': 'request_excel',
        'click #embed': 'request_embed',
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
        this.render();
    },

    request_csv: function(ev){
        ev.preventDefault();
        App.jQuery('input[name="format"]', this.form).remove();
        this.$el.find('form').submit();
    },

    request_embed: function(ev){
        ev.stopPropagation();
        window.location.replace(window.location.pathname + "/embedded" + window.location.hash);
        return false;
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
        this.$el.html(this.template({'related': this.related.html()}));
        App.jQuery(this.form).appendTo(this.$el);
        //window.addthis.button('#scoreboard-addthis', {}, {url: this.url});
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
        eval(App.chart_config.chart_entry_point)();
    }
    else {
        App.create_visualization($('#scenario-box')[0], App.chart_config);
    }
};


})(App.jQuery);
