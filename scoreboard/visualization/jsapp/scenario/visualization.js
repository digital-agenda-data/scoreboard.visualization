/*global App, Scoreboard, Backbone */
/*jshint sub:true */

(function($) {
"use strict";


App.Visualization = Backbone.View.extend({

    template: App.get_template('scenario.html'),
    embedded_template: App.get_template('scenario_embedded.html'),

    // As of Backbone 1.1, options passed into the Backbone.View constructor
    // are no longer automatically attached to the view instance as this.options.
    constructor: function(options) {
        this.options = options || {};
        Backbone.View.apply(this, arguments);
    },

    initialize: function(options) {
        this.embedded = options['embedded'] !== undefined ? options['embedded'] : false;
        this.viewPortW = $(window).width();
        this.viewPortH = $(window).height();
        if (this.embedded) {
            this.$el.html(this.embedded_template());
            // hide cookie notification
            $('.cookie-consent').hide();
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
                    uri = uri.replace('"null"', 'null');
                }
                url_filters = JSON.parse(uri);
            } catch(e) {}
            var keep_filters = {};
            var filter_list = ['select', 'multiple_select', 'dataset_select',
                               'composite', 'hidden_select'];
            _(filters_schema).forEach(function(item) {
                if (_.contains(filter_list, item['type']) > -1) {
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

        App.cube_metadata = this.get_metadata(options);
        App.cube_html_annotations = this.get_annotations(options);

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

    get_metadata: function(options) {

        var url = options['cube_url'] + '/dimension_metadata';
        var args = {};
        args['rev'] = options['data_revision'] || '';

        return JSON.parse( $.ajax({
            type: "GET",
            url: url,
            async: false,
            cache: true,
            dataType: 'json',
            data: args
        }).responseText);
    },

    get_annotations: function(options) {

        var url = options['cube_url'] + '/annotations.json';
        var args = {};
        //args['rev'] = options['data_revision'] || '';

        return JSON.parse( $.ajax({
            type: "GET",
            url: url,
            async: false,
            cache: true,
            dataType: 'json',
            data: args
        }).responseText);
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

App.metadata_by_uri = function(uri) {
    var metadata = null;

    for (var key in App.cube_metadata) {
        metadata = _(App.cube_metadata[key]).find(function(dimension){
            return dimension['uri'] == uri;
        });
        if(!!metadata){
            metadata['dimension'] = key;
            return metadata;
        }
    }
    return null;
};


})(App.jQuery);
