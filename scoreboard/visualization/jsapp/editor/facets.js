/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.FacetEditorField = Backbone.View.extend({

    tagName: 'div',
    className: 'editor-facets',
    template: App.get_template('editor/facet-field.html'),

    events: {
        'input [name="label"]': 'on_input_label',
        'keyup [name="label"]': 'on_input_label',
        'focusout [name="label"]': 'on_focusout_label',
        'change [name="type"]': 'on_change_type',
        'click .facet-sort': 'on_click_sort',
        'change [name="include_wildcard"]': 'on_change_wildcard',
        'change [name="sort-by"]': 'on_change_sorting',
        'change [name="sort-order"]': 'on_change_sorting',
        'change [name="default_value"]': 'on_change_default_value',
        'change [name="ignore_values"]': 'on_change_ignore_values',
        'change [name="highlights"]': 'on_change_highlights',
    },

    fetch_options: function(){
        var args = {};
        args['dimension'] = this.model.get('dimension');
        args['rev'] = App.DATA_REVISION;
        var view_name = 'dimension_options';
        return $.getJSON(App.URL + '/' + view_name, args);
    },

    sort_by_options: [
        {value: 'order_in_codelist', label: "by order within the code list"},
        {value: 'inner_order', label: "by order within the group"},
        {value: 'label', label: "by value - long label"},
        {value: 'short_label', label: "by value - short label"},
        {value: 'notation', label: "by value - notation"}
    ],

    sort_order_options: [
        {value: 'asc', label: "ascending"},
        {value: 'reverse', label: "descending"}
    ],

    initialize: function(options) {
        if(! this.model.has('type')) {
            this.model.set('type', this.type_options[0]['value']);
        }
        if (! this.model.has('sortBy')) {
            this.model.set('sortBy', this.sort_by_options[0]['value']);
        }
        if (! this.model.has('sortOrder')) {
            this.model.set('sortOrder', this.sort_order_options[0]['value']);
        }
        this.facets_editor = options['facets_editor'];
        var ajax = this.fetch_options();

        ajax.done(_.bind(function(data){
            options = [];
            _(data.options).each(function(item){
                options.push({
                    label: item['label'],
                    value: item['notation']
                });
            });
            this.facet_options = options;
            this.trigger('options_received', this);
            this.options_received = true;
            this.render();
        },this));
    },

    render: function() {
        var facet_options = _.chain(this.facet_options)
            .map(function(opt, idx, list) {
                    opt['default'] = false;
                    if (_(this.model.get('default_value')).contains(opt['value']) ||
                        this.model.get('default_value') == opt['value']) {
                        opt['default'] = true;
                    }
                    if (_(this.model.get('ignore_values')).contains(opt['value']) ||
                        this.model.get('ignore_values') == opt['value']) {
                        opt['ignore'] = true;
                    }
                    if (_(this.model.get('highlights')).contains(opt['value']) ||
                        this.model.get('highlights') == opt['value']) {
                        opt['highlight'] = true;
                    }
                    return opt;
                }, this)
            .tap(_.bind(function(object, interceptor){
                    var random = { 'label': '#random',
                                   'value': '#random' };
                    if (this.model.get('default_value') == '#random'){
                        random['default'] = true;
                    }
                    object.push(random);
                    if (this.model.get('type') == 'multiple_select' &&
                        this.model.get('dimension') == 'ref-area'){
                        var eu27 = { 'label': '#eu',
                                     'value': '#eu27' };
                        object.push(eu27);
                    }
                }, this))
            .value();
        var highlights_options = _(facet_options).reject(function(item){
            return item.value == '#random'
        });
        var context = _({
            is_refarea: (this.model.get('dimension') == 'ref-area')?true:false,
            options_received: this.options_received || false,
            facet_label: this.model.get('label'),
            facet_options: facet_options,
            highlights_options: highlights_options,
            is_all_values: this.model.get('type') == 'all-values',
            sort_by_options: _(this.sort_by_options).map(function(spec) {
                    var opt = _({}).extend(spec);
                    if(spec['value'] == this.model.get('sortBy')) {
                        opt['selected'] = true;
                    }
                    return opt;
                }, this),
            sort_order_options: _(this.sort_order_options).map(function(spec) {
                    var opt = _({}).extend(spec);
                    if(spec['value'] == this.model.get('sortOrder')) {
                        opt['selected'] = true;
                    }
                    return opt;
                }, this),
            is_single_select: (this.model.get('type') == 'select'),
            is_category_facet: (this.facets_editor.model.get('category_facet') == this.model.get('name')),
            chart_is_multidim: this.facets_editor.chart_is_multidim()
        }).extend(this.model.toJSON());
        this.$el.html(this.template(context));
        this.$el.attr('data-name', this.model.get('name'));
        var params = {
            placeholder: "Click to select values",
            allowClear: true
        }
        var category_highlights = this.$el.find('[name="highlights"]');
        if (category_highlights) {
            category_highlights.select2(params);
        }
        this.$el.find('[name="ignore_values"]').select2(params);
        this.$el.find('[name="default_value"]').select2(params);
    },

    on_input_label: function(evt) {
        if (this.facet_label == this.$el.find('[name="label"]').val()){
            return;
        }
        this.facet_label = this.$el.find('[name="label"]').val() ||
                          this.model.get('label');
    },

    on_focusout_label: function(evt) {
        this.model.set({
            label: this.facet_label || this.model.get('label')
        });
    },

    on_change_default_value: function(evt) {
        var value = this.$el.find('[name="default_value"]').val();
        var result = [];
        _(this.facet_options).each(function(opt){
            opt['default'] = false;
            if (_(value).contains(opt.value)){
                opt['default'] = true;
                result.push(opt.value);
            }
        });
        if (_(value).contains('#random')){
            result.push('#random');
        }
        if (_(value).contains('#eu27')){
            result = _.union(result, _(App.EU27).keys());
        }
        if (result.length > 0){
                this.model.set({default_value: result});
        }
        else if (this.model.has('default_value')){
            this.model.unset('default_value');
        }
    },


    on_change_ignore_values: function(evt) {
        var value = this.$el.find('[name="ignore_values"]').val();
        var result = []
        _(this.facet_options).each(function(opt){
            opt['ignore'] = false;
            if (_(value).contains(opt.value)){
                opt['ignore'] = true;
                result.push(opt.value);
            }
        })
        if (result.length > 0){
            this.model.set({ignore_values: result});
        }
        else if (this.model.has('ignore_values')){
            this.model.unset('ignore_values');
        }
    },

    on_change_highlights: function(){
        var values = this.$el.find('[name="highlights"]').val();
        var result = []
        _(this.facet_options).each(function(opt){
            opt['highlight'] = false;
            if (_(values).contains(opt.value)){
                opt['highlight'] = true;
                result.push(opt.value);
            }
        })
        this.model.set({highlights: result});
    },

    on_change_type: function(evt) {
        this.model.set({
            type: this.$el.find('[name="type"]').val()
        });
        this.check_constraints();
    },

    on_click_sort: function(evt) {
        evt.preventDefault();
        var direction = $(evt.target).data('sort-direction');
        var idx = this.model.collection.indexOf(this.model);
        var new_idx = idx + (direction == 'down' ? +1 : -1);
        if(new_idx < 0) { new_idx = 0; }
        this.model.collection.move(this.model, new_idx);
    },

    on_change_wildcard: function(evt) {
        if($(evt.target).is(':checked')) {
            this.model.set('include_wildcard', true);
        }
        else {
            this.model.unset('include_wildcard');
        }
        this.check_constraints();
    },

    check_constraints: function() {
        if(this.model.get('type') != 'select') {
            this.model.unset('include_wildcard');
        }
    },

    on_change_sorting: function() {
        this.model.set({
            'sortBy': this.$el.find('[name="sort-by"]').val(),
            'sortOrder': this.$el.find('[name="sort-order"]').val()
        });
    }

});

