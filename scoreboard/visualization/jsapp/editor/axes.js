/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";

App.TitlePart = Backbone.Model.extend({
    initialize: function(options){
        options['facet_name'] = options['facet_name'] || null;
        options['prefix'] = options['prefix'] || null;
        options['format'] = options['format'] || 'short_label';
        this.set(options);
    }
});

App.TitlePartView = Backbone.View.extend({

    events: {
        'change [name="title-part"]': 'on_change_facet_name',
        'change [name="title-part-prefix"]': 'on_change_prefix',
        'change [name="title-part-format"]': 'on_change_format'
    },

    template: App.get_template('editor/title-part.html'),

    prefix_options:[
        {value: '', label: '--'},
        {value: ', ', label: ','},
        {value: ' by ', label: 'by'},
        {value: ' - ', label: '-'}
    ],

    format_options: [
        {value: 'short_label', label: 'short label'},
        {value: 'label', label: 'label'}
    ],

    initialize: function(options){
        this.facets = options.facets;
        this.model.on('change', this.render, this);
        this.parts = options.parts;
        this.render();
    },

    on_change_facet_name: function(){
        var value = this.$el.find('[name="title-part"]').val();
        this.model.set('facet_name', value);
    },

    on_change_prefix: function(){
        var value = this.$el.find('[name="title-part-prefix"]').val();
        this.model.set('prefix', value);
    },

    on_change_format: function(){
        var value = this.$el.find('[name="title-part-format"]').val();
        this.model.set('format', value);
    },

    render: function(){
        var context = {
            id: this.model.cid,
            show_sep: this.parts.indexOf(this.model)!=0,
            format_options: _(this.format_options).map(function(opt){
                delete opt['selected'];
                if(this.model.get('format') == opt.value) {
                    opt['selected'] = true;
                }
                return opt;
            }, this),
            prefix_options: _(this.prefix_options).map(function(opt){
                delete opt['selected'];
                if(this.model.get('prefix') == opt.value) {
                    opt['selected'] = true;
                }
                return opt;
            }, this),
            facets: _.chain(this.facets)
                       .where({type: "select"})
                       .map(function(facet){
                          var option = _.object([
                              ['label', facet.label],
                              ['value', facet.name]
                          ]);
                          if(this.model.get('facet_name') == facet.name) {
                              option['selected'] = true;
                          }
                          return option;
                       }, this).value()
        };
        this.$el.empty().append(this.template(context));
    }
});


App.TitlePartsCollection = Backbone.Collection.extend({

    constructor: function(options) {
        var parts = [];
        if (options.parts){
            _(options.parts).each(function(part){
                parts.push(new App.TitlePart({
                    prefix: part.prefix || null,
                    facet_name: part.facet_name
                }));
            })
        }
        Backbone.Collection.apply(this, [parts]);
    },

    get_values: function(){
        return this.map(function(part_model){
            return part_model.toJSON();
        });
    }
});

App.TitleComposerModel = Backbone.Model.extend({

    initialize: function(options){
        this.name = options.name;
        var parts = [];
        var valid_names = _(this.get('facets')).pluck('name');
        if (options.init_value){
            _(options.init_value).each(function(part){
                if (_(valid_names).contains(part.facet_name)){
                    if (parts.length == 0){
                        part = _(part).omit('prefix');
                    }
                    parts.push(part);
                }
            })
        }
        else{
            var a_facet = _.chain(this.get('facets')).where({type: 'select'});
            //try to find an indicator
            a_facet = a_facet.findWhere({dimension: 'indicator'}).value() ||
                      a_facet.first().value();
            if (a_facet){
                parts.push({ facet_name: a_facet.name });
            }
        }
        this.set('parts', parts);
    },
});

