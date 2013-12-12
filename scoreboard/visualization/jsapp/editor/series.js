/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.SeriesEditor = Backbone.View.extend({

    tagName: 'form',
    className: 'editor-series form-inline',

    template: App.get_template('editor/series.html'),

    title: "Legend and tooltips",

    events: {
        'change [name="tooltip"]': 'on_tooltip_change',
        'change [name="legend-label"]': 'on_legend_label_change',
        'change [name="point-label"]': 'on_point_label_change',
        'change [name="ending-label"]': 'on_ending_label_change'
    },

    legend_label_options: [
        {value: 'none', label: "none"},
        {value: 'short', label: "Short label"},
        {value: 'long', label: "Long label"}
    ],

    point_label_options: [
        {value: 'none', label: "none"},
        {value: 'short', label: "Short label"}
    ],

    ending_label_options: [
        {value: 'none', label: "none"},
        {value: 'short', label: "Short label"},
        {value: 'long', label: "Long label"}
    ],

    initialize: function(options) {
        this.tooltips_model = new Backbone.Model(this.model.get('tooltips'));
        if (!this.model.has('tooltips')){
            _.chain(this.model.dimensions)
             .where({type_label: "attribute"})
             .each(function(dimension){
                this.tooltips_model.set(dimension.notation, true);
             }, this);
            this.model.set('tooltips', this.tooltips_model.toJSON());
        }
        this.tooltips_model.on('change', function() {
            this.model.set('tooltips', this.tooltips_model.toJSON());
        }, this);
        this.render();
    },

    render: function() {
        var tooltips = [];
        _(this.model.dimensions).forEach(function(dimension) {
            if(dimension['type_label'] == 'attribute') {
                tooltips.push({
                    label: dimension['label'],
                    value: dimension['notation'],
                    checked: this.tooltips_model.get(dimension['notation'])
                });
            }
        }, this);
        var context = {
            tooltips: tooltips,
            legend_label_options: _(this.legend_label_options).map(
                                   function(spec) {
                var item = _({}).extend(spec);
                if(item['value'] == this.model.get('series-legend-label')) {
                    item['selected'] = true;
                }
                return item;
            }, this),
            point_label_options: _(this.point_label_options).map(
                                   function(spec) {
                var item = _({}).extend(spec);
                if(item['value'] == this.model.get('series-point-label')) {
                    item['selected'] = true;
                }
                return item;
            }, this),
            ending_label_options: _(this.ending_label_options).map(
                                   function(spec) {
                var item = _({}).extend(spec);
                if(item['value'] == this.model.get('series-ending-label')) {
                    item['selected'] = true;
                }
                return item;
            }, this)
        };
        this.$el.html(this.template(context));
    },

    on_tooltip_change: function() {
        _(this.$el.find('[name="tooltip"]')).forEach(function(checkbox) {
            var tooltip = $(checkbox).val();
            if($(checkbox).is(':checked')) {
                this.tooltips_model.set(tooltip, true);
            }
            else {
                this.tooltips_model.unset(tooltip);
            }
        }, this);
    },

    on_legend_label_change: function() {
        var value = this.$el.find('[name="legend-label"]').val();
        this.model.set('series-legend-label', value);
    },

    on_point_label_change: function() {
        var value = this.$el.find('[name="point-label"]').val();
        this.model.set('series-point-label', value);
    },

    on_ending_label_change: function() {
        var value = this.$el.find('[name="ending-label"]').val();
        this.model.set('series-ending-label', value);
    }

});


})(App.jQuery);
