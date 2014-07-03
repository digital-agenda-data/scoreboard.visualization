/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.StructureEditorField = Backbone.View.extend({

    tagName: 'div',
    className: 'editor-structure-field',
    template: App.get_template('editor/structure-field.html'),

    events: {
        'change [name="type"]': 'on_change_type',
        'change [name="multidim_common"]': 'on_change_multidim_common',
        'click .facet-sort': 'on_click_sort'
    },

    type_options: [
        {value: 'select', label: "single selection"},
        {value: 'multiple_select', label: "multiple selection"},
        {value: 'all-values', label: "all values"},
        {value: 'ignore', label: "ignore"}
    ],

    initialize: function(options) {
        if(! this.model.has('type')) {
            this.model.set('type', this.type_options[0]['value']);
        }
        this.structure_editor = options['structure_editor'];
        this.render();
    },

    render: function() {
        // multiple selection not allowed in multilines chart type
        var is_multilines = typeof this.structure_editor.model.get('multiple_series') == 'number';
        var context = _({
            type_options: _.chain(this.type_options)
              .reject(function(item){
                return is_multilines && item['value'] == 'multiple_select';
              }).map(function(opt) {
                var selected = this.model.get('type') == opt['value'];
                return _({
                    selected: selected
                }).extend(opt);
            }, this).value(),
            is_single_select: (this.model.get('type') == 'select'),
            chart_is_multidim: this.structure_editor.chart_is_multidim()
        }).extend(this.model.toJSON());
        this.$el.html(this.template(context));
        this.$el.attr('data-name', this.model.get('name'));
        var params = {
            placeholder: "Click to select values",
            allowClear: true
        };
    },

    on_change_type: function(evt) {
        this.model.set({
            type: this.$el.find('[name="type"]').val()
        });
        this.check_constraints();
    },

    check_constraints: function() {
        if(this.model.get('type') != 'select') {
            this.model.unset('include_wildcard');
        }
    },

    on_change_multidim_common: function(evt) {
        if($(evt.target).is(':checked')) {
            this.model.set('multidim_common', true);
        }
        else {
            this.model.set('multidim_common', false);
        }
    }

});