App.FacetModel = Backbone.Model.extend({
    initialize: function(options){
        this.name = options.name;
        this.on('change:type', this.drop_default_value, this);
    },

    drop_default_value: function(){
        if (this.get('type') == 'select'){
            this.unset('default_value');
        }
    }
})


App.FacetCollection = Backbone.Collection.extend({

    model: App.FacetModel,

    comparator: function(val){
        var idx = this.order.indexOf(
            val.attributes.dimension||val.attributes.name);
        var value = (val.attributes.type == 'all-values')?
                    this.order.length+idx:idx;
        return value;
    },

    constructor: function(value, dimensions) {
        this.order = _.chain(dimensions).reject(function(dim){
            return !_(['dimension group', 'dimension']).contains(dim.type_label);
        }).pluck('notation').value();
        Backbone.Collection.apply(this, [value]);
        var facets_to_keep = {};
        var add_model = _.bind(function(name, defaults) {
            var facet_model = this.findWhere({name: name});
            if(! facet_model) {
                var facet_model = this.findWhere({name: 'x-' + name});
                if(facet_model) { // hey, it's a multidim facet
                    var label = facet_model.get('label') || defaults['label'];
                    if(label.substr(0, 4) == '(X) ') {
                        label = label.substr(4);
                    }
                    facet_model.set({
                        name: name,
                        multidim_common: false,
                        label: label
                    });
                }
                else {
                    facet_model = new App.FacetModel({'name': name});
                    facet_model.set(defaults);
                }
            }
            this.add(facet_model);
            facets_to_keep[facet_model.cid] = true;
        }, this);
        _(dimensions).forEach(function(dimension) {
            if(dimension['type_label'] != 'dimension' &&
               dimension['type_label'] != 'dimension group') {
                return;
            }
            var name = dimension['notation'];
            add_model(name, {
                'dimension': name,
                'label': dimension['label']
            });
        });
        var to_remove = [];
        this.forEach(function(facet) {
            if(! facets_to_keep[facet.cid]) {
                to_remove.push(facet);
            }
        });
        this.remove(to_remove);
    },

    get_value: function(chart_multidim, presets) {
        this.sort();
        var result = [];
        var multidim_facets = {};
        var all_multidim = _.range(chart_multidim);
        var facets_by_axis = {'all': []};
        _(all_multidim).forEach(function(n) {
            var letter = 'xyz'[n];
            facets_by_axis[letter] = [];
        });
        var facets_above = [];
        this.forEach(function(facet_model) {
            var facet = facet_model.toJSON();
            var multidim_common = facet['multidim_common'];
            delete facet['multidim_common'];
            if(chart_multidim && !multidim_common) {
                // multidim chart, facet is not common
                if(chart_multidim) {
                    facet['multidim_common'] = false;
                }
                multidim_facets[facet['name']] = true;
                _(all_multidim).forEach(function(n) {
                    var letter = 'xyz'[n];
                    var prefix = letter + '-';
                    var constraints = {};
                    _(facets_above).forEach(function(name) {
                        if(multidim_facets[name]) {
                            constraints[name] = prefix + name;
                        } else {
                            constraints[name] = name;
                        }
                    });
                    var label = '(' + letter.toUpperCase() + ') '
                              + facet['label'];
                    var key = facet.dimension + '/' + prefix + facet['name'];
                    if (presets && _(presets).has(key)){
                        facet.position = presets[key]
                    }
                    /*facets_by_axis[letter].push(_({
                        name: prefix + facet['name'],
                        label: label,
                        constraints: constraints
                    }).defaults(facet));
                    */
                    // push in result (to preserve original order of facets)
                    result.push(_({
                        name: prefix + facet['name'],
                        label: label,
                        constraints: constraints
                    }).defaults(facet));
                });
            }
            else {
                // chart is not multidim or facet is common
                var constraints = {};
                _(facets_above).forEach(function(name) {
                    if(multidim_facets[name]) {
                        _(all_multidim).forEach(function(n) {
                            var letter = 'xyz'[n];
                            var prefix = letter + '-';
                            constraints[prefix + name] = prefix + name;
                        });
                    }
                    else {
                        constraints[name] = name;
                    }
                });
                facet['constraints'] = constraints;
                if(!chart_multidim) {
                    delete facet['multidim_common'];
                } else {
                    facet['multidim_common'] = true;
                }
                // set default position (in layout tab)
                var key = facet.dimension + '/' + facet.name;
                if (presets && _(presets).has(key)){
                    facet.position = presets[key]
                }
                result.push(facet);
                /*facets_by_axis['all'].push(facet);*/
            }
            if(facet['type'] == 'select') {
                facets_above.push(facet['name']);
            }
        });
        var value = [];
        _(all_multidim).forEach(function(n) {
            var letter = 'xyz'[n];
            value = value.concat(facets_by_axis[letter]);
        });
        value = value.concat(facets_by_axis['all']);
        var value_facet = {
            name: 'value',
            type: 'all-values',
            dimension: 'value'
        };
        if(chart_multidim) {
            value_facet['multidim_value'] = true;
        }
        /*value.push(value_facet);*/
        result.push(value_facet);
        return result;
    }

});


