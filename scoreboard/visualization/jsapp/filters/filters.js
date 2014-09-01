/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";

App.groupers =  {
    'indicator': 'indicator-group',
    'x-indicator': 'x-indicator-group',
    'y-indicator': 'y-indicator-group',
    'z-indicator': 'z-indicator-group',
    'breakdown': 'breakdown-group',
    'x-breakdown': 'x-breakdown-group',
    'y-breakdown': 'y-breakdown-group',
    'z-breakdown': 'z-breakdown-group'
};


App.SelectFilter = Backbone.View.extend({

    className: "chart-filter",

    template: App.get_template('filters/dropdown.html'),

    simple_template: App.get_template('filters/dropdown.html'),

    group_template: App.get_template('filters/dropdown_with_groups.html'),

    events: {
        'change select': 'on_selection_change'
    },

    initialize: function(options) {
        this.cube_url = options['cube_url'];
        this.data_revision = options['data_revision'] || '';
        this.name = options['name'];
        this.label = options['label'];
        this.dimension = options['dimension'];
        this.chart_type = options['chart_type'];
        this.chart_subtype = options['chart_subtype'];
        this.sortBy = options['sortBy'] || 'notation';
        this.sortOrder = options['sortOrder'];
        this.multidim = options['multidim'];
        this.constraints = options['constraints'] || [];
        this.dimension_options = [];
        this.ajax = null;
        this.default_value = options['default_value'];
        this.ignore_values = options['ignore_values'];
        this.default_all = options['default_all'] || false;
        this.loadstate = options['loadstate'] || new Backbone.Model();
        this.dimension_group_map = _.object(
            _(options['dimensions']).pluck('notation'),
            _(options['dimensions']).pluck('group_notation'));
        _(this.constraints).forEach(function(other_name, other_dimension) {
            this.model.on('change:' + other_name, this.update, this);
            this.loadstate.on('change:' + other_name, this.update, this);
        }, this);
        var grouper = App.groupers[this.name];
        if ( grouper && !_(_.toArray(this.constraints)).contains(grouper)){
            this.model.on('change:' + grouper, this.update, this);
            this.loadstate.on('change:' + grouper, this.update, this);
        }
        this.update();
    },

    adjust_value: function() {
        var default_value,
            default_value_candidates,
            range = _(this.dimension_options).pluck('notation');
        if (typeof this.model.get(this.name) == 'object' && this.model.get(this.name) && this.model.get(this.name)[0]) {
            this.model.set(this.name, this.model.get(this.name)[0]);
        }
        if(! _(range).contains(this.model.get(this.name))) {
            default_value_candidates = this.default_value || [];
            if (! _(default_value_candidates).isArray()){
                // backwards compatibility support
                default_value_candidates = [ default_value_candidates ];
            }
            default_value_candidates.push(range[0]);

            default_value = _(default_value_candidates).filter(
                    function(item){
                        return _(range).contains(item) || item === '#random';
                    }
                ).shift();

            if ( default_value == '#random' ) {
                default_value = range[Math.floor( Math.random()*range.length )];
            }
            this.model.set(this.name, default_value);
        }
    },

    update_loading_bar: function() {
        this.$el.addClass('loading-small');
    },

    update: function() {
        this.$el.addClass('on-hold');
        this.update_loading_bar();
        if(this.ajax) {
            this.ajax.abort();
            this.ajax = null;
        }
        this.loadstate.set(this.name, true);
        var incomplete = false;
        var args = {'dimension': this.dimension};
        this.display_in_groups = false;
        _(this.constraints).forEach(function(other_name, other_dimension) {
            var other_option = this.model.get(other_name);
            var other_loading = this.loadstate.get(other_name);
            if(other_loading || ! other_option) {
                incomplete = true;
            }
            args[other_dimension] = other_option;
            if(other_option == 'any' && App.groupers[this.dimension] == other_dimension){
                this.display_in_groups = true;
            }
        }, this);
        // if grouper not found in constraints at all, display in groups
        if ( App.groupers[this.name] && !_(_.toArray(this.constraints)).contains(App.groupers[this.name])) {
            this.display_in_groups = true;
            var grouper_option = this.model.get(App.groupers[this.name]);
            var grouper_loading = this.loadstate.get(App.groupers[this.name]);
            if(grouper_loading || ! grouper_option) {
                incomplete = true;
            }
        }
        if(incomplete) {
            this.$el.html("");
            return;
        }
        this.$el.removeClass('on-hold');
        this.$el.html("");
        App.trim_dimension_group_args(args, this.dimension_group_map);
        this.ajax = this.fetch_options(args);
        this.ajax.done(_.bind(function(data) {
            this.ajax = null;
            if (this.options.include_wildcard){
                _(data['options']).unshift(
                    _.object([
                        ['group_notation', null],
                        ['label', 'Any'],
                        ['short_label', 'Any'],
                        ['notation', 'any'],
                        ['uri', null]
                    ]
                ));
            }

            // Sort items
            var sortBy = this.sortBy;
            if ( !sortBy || sortBy == 'nosort' || sortBy == 'order_in_codelist' ) {
                // default sorting
                sortBy = 'inner_order';
            }
            this.dimension_options = _(data['options']).sortBy(function(item){
                if (item[sortBy] && !isNaN(parseInt(item[sortBy], 10)) && isFinite(item[sortBy])) {
                    return parseInt(item[sortBy], 10);
                }
                return item[sortBy];
            });
            if(this.sortOrder === 'reverse'){
                this.dimension_options = _(this.dimension_options).reverse();
            }
            this.options_labels = {};
            _(this.dimension_options).each(function(opt){
                  if (opt['notation'] != 'any'){
                      _(this.options_labels).extend(
                          _.object([[opt['notation'], opt]]));
                  }
            }, this);
            this.adjust_value();
            this.$el.removeClass('loading-small');
            this.render();
            this.loadstate.set(this.name, false);
            if ( _.isEmpty(this.dimension_options) ) {
                App.visualization.chart_view.remove_loading_add_msg('No data.');
            }
        }, this));
    },

    grab_dataset_url: function(dataset_name) {
        var selectable_dataset = true;
        if (!selectable_dataset){
            return this.cube_url;
        } else {
          var filters = App.visualization.filters_box.filters;
          var selected_dataset_string = App.visualization.filters_box.model.get(dataset_name);
          var selected_dataset = _(filters).findWhere({name:dataset_name});
          var dataset_definition = _(selected_dataset.dimension_options).findWhere({
            notation:selected_dataset_string
          });
          return dataset_definition.uri;
        }
    },

    fetch_options: function(args) {
        var view_name = '';
        if(this.multidim == 3) {
            view_name = 'dimension_options_xyz';
        }
        else if(this.multidim == 2) {
            view_name = 'dimension_options_xy';
        }
        else if(this.chart_type === 'country_profile'){
            args.subtype = this.chart_subtype;
            view_name = 'dimension_options_cp';
        }
        else {
            view_name = 'dimension_options';
        }
        var relevant_args = {};
        _(args).each(function(value, key){
            if (value!='any'){
                var pair = _.object([[key, value]]);
                _(relevant_args).extend(pair);
            }
        });
        relevant_args['rev'] = this.data_revision;

        delete relevant_args["__dataset"];

        var dataset_url;
        var prefix = this.name.slice(0,2);
        var dataset_name;
        if (prefix === "x-" || prefix === "y-"){
          dataset_name = prefix + "__dataset";
        } else {
          dataset_name = "x-__dataset";
        }
        try{
            dataset_url = this.grab_dataset_url(dataset_name);
        }
        catch(err){
            dataset_url = this.cube_url;
        }

        return $.getJSON(dataset_url + '/' + view_name, relevant_args);
    },

    render: function() {
        var selected_value = this.model.get(this.name);
        var options = _(this.dimension_options).map(function(item) {
            var selected = (item['notation'] == selected_value);
            return _({'selected': selected}).extend(item);
        });
        var template_data = {
            'dimension_options': options,
            'filter_label': this.label
        };
        if (this.display_in_groups){
            var grouped_data = _(this.dimension_options).groupBy('group_notation');
            var groups = _.zip(_(grouped_data).keys(), _(grouped_data).values());
            var grouper = _.chain(App.visualization.filters_box.filters).
              findWhere({name: App.groupers[this.name]}).value();
            template_data['groups'] = _.chain(groups).map(function(item){
                var label = null;
                if (!grouper) {
                    label = item[0];
                } else if ( grouper.options_labels[item[0]] ) {
                    label = grouper.options_labels[item[0]].short_label ||
                            grouper.options_labels[item[0]].label;
                }
                options = _(item[1]).map(function(item) {
                    var selected = (item['notation'] == selected_value);
                    return _({'selected': selected}).extend(item);
                });
                var out = _.object(['group', 'options'],
                                   [label, options]);
                return out;
            }).sortBy('group').value();
            this.$el.html(this.group_template(template_data));
        }
        else{
            this.$el.html(this.simple_template(template_data));
        }
    },

    on_selection_change: function() {
        var value = this.$el.find('select').val();
        var key = this.name;
        this.model.set(key, value);
    }

});

