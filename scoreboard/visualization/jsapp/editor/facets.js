/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.FacetEditorField = Backbone.View.extend({

    tagName: 'tr',
    template: App.get_template('editor/facet-field.html'),

    events: {
        'change [name="type"]': 'on_change_type'
    },

    type_options: [
        {value: 'select', label: "select filter"},
        {value: 'multiple_select', label: "multiple select filter"},
        {value: 'all-values', label: "all values as series"},
        {value: 'data-column', label: "datapoints"}
    ],

    initialize: function(options) {
        this.render();
    },

    render: function() {
        var context = _({
            'type_options': _(this.type_options).map(function(opt) {
                var selected = this.model.get('type') == opt['value'];
                return _({
                    selected: selected
                }).extend(opt);
            }, this)
        }).extend(this.model.toJSON());
        this.$el.html(this.template(context));
        this.$el.attr('data-name', this.model.get('name'));
    },

    on_change_type: function(evt) {
        this.model.set('type', $(evt.target).val());
    }

});


App.FacetsEditor = Backbone.View.extend({

    template: App.get_template('editor/facets.html'),

    title: "Facets",

    initialize: function(options) {
        this.render();
        var dimensions_ajax = $.get(options.cube_url + '/dimensions?flat=on');
        dimensions_ajax.done(_.bind(this.got_dimensions, this));
    },

    got_dimensions: function(dimensions) {
        this.dimensions = dimensions;
        this.load_value();
    },

    load_value: function() {
        this.facets = new Backbone.Collection(this.model.get('facets'));
        this.facet_views = {};
        _(this.dimensions).forEach(function(dimension) {
            if(dimension['type_label'] != 'dimension' &&
               dimension['type_label'] != 'group dimension') {
                return;
            }
            var name = dimension['notation'];
            var facet_model = this.facets.findWhere({name: name});
            if(! facet_model) {
                facet_model = new Backbone.Model({
                    'name': name,
                    'dimension': name,
                    'label': dimension['label']
                });
            }
            this.facets.add(facet_model);
            var facet_view = new App.FacetEditorField({model: facet_model});
            this.facet_views[facet_model.cid] = facet_view;
        }, this);
        this.facets.on('change', this.save_value, this);
        this.save_value();
        this.render();
    },

    render: function() {
        if(! this.dimensions) {
            this.$el.html('loading...');
            return;
        }
        this.$el.html(this.template());
        this.facets.forEach(function(facet_model) {
            var facet_view = this.facet_views[facet_model.cid];
            this.$el.find('tbody').append(facet_view.el);
        }, this);
    },

    save_value: function() {
        var value = [];
        this.facets.forEach(function(facet) {
            value.push(facet.toJSON());
        });
        this.model.set('facets', value);
    }

});


})(App.jQuery);