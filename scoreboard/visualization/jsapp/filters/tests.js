/*global App, Backbone, describe, beforeEach, afterEach, it, expect, sinon */
/*jshint sub:true */

describe('modular filters', function() {
    "use strict";

    var url_param = App.testing.url_param;

    describe('SelectFilter', function() {

        beforeEach(function() {
            this.sandbox = sinon.sandbox.create();
        });

        var NoAjaxSelectFilter = App.SelectFilter.extend({
            fetch_options: function(args) {
                var mock_ajax = App.jQuery.Deferred();
                mock_ajax.abort = function() {
                    mock_ajax.reject();
                };
                return mock_ajax;
            }
        });

        it('should load options via ajax', function() {
            this.sandbox.useFakeServer();
            var server = this.sandbox.server;
            var view = new App.SelectFilter({
                model: new Backbone.Model(),
                name: 'this-time-period',
                dimension: 'time-period'
            });
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            expect(view.dimension_options).to.deep.equal(options);
            expect(url_param(server.requests[0].url, 'dimension')).
                to.equal('time-period');
        });

        it('should filter years based on indicator', function() {
            this.sandbox.useFakeServer();
            var server = this.sandbox.server;
            var view = new App.SelectFilter({
                model: new Backbone.Model({'this-indicator': 'i_iugm'}),
                constraints: {
                    'indicator': 'this-indicator'
                },
                name: 'this-time-period',
                dimension: 'time-period'
            });
            expect(url_param(server.requests[0].url, 'dimension')).
                to.equal('time-period');
            expect(url_param(server.requests[0].url, 'indicator')).
                to.equal('i_iugm');
        });

        it('should wait until all constraints are selected', function() {
            this.sandbox.useFakeServer();
            var server = this.sandbox.server;
            var model = new Backbone.Model();
            var c1 = new NoAjaxSelectFilter({model: model,
                                             name: 'this-indicator',
                                             dimension: 'indicator'});
            var c2 = new NoAjaxSelectFilter({model: model,
                                             name: 'this-ref-area',
                                             dimension: 'ref-area'});
            var view = new NoAjaxSelectFilter({
                model: model,
                constraints: {
                    'indicator': 'this-indicator',
                    'ref-area': 'this-ref-area'
                },
                name: 'this-time-period',
                dimension: 'time-period'
            });
            expect(view.ajax).to.equal(null);

            c1.ajax.resolve({options: [{notation: 'ind1'}]});
            expect(view.ajax).to.equal(null);

            c2.ajax.resolve({options: [{notation: 'country1'}]});
            expect(view.ajax).to.not.equal(null);
        });

        it('should wait until constraints finish loading', function() {
            this.sandbox.useFakeServer();
            var server = this.sandbox.server;
            var model = new Backbone.Model({'this-ref-area': 'country1'});
            var loadstate = new Backbone.Model();
            var c1 = new NoAjaxSelectFilter({model: model,
                                             loadstate: loadstate,
                                             name: 'this-ref-area',
                                             dimension: 'ref-area'});
            var view = new NoAjaxSelectFilter({
                model: model,
                loadstate: loadstate,
                constraints: {
                    'ref-area': 'this-ref-area'
                },
                name: 'this-time-period',
                dimension: 'time-period'
            });
            expect(view.ajax).to.equal(null);

            c1.ajax.resolve({options: [{notation: 'country1'}]});
            expect(view.ajax).to.not.equal(null);
        });

        it('should abort in-flight ajax requests', function() {
            this.sandbox.useFakeServer();
            var server = this.sandbox.server;
            var view = new App.SelectFilter({
                model: new Backbone.Model(),
                name: 'this-time-period',
                dimension: 'time-period'
            });
            view.update();
            App.respond_json(server.requests[1], {
                'options': [{'label': "Option One", 'notation': 'two'}]});
            App.respond_json(server.requests[0], {
                'options': [{'label': "Option One", 'notation': 'one'}]});
            expect(view.dimension_options[0]['notation']).to.equal('two');
        });

        it('should update model with initial value', function() {
            var model = new Backbone.Model();
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            var view = new NoAjaxSelectFilter({
                model: model,
                name: 'this-time-period',
                dimension: 'time-period'
            });
            view.ajax.resolve({options: options});
            expect(model.get('this-time-period')).to.equal('one');
        });

        it('should update model when selection changes', function() {
            var model = new Backbone.Model();
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            var view = new NoAjaxSelectFilter({
                model: model,
                name: 'this-time-period',
                dimension: 'time-period'
            });
            view.ajax.resolve({options: options});
            App.testing.choose_option(view.$el.find('select'), 'two');
            expect(model.get('this-time-period')).to.equal('two');
        });

        it('should call dimension_options_xy view if multidim=2', function() {
            this.sandbox.useFakeServer();
            var server = this.sandbox.server;
            var view = new App.SelectFilter({
                multidim: 2,
                model: new Backbone.Model(),
                name: 'this-time-period',
                dimension: 'time-period'
            });
            expect(server.requests[0].url).to.contain('/dimension_options_xy?');
        });

        it('should render with current value selected', function() {
            var model = new Backbone.Model({'this-time-period': 'two'});
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            var view = new NoAjaxSelectFilter({
                model: model,
                name: 'this-time-period',
                dimension: 'time-period'
            });
            view.ajax.resolve({options: options});
            expect(view.$el.find('select').val()).to.equal('two');
            expect(model.get('this-time-period')).to.equal('two');
        });

        it('should pick default value if old value is invalid', function() {
            var model = new Backbone.Model({'this-time-period': 'other'});
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            var view = new NoAjaxSelectFilter({
                model: model,
                name: 'this-time-period',
                dimension: 'time-period',
                default_value: 'two'
            });
            view.ajax.resolve({options: options});
            expect(view.$el.find('select').val()).to.equal('two');
            expect(model.get('this-time-period')).to.equal('two');
        });

    });


    describe('MultipleSelectFilter', function() {

        var NoAjaxMultipleSelectFilter = App.MultipleSelectFilter.extend({
            fetch_options: function(args) {
                var mock_ajax = App.jQuery.Deferred();
                mock_ajax.abort = function() {
                    mock_ajax.reject();
                };
                return mock_ajax;
            }
        });

        it('should select all values if default_all', function() {
            var model = new Backbone.Model();
            var options = [{'notation': 'one'}, {'notation': 'two'}];
            var view = new NoAjaxMultipleSelectFilter({
                model: model,
                name: 'fil1',
                dimension: 'dim1',
                default_all: true
            });
            view.ajax.resolve({options: options});
            expect(view.$el.find('select').val()).to.deep.equal(['one', 'two']);
            expect(model.get('fil1')).to.deep.equal(['one', 'two']);
        });

        it('should preserve selection even if default_all', function() {
            var model = new Backbone.Model({'fil1': ['one']});
            var options = [{'notation': 'one'}, {'notation': 'two'}];
            var view = new NoAjaxMultipleSelectFilter({
                model: model,
                name: 'fil1',
                dimension: 'dim1',
                default_all: true
            });
            view.ajax.resolve({options: options});
            expect(view.$el.find('select').val()).to.deep.equal(['one']);
            expect(model.get('fil1')).to.deep.equal(['one']);
        });

        it('should pick default value if old value is invalid', function() {
            var model = new Backbone.Model({'fil1': 'other'});
            var options = [{'label': "Option One", 'notation': 'v1'},
                           {'label': "Option Two", 'notation': 'v2'},
                           {'label': "Option Three", 'notation': 'v3'}];
            var view = new NoAjaxMultipleSelectFilter({
                model: model,
                name: 'fil1',
                dimension: 'dim1',
                default_value: ['v2', 'v3']
            });
            view.ajax.resolve({options: options});
            expect(view.$el.find('select').val()).to.deep.equal(['v2', 'v3']);
            expect(model.get('fil1')).to.deep.equal(['v2', 'v3']);
        });

    });

    describe('HiddenSelectFilter', function() {

        var NoAjaxHiddenSelectFilter = App.HiddenSelectFilter.extend({
            fetch_options: function(args) {
                var mock_ajax = App.jQuery.Deferred();
                mock_ajax.abort = function() {
                    mock_ajax.reject();
                };
                return mock_ajax;
            }
        });
        it('should add the hidden-select class', function() {
            var model = new Backbone.Model();
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            var view = new NoAjaxHiddenSelectFilter({
                model: model,
                name: 'this-time-period',
                dimension: 'time-period',
                default_value: 'two'
            });
            view.ajax.resolve({options: options});
            expect(view.$el.hasClass('hidden-select')).to.equal(true);
        });
    });

    describe('CompositeFilter', function() {
        this.sandbox = sinon.sandbox.create();
        this.sandbox.useFakeServer();
        var server = this.sandbox.server;
        App.visualization = sinon.mock();
        
        var schema = {
            facets: [
                {type: 'select',
                 name: 'indicator-group',
                 label: 'Indicator group',
                 dimension: 'indicator-group',
                 include_wildcard: true,
                 constraints: {}},
                {type: 'composite',
                 name: 'breakdown',
                 label: 'Breakdown',
                 dimension: 'breakdown',
                 position: 'upper-right',
                 constraints: {}}
            ]
        };
        
        var scenario_chart = sinon.spy();
        
        this.model = new Backbone.Model();
        this.model.set({'indicator-group': 'any',
                        'breakdown': 'option'});
        
        var chart = new App.ScenarioChartView({
            model: this.model,
            schema: schema,
            scenario_chart: scenario_chart
        });
        
        expect(server.requests[0].url).to.contain('/datapoints?');
        App.visualization.chart_view = chart;

        var NoAjaxCompositeFilter = App.CompositeFilter.extend({
            fetch_options: function(args) {
                var mock_ajax = App.jQuery.Deferred();
                mock_ajax.abort = function() {
                    mock_ajax.reject();
                };
                return mock_ajax;
            }
        });

        it('should display the sliders widgets', function() {
            var model = new Backbone.Model();
            var options = [{'label': "Option One", 'notation': 'v1'},
                           {'label': "Option Two", 'notation': 'v2'},
                           {'label': "Option Three", 'notation': 'v3'}];
            var view = new NoAjaxCompositeFilter({
                model: model,
                name: 'fil1',
                dimension: 'dim1',
                label: 'Composite'
            });
            view.ajax.resolve({options: options});
            expect(view.$el.find('.composite-slider-widget').length).to.deep.equal(3);
            expect(view.$el.find('.slider-label label').text())
                .to.deep.equal('Option OneOption TwoOption Three');
            expect(model.get('fil1')).to.deep.equal(["v1", "v2", "v3"]);
        });

        it('should store sliders position in slidersvalues data attribute', function() {
            var model = new Backbone.Model();
            var options = [{'label': "Option One", 'notation': 'v1'},
                           {'label': "Option Two", 'notation': 'v2'}];
            var view = new NoAjaxCompositeFilter({
                model: model,
                name: 'fil1',
                dimension: 'dim1',
                label: 'Composite'
            });
            view.ajax.resolve({options: options});
            expect(view.$el.find('.composite-slider-widget').length).to.deep.equal(2);
            var sliders = view.$el.find('.composite-slider');
            var sliders_values = sliders.data('slidersvalues');
            expect(JSON.stringify(sliders_values)).to.deep.equal('{"v1":5,"v2":5}');
        });
    });

    describe('AnyOption', function(){
        "use strict";

        beforeEach(function() {
            this.sandbox = sinon.sandbox.create();
            this.sandbox.useFakeServer();
        });

        afterEach(function () {
            this.sandbox.restore();
        });

        it('should include "any" option if allowed in schema', function() {
            var server = this.sandbox.server;
            var view = new App.SelectFilter({
                model: new Backbone.Model(),
                name: 'this-time-period',
                dimension: 'time-period',
                include_wildcard: true
            });
            App.respond_json(server.requests[0], {'options': []});
            expect(_(view.dimension_options).pluck('notation')).to.deep.equal(['any']);
            expect(view.$el.find('option').val()).to.deep.equal('any');
        });

        it("should have a mapping to groupers on App", function(){
            expect(App.groupers).to.deep.equal({
                'indicator': 'indicator-group',
                'x-indicator': 'x-indicator-group',
                'y-indicator': 'y-indicator-group',
                'z-indicator': 'z-indicator-group',
                'breakdown': 'breakdown-group',
                'x-breakdown': 'x-breakdown-group',
                'y-breakdown': 'y-breakdown-group',
                'z-breakdown': 'z-breakdown-group'
            });
        });

        it("should set display_in_groups to true", function(){
            var server = this.sandbox.server;
            var box = $('<div></div>');
            box.html(App.get_template('scenario.html')());

            var filter_loadstate = new Backbone.Model();

            this.model = new Backbone.Model();
            var filters_box = new App.FiltersBox({
                el: $('#the-filters', box)[0],
                model: this.model,
                loadstate: filter_loadstate,
                schema: {},
                filters_schema: [
                    {type: 'select',
                     name: 'indicator-group',
                     label: 'Indicator group',
                     dimension: 'indicator-group',
                     include_wildcard: true,
                     constraints: {}},
                    {type: 'select',
                     name: 'indicator',
                     label: 'Indicator',
                     dimension: 'indicator',
                     constraints: {
                         'indicator-group': 'indicator-group'
                     }}
                ]
            });

            this.model.set('indicator-group', 'option');
            expect(filters_box.filters[1].display_in_groups).to.equal(false);
            this.model.set('indicator-group', 'any');
            expect(filters_box.filters[1].display_in_groups).to.equal(true);
        });

        it("should use the group template if its grouper's value is 'any'", function(){
            var server = this.sandbox.server;
            var box = $('<div></div>');
            box.html(App.get_template('scenario.html')());

            var filter_loadstate = new Backbone.Model();

            this.model = new Backbone.Model();
            App.visualization = sinon.mock();
            App.visualization.filters_box = new App.FiltersBox({
                el: $('#the-filters', box)[0],
                model: this.model,
                loadstate: filter_loadstate,
                schema: {},
                filters_schema: [
                    {type: 'select',
                     name: 'indicator-group',
                     label: 'Indicator group',
                     dimension: 'indicator-group',
                     include_wildcard: true,
                     constraints: {}},
                    {type: 'select',
                     name: 'indicator',
                     label: 'Indicator',
                     dimension: 'indicator',
                     constraints: {
                         'indicator-group': 'indicator-group'
                     }}
                ]
            });
            var filters_box = App.visualization.filters_box;
            var simple_template = new sinon.spy();
            var group_template = new sinon.spy();
            filters_box.filters[1].simple_template = simple_template;
            filters_box.filters[1].group_template = group_template;

            App.respond_json(server.requests[0],
                    {'options': [
                        {'short_label': 'lbl',
                         'notation': 'group'}
                     ]
                    });
            var options = [{'label': "Option One", 'notation': 'one', 'group_notation': 'group'}];
            App.respond_json(server.requests[1], {'options': options});
            expect(group_template.callCount).to.equal(1);
            this.model.set('indicator-group', 'option');
            App.respond_json(server.requests[2], {'options': options});
            expect(simple_template.callCount).to.equal(1);
            expect(group_template.callCount).to.equal(1);
        });

        it("should format the data for the group template", function(){
            var server = this.sandbox.server;
            var box = $('<div></div>');
            box.html(App.get_template('scenario.html')());

            var filter_loadstate = new Backbone.Model();

            this.model = new Backbone.Model();
            App.visualization = sinon.mock();
            App.visualization.filters_box = new App.FiltersBox({
                el: $('#the-filters', box)[0],
                model: this.model,
                loadstate: filter_loadstate,
                schema: {},
                filters_schema: [
                    {type: 'select',
                     name: 'indicator-group',
                     label: 'Indicator group',
                     dimension: 'indicator-group',
                     include_wildcard: true,
                     constraints: {}},
                    {type: 'select',
                     name: 'indicator',
                     label: 'Indicator',
                     dimension: 'indicator',
                     constraints: {
                         'indicator-group': 'indicator-group'
                     }}
                ]
            });
            var filters_box = App.visualization.filters_box;
            var group_template = sinon.spy(filters_box.filters[1], 'group_template');
            App.respond_json(server.requests[0],
                    {'options': [
                        {'short_label': 'lbl',
                         'notation': 'group'}
                     ]
                    });
            var options = [{'label': "Option One", 'notation': 'one', 'group_notation': 'group'}];
            App.respond_json(server.requests[1], {'options': options});
            expect(group_template.callCount).to.equal(1);
            expect(group_template.args[0][0]['groups']).to.deep.equal(
                [{
                    group: 'lbl',
                    options: [{
                        group_notation: 'group',
                        label: 'Option One',
                        notation: 'one',
                        selected: true
                    }]
                }]
            );
            var target = filters_box.filters[1]
            expect(target.$el.find('optgroup').attr('label')).to.equal('lbl');
            expect(target.$el.find('option').attr('value')).to.equal('one');
        });

        it("should omit its grouper=='any' when making options requests", function(){
            var server = this.sandbox.server;
            var box = $('<div></div>');
            box.html(App.get_template('scenario.html')());

            var filter_loadstate = new Backbone.Model();

            this.model = new Backbone.Model();
            var filters_box = new App.FiltersBox({
                el: $('#the-filters', box)[0],
                model: this.model,
                loadstate: filter_loadstate,
                schema: {},
                filters_schema: [
                    {type: 'select',
                     name: 'indicator-group',
                     label: 'Indicator group',
                     dimension: 'indicator-group',
                     include_wildcard: true,
                     constraints: {}},
                    {type: 'select',
                     name: 'indicator',
                     label: 'Indicator',
                     dimension: 'indicator',
                     constraints: {
                         'indicator-group': 'indicator-group'
                     }}
                ]
            });

            this.model.set('indicator-group', 'any');
            App.respond_json(server.requests[0], {'options': []});
            expect(url_param(server.requests[1].url, 'indicator-group')).
                to.equal(null);
        })

        it("should omit 'any' options when making data requests", function(){
            var server = this.sandbox.server;
            var schema = {
                facets: [
                    {type: 'select',
                     name: 'indicator-group',
                     label: 'Indicator group',
                     dimension: 'indicator-group',
                     include_wildcard: true,
                     constraints: {}},
                    {type: 'select',
                     name: 'indicator',
                     label: 'Indicator',
                     dimension: 'indicator',
                     constraints: {
                         'indicator-group': 'indicator-group'
                     }}
                ]
            };
            var scenario_chart = sinon.spy();
            this.model = new Backbone.Model();
            this.model.set({'indicator-group': 'any',
                            'indicator': 'option'});
            var chart = new App.ScenarioChartView({
                model: this.model,
                schema: schema,
                scenario_chart: scenario_chart
            });
            expect(url_param(server.requests[0].url, 'indicator-group')).
                to.equal(null);
        });

    });

    describe('FilterPositioning', function() {
        "use strict";

        beforeEach(function() {
            this.sandbox = sinon.sandbox.create();
            this.sandbox.useFakeServer();
            this.model = new Backbone.Model();

            this.schema = {
                facets: [
                    {type: 'select',
                     name: 'indicator-group',
                     label: 'Indicator group',
                     dimension: 'indicator-group',
                     constraints: {}},
                    {type: 'multiple_select',
                     name: 'indicator',
                     label: 'Indicator',
                     dimension: 'indicator',
                     constraints: {
                         'indicator-group': 'indicator-group'
                     }}
                ]
            };
        });

        afterEach(function () {
            this.sandbox.restore();
        });

        it('should append filters on the left if pos param is missing', function(){
            var schema = {
                facets: [
                    {type: 'select',
                     name: 'indicator-group',
                     label: 'Indicator group',
                     dimension: 'indicator-group',
                     constraints: {}}
                ]
            };

            var box = $('<div></div>');
            box.html(App.get_template('scenario.html')());

            var filter_loadstate = new Backbone.Model();

            var filters_box = new App.FiltersBox({
                el: $('#the-filters', box)[0],
                model: this.model,
                loadstate: App.filter_loadstate,
                schema: schema,
                filters_schema: schema.facets
            });
            expect($('.upper-left > div', filters_box.$el).length).to.equal(1);
        });

        it('should position filters according to their type', function(){

            var box = $('<div></div>');
            box.html(App.get_template('scenario.html')());

            var filter_loadstate = new Backbone.Model();

            var filters_box = new App.FiltersBox({
                el: $('#the-filters', box)[0],
                model: this.model,
                loadstate: App.filter_loadstate,
                schema: this.schema,
                filters_schema: this.schema.facets
            });
            expect($('.upper-left > div', filters_box.$el).length).to.equal(1);
            expect($('.upper-right > div', filters_box.$el).length).to.equal(1);
        });

    });

});