App.TitleComposerView = Backbone.View.extend({

    events: {
        'click [name="add-title-part"]': 'on_add_part'
    },

    template: App.get_template('editor/title.html'),

    initialize: function(options) {
        this.parts = new App.TitlePartsCollection({
            parts: this.model.get('parts'),
        });
        this.model.set('parts', this.parts.get_values());
        this.parts.on('change', this.on_change, this);
        this.part_views = _.object(this.parts.map(function(part_model) {
            var part_view = new App.TitlePartView({
                model: part_model,
                facets: this.model.get('facets'),
                parts: this.parts,
                composer: this
            });
            return [part_model.cid, part_view];
        }, this));
        this.render();
    },

    on_change: function(){
        var to_remove = [];
        this.parts.forEach(function(part){
            if (part.get('facet_name') == ""){
                to_remove.push(part);
            }
        });
        this.parts.remove(to_remove);
        this.model.set('parts', this.parts.get_values());
        this.render();
    },

    on_add_part: function(){
        var part_view = new App.TitlePartView({
            model: new App.TitlePart({}),
            facets: this.model.get('facets'),
            parts: this.parts,
            composer: this
        });
        this.parts.add(part_view.model);
        this.part_views[part_view.model.cid] = part_view;
        this.render();
    },

    render: function(){
        var context = {
            name: this.model.get('name')
        };
        this.$el.html(this.template(context));
        this.$el.find('[name="title-parts"]').empty();
        this.parts.forEach(function(model){
            var part_view = this.part_views[model.cid];
            if (part_view){
                this.$el.find('[name="title-parts"]').append(part_view.el);
                part_view.delegateEvents();
            }
        }, this);
    }
});

App.TitleComposers = Backbone.Collection.extend({

    constructor: function(options) {
        var composers = _(options.names).map(function(name){
            return new App.TitleComposerModel({
                name: name,
                facets: _(options.facets).where({type: 'select'}),
                init_value: options.init_value[name] || null
            });
        }, this);
        Backbone.Collection.apply(this, [composers]);
    },

    get_values: function(){
        var value = _.object(_(this.models).map(function(composer){
            return [composer.name, composer.get('parts')]
        }));
        return value;
    },

    append_labels: function(options){
        var ok_to_insert = function(label, labels){
            return !_(labels).has(label.facet);
        };
        var labels = options.current || {};
        this.forEach(function(composer){
            _(composer.get('parts')).each(function(part){
                if(part.facet_name){
                    var label = _.object([
                        ['facet', part.facet_name]
                    ]);
                    if (ok_to_insert(label, labels)){
                        labels[label.facet] = label;
                    }
                }
            });
        });
        return labels;
    }
})