App.DatasetSelectFilter = App.SelectFilter.extend({

  initialize: function(){
      App.SelectFilter.prototype.initialize.apply(this, arguments);
      this.default_value = this.model.get(this.name);
  },

  fetch_options: function(args){
      var split = this.cube_url.split("/");
      var url = split.splice(0, split.length - 2).join("/");
      return $.getJSON(url + "/datacubesForSelect");
  }

});


App.MultipleSelectFilter = App.SelectFilter.extend({

    template: App.get_template('filters/multiple_select.html'),

    events: _({
        'click input[type="button"][id$="-add-all"]': 'add_all',
        'click input[type="button"][id$="-clear"]': 'clear'
    }).extend(App.SelectFilter.prototype.events),

    adjust_value: function() {
        var current_value = this.model.get(this.name);
        if ( typeof current_value == "string" ) {
            current_value = [current_value];
            this.model.set(this.name, current_value);
        }
        var range = _(this.dimension_options).pluck('notation');
        if(_.intersection(range, current_value).length === 0){
            if(this.default_all){
                this.model.set(this.name, range);
            }
            else{
                var default_value = this.default_value || [range[0]];
                if ( typeof default_value == "string" ) {
                    // workaround; defautl value should be array
                    default_value = [default_value];
                }
                default_value = _.map(default_value, function(item) {
                    if ( item == '#random' ) {
                        return range[Math.floor( Math.random()*range.length )];
                    } else {
                        return item;
                    }
                });
                this.model.set(this.name, default_value);
            }
        }
    },

    render: function() {
        var selected_value = this.model.get(this.name);
        var options = _(this.dimension_options).map(function(item) {
            var selected = (item['notation'] == selected_value);
            return _({'selected': selected}).extend(item);
        });
        this.$el.html(this.template({
            'dimension_options': options,
            'filter_label': this.label,
            'filter_name': this.name
        }));
        this.$el.find('select').select2();
        this.$el.find('select').select2("val", this.model.get(this.name));
    },

    add_all: function() {
        var all = _(this.dimension_options).pluck('notation');
        this.model.set(this.name, []);
        $(this.$el.find('select')).select2("val", "");
        this.model.set(this.name, all);
        $(this.$el.find('select')).select2("val", all);
    },

    clear: function() {
        this.$el.find('select').select2("val", "");
        this.model.set(this.name, []);
    }

});


