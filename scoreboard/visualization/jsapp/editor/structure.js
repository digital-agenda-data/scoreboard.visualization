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
        'change [name="multidim"]': 'on_change_multidim',
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

    check_for_multilines: function(){
        if ( this.structure_editor.model.has('multilines') ){
            this.structure_editor.model.set('multiple_series', 2);
            this.type_options = [
                {value: 'select', label: "single selection"},
                {value: 'all-values', label: "all values"},
                {value: 'ignore', label: "ignore"}
            ]
        } 
    },

    render: function() {
        this.check_for_multilines();
        var context = _({
            type_options: _(this.type_options).map(function(opt) {
                var selected = this.model.get('type') == opt['value'];
                return _({
                    selected: selected
                }).extend(opt);
            }, this),
            is_single_select: (this.model.get('type') == 'select'),
            chart_is_multidim: this.structure_editor.chart_is_multidim()
        }).extend(this.model.toJSON());
        this.$el.html(this.template(context));
        this.$el.attr('data-name', this.model.get('name'));
        var params = {
            placeholder: "Click to select values",
            allowClear: true
        }
    },

    on_change_position: function(evt) {
        this.model.set({
            position: this.$el.find('[name="position"]').val()
        });
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

    on_change_multidim: function(evt) {
        if($(evt.target).is(':checked')) {
            this.model.unset('multidim');
        }
        else {
            this.model.set('multidim', true);
        }
    }

});

App.StructureEditor = Backbone.View.extend({

    template: App.get_template('editor/structure.html'),

    title: "Structure",

    events: {
        'change [name="multiple_series"]': 'on_multiple_series_change'
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
            model: new Backbone.Model({
            }),
            parent_view: this
        });
        this.multipleseries = new App.MultipleSeriesView({
            model: new Backbone.Model(),
            parent_view: this
        });
        this.multipleseries.model.on('change', this.update_model, this);
        this.categoryby.model.on('change', this.update_model, this);

        if(! this.model.has('multiple_series')) {
            this.model.set('multiple_series', null);
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
        this.model.facets.on('change:type change:multidim', this.apply_changes, this);
    },

    compute_facet_roles: function() {
        var series_options = [];
        var no_multiple_series = true;
        var free_dimensions = [];
        this.model.facets.forEach(function(facet_model) {
            var facet = facet_model.toJSON();
            var name = facet['name'];
            if(facet['type'] == 'multiple_select' ||
               facet['type'] == 'all-values') {
                var option = _({}).extend(facet);
                if(name == this.model.get('multiple_series')) {
                    option['selected'] = true;
                    no_multiple_series = false;
                }
                else {
                    free_dimensions.push(option);
                }
                series_options.push(option);
            }
        }, this);
        if(no_multiple_series) {
            this.model.set('multiple_series', null);
        }
        var category_facet = (free_dimensions.length == 1
                             ? free_dimensions[0]
                             : null);
        this.facet_roles = {
            series_options: series_options,
            err_too_few: (free_dimensions.length < 1),
            err_too_many: (free_dimensions.length > 1),
            category_facet: category_facet
        }
        this.categoryby.update();
        this.multipleseries.update();

    },

    render: function() {
        var context = _({
            chart_is_multidim: this.chart_is_multidim(),
            chart_has_multilines: this.model.has('multilines')
        }).extend(this.model.toJSON());
        this.$el.html(this.template(context));
        this.$el.find('[name="categories-by"]').html(this.categoryby.el);
        if (! this.model.has('multilines') ){
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
                this.model.get('multidim'),
                this.model.layout_collection.presets());
        this.model.set('facets', value);
    },

    chart_is_multidim: function() {
        return this.model.get('multidim') ? true : false;
    },

    apply_changes: function() {
        this.compute_facet_roles();
        this.save_value();
        this.render()
    },

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
    },

    initialize: function(options){
        this.parent_view = options.parent_view;
        this.update();
    },

    update: function(){
        var category_config = {};
        if(this.parent_view.facet_roles) {
            if (this.parent_view.facet_roles.category_facet){
                category_config['category_facet'] = this.parent_view.facet_roles.category_facet['name'];
            }
            _(category_config).extend({
                err_too_few: this.parent_view.facet_roles.err_too_few,
                err_too_many: this.parent_view.facet_roles.err_too_many
            });
        }
        else{
            _(category_config).extend({
                category_facet: null,
                err_too_few: null,
                err_too_many: null
            });
        }
        this.model.set(category_config);
        this.render();
    },

    get_values: function(){
        return _(this.model.toJSON()).pick(
            'highlights',
            'category_facet');
    },

    render: function(){
        var context = _({
        }).extend(this.model.toJSON(), this.parent_view.facet_roles);
        this.$el.html(this.template(context));
    }
});

})(App.jQuery);
