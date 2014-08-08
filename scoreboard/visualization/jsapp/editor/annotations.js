/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.AnnotationsEditor = Backbone.View.extend({

    tagName: 'form',
    className: 'editor-annotations form-inline',

    template: App.get_template('editor/annotations.html'),

    title: "Definitions",

    events: {
        'change [name="annotation"]': 'on_change_annotation',
        'change [name="title"]': 'on_change_texts',
        'change [name="notes"]': 'on_change_texts'
    },

    initialize: function(options) {
        if (!this.model.has('annotations')){
            var filters = [];
            var defaults = ['indicator', 'breakdown', 'unit-measure'];
            _.chain(this.model.get('facets'))
             .filter(function(facet){
                if(facet['type'] == 'ignore' || facet['dimension'] == 'value') {
                    return false;
                }
                 return _(defaults).contains(facet.dimension);
             }).each(function(facet){
                 filters.push({'name': facet.name});
             });
            this.model.set('annotations', {filters: filters});
        }
        this.annotations_model = new Backbone.Model(
            this.model.get('annotations'));
        this.annotations_model.on('change', function() {
            this.model.set('annotations', this.annotations_model.toJSON());
        }, this);
        this.render();
    },

    render: function() {
        var filters  = (this.model.get('annotations') || {})['filters'];
        var selected_facets = _(filters).pluck('name');
        var facets = [];
        _(this.model.get('facets')).forEach(function(facet) {
            if(facet['type'] === 'ignore' ||
               facet['dimension'] === 'value' ||
               _.chain(facets).pluck('value').contains(facet['dimension']).value()) {
                return;
            }
            var item = {
                label: facet['label'],
                value: facet['dimension']
            };
            if(_(selected_facets).contains(facet['name'])) {
                item['checked'] = true;
            }
            facets.push(item);
        });
        this.$el.html(this.template({
            facets: facets,
            title: (this.annotations_model.get('title') || "Definitions and scopes"),
            notes: this.annotations_model.get('notes')
        }));
    },

    on_change_annotation: function(evt) {
        var checked = this.$el.find('[name="annotation"]:checked');
        var value = _(checked).map(function(checkbox) {
            var facets = _(this.model.get("facets")).where({"dimension": $(checkbox).val()});
            return facets.map(function(facet){
                return {name: facet.name};
            });
        }, this);
        this.annotations_model.set('filters', _.flatten(value));
    },

    on_change_texts: function() {
        this.annotations_model.set('title', this.$el.find('[name="title"]').val());
        this.annotations_model.set('notes', this.$el.find('[name="notes"]').val());
    }

});


})(App.jQuery);