App.AllValuesFilter = App.SelectFilter.extend({

    className: "chart-filter",

    render: function() {
        this.$el.html("");
    },

    update_loading_bar: function() {
    },

    adjust_value: function() {
        var adjusted_values = _.chain(this.dimension_options)
                               .pluck('notation')
                               .difference(this.ignore_values)
                               .value();
        this.model.set(this.name, adjusted_values);
    }

});

App.HiddenSelectFilter = App.SelectFilter.extend({
    className: "chart-filter hidden-select"
});

App.CompositeFilter = App.AllValuesFilter.extend({
    className: "chart-filter",
    template: App.get_template('filters/composite.html'),
    slider_min: 0,
    slider_max: 10,
    slider_default: 5,

    events: _({
        'sliderChanged': 'update_slider_data',
        'sliderValuesUpdated': 'update_normalized',
        'sliderNormalizeUpdated': 'update_chart'
    }).extend(App.SelectFilter.prototype.events),

    initialize: function(options) {
        this.composite_values = {};
        // If we get proper slider settings in the url, save them as an attribute
        // to this view, but sanitize the model's attributes
        if (this.model.attributes[options.name] && !_.isArray(this.model.attributes[options.name])) {
            this.composite_values = JSON.parse(JSON.stringify(this.model.attributes[options.name]));
            var objectKeys = _.map(this.composite_values, function(value, key) {
                return key;
            });
            this.model.set(options.name, objectKeys);
        }
        App.AllValuesFilter.prototype.initialize.apply(this, arguments);
    },

    render: function() {
        var that = this;
        this.$el.html(this.template({
            'dimension_options': this.dimension_options,
            'filter_label': this.label,
            'filter_name': this.name
        }));
        var sliders = this.$el.find('.composite-slider');
        var sliders_values = sliders.data('slidersvalues');
        if (!sliders_values) {
            sliders_values = {};
        }
        // Initialize the sliders
        _(sliders).each(function(slider, slider_idx){
            var slider_id = $(slider).prop('id').split('-slider')[0];

            $(slider).slider({
                value: that.composite_values[slider_id],
                min: that.slider_min,
                max: that.slider_max,
                step: 1,
                range: 'min',
                animate: true,
                orientation: 'horizontal',
                stop: function( event, ui ) {
                    var data = {
                        slider_id: slider_id,
                        slider_value: ui.value
                    };
                    that.$el.trigger('sliderChanged', data);
                }
            }).each(function() {
                // Add the slider's steps labels
                var opt = $(this).data().uiSlider.options;
                var vals = opt.max - opt.min;
                for (var i = 0; i <= vals; i++) {
                    var el = $('<label class="slider-step">' + i + '</label>')
                        .css('left',(i/vals*100)+'%');
                    $(this).append(el);
                }
                 
            });
            var norm_value = (100 / sliders.length).toFixed(1);
            var span_id = slider_id.split('-slider')[0] + '-normalized';
            $( '#' + span_id ).html(norm_value + '%');
            sliders_values[slider_id] = that.composite_values[slider_id];
        });

        sliders.data('slidersvalues', sliders_values);
        this.listenToOnce(App.visualization.chart_view, 'chart_load', this.handle_chart_loaded);
        this.listenTo(App.visualization.chart_view, 'chart_ready', this.update_metadata);
    },

    handle_chart_loaded: function(data) {
        // Add the original series and chart as attributes to the view
        if (!this.series) {
            this.series = JSON.parse(JSON.stringify(data.series));
        }
        if (!this.current_series) {
            this.current_series = JSON.parse(JSON.stringify(data.series));
        }
        if (!this.chart) {
            this.chart = data.chart;
        }
        if (!this.meta_options) {
            this.meta_options = data.options;
        }
        this.$el.trigger('sliderValuesUpdated');
    },

    update_slider_data: function(event, data) {
        // Save the current slider's value
        var sliders = this.$el.find('.composite-slider');
        var sliders_values = sliders.data('slidersvalues');
        sliders_values[data.slider_id] = data.slider_value;
        sliders.data('slidersvalues', sliders_values);
        this.composite_values[data.slider_id] = data.slider_value;
        this.$el.trigger('sliderValuesUpdated');
    },

    update_normalized: function() {
        // Process the normalized values
        var total = 0;
        var sliders = this.$el.find('.composite-slider');
        var sliders_values = sliders.data('slidersvalues');
        var sliders_norm = sliders.data('slidersnorm');
        if (!sliders_norm) {
            sliders_norm = {};
        }

        for(var slider in sliders_values) {
            total += sliders_values[slider]; 
        }

        _(sliders).each(function(slider, slider_idx){
            var slider_value = $(slider).slider('option', 'value');
            var slider_id = $(slider).prop('id');
            var norm_value = ((slider_value / total) * 100).toFixed(1);
            var span_id = slider_id.split('-slider')[0] + '-normalized';
            $( '#' +  span_id).html( norm_value + "%");
            sliders_norm[slider_id.split('-slider')[0]] = norm_value;
        });
        sliders.data('slidersnorm', sliders_norm);
        this.$el.trigger('sliderNormalizeUpdated');
    },

    update_chart: function() {
        // Redraw the chart with the new series
        var that = this;
        var sliders = this.$el.find('.composite-slider');
        var sliders_norm = sliders.data('slidersnorm');
        var context = {};

        _(this.chart.series).each(function(serie, serie_idx){
            context = {
                'that': that,
                'sliders_norm': sliders_norm,
                'name': serie.options.notation
            }
            _.each(serie.data, function(item, item_idx){
                var point_data = null;
                var normalized = parseFloat(this.sliders_norm[this.name], 10);
                point_data = that.series[serie_idx].data[item_idx].y * (normalized / 100);
                item.update(point_data,
                            false,
                            {duration: 950, easing: 'linear'});
                that.current_series[serie_idx].data[item_idx].y = point_data;

            }, context);
        });
        this.chart.redraw();
        this.update_hash();
        this.update_metadata();
    },

    update_metadata: function() {
        var that = this;
        var attributes = JSON.parse(JSON.stringify(this.model.attributes));
        var sliders = this.$el.find('.composite-slider');
        var sliders_values = sliders.data('slidersvalues');
        var sliders_norm = sliders.data('slidersnorm');
        var breakdown_sliders_values = [];
        var breakdown_normalized_values = [];
        var breakdown_index;

        // Order the sliders values and normalized values as the order of the 
        // breakdown list
        _.each(attributes[this.name], function(item, item_idx) {
            breakdown_sliders_values.splice(item_idx, 0, sliders_values[item]);
            breakdown_normalized_values.splice(item_idx, 0, sliders_norm[item] + '%');
        });
        var filters_applied = _(attributes).pairs();

        // Get the index of the breakdown
        _.every(filters_applied, function(item, item_idx) {
            breakdown_index = item_idx;
            return item[0] !== that.name;
        });

        // Add the slider values and normalized values after the breakdown
        breakdown_sliders_values = [this.name + '-slider-values',
                                     breakdown_sliders_values];
        breakdown_normalized_values = [this.name + '-normalized-values',
                                        breakdown_normalized_values];
        filters_applied.splice(breakdown_index+=1, 0, breakdown_sliders_values);
        filters_applied.splice(breakdown_index+=1, 0, breakdown_normalized_values);

        var metadata = {
            'chart-title': this.meta_options.titles.title,
            'chart-subtitle': this.meta_options.titles.subtitle,
            'chart-xAxisTitle': this.meta_options.titles.xAxisTitle,
            'chart-yAxisTitle': this.meta_options.titles.yAxisTitle,
            'source-dataset': this.meta_options.credits.text,
            'chart-url': document.URL,
            'filters-applied': filters_applied
        };
        App.visualization.share.chart_ready(this.current_series, metadata);
    },

    adjust_value: function() {
        // Set the initial slider's values
        var composite_values = {};
        if (!$.isEmptyObject(this.composite_values)) {
            var break_values = this.composite_values;
        }
        _.each(this.dimension_options, function(val) {
          break_values ? composite_values[val.notation] = break_values[val.notation] : composite_values[val.notation] = 5;
        });
        this.composite_values = composite_values;
        var adjusted_values = _.chain(this.dimension_options)
                               .pluck('notation')
                               .difference(this.ignore_values)
                               .value();
        this.model.set(this.name, adjusted_values);
    },

    update_hash: function() {
        // Modify the hash in accordance with the slider's settings
        if (!App.visualization.$el.hasClass('embedded')) {
            var attrs = JSON.parse(JSON.stringify(this.model.attributes));
            attrs[this.name] = this.composite_values;
            var hashcfg = 'chart=' + JSON.stringify(_.pick(attrs, App.visualization.filters_in_url));
            App.visualization.navigation.update_hashcfg(hashcfg);
            App.visualization.share.update_url(App.SCENARIO_URL + '#' + hashcfg);
            App.update_url_hash(hashcfg);
        }
    }
});

