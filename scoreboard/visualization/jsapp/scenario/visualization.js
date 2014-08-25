/*global App, Scoreboard, Backbone */
/*jshint sub:true */

(function($) {
"use strict";


App.Visualization = Backbone.View.extend({

    template: App.get_template('scenario.html'),
    embedded_template: App.get_template('scenario_embedded.html'),

    initialize: function(options) {
        this.embedded = options['embedded'] !== undefined ? options['embedded'] : false;
        this.viewPortW = $(window).width();
        this.viewPortH = $(window).height();
        if (this.embedded) {
            this.$el.html(this.embedded_template());
        } else {
            this.$el.html(this.template());
        }
        this.filters = new Backbone.Model();
        this.filter_loadstate = new Backbone.Model();

        var filters_schema = [];
        var values_schema = [];
        var filters_in_url = [];
        var groupers = _.chain(options['schema']['facets'])
                        .filter(function(item){
                            return App.groupers[item['name']];
                         })
                        .map(function(item){
                           return App.groupers[item['name']];
                        })
                        .value()
        _(options['schema']['facets']).forEach(function(item) {
            if(item['type'] == 'ignore') {
                if(_(groupers).contains(item['name'])) {
                    // we need its values for grouping a dimension
                    item['type'] = 'all-values';
                } else {
                    return;
                }
            }
            if(item['dimension'] == 'value') {
                values_schema.push(item);
                return;
            }
            filters_schema.push(item);
            if(item['type'] != 'all-values') {
                filters_in_url.push(item['name']);
            }
        });
        this.filters_in_url = filters_in_url;

        if((App.initial_hash || '').substr(0, 7) == '#chart=') {
            var url_filters = {};
            try {
                var uri = decodeURIComponent(App.initial_hash.substr(7));
                if (uri.indexOf('"') == -1) {
                    var rgx = /([^\[\]\{\},:]+)/g;
                    uri = uri.replace(rgx, '"$1"');
                }
                url_filters = JSON.parse(uri);
            } catch(e) {}
            var keep_filters = {};
            _(filters_schema).forEach(function(item) {
                if(item['type'] == 'select' || item['type'] == 'multiple_select' || item['type'] == 'dataset_select' || item['type'] == 'composite') {
                    keep_filters[item['name']] = true;
                }
                // ignore ref-area from previous charts when navigating to map chart
                if(item['dimension'] == 'ref-area' && options['schema']['chart_type'] == 'map' ) {
                    keep_filters[item['name']] = false;
                }
            });
            _(url_filters).forEach(function(value, name) {
                if(! keep_filters[name]) {
                    if(name.substr(0, 2) == 'x-') {
                        name = name.substr(2);
                    }
                    else if(keep_filters['x-' + name]) {
                        name = 'x-' + name;
                    }
                    else {
                        return;
                    }
                }
                this.filters.set(name, value);
            }, this);
        }


        if (this.embedded){
            this.filters_box = new App.EmbeddedFiltersBox({
                el: this.$el.find('#the-filters'),
                model: this.filters,
                loadstate: this.filter_loadstate,
                cube_url: options['cube_url'],
                data_revision: options['data_revision'],
                schema: options['schema'],
                filters_schema: filters_schema,
                multidim: options['schema']['multidim'],
                dimensions: App.CUBE_DIMENSIONS
            });
        } else {
            this.filters_box = new App.FiltersBox({
                el: this.$el.find('#the-filters'),
                model: this.filters,
                loadstate: this.filter_loadstate,
                cube_url: options['cube_url'],
                data_revision: options['data_revision'],
                schema: options['schema'],
                filters_schema: filters_schema,
                multidim: options['schema']['multidim'],
                dimensions: App.CUBE_DIMENSIONS
            });

            this.metadata = new App.AnnotationsView({
                el: this.$el.find('#the-metadata'),
                cube_url: options['cube_url'],
                data_revision: options['data_revision'],
                model: this.filters,
                field: 'indicator',
                schema: options['schema']
            });

            this.share = new App.ShareOptionsView({
                el: this.$el.find('#the-share')
            });

            this.navigation = new Scoreboard.Views.ScenarioNavigationView({
                el: this.$el.find('#the-navigation'),
                cube_url: options['cube_url'],
                scenario_url: App.SCENARIO_URL
            });
        }

        var chart_type = options['schema']['chart_type'];
        this.chart_view = new App.ScenarioChartView({
            el: this.$el.find('#the-chart'),
            model: this.filters,
            loadstate: this.filter_loadstate,
            cube_url: options['cube_url'],
            data_revision: options['data_revision'],
            schema: options['schema'],
            filters_schema: filters_schema,
            values_schema: values_schema,
            scenario_chart: App.chart_library[chart_type],
            dimensions: App.CUBE_DIMENSIONS
        });
        this.$el.addClass(chart_type+'-chart');
        var chart_type = options['schema']['chart_type'];
        var el = this.$el;
        _(options['schema']['text']).forEach(function(item) {
            if (item['value']) {
                var paragraph = el.find("#the-filters ." + item['position'] + " p");
                paragraph.text(item['value']).removeClass('default-hidden');
            }
        });

        if (!this.embedded) {
            this.chart_view.on('chart_ready', this.share.chart_ready, this.share);
            this.metadata.on('metadata_ready', this.share.metadata_ready, this.share);
            this.filters.on('change', this.update_hashcfg, this);
        }

        this.chart_view.on('chart_ready', this.chart_view.chart_ready);

    },

    update_hashcfg: function() {
        // do not include all-values and ignore
        var hashcfg = 'chart=' + JSON.stringify(_.pick(this.filters.attributes, this.filters_in_url));
        this.navigation.update_hashcfg(hashcfg);
        this.share.update_url(App.SCENARIO_URL + '#' + hashcfg);
        App.update_url_hash(hashcfg);
    }

});


App.update_url_hash = function(value) {
    var base_url = window.location.href.split('#')[0];
    if(typeof(window.history.replaceState) == "function") {
        window.history.replaceState(null, '', base_url + '#' + value);
    }
    else {
        window.location.hash = value;
    }
};


App.create_visualization = function(container, schema) {
    App.visualization = new App.Visualization({
        el: container,
        embedded: $(container).hasClass("embedded"),
        schema: schema,
        cube_url: App.URL,
        data_revision: App.DATA_REVISION,
        scenario_url: App.SCENARIO_URL
    });
};


})(App.jQuery);