App.AxesEditor = Backbone.View.extend({

    tagName: 'form',
    className: 'editor-axes form-inline',

    template: App.get_template('editor/axes.html'),

    title: "Axes",

    events: {
        'change [name="axis-sort-by"]': 'on_change',
        'change [name="axis-sort-order"]': 'on_change',
        'change [name="axis-sort-each-series"]': 'on_change',
        'change [name="axis-horizontal-title"]': 'on_change',
        'change [name="axis-horizontal-rotated"]': 'on_change',
        'change [name="axis-horizontal-plotline"]': 'on_change',
        'change [name="axis-vertical-title"]': 'on_change',
        'change [name="axis-vertical-plotline"]': 'on_change'
    },

    sort_by_options: [
        {value: 'value', label: "Value"},
        {value: 'category', label: "Category"}
    ],

    sort_order_options: [
        {value: 1, label: "Ascending"},
        {value: -1, label: "Descending"}
    ],

    axis_title_options: [
        {value: 'none', label: "none"},
        {value: 'short', label: "Short label"},
        {value: 'long', label: "Long label"}
    ],

    plotlines_options: [
        {value: '', label: "none"},
        {value: 'values', label: "values"}
    ],

    initialize: function(options) {
        this.composers = new App.TitleComposers({
            names: ['title', 'subtitle', 'xAxisTitle', 'yAxisTitle'],
            init_value: this.model.get('titles') || {},
            facets: this.model.get('facets')
        });
        this.composers_views = _.object(this.composers.map(function(composer){
            var composer_view = new App.TitleComposerView({
                model: composer
            });
            return [composer.get('name'), composer_view];
        }, this));
        this.save_titles();
        this.composers.on('change', this.save_titles, this);
        this.render();
        this.set_axis_labels();
        this.model.on('change facets', this.set_axis_labels, this);
    },

    save_titles: function(){
        this.model.set('titles', this.composers.get_values());
        this.model.set('labels', this.composers.append_labels({
            current: this.model.get('labels')
        }));
    },

    set_axis_labels: function() {
        var unit_measure = _(this.model.get('facets')).findWhere(
            {name: 'unit-measure'});
        if(unit_measure && unit_measure['type'] == 'select') {
            var labels = _({}).extend(this.model.get('labels'));
            _(labels).extend({
                ordinate: {facet: 'unit-measure'},
                'unit-measure': {facet: 'unit-measure'}
            });
            this.model.set('labels', labels);
        }
    },

    render: function() {
        var sort = this.model.get('sort') || {};
        var plotlines = this.model.get('plotlines') || {};
        var context = {
            sort_by_options: _(this.sort_by_options).map(function(spec) {
                var item = _({}).extend(spec);
                if(spec['value'] == sort['by']) {
                    item['checked'] = true;
                }
                return item;
            }, this),
            sort_order_options: _(this.sort_order_options).map(function(spec) {
                var item = _({}).extend(spec);
                if(spec['value'] == sort['order']) {
                    item['checked'] = true;
                }
                return item;
            }, this),
            sort_each_series: sort['each_series'],
            horizontal_title_options: _(this.axis_title_options).map(
                                       function(spec) {
                var item = _({}).extend(spec);
                if(spec['value'] == this.model.get('axis-horizontal-title')) {
                    item['selected'] = true;
                }
                return item;
            }, this),
            horizontal_rotated: this.model.get('axis-horizontal-rotated'),
            horizontal_plotline_options: _(this.plotlines_options).map(
                                          function(spec) {
                var item = _({}).extend(spec);
                if(spec['value'] == plotlines['x']) {
                    item['selected'] = true;
                }
                return item;
            }),
            vertical_title_options: _(this.axis_title_options).map(
                                       function(spec) {
                var item = _({}).extend(spec);
                if(spec['value'] == this.model.get('axis-vertical-title')) {
                    item['selected'] = true;
                }
                return item;
            }, this),
            vertical_plotline_options: _(this.plotlines_options).map(
                                          function(spec) {
                var item = _({}).extend(spec);
                if(spec['value'] == plotlines['y']) {
                    item['selected'] = true;
                }
                return item;
            })
        };
        this.$el.html(this.template(context));
        _(this.composers_views).each(function(composer_view){
            this.$el.find('[name="chart-titles"]').append(composer_view.el);
            composer_view.delegateEvents();
            if(composer_view.parts){
                composer_view.parts.forEach(function(model){
                    var part_view = composer_view.part_views[model.cid];
                    part_view.delegateEvents();
                }, this);
            };
        }, this);
    },

    on_change: function() {
        var val = _.bind(function(sel){return this.$el.find(sel).val()}, this);
        var checked = _.bind(function(sel){
            return this.$el.find(sel).is(':checked')}, this);
        var plotlines = {
            x: val('[name="axis-horizontal-plotline"]'),
            y: val('[name="axis-vertical-plotline"]')
        };
        _(['x', 'y']).forEach(function(key) {
            if(! plotlines[key]) { delete plotlines[key]; }
        });
        this.model.set({
            'sort': {
                by: val('[name="axis-sort-by"]:checked'),
                order: Number(val('[name="axis-sort-order"]:checked')) || 0,
                each_series: checked('[name="axis-sort-each-series"]')
            },
            'axis-horizontal-title': val('[name="axis-horizontal-title"]'),
            'axis-horizontal-rotated': checked('[name="axis-horizontal-rotated"]'),
            'axis-vertical-title': val('[name="axis-vertical-title"]'),
            'plotlines': plotlines
        });
    }

});


})(App.jQuery);