App.FacetsEditor = Backbone.View.extend({

    template: App.get_template('editor/facets.html'),

    title: "Filter settings",

    events: {
        'change [name="multiple_series"]': 'on_change_multiple_series'
    },

    update_model: function(){
        var values = {};
        this.model.set(values);
        _(values).extend(this.categoryby.get_values());
        this.apply_changes();
    },

    initialize: function(options) {
        if(! this.model.has('multiple_series')) {
            this.model.set('multiple_series', null);
        }
        this.facet_views = _.object(this.model.facets.map(function(facet_model) {
            var facet_view = new App.FacetEditorField({
                model: facet_model,
                facets_editor: this
            });
            return [facet_model.cid, facet_view];
        }, this));
        this.apply_changes();
        this.render();
        this.model.facets.on(
            'change:include_wildcard change:label change:sortBy change:sortOrder change:default_value',
            this.apply_changes, this);
        this.model.facets.on('change:type', this.render, this);
    },

    render: function() {
        this.$el.html(this.template());
        this.model.facets.forEach(function(facet_model) {
            if(facet_model.get('type') != 'ignore'){
                var facet_view = this.facet_views[facet_model.cid];
                facet_view.render();
                this.$el.find('div.facets').append(facet_view.el);
                facet_view.delegateEvents();
            }
        }, this);
    },

    save_value: function() {
        var value = this.model.facets.get_value(
                this.chart_is_multidim(),
                this.model.layout_collection.presets());
        this.model.set('facets', value);
    },

    chart_is_multidim: function() {
        // TODO: this is duplicate code, refactor
        if (this.model.get('multidim')) {
            return this.model.get('multidim');
        }
        if (typeof this.model.get('multiple_series') == 'number') {
            return this.model.get('multiple_series');
        }
        return false;
    },

    apply_changes: function() {
        this.save_value();
    },

});


})(App.jQuery);