App.StructureEditor = Backbone.View.extend({

    template: App.get_template('editor/structure.html'),

    title: "Structure",

    events: {
    },

    update_model: function(){
        var values = {};
        _(values).extend(this.categoryby.get_values());
        _(values).extend(this.multipleseries.get_values());
        this.model.set(values);
        this.apply_changes();
    },

    initialize: function(options) {
        this.categoryby = new App.CategoriesView({
            model: new Backbone.Model({}),
            parent_view: this
        });
        this.multipleseries = new App.MultipleSeriesView({
            model: new Backbone.Model({}),
            parent_view: this
        });
        this.multipleseries.model.on('change', this.update_model, this);
        this.categoryby.model.on('change', this.update_model, this);

        if(!this.model.has('multiple_series')) {
            this.model.set('multiple_series', null);
        }
        if(!this.model.has('category_facet')) {
            this.model.set('category_facet', null);
        }
        this.facet_views = _.object(this.model.facets.map(function(facet_model) {
            var facet_view = new App.StructureEditorField({
                model: facet_model,
                structure_editor: this
            });
            return [facet_model.cid, facet_view];
        }, this));
        this.apply_changes();
        this.render();
        this.model.facets.on('change:type change:multidim_common', this.apply_changes, this);
    },

    compute_facet_roles: function() {
        var series_options = [];
        var no_multiple_series = true;
        var is_multilines = typeof this.model.get('multiple_series') == 'number';
        this.model.facets.forEach(function(facet_model) {
            var facet = facet_model.toJSON();
            var name = facet['name'];
            if (is_multilines) {
                if (name == 'ref-area' && facet['type'] == 'multiple_select'){
                    facet_model.set('type', 'select');
                    facet['type'] = 'select';
                }
                if (name == 'time-period') {
                    facet_model.set('type', 'all-values');
                    facet_model.set('multidim_common', 'true');
                    facet['type'] = 'all-values';
                }
            }
            if(facet['type'] == 'multiple_select' ||
               facet['type'] == 'all-values') {
                var option = _({}).extend(facet);
                if(name == this.model.get('multiple_series')) {
                    option['selected'] = true;
                    no_multiple_series = false;
                }
                series_options.push(option);
            }
        }, this);
        if(no_multiple_series && !is_multilines) {
            // is number for multilines chart
            this.model.set('multiple_series', null);
        }

        this.facet_roles = {
            series_options: series_options
        };

        this.categoryby.update();
        this.multipleseries.update();

    },

    render: function() {
        var context = _({
            chart_is_multidim: this.chart_is_multidim()
        }).extend(this.model.toJSON());
        this.$el.html(this.template(context));
        this.$el.find('[name="categories-by"]').html(this.categoryby.el);
        // TODO
        var is_multilines = typeof this.model.get('multiple_series') == 'number';
        if (! is_multilines ){
            this.$el.find('[name="multiple-series-slot"]').html(this.multipleseries.el);
        }
        this.categoryby.delegateEvents();
        this.multipleseries.delegateEvents();
        this.model.facets.forEach(function(facet_model) {
            var facet_view = this.facet_views[facet_model.cid];
            facet_view.render();
            this.$el.find('div.editor-structure').append(facet_view.el);
            facet_view.delegateEvents();
        }, this);
    },

    save_value: function() {
        var value = this.model.facets.get_value(
                this.chart_is_multidim(),
                this.model.layout_collection.presets());
        this.model.set('facets', value);
    },

    chart_is_multidim: function() {
        if (this.model.get('multidim')) {
            return this.model.get('multidim');
        }
        if (typeof this.model.get('multiple_series') == 'number') {
            return this.model.get('multiple_series');
        }
        return false;
    },

    apply_changes: function() {
        this.compute_facet_roles();
        this.save_value();
        this.render();
    }

});


App.MultipleSeriesView = Backbone.View.extend({
    template: App.get_template('editor/multipleseries.html'),

    events: {
        'change [name="multiple_series"]': 'on_change_multiple_series'
    },

    initialize: function(options){
        this.parent_view = options.parent_view;
        this.model.on('change', this.render, this);
        this.render();
    },

    update: function(){
        this.model.set({
            series_options: this.parent_view.facet_roles.series_options,
            chart_is_multidim: this.parent_view.chart_is_multidim()
        });
        this.render();
    },

    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
    },

    on_change_multiple_series: function() {
        var select = this.$el.find('[name="multiple_series"]');
        this.model.set('multiple_series', select.val() || null);
    },

    get_values: function(){
        return _(this.model.toJSON()).pick('multiple_series');
    }
});

App.CategoriesView = Backbone.View.extend({

    template: App.get_template('editor/categories.html'),

    events: {
        'change [name="categories"]': 'on_change_categories'
    },

    initialize: function(options){
        this.parent_view = options.parent_view;
        this.model.on('change', this.render, this);
        this.update();
    },

    update: function(){
        var category_config = {};
        if(this.parent_view.facet_roles) {
            var series_options = this.parent_view.facet_roles.series_options;
            var category_facet = this.parent_view.model.get("category_facet");

            _(category_config).extend({
                category_facet: category_facet,
                series_options: _(series_options)
                  .map(_.clone)
                  .filter(function(item){
                    item.selected = false;
                    if(item.name === category_facet){
                      item.selected = true;
                    }
                    return item;
                  }, this)
            });
        }
        this.model.set(category_config);
        this.render();
    },

    on_change_categories: function() {
        var select = this.$el.find('[name="categories"]');
        this.model.set('category_facet', select.val() || null);
    },

    get_values: function(){
        return _(this.model.toJSON()).pick('category_facet');
    },

    render: function(){
        var context = _({}).extend(this.model.toJSON());
        this.$el.html(this.template(context));
    }
});

})(App.jQuery);
