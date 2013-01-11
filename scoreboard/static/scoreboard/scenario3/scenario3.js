/*global App, Backbone, $, _ */
/*jshint sub:true */

(function() {
"use strict";


App.Scenario3FiltersView = Backbone.View.extend({

    template: App.get_template('scoreboard/scenario3/filters.html'),

    events: {
        'change select': 'update_filters',
        'change input[name=year]': 'update_filters'
    },

    initialize: function(options) {
        this.filters_data = JSON.stringify(options['filters_data']);
        this.model.on('change', this.render, this);
        this.render();
    },

    get_options: function(value) {
        var data = {
            'indicators_for_x': JSON.parse(this.filters_data)['indicators'],
            'indicators_for_y': JSON.parse(this.filters_data)['indicators']
        }

        var index_x = App.index_by(data['indicators_for_x'], 'uri');
        var index_y = App.index_by(data['indicators_for_y'], 'uri');
        var indicator_x = index_x[value['indicator_x']];
        var indicator_y = index_y[value['indicator_y']];
        if(indicator_x) { indicator_x['selected'] = true; }
        if(indicator_y) { indicator_y['selected'] = true; }

        if(indicator_x && indicator_y) {
            var years = _(indicator_x['years']).filter(function(y) {
                return _(indicator_y['years']).contains(y);
            });
            data['years'] = _(years).map(function(year) {
                return {
                    'value': year,
                    'selected': (year == value['year'])
                }
            });
        } else {
            data['years'] = [];
        }
        return data;
    },

    render: function() {
        var options = this.get_options(this.model.toJSON());
        this.$el.html(this.template(options));
    },

    update_filters: function() {
        var year = this.$el.find('[name=year]:checked').val();
        var new_value = {
            'indicator_x': this.$el.find('select[name=indicator_x]').val(),
            'indicator_y': this.$el.find('select[name=indicator_y]').val()
        };
        var options = this.get_options(new_value);
        var available_years = _(_(options['years']).pluck('value'));
        if(! available_years.contains(year)) { year = null; }
        new_value['year'] = year;
        this.model.set(new_value);
    }

});


App.scenario3_initialize = function() {

    var box = $('#scenario-box');
    box.html(App.get_template('scoreboard/scenario3/scenario3.html')());
    box.addClass('scenario3');

    App.filters = new Backbone.Model();
    App.router = new App.ChartRouter(App.filters);

    $.getJSON(App.URL + '/filters_data', function(data) {
        new App.Scenario3FiltersView({
            model: App.filters,
            el: $('#the-filters'),
            filters_data: data
        });

    });

    App.metadata_x = new App.IndicatorMetadataView({
        model: App.filters,
        field: 'indicator_x'
    });
    $('#the-metadata').append(App.metadata_x.el);

    App.metadata_y = new App.IndicatorMetadataView({
        model: App.filters,
        field: 'indicator_y'
    });
    $('#the-metadata').append(App.metadata_y.el);

    Backbone.history.start();

};


})();
