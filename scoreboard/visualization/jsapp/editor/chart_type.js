/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.ChartTypeEditor = Backbone.View.extend({

    tagName: 'form',
    className: 'editor-charttype',
    template: App.get_template('editor/chart_type.html'),

    title: "Chart type",

    events: {
        'change': 'save'
    },

    chart_types: [
        {label: "Line", value: 'lines',
         multilines_available: true},
        {label: "Column", value: 'columns',
         animation_available: true},
        {label: "Scatterplot", value: 'scatter',
         multidim: 2,
         animation_available: true},
        {label: "Bubble chart", value: 'bubbles',
         multidim: 3,
         animation_available: true},
        {label: "Map", value: 'map'}
    ],

    checkboxes_refresh: function(){
        var animation = this.$el.find('[name="animation"]').is(':checked');
        var multilines = this.$el.find('[name="multilines"]').is(':checked');

        if (animation) { 
            this.model.set('animation', animation);
        } else {
            this.model.unset('animation');
        }
        if (multilines) {
            this.model.set('multilines', multilines);
            this.model.set('multiple_series', 2);
        } else {
            this.model.unset('multilines');
            this.model.unset('multiple_series');
            this.model.unset('multidim');
        }
        return {'animation': animation, 'multilines': multilines}
    },

    initialize: function(options) {
        if(! _(this.chart_types).findWhere({value: this.model.get('chart_type')})) {
            this.model.set('chart_type', this.chart_types[0]['value']);
        }

        this.checkboxes_refresh();
        this.render();
    },

    render: function() {
        var value = this.model.get('chart_type');
        if(! _(this.chart_types).findWhere({value: value})) {
            value = this.chart_types[0]['value'];
        }
        var chart_types = _(this.chart_types).map(function(chart_type) {
            var selected = chart_type['value'] === value;
            return _({selected: selected}).extend(chart_type);
        }, this);
        var chart_type_info = _(this.chart_types).findWhere({value: value});

        var context = {
            chart_types: chart_types,
            animation: this.model.get('animation'),
            animation_available: chart_type_info['animation_available'],
            multilines: this.model.get('multilines'),
            multilines_available: chart_type_info['multilines_available']
        };
        this.$el.html(this.template(context));
    },

    save: function() {
        var chart_type = this.$el.find('[name=chart-type]:checked').val();
        if(! _(this.chart_types).findWhere({value: chart_type})) {
            chart_type = this.chart_types[0]['value'];
        }
        this.model.set('chart_type', chart_type);

        var multilines = this.checkboxes_refresh()['multilines'];

        var chart_def = _(this.chart_types).findWhere({value: chart_type});
        var multidim = chart_def['multidim'];

        if (multilines) { multidim = 2;}

        if (multidim) {
            this.model.set('multidim', multidim);
        }
        else {
            this.model.unset('multidim');
        }
        this.render();
    }

});


})(App.jQuery);