var EmbeddedPrototype = {
    update: function(){
        this.loadstate.set(this.name, true);
        var args = {'dimension': this.dimension};
        var incomplete = false;
        _(this.constraints).forEach(function(other_name, other_dimension) {
            var other_option = this.model.get(other_name);
            var other_loading = this.loadstate.get(other_name);
            if(other_loading || ! other_option) {
                incomplete = true;
            }
            args[other_dimension] = other_option;
            if(other_option == 'any' && App.groupers[this.dimension] == other_dimension){
                this.display_in_groups = true;
            }
            else{
                this.display_in_groups = false;
            }
        }, this);
        // if grouper not found in constraints at all, display in groups
        if ( App.groupers[this.name] && !_(_.toArray(this.constraints)).contains(App.groupers[this.name])) {
            this.display_in_groups = true;
        }
        App.trim_dimension_group_args(args, this.dimension_group_map);

        var values = this.model.get(this.name);
        if (!_(values).isArray()){
            values = [values];
        }
        this.dimension_options = _(values).map(function(item){
            return _.object([
                    ['group_notation', null],
                    ['label', 'Any'],
                    ['short_label', 'Any'],
                    ['notation', item],
                    ['uri', null]
                ]);
        });
        if (this.options.include_wildcard){
            this.dimension_options.unshift(
                _.object([
                    ['group_notation', null],
                    ['label', 'Any'],
                    ['short_label', 'Any'],
                    ['notation', 'any'],
                    ['uri', null]
                ]
            ));
        }

        this.options_labels = {};
        _(this.dimension_options).each(function(opt){
              if (opt['notation'] != 'any'){
                  _(this.options_labels).extend(
                      _.object([[opt['notation'], opt]]));
              }
        }, this);
        this.adjust_value();
        this.loadstate.set(this.name, false);
    }
};

App.EmbeddedSelectFilter = App.SelectFilter.extend(EmbeddedPrototype);
App.EmbeddedMultipleSelectFilter = App.MultipleSelectFilter.extend(EmbeddedPrototype);
App.EmbeddedAllValuesFilter = App.AllValuesFilter.extend(EmbeddedPrototype);


App.FiltersBox = Backbone.View.extend({

    filter_types: {
        'select': App.SelectFilter,
        'hidden_select': App.HiddenSelectFilter,
        'dataset_select': App.DatasetSelectFilter,
        'multiple_select': App.MultipleSelectFilter,
        'composite': App.CompositeFilter,
        'all-values': App.AllValuesFilter
    },

    initialize: function(options) {
        this.filters = [];
        this.loadstate = options['loadstate'] || new Backbone.Model();
        this.cube_url = options['cube_url'];
        this.data_revision = options['data_revision'] || '';
        var schema = options['schema'];
        _(options['filters_schema']).forEach(function(item) {
            var Cls = this.filter_types[item['type']];
            var default_all = (item['name'] == schema['category_facet']) && !item['default_value'];
            var filter = new Cls({
                model: this.model,
                loadstate: this.loadstate,
                cube_url: this.cube_url,
                data_revision: this.data_revision,
                chart_type: schema['chart_type'],
                chart_subtype: schema['chart_subtype'],
                sortBy: item['sortBy'],
                sortOrder: item['sortOrder'],
                multidim: item['multidim_common'] ? options['multidim'] | options.schema['multiple_series'] : null,
                name: item['name'],
                label: item['label'],
                default_value: item['default_value'],
                ignore_values: item['ignore_values'],
                default_all: default_all,
                dimension: item['dimension'],
                dimensions: options['dimensions'],
                include_wildcard: item['include_wildcard'],
                constraints: item['constraints']
            });

            this.filters.push(filter);
            if(item.position == 'upper-right' || item.type == 'multiple_select'){
                $(filter.el).appendTo($('.upper-right', this.$el));
            }
            else if(item.position == 'bottom-left'){
                $(filter.el).appendTo($('.bottom-left', this.$el));
            }
            else if(item.position == 'bottom-right'){
                $(filter.el).appendTo($('.bottom-right', this.$el));
            }
            else{
                $(filter.el).appendTo($('.upper-left', this.$el));
            }
        }, this);
    }

});

App.EmbeddedFiltersBox = App.FiltersBox.extend({

    filter_types: {
        'select': App.EmbeddedSelectFilter,
        'dataset_select': App.DatasetSelectFilter,
        'multiple_select': App.EmbeddedMultipleSelectFilter,
        'composite': App.CompositeFilter,
        'hidden_select': App.EmbeddedSelectFilter,
        'all-values': App.AllValuesFilter
    }

});


App.trim_dimension_group_args = function(args, dimension_group_map) {
    _(dimension_group_map).forEach(function(group_name, name) {
        if(! group_name) return;
        _(['', 'x-', 'y-', 'z-']).forEach(function(prefix) {
            if(args[prefix + name] && args[prefix + group_name]) {
                delete args[prefix + group_name];
            }
        });
    });
};


})(App.jQuery);
