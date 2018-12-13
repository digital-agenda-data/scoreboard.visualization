/*global App, Backbone, _, describe, beforeEach, afterEach, it, expect, sinon */
/*jshint sub:true */

describe('ChartTypeEditor', function() {
    "use strict";

    var testing = App.testing;

    it('should save first value as default', function() {
        var model = new Backbone.Model();
        var editor = new App.ChartTypeEditor({model: model});
        expect(model.get('chart_type')).to.equal('lines');
    });

    it('should select chart type', function() {
        var model = new Backbone.Model();
        var editor = new App.ChartTypeEditor({model: model});
        testing.choose_radio(editor.$el.find('[name=chart-type]'), 'columns');
        expect(model.get('chart_type')).to.equal('columns');
    });

    it('should preselect current value', function() {
        var model = new Backbone.Model({chart_type: 'columns'});
        var editor = new App.ChartTypeEditor({model: model});
        expect(editor.$el.find(':checked').val()).to.equal('columns');
    });

    it('should set multidim according to chart type', function() {
        var model = new Backbone.Model();
        var editor = new App.ChartTypeEditor({model: model});
        testing.choose_radio(editor.$el.find('[name=chart-type]'), 'scatter');
        expect(model.get('multidim')).to.equal(2);
        testing.choose_radio(editor.$el.find('[name=chart-type]'), 'bubbles');
        expect(model.get('multidim')).to.equal(3);
        testing.choose_radio(editor.$el.find('[name=chart-type]'), 'columns');
        expect(model.get('multidim')).to.be.undefined;
    });

    it('should save animation choice', function() {
        var view = new App.ChartTypeEditor({model: new Backbone.Model({
            chart_type: 'columns'})});
        view.$el.find('[name="animation"]').click().change();
        expect(view.model.get('animation')).to.be.true;
    });

    it('should show existing animation choice', function() {
        var model = new Backbone.Model({animation: true, chart_type: 'columns'});
        var view = new App.ChartTypeEditor({model: model});
        expect(view.$el.find('[name="animation"]').is(':checked')).to.be.true;
    });

    it('should draw animation checkbox for relevant chart types', function() {
        var view = new App.ChartTypeEditor({model: new Backbone.Model({
            chart_type: 'columns'})});
        expect(view.$el.find('[name="animation"]').length).to.equal(1);
        var view = new App.ChartTypeEditor({model: new Backbone.Model({
            chart_type: 'lines'})});
        expect(view.$el.find('[name="animation"]').length).to.equal(0);
    });

});

describe('StructureEditor', function() {
    "use strict";

    var $ = App.jQuery;

    beforeEach(function() {
        this.sandbox = sinon.createSandbox();
        this.sandbox.useFakeServer();
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    var four_dimensions = [
        {type_label: 'dimension', notation: 'dim1', label: "Dim 1"},
        {type_label: 'dimension', notation: 'dim2', label: "Dim 2"},
        {type_label: 'dimension', notation: 'dim3', label: "Dim 3"},
        {type_label: 'dimension', notation: 'dim4', label: "Dim 4"}];

    describe('facet list', function() {

        it('should prefill dimensions', function() {
            var model = new App.EditorConfiguration({}, {
                dimensions: [
                    {type_label: 'measure', notation: 'ignore me'},
                    {type_label: 'attribute', notation: 'ignore me too'},
                    {type_label: 'dimension group', notation: 'indicator-group'},
                    {type_label: 'dimension', notation: 'indicator'},
                    {type_label: 'dimension group', notation: 'breakdown-group'},
                    {type_label: 'dimension', notation: 'breakdown'},
                    {type_label: 'dimension', notation: 'unit-measure'},
                    {type_label: 'dimension', notation: 'ref-area'},
                    {type_label: 'dimension', notation: 'time-period'}
                ]
            });
            var view = new App.StructureEditor({model: model});
            expect(_(model.get('facets')).pluck('dimension')).to.deep.equal([
                'indicator-group', 'indicator', 'breakdown-group', 'breakdown',
                'unit-measure', 'ref-area', 'time-period', 'value'
            ]);
        });

        it('should save filter name same as dimension by default', function() {
            var model = new App.EditorConfiguration({}, {
                dimensions: [{type_label: 'dimension', notation: 'time-period'}]
            });
            var view = new App.StructureEditor({model: model});
            expect(model.get('facets')[0]['name']).to.equal('time-period');
            expect(model.get('facets')[0]['dimension']).to.equal('time-period');
        });

        it('should save filter type', function() {
            var model = new App.EditorConfiguration({}, {
                dimensions: [{type_label: 'dimension', notation: 'time-period'}]
            });
            var view = new App.StructureEditor({model: model});
            view.$el.find('select[name="type"]').val('multiple_select').change();
            expect(model.get('facets')[0]['type']).to.equal('multiple_select');
        });

        it('should create missing facets when loading config', function() {
            var model = new App.EditorConfiguration({
                facets: [{name: 'time-period',
                          dimension: 'time-period',
                          type: 'multiple_select'}]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'indicator'},
                    {type_label: 'dimension', notation: 'time-period'}
                ]
            });
            var view = new App.StructureEditor({model: model});
            expect(_(model.get('facets')).pluck('dimension')).to.deep.equal(
                ['indicator', 'time-period', 'value']);
        });

        it('should remove facets with no corresponding dimension', function() {
            var model = new App.EditorConfiguration({
                facets: [{name: 'time-period', type: 'multiple_select'}]
            }, {dimensions: []});
            var view = new App.StructureEditor({model: model});
            expect(_(model.get('facets')).pluck('dimension')).to.deep.equal(
                ['value']);
        });

    });
    describe('facet type', function() {

        it('should default to "select"', function() {
            var model = new App.EditorConfiguration({}, {
                    dimensions: [{type_label: 'dimension', notation: 'dim1'}]
                });
            var view = new App.StructureEditor({model: model});
            var facet0 = view.model.toJSON()['facets'][0];
            expect(facet0['type']).to.equal('select');
        });

        it('should select existing filter type', function() {
            var model = new App.EditorConfiguration({
                facets: [{name: 'time-period', type: 'multiple_select'}]
            }, {
                dimensions: [{type_label: 'dimension', notation: 'time-period'}]
            });
            var view = new App.StructureEditor({model: model});
            var select = view.$el.find('select[name="type"]');
            expect(select.val()).to.equal('multiple_select');
        });

    });


    describe('multiple series', function() {

        it('should display list of series options', function() {
            var view = new App.StructureEditor({
                model: new App.EditorConfiguration({
                    facets: [
                        {name: 'dim3', type: 'all-values'},
                        {name: 'dim4', type: 'all-values'}
                    ]
                }, {dimensions: four_dimensions}),
            });
            var options = view.$el.find('[name="multiple_series"] option');
            var series_options = _(options).map(function(opt) {
                return $(opt).attr('value');
            });
            expect(series_options).to.deep.equal(['', 'dim3', 'dim4']);
        });

        it('should update model with selection', function() {
            var model = new App.EditorConfiguration({
                facets: [
                    {name: 'dim3', type: 'all-values'},
                    {name: 'dim4', type: 'all-values'}
                ]
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            expect(model.get('multiple_series')).to.be.null;
            view.$el.find('[name="multiple_series"]').val('dim3').change();
            expect(model.get('multiple_series')).to.equal('dim3');
        });

        it('should render multiple_series with selected value', function() {
            var model = new App.EditorConfiguration({
                facets: [
                    {name: 'dim3', type: 'all-values'},
                    {name: 'dim4', type: 'all-values'}
                ],
                multiple_series: 'dim3'
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            var select = view.$el.find('[name="multiple_series"]');
            expect(select.val()).to.equal('dim3');
        });

    });

    describe('hidden facet', function() {

        it('should not include ignore facet in constraints', function() {
            var model = new App.EditorConfiguration({
                'facets': [{name: 'dim2', type: 'ignore'}]
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            expect(model.get('facets')[3]['constraints']).to.deep.equal(
                {'dim1': 'dim1', 'dim3': 'dim3'});
        });

    });

    describe('facet verification', function() {

        it('should not update category facet section', function() {
            var model = new App.EditorConfiguration({
                facets: [{name: 'dim3', type: 'select', label:'dimension3'}]
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            sinon.spy(view.categoryby, 'render');
            view.$el.find('[data-name="dim3"] [name="type"]').val('all-values').change();
            expect(view.$el.find('[name="categories-by"] .alert').text().trim()).to.equal(
            '');
        });

        it('should not update category section when selecting multipleseries', function(){
            var model = new App.EditorConfiguration({
                facets: [{name: 'dim1', type: 'select', label: 'dimension1'},
                         {name: 'dim3', type: 'select'}]
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            view.$el.find('[data-name="dim3"] [name="type"]').val('all-values').change();
            view.$el.find('[data-name="dim4"] [name="type"]').val('all-values').change();
            view.$el.find('[name="multiple_series"]').val('dim3').change();
            expect(view.model.attributes.multiple_series).to.equal('dim3');
            expect(view.model.attributes.category_facet).to.equal(null);
            view.$el.find('[name="categories"]').val('dim3').change();
            expect(view.model.attributes.multiple_series).to.equal('dim3');
            expect(view.model.attributes.category_facet).to.equal('dim3');
        });

        it('should write category facet on model', function() {
            var model = new App.EditorConfiguration({
                facets: [
                    {name: 'dim3', type: 'all-values'},
                    {name: 'dim4', type: 'all-values'}
                ],
                multiple_series: 'dim3',
                category_facet: 'dim4'
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            expect(model.get('category_facet')).to.equal('dim4');
        });

    });

    describe('constraints between filters', function() {

        it('should generate no constraints for first filter', function() {
            var view = new App.StructureEditor({
                model: new App.EditorConfiguration({}, {
                    dimensions: four_dimensions})});
            var constr0 = view.model.toJSON()['facets'][0]['constraints'];
            expect(constr0).to.deep.equal({});
        });

        it('should generate 3 constraints for 4th filter', function() {
            var view = new App.StructureEditor({
                model: new App.EditorConfiguration({}, {
                    dimensions: four_dimensions})});
            var constr3 = view.model.toJSON()['facets'][3]['constraints'];
            expect(constr3).to.deep.equal({
                'dim1': 'dim1',
                'dim2': 'dim2',
                'dim3': 'dim3'
            });
        });

        it('should generate no constraints with multiple_select', function() {
            var view = new App.StructureEditor({
                model: new App.EditorConfiguration({
                    facets: [{name: 'dim2', type: 'multiple_select'}]
                }, {dimensions: four_dimensions})
            });
            var constr3 = view.model.toJSON()['facets'][3]['constraints'];
            expect(constr3).to.deep.equal({'dim1': 'dim1', 'dim3': 'dim3'});
        });

        it('should move all-value at the end of facets', function() {
            var view = new App.StructureEditor({
                model: new App.EditorConfiguration({
                    facets: [{name: 'dim2', type: 'all-values'}]
                }, {dimensions: four_dimensions})
            });
            expect(_(view.model.attributes.facets).pluck('name')).to.deep.equal(
                ['dim1', 'dim3', 'dim4', 'dim2', 'value']
            );
        });

        it('should move facet to normal position', function() {
            var view = new App.StructureEditor({
                model: new App.EditorConfiguration({
                    facets: [{name: 'dim2', type: 'all-values'}]
                }, {dimensions: four_dimensions})
            });
            expect(_(view.model.attributes.facets).pluck('name')).to.deep.equal(
                ['dim1', 'dim3', 'dim4', 'dim2', 'value']
            );
            var dim2_type = view.$el.find('[name="type"]:last');
            dim2_type.val('select').change();
            expect(_(view.model.attributes.facets).pluck('name')).to.deep.equal(
                ['dim1', 'dim2', 'dim3', 'dim4', 'value']
            );
        });

        it('should add all qualifying facets to the constraints of all-values', function() {
            var model = new App.EditorConfiguration({
                facets: [{name: 'dim2', type: 'all-values'}]
                },
                {dimensions: four_dimensions}
            );
            var view = new App.StructureEditor({
                model: model
            });
            var constr3 = view.model.toJSON()['facets'][3]['constraints'];
            expect(view.model.attributes.facets[3]['name']).to.equal(
                'dim2'
            );
            expect(constr3).to.deep.equal(
                {'dim1': 'dim1', 'dim3': 'dim3', 'dim4': 'dim4'});
        });

    });

    describe('multidim facets', function() {
        var facets_by_name = function(facets) {
            return _.object(_(facets).map(function(facet) {
                return [facet['name'], facet];
            }));
        };

        it('should generate double facets if multidim=2', function() {
            var model = new App.EditorConfiguration({multidim: 2}, {
                dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            // dim1 is multilines_common, dim2 is not
            view.$el.find('[data-name="dim1"] [name="multidim_common"]').click().change();
            expect(model.get('facets')[0]['name']).to.equal('dim1');
            expect(model.get('facets')[1]['name']).to.equal('x-dim2');
            expect(model.get('facets')[2]['name']).to.equal('y-dim2');
        });

        it('multidim dimensions should depend on their axis only', function() {
            var model = new App.EditorConfiguration({multidim: 2}, {
                dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            //view.$el.find('[data-name="dim1"] [name="multidim_common"]').click().change();
            view.$el.find('[data-name="dim2"] [name="multidim_common"]').click().change();
            //view.$el.find('[data-name="dim3"] [name="multidim_common"]').click().change();
            var facets = facets_by_name(model.get('facets'));
            expect(facets['x-dim1']['constraints']).to.deep.equal(
                {});
            expect(facets['dim2']['constraints']).to.deep.equal(
                {'x-dim1': 'x-dim1', 'y-dim1': 'y-dim1'});
            expect(facets['x-dim3']['constraints']).to.deep.equal(
                {'dim1': 'x-dim1', 'dim2': 'dim2'});
        });

        it('subsequent dimensions depend on all multidim axes', function() {
            var model = new App.EditorConfiguration({multidim: 2}, {
                dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            view.$el.find('[data-name="dim3"] [name="multidim_common"]').click().change();
            view.$el.find('[data-name="dim4"] [name="multidim_common"]').click().change();
            var facets = facets_by_name(model.get('facets'));
            expect(facets['dim3']['constraints']).to.deep.equal({
                'x-dim1': 'x-dim1', 'x-dim2': 'x-dim2',
                'y-dim1': 'y-dim1', 'y-dim2': 'y-dim2'});
            expect(facets['dim4']['constraints']).to.deep.equal({
                'x-dim1': 'x-dim1', 'x-dim2': 'x-dim2',
                'y-dim1': 'y-dim1', 'y-dim2': 'y-dim2',
                'dim3': 'dim3'});
        });

        it('should have by default multidim_common=false', function() {
            var model = new App.EditorConfiguration({multidim: 2}, {
                dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            view.$el.find('[data-name="dim2"] [name="multidim_common"]').click().change();
            var facets = facets_by_name(model.get('facets'));
            expect(facets['x-dim1']['multidim_common']).to.be.false;
            expect(facets['y-dim1']['multidim_common']).to.be.false;
            expect(facets['dim1']).to.be.undefined;
            expect(facets['dim2']['multidim_common']).to.be.true;
            expect(facets['x-dim2']).to.be.undefined;
            expect(facets['y-dim2']).to.be.undefined;
        });

        it('should set multidim_value on value facet', function() {
            var model = new App.EditorConfiguration({multidim: 2}, {
                dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            var facets = facets_by_name(model.get('facets'));
            expect(facets['value']['multidim_value']).to.be.true;
        });

        it('should parse multidim facets and preserve labels', function() {
            var model = new App.EditorConfiguration({
                multidim: 2,
                facets: [
                    {name: 'x-dim1', label: '(X) blah dim1'},
                    {name: 'y-dim1', label: '(Y) ignored dim1'},
                    {name: 'x-dim2', label: '(X) blah dim2'},
                    {name: 'y-dim2', label: '(Y) ignored dim2'},
                    {name: 'dim3', label: 'blah dim3', multidim_common: true},
                    {name: 'dim4', label: 'blah dim4', multidim_common: true}
                ]
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            var facets = facets_by_name(model.get('facets'));
            expect(facets['x-dim1'].label).to.equal('(X) blah dim1');
            expect(facets['y-dim1'].label).to.equal('(Y) blah dim1');
            expect(facets['x-dim2'].label).to.equal('(X) blah dim2');
            expect(facets['y-dim2'].label).to.equal('(Y) blah dim2');
            expect(facets['dim3'].label).to.equal('blah dim3');
            expect(facets['dim4'].label).to.equal('blah dim4');
        });

        it('should order multidim facets grouped by dimension and axis', function() {
            var model = new App.EditorConfiguration({multidim: 2}, {
                dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            view.$el.find('[data-name="dim3"] [name="multidim_common"]').click().change();
            view.$el.find('[data-name="dim4"] [name="multidim_common"]').click().change();
            expect(_(model.get('facets')).pluck('name')).to.deep.equal(
                ['x-dim1', 'y-dim1', 'x-dim2', 'y-dim2',
                 'dim3', 'dim4', 'value']);
        });

    });
});

describe('LayoutEditor', function() {
    "use strict";

    var $ = App.jQuery;

    it('should display the facets and position controls', function(){
        var model = new App.EditorConfiguration({
                facets: [
                        {name: 'time-period', position: 'lower-right'}]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'time-period'}]
                });
        var view = new App.LayoutEditor({model: model});
        expect(view.$el.find('select').length).to.equal(1);
    });

    it('should display the preselected position', function(){
        var model = new App.EditorConfiguration({
                facets: [
                        {name: 'time-period', position: 'bottom-right'}]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'time-period'}]
                });
        var view = new App.LayoutEditor({model: model});
        expect(view.$el.find('select').val()).to.equal('bottom-right');
    });

    it('should init model with the default position', function() {
        var model = new App.EditorConfiguration({
                facets: [
                    {name: 'time-period', dimension: 'time-period', type: 'select'}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'time-period'}]
            });
        var structureView = new App.StructureEditor({model: model});
        var view = new App.LayoutEditor({model: model});
        expect(model.get('facets')[0]['position']).to.equal('upper-left');
    });

    it('should update model with selected position', function() {
        var model = new App.EditorConfiguration({
                facets: [
                    {name: 'dim1', type: 'select'}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'time-period'}]
            });
        var structureView = new App.StructureEditor({model: model});
        var view = new App.LayoutEditor({model: model});
        expect(model.get('facets')[0]['position']).to.equal('upper-left');
        view.$el.find('[name="position"]').val('upper-right').change();
        expect(model.get('facets')[0]['position']).to.equal('upper-right');
    });

    it('should display separate position controls for multidim facets', function() {
        var model = new App.EditorConfiguration({
                multidim: 2,
                facets: [
                    {name: 'x-indicator', type: 'select'},
                    {name: 'y-indicator', type: 'select'}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'x-indicator'},
                    {type_label: 'dimension', notation: 'y-indicator'}]
            });
        var structureView = new App.StructureEditor({model: model});
        var view = new App.LayoutEditor({model: model});
    });

    it('should filter facets when building layout collection', function() {
        var model = new App.EditorConfiguration({
                multidim: 1,
                facets: [
                    {name: 'indicator', type: 'select'},
                    {name: 'breakdown', type: 'ignore'},
                    {name: 'unit-measure', type: 'all-values'}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'indicator'}]
            });
        var structureView = new App.StructureEditor({model: model});
        var view = new App.LayoutEditor({model: model});
        expect(view.model.layout_collection.length).to.equal(1);
    });

    it('should rebuild layout collection when facet multidim changes', function() {
        var model = new App.EditorConfiguration({
                multidim: 2,
                facets: [
                    {name: 'indicator', type: 'select'}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'indicator'}]
            });
        // TODO: length should be 2 by default; fix this
        var structureView = new App.StructureEditor({model: model});
        var view = new App.LayoutEditor({model: model});
        structureView.$el.find('[name="multidim_common"]').click().change();
        expect(view.model.layout_collection.length).to.equal(1);
        expect(view.model.layout_collection.models[0].get('name')).to.equal(
            'indicator');
        structureView.$el.find('[name="multidim_common"]').click().change();
        expect(view.model.layout_collection.length).to.equal(2);
        expect(view.model.layout_collection.models[0].get('name')).to.equal(
            'x-indicator');
        expect(view.model.layout_collection.models[1].get('name')).to.equal(
            'y-indicator');
    });

    it('should rebuild layout collection when facet type changes', function() {
        var model = new App.EditorConfiguration({
                multidim: 1,
                facets: [
                    {name: 'indicator', type: 'select'}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'indicator'}]
            });
        var structureView = new App.StructureEditor({model: model});
        var view = new App.LayoutEditor({model: model});
        expect(view.model.layout_collection.length).to.equal(1);
        structureView.$el.find('[name="type"]').val('ignore').change();
        expect(view.model.layout_collection.length).to.equal(0);
    });

    it('should preserve position when changing structure', function() {
        var model = new App.EditorConfiguration({
                multidim: 2,
                facets: [
                    {constraints: {},
                     dimension: "indicator-group",
                     label: "(X) Indicator group",
                     name: "x-indicator-group",
                     position: "upper-left",
                     multidim_common: false,
                     sortBy: "order_in_codelist",
                     sortOrder: "asc",
                     type: "select"},
                    {name: "x-indicator",
                     label: "(X) Indicator",
                     constraints: {},
                     dimension: "indicator",
                     multidim_common: false,
                     position: "upper-left",
                     sortBy: "inner_order",
                     sortOrder: "asc",
                     type: "select"},
                    {constraints: {},
                     dimension: "indicator-group",
                     label: "(Y) Indicator group",
                     name: "y-indicator-group",
                     position: "upper-right",
                     multidim_common: false,
                     sortBy: "order_in_codelist",
                     sortOrder: "asc",
                     type: "select"},
                    {name: "y-indicator",
                     label: "(Y) Indicator",
                     constraints: {},
                     dimension: "indicator",
                     multidim_common: false,
                     position: "upper-right",
                     sortBy: "inner_order",
                     sortOrder: "asc",
                     type: "select"}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'indicator-group'},
                    {type_label: 'dimension', notation: 'indicator'}
                ]
            });
        var structure_view = new App.StructureEditor({model: model});
        var layout_view = new App.LayoutEditor({model: model});
        var ind_gr = structure_view.$el.find('[name="type"]:first');
        ind_gr.val('ignore').change();
        expect(model.get('facets')[3].position).to.equal('upper-right');
    });

    it('should preserve structure changes when changing position', function() {
        var model = new App.EditorConfiguration({
                multidim: 2,
                facets: [
                    {constraints: {},
                     dimension: "indicator-group",
                     label: "(X) Indicator group",
                     name: "x-indicator-group",
                     position: "upper-left",
                     multidim_common: true,
                     sortBy: "order_in_codelist",
                     sortOrder: "asc",
                     type: "ignore"},
                    {name: "x-indicator",
                     label: "(X) Indicator",
                     constraints: {},
                     dimension: "indicator",
                     multidim_common: true,
                     position: "bottom-left",
                     sortBy: "inner_order",
                     sortOrder: "asc",
                     type: "select"},
                    {constraints: {},
                     dimension: "indicator-group",
                     label: "(Y) Indicator group",
                     name: "y-indicator-group",
                     position: "upper-right",
                     multidim_common: true,
                     sortBy: "order_in_codelist",
                     sortOrder: "asc",
                     type: "ignore"},
                    {name: "y-indicator",
                     label: "(Y) Indicator",
                     constraints: {},
                     dimension: "indicator",
                     multidim_common: true,
                     position: "bottom-right",
                     sortBy: "inner_order",
                     sortOrder: "asc",
                     type: "select"}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'indicator-group'},
                    {type_label: 'dimension', notation: 'indicator'}
                ]
            });
        var structure_view = new App.StructureEditor({model: model});
        var layout_view = new App.LayoutEditor({model: model});
        // order will be: x-indicator-group, y-indicator-group, x-indicator, y-indicator
        // only two position fields will be visible (x-indicator, y-indicator)
        var x_indicator_pos = layout_view.$el.find('[name="position"]:first');
        x_indicator_pos.val('bottom-right').change();
        expect(model.get('facets')[0].position).to.equal('upper-left');
        expect(model.get('facets')[1].position).to.equal('upper-right');
        expect(model.get('facets')[2].position).to.equal('bottom-right');
        expect(model.get('facets')[3].position).to.equal('bottom-right');
    });

    it('should put "all-values" at the bottom of facets', function() {
        var model = new App.EditorConfiguration({
                multidim: 2,
                facets: [
                    {name: 'dim1', type: 'all-values'},
                    {name: 'dim2', type: 'select'}
                ]
            }, {
                dimensions: [
                    {type_label: 'dimension', notation: 'dim1'},
                    {type_label: 'dimension', notation: 'dim2'}]
            });
        var structureView = new App.StructureEditor({model: model});
        var view = new App.LayoutEditor({model: model});
        expect(_(model.get('facets')).first()['name']).to.equal(
            'x-dim2');
    });

});

describe('FacetsEditor', function() {
    "use strict";

    var $ = App.jQuery;

    beforeEach(function() {
        this.sandbox = sinon.createSandbox();
        this.sandbox.useFakeServer();
    });

    afterEach(function () {
        this.sandbox.restore();
    });

    var four_dimensions = [
        {type_label: 'dimension', notation: 'dim1', label: "Dim 1"},
        {type_label: 'dimension', notation: 'dim2', label: "Dim 2"},
        {type_label: 'dimension', notation: 'dim3', label: "Dim 3"},
        {type_label: 'dimension', notation: 'dim4', label: "Dim 4"}];

    describe('facet labels', function() {
        it('should save the provided filter label', function() {
            var model = new App.EditorConfiguration({}, {
                dimensions: [{type_label: 'dimension', notation: 'indicator'},
                             {type_label: 'dimension', notation: 'time-period'}]
            });
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            view.$el.find('[name="label"]:eq(0)').val('ind').trigger('input');
            view.$el.find('[name="label"]:eq(1)').val('period').trigger('keyup');
            view.$el.find('[name="label"]:eq(0)').trigger('focusout');
            view.$el.find('[name="label"]:eq(1)').trigger('focusout');
            expect(model.get('facets')[0]['label']).to.equal('ind');
            expect(model.get('facets')[1]['label']).to.equal('period');
            expect(model.get('facets')[0]['dimension']).to.equal('indicator');
            expect(model.get('facets')[1]['dimension']).to.equal('time-period');
        });

        it('should save old filter label when empty', function() {
            var model = new App.EditorConfiguration({}, {
                dimensions: [{type_label: 'dimension', notation: 'indicator'}]});
            model.facets.models[0].set('label', 'Indicator');
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            view.$el.find('[name="label"]:eq(0)').val('').trigger('input');
            view.$el.find('[name="label"]:eq(0)').trigger('focusout');
            expect(model.get('facets')[0]['label']).to.equal('Indicator');
        });
    });

    describe('facet ignore values', function() {
        it('should update model with values selected', function() {
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'dim1', type: 'select'},
                        {name: 'dim2', type: 'multiple_select'}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'dim1'},
                        {type_label: 'dimension', notation: 'dim2'}]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            expect(model.facets.models[0].get('ignore_values')).to.be.undefined;
            App.respond_json(server.requests[1], {'options': options});
            view.$el.find('[name="ignore_values"]:first').val(['one', 'two']).change();
            expect(model.facets.models[0].get('ignore_values')).to.deep.equal(['one', 'two']);
            view.$el.find('[name="ignore_values"]:eq(1)').val(['one']).change();
            expect(model.facets.models[1].get('ignore_values')).to.deep.equal(['one']);
        });
    });

    describe('facet default value', function() {
        it('should have no default_value by default', function() {
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'time-period', type: 'select'}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'time-period'}]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            var facet0 = view.model.toJSON()['facets'][0];
            expect(facet0['default_value']).to.be.undefined;
        });

        it('should select existing default_value', function() {
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'time-period', type: 'select', default_value: ['one']}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'time-period'}]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            var facet0 = view.model.toJSON()['facets'][0];
            expect(facet0['default_value']).to.deep.equal(['one']);
        });

        it('should remove existing default_value', function() {
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'time-period', type: 'select', default_value: ['one']}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'time-period'}]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            view.$el.find('[name="default_value"]:first').val([]).change();
        });

        it('should update model with values selected', function() {
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'dim1', type: 'select'},
                        {name: 'dim2', type: 'multiple_select'}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'dim1'},
                        {type_label: 'dimension', notation: 'dim2'}]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            expect(model.facets.models[0].get('default_value')).to.be.undefined;
            App.respond_json(server.requests[1], {'options': options});
            view.$el.find('[name="default_value"]:first').val(['two']).change();
            expect(model.facets.models[0].get('default_value')).to.deep.equal(['two']);
            view.$el.find('[name="default_value"]:eq(1)').val(['one']).change();
            expect(model.facets.models[1].get('default_value')).to.deep.equal(['one']);
        });

        it('should save default_value as string for single select', function(){
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'dim1', type: 'select'}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'dim1'}
                    ]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            view.$el.find('[name="default_value"]:first').val(['two']).change();
            expect(model.facets.models[0].get('default_value')).to.deep.equal(['two']);
            expect(model.toJSON()['facets'][0]['default_value']).to.deep.equal(['two']);
        });

        it('should unset default_value from model', function(){
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'dim1', type: 'select'}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'dim1'}
                    ]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            expect(model.facets.models[0].get('default_value')).to.be.undefined;
            view.$el.find('[name="default_value"]:first').val(['two']).change();
            expect(model.facets.models[0].get('default_value')).to.deep.equal(['two']);
            view.$el.find('[name="default_value"]:first').val([]).change();
            expect(model.facets.models[0].get('default_value')).to.be.undefined;
        });

        it('should have "#random" option', function(){
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'dim1', type: 'select'}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'dim1'}
                    ]
                });
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            var select = view.$el.find('[name="default_value"]:first');
            select.val(['#random']).change();
            expect(model.facets.models[0].get('default_value')).to.deep.equal(['#random']);
        });

        it('should have "#eu27" option for country multiple_select', function(){
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'ref-area', type: 'multiple_select', dimension: 'ref-area'},
                        {name: 'ref-area1', type: 'multiple_select', dimension: 'other'},
                        {name: 'ref-area2', type: 'select', dimension: 'ref-area'},
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'ref-area'},
                        {type_label: 'dimension', notation: 'other'}
                    ]
                });
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            App.respond_json(server.requests[1], {'options': options});
            var select = view.$el.find('[name="default_value"]:eq(0)');
            select.val(['#eu27']).change();
            expect(model.facets.models[0].get('default_value')).to.deep.equal(
                _(App.EU27).keys());
            var select = view.$el.find('[name="default_value"]:eq(1)');
            expect(select.find('option[value="#eu27"]').toArray()).to.deep.equal([]);
        });

        it('should replace "#eu27" with the right countries', function(){
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'ref-area', type: 'multiple_select', dimension: 'ref-area'},
                        {name: 'ref-area1', type: 'multiple_select', dimension: 'other'},
                        {name: 'ref-area2', type: 'select', dimension: 'ref-area'},
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'ref-area'},
                        {type_label: 'dimension', notation: 'other'}
                    ]
                });
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            App.respond_json(server.requests[1], {'options': options});
            var select = view.$el.find('[name="default_value"]:eq(0)');
            select.val(['#eu27']).change();
            expect(model.facets.models[0].get('default_value')).to.deep.equal(
                _(App.EU27).keys());
            var select = view.$el.find('[name="default_value"]:eq(1)');
            expect(select.find('option[value="#eu27"]').toArray()).to.deep.equal([]);
        });

        it('should not have "#eu27" option for country single select', function(){
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'ref-area', type: 'select', dimension: 'ref-area'},
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'ref-area'}
                    ]
                });
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            var select = view.$el.find('[name="default_value"]:eq(0)');
            expect(select.find('option[value="#eu27"]').toArray()).to.deep.equal([]);
        });

        it('should not have "#eu27" option for non country dimension', function(){
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'ref-area', type: 'multiple_select', dimension: 'other'}
                    ]
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'other'}
                    ]
                });
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            var select = view.$el.find('[name="default_value"]:eq(0)');
            expect(select.find('option[value="#eu27"]').toArray()).to.deep.equal([]);
        });

        it('should drop default_value when type becomes "select"', function() {
            this.sandbox.useFakeServer();
            var model = new App.EditorConfiguration({
                    facets: [
                        {name: 'indicator',
                         type: 'multiple_select',
                         default_value: ['one', 'two']
                        }
                    ]
                }, {
                    dimensions: [{type_label: 'dimension', notation: 'indicator'}]
                }
            );

            var structure_view = new App.StructureEditor({model: model});
            var facets_view = new App.FacetsEditor({model: model});
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});

            expect(model.toJSON()['facets'][0]['default_value']).to.deep.equal(
                ['one', 'two']);
            expect(facets_view.$el.find('[name="default_value"]').val()).to.deep.equal(
                ['one', 'two']);

            model.facets.first().set({type: 'select'});

            expect(model.toJSON()['facets'][0]['default_value']).to.be.undefined;
            expect(facets_view.$el.find('[name="default_value"]').val()).to.be.null;
        });

    });

    describe('highlights', function() {

        it('should display existing highlights', function() {
            this.sandbox.useFakeServer();
            var view = new App.FacetsEditor({
                model: new App.EditorConfiguration({
                    category_facet: 'dim1',
                    facets: [
                        {name: 'dim1', type: 'multiple_select', highlights: ['two']},
                    ],
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'dim1'}
                    ]
                })
            });
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            var select = view.$el.find('[name="highlights"]');
            expect(select.val()).to.deep.equal(['two']);
        }),

        it('should update model with values selected', function() {
            this.sandbox.useFakeServer();
            var view = new App.FacetsEditor({
                model: new App.EditorConfiguration({
                    category_facet: 'dim1',
                    facets: [
                        {name: 'dim1', type: 'multiple_select'},
                    ],
                }, {
                    dimensions: [
                        {type_label: 'dimension', notation: 'dim1'}
                    ]
                })
            });
            var server = this.sandbox.server;
            var options = [{'label': "Option One", 'notation': 'one'},
                           {'label': "Option Two", 'notation': 'two'}];
            App.respond_json(server.requests[0], {'options': options});
            var select = view.$el.find('[name="highlights"]');
            select.val(['two']).change();
            expect(view.model.facets.models[0].get('highlights')).to.deep.equal(['two']);
        });
    });

    describe('include_wildcard option', function() {
        it('should be controlled by checkbox', function() {
            var model = new App.EditorConfiguration({}, {dimensions: four_dimensions});
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model:model});
            var facet0 = function() { return view.model.get('facets')[0]; };
            view.$el.find('[name="include_wildcard"]').click().change();
            expect(facet0()['include_wildcard']).to.be.true;
            view.$el.find('[name="include_wildcard"]').click().change();
            expect(facet0()['include_wildcard']).to.be.undefined;
        });

        it('should be removed if facet is not single select', function() {
            var model = new App.EditorConfiguration({
                facets: [{name: 'dim2', type: 'select', include_wildcard: true}]
            }, {dimensions: four_dimensions});
            var view = new App.StructureEditor({model: model});
            view.$el.find('[name="type"]').val('multiple_select').change();
            expect(model.get('facets')[0]['include_wildcard']).to.be.undefined;
        });
    });

    describe('sort facet options', function() {

        it('should save selected values', function() {
            var model = new App.EditorConfiguration({}, {
                dimensions: four_dimensions});
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            var $dim2_el = view.$el.find('[data-name="dim2"]');
            $dim2_el.find('[name="sort-by"]').val('notation').change();
            $dim2_el.find('[name="sort-order"]').val('reverse').change();
            var dim2 = _(model.get('facets')).findWhere({name: 'dim2'});
            expect(dim2['sortBy']).to.equal('notation');
            expect(dim2['sortOrder']).to.equal('reverse');
        });

        it('should display selected values', function() {
            var model = new App.EditorConfiguration({
                facets: [
                    {name: 'dim2', sortBy: 'notation', sortOrder: 'reverse'}]
            }, {dimensions: four_dimensions});
            var structureView = new App.StructureEditor({model: model});
            var view = new App.FacetsEditor({model: model});
            var $dim2_el = view.$el.find('[data-name="dim2"]');
            expect($dim2_el.find('[name="sort-by"]').val()).to.equal('notation');
            expect($dim2_el.find('[name="sort-order"]').val()).to.equal('reverse');
        });
    });

});


describe('AxesEditor', function() {

    describe('TitleComposer', function(){
        it('should present title choices to user', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'breakdown', type: 'select'},
                    {name: 'indicator', type: 'select', dimension: 'indicator'},
                    {name: 'ref-area', type: 'multiple_select'}
                ],
                titles:{
                    title: [
                        {facet_name: 'indicator'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var select = view.composers_views.title.$el.find('[name="title-part"]');
            var options = select.find('option', '[name="title"]');
            expect(select.val()).to.equal('indicator');
            expect(options.length).to.equal(3);
        });

        it('should have xAxisTitle only for scatter or bubble', function(){
            var model = new Backbone.Model({
                multidim: 2
            });
            var view = new App.AxesEditor({model: model});
            expect(view.composers.length).to.equal(4);
            var model = new Backbone.Model();
            var view = new App.AxesEditor({model: model});
            expect(view.composers.length).to.equal(3);
        });

        it('should update title composers section when chart type changes', function(){
            var model = new Backbone.Model({
                multidim: 2
            });
            var view = new App.AxesEditor({model: model});
            expect(view.composers.length).to.equal(4);
            model.set('multidim', 1);
            expect(view.composers.length).to.equal(3);
        });

        it('should not present title choices to user', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ref-area', type: 'multiple_select'}
                ]
            });
            var view = new App.AxesEditor({model: model});
            var select = view.composers_views.title.$el.find('[name="title-part"]');
            expect(select.val()).to.equal(undefined);
        });

        it('should save default title to model', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                    {name: 'ref-area', type: 'multiple_select', value: 'ref-area'}
                ]
            });
            var view = new App.AxesEditor({model: model});
            var select = view.composers_views.title.$el.find('[name="title-part"]');
            expect(view.model.get('titles')['title']).to.deep.equal([ ]);
        });

        it('should save selected title to model', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                    {name: 'ref-area', type: 'multiple_select', value: 'ref-area'}
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var select = view.composers_views.title.$el.find('[name="title-part"]');
            select.val('brk').change();
            expect(view.model.get('titles')['title']).to.deep.equal([
                {facet_name: 'brk', prefix: null, suffix: null, format: 'short_label'}
            ]);
        });

        it('should render a new title part', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var models = view.composers_views.title.parts.models;
            var views = view.composers_views.title.part_views;
            expect(_(models).pluck('cid')).to.deep.equal(_(views).keys());
            var add_button = view.composers_views.title.$el.find('[name="add-title-part"]');
            add_button.click();
            var select = view.composers_views.title.$el.find('[name="title-part"]');
            expect(select.length).to.deep.equal(2);
        });

        it('should save all title parts to model', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var select = view.composers_views.title.$el.find('[name="title-part"]:eq(0)');
            select.val('ind').change();
            var add_button = view.composers_views.title.$el.find('[name="add-title-part"]');
            add_button.click();
            var models = view.composers_views.title.parts.models;
            var views = view.composers_views.title.part_views;
            expect(_(models).pluck('cid')).to.deep.equal(_(views).keys());
            var select = view.composers_views.title.$el.find('[name="title-part"]:eq(1)');
            select.val('brk').change();
            expect(view.model.get('titles')['title']).to.deep.equal(
                [{facet_name: 'ind', prefix: null, suffix: null, format: 'short_label'},
                 {facet_name: 'brk', prefix: null, suffix: null, format: 'short_label'}]);
        });

        it('should render prefix options', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'}
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var prefix = view.composers_views.title.$el.find(
                '[name="title-part-prefix"]');
            expect(prefix.val()).to.equal("");
        });

        it('should render suffix options', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'}
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var suffix = view.composers_views.title.$el.find(
                '[name="title-part-suffix"]');
            expect(suffix.val()).to.equal("");
        });

        it('should save selected prefixes and suffixes', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});

            var select = view.composers_views.title.$el.find('[name="title-part"]:eq(0)');
            select.val('ind').change();

            var selectFormat = view.composers_views.title.$el.find(
                '[name="title-part-format"]:eq(0)');
            selectFormat.val('label').change();

            var prefix = view.composers_views.title.$el.find(
                '[name="title-part-prefix"]:eq(0)');
            prefix.val(' ( ').change();

            expect(view.model.get('titles')['title']).to.deep.equal(
                [ {facet_name: 'ind', prefix: ' ( ', suffix: null, format: 'label'}]);

            var add_button = view.composers_views.title.$el.find('[name="add-title-part"]');
            add_button.click();

            var select = view.composers_views.title.$el.find('[name="title-part"]:eq(1)');
            select.val('brk').change();

            var selectFormat = view.composers_views.title.$el.find(
                '[name="title-part-format"]:eq(1)');
            selectFormat.val('short-label').change();

            var suffix = view.composers_views.title.$el.find(
                '[name="title-part-suffix"]:eq(1)');
            suffix.val(' ) ').change();

            expect(view.model.get('titles')['title']).to.deep.equal(
                [ {facet_name: 'ind', prefix: ' ( ', suffix: null, format: 'label'},
                  {prefix: null, suffix: ' ) ', facet_name: 'brk', format: 'short_label'}]);
        });

        it('should add a new title part when clicking the add button', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                ]
            });
            var view = new App.AxesEditor({model: model});
            var add_button = view.composers_views.title.$el.find('[name="add-title-part"]');
            add_button.click();
            var select = view.composers_views.title.$el.find('[name="title-part"]:eq(0)');
            select.val('brk').change();
            expect(view.composers_views['title'].model.get('parts').length).to.equal(1);
            expect(view.model.get('titles')['title']).to.deep.equal(
                [ {prefix: null, suffix: null, facet_name: 'brk', format: 'short_label'}]);
        });

        it('should display existing title parts', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                ],
                titles: {
                    title: [{facet_name: "ind", format: "label"},
                            {prefix: ', ', suffix: ' - ', facet_name: "brk"} ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var select1 = view.composers_views.title.$el.find('[name="title-part"]:eq(0)');
            var select1format = view.composers_views.title.$el.find('[name="title-part-format"]:eq(0)');
            var prefix = view.composers_views.title.$el.find(
                '[name="title-part-prefix"]:eq(1)');
            var suffix = view.composers_views.title.$el.find(
                '[name="title-part-suffix"]:eq(1)');
            var select2 = view.composers_views.title.$el.find('[name="title-part"]:eq(1)');
            expect(select1.val()).to.equal('ind');
            expect(select1format.val()).to.equal('label');
            expect(prefix.val()).to.equal(', ');
            expect(suffix.val()).to.equal(' - ');
            expect(select2.val()).to.equal('brk');
        });

        it('should validate existing title parts', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'multiple_select', value: 'breakdown'},
                ],
                titles: {
                    title: [{facet_name: "ind"},
                            {prefix: ',', suffix: ' - ', facet_name: "brk"} ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var select1 = view.composers_views.title.$el.find('[name="title-part"]:eq(0)');
            var prefix = view.composers_views.title.$el.find(
                '[name="title-part-prefix"]:eq(1)');
            var suffix = view.composers_views.title.$el.find(
                '[name="title-part-suffix"]:eq(1)');
            var select2 = view.composers_views.title.$el.find('[name="title-part"]:eq(1)');
            expect(select1.val()).to.equal('ind');
            expect(prefix.length).to.equal(0);
            expect(suffix.length).to.equal(0);
            expect(select2.length).to.equal(0);
            expect(view.model.get('titles')['title']).to.deep.equal(
                [{facet_name: 'ind', prefix: null, suffix: null, format: 'short_label'}]);
        })

        it('should remove title part when empty facet name', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                    {name: 'area', type: 'select', value: 'ref-area'}
                ],
                titles: {
                    title: [{facet_name: "ind"},
                            {prefix: ',', suffix: null, facet_name: "brk"} ],
                }
            });
            var view = new App.AxesEditor({model: model});
            var select2 = view.composers_views.title.$el.find(
                                '[name="title-part"]:eq(1)');
            var select3 = view.composers_views.title.$el.find(
                                '[name="title-part"]:eq(2)');
            select2.val("").change();
            select3.val("").change();
            expect(view.model.get('titles')['title']).to.deep.equal(
                [{facet_name: 'ind', prefix: null, suffix: null, format: 'short_label'}]);
        });

        it('should remove title part when clicking remove button', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'}
                ],
                titles: {
                    title: [{facet_name: "ind"},
                            {prefix: ',', suffix: null, facet_name: "brk"} ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var remove_button = view.composers_views.title.$el.find(
                                '[name="remove-title-part"]:eq(1)');
            remove_button.click();
            expect(view.model.get('titles')['title']).to.deep.equal(
                [{facet_name: 'ind', prefix: null, suffix: null, format: 'short_label'}]);
        });

        it('should update labels section on model', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                    {name: 'area', type: 'select', value: 'ref-area'}
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});

            var select = view.composers_views.title.$el.find(
                                    '[name="title-part"]:eq(0)');
            select.val('ind').change();

            var format_select = view.composers_views.title.$el.find(
                                    '[name="title-part-format"]');
            format_select.val('label').change();

            var add_button = view.composers_views.title.$el.find(
                                    '[name="add-title-part"]');
            add_button.click();


            var select = view.composers_views.title.$el.find(
                                    '[name="title-part"]:eq(1)');
            select.val('brk').change();

            var prefix = view.composers_views.title.$el.find(
                '[name="title-part-prefix"]:eq(1)');
            prefix.val(' by ').change();

            expect(view.model.get('titles').title).to.deep.equal([
                {facet_name: 'ind', prefix: null, suffix: null, format: 'label'},
                {facet_name: 'brk', prefix: ' by ', suffix: null, format: 'short_label'}
            ]);
            expect(view.model.get('labels')).to.deep.equal({
                "ind": {
                  "facet": "ind"
                },
                "brk": {
                  "facet": "brk"
                },
            })
        });

        it('should remove own labels in labels section on model', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                    {name: 'area', type: 'select', value: 'ref-area'}
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                },
                labels: { ind: { facet: 'ind' } }
            });
            var view = new App.AxesEditor({model: model});

            var select = view.composers_views.title.$el.find(
                                    '[name="title-part"]:eq(0)');
            select.val('ind').change();

            var format_select = view.composers_views.title.$el.find(
                                    '[name="title-part-format"]');
            format_select.val('label').change();

            var add_button = view.composers_views.title.$el.find(
                                    '[name="add-title-part"]');
            add_button.click();

            var select = view.composers_views.title.$el.find(
                                    '[name="title-part"]:eq(1)');
            select.val('brk').change();

            var parts = view.composers_views['title'].parts;
            parts.remove(parts.last().cid).trigger('remove');

            expect(view.model.get('titles').title).to.deep.equal([
                {facet_name: 'ind', prefix: null, suffix: null, format: 'label'}
            ]);
            expect(view.model.get('labels')).to.deep.equal({
                "ind": {
                  "facet": "ind"
                }
            })
        });

        it('should not remove existing labels in labels section on model', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'},
                    {name: 'brk', type: 'select', value: 'breakdown'},
                    {name: 'area', type: 'select', value: 'ref-area'}
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                },
                labels: {
                    ind: { facet: 'ind' },
                    brk: { facet: 'brk' }
                }
            });
            var view = new App.AxesEditor({model: model});
            var select = view.composers_views.title.$el.find(
                                    '[name="title-part"]:eq(0)');
            select.val('ind').change();

            var format_select = view.composers_views.title.$el.find(
                                    '[name="title-part-format"]');
            format_select.val('label').change();

            var add_button = view.composers_views.title.$el.find(
                                    '[name="add-title-part"]');
            add_button.click();

            var select = view.composers_views.title.$el.find(
                                    '[name="title-part"]:eq(1)');
            select.val('brk').change();
            var parts = view.composers_views['title'].parts;

            parts.remove(parts.last().cid);
            expect(view.model.get('titles').title).to.deep.equal([
                {facet_name: 'ind', prefix: null, suffix: null, format: 'label'}
            ]);
            expect(view.model.get('labels')).to.deep.equal({
                "ind": {
                  "facet": "ind"
                },
                "brk": {
                  "facet": "brk"
                },
            })
        });

        it('should save parts with default format', function(){
            var model = new Backbone.Model({
                facets: [
                    {name: 'ind', type: 'select', value: 'indicator'}
                ],
                titles:{
                    title: [
                        {facet_name: 'ind'}
                    ]
                }
            });
            var view = new App.AxesEditor({model: model});
            var select = view.composers_views.title.$el.find('[name="title-part"]:eq(0)');
            select.val('ind').change();
            expect(view.model.get('titles').title).to.deep.equal([
                {facet_name: 'ind', format: 'short_label', prefix: null, suffix: null}
            ]);
        });
    });

    it('should save axes sort criteria choice', function() {
        var view = new App.AxesEditor({model: new Backbone.Model()});
        view.$el.find('[name="axis-sort-by"][value="category"]').click().change();
        expect(view.model.get('sort')['by']).to.equal('category');
    });

    it('should show existing axes sort criteria choice', function() {
        var model = new Backbone.Model({sort: {by: 'category'}});
        var view = new App.AxesEditor({model: model});
        expect(view.$el.find('[name="axis-sort-by"]:checked').val()
            ).to.equal('category');
    });

    it('should save axes sort order choice', function() {
        var view = new App.AxesEditor({model: new Backbone.Model()});
        view.$el.find('[name="axis-sort-order"][value="-1"]').click().change();
        expect(view.model.get('sort')['order']).to.equal(-1);
    });

    it('should show existing axes sort order choice', function() {
        var model = new Backbone.Model({sort: {order: -1}});
        var view = new App.AxesEditor({model: model});
        expect(view.$el.find('[name="axis-sort-order"]:checked').val()
            ).to.equal('-1');
    });

    it('should save sort each series choice', function() {
        var view = new App.AxesEditor({model: new Backbone.Model()});
        view.$el.find('[name="axis-sort-each-series"]').click().change();
        expect(view.model.get('sort')['each_series']).to.be.true;
    });

    it('should show existing sort each series choice', function() {
        var model = new Backbone.Model({sort: {each_series: true}});
        var view = new App.AxesEditor({model: model});
        expect(view.$el.find('[name="axis-sort-each-series"]').is(':checked')
            ).to.be.true;
    });

    it('should save horizontal plotlines choice', function() {
        var view = new App.AxesEditor({model: new Backbone.Model()});
        view.$el.find('[name="axis-horizontal-plotline"]'
            ).val('values').change();
        expect(view.model.get('plotlines')['x']).to.equal('values');
    });

    it('should show existing horizontal plotlines choice', function() {
        var model = new Backbone.Model({'plotlines': {x: 'values'}});
        var view = new App.AxesEditor({model: model});
        expect(view.$el.find('[name="axis-horizontal-plotline"]').val()
            ).to.equal('values');
    });

    it('should save vertical plotlines choice', function() {
        var view = new App.AxesEditor({model: new Backbone.Model()});
        view.$el.find('[name="axis-vertical-plotline"]'
            ).val('values').change();
        expect(view.model.get('plotlines')['y']).to.equal('values');
    });

    it('should show existing vertical plotlines choice', function() {
        var model = new Backbone.Model({'plotlines': {y: 'values'}});
        var view = new App.AxesEditor({model: model});
        expect(view.$el.find('[name="axis-vertical-plotline"]').val()
            ).to.equal('values');
    });

});


describe('SeriesEditor', function() {

    var all_dimensions = [
        {type_label: 'measure', notation: null},
        {type_label: 'attribute', notation: 'unit-measure'},
        {type_label: 'attribute', notation: 'flag'},
        {type_label: 'attribute', notation: 'note'},
        {type_label: 'dimension group', notation: 'indicator-group'},
        {type_label: 'dimension', notation: 'indicator'},
        {type_label: 'dimension group', notation: 'breakdown-group'},
        {type_label: 'dimension', notation: 'breakdown'},
        {type_label: 'dimension', notation: 'unit-measure'},
        {type_label: 'dimension', notation: 'ref-area'},
        {type_label: 'dimension', notation: 'time-period'}
    ];

    beforeEach(function() {
        this.model = new App.EditorConfiguration({}, {
            dimensions: all_dimensions});
    });

    it('should display checkboxes for relevant dimensions', function() {
        var view = new App.SeriesEditor({model: this.model});
        expect(view.$el.find('[value="flag"]').length).to.equal(1);
        expect(view.$el.find('[value="note"]').length).to.equal(1);
        expect(view.$el.find('[value="unit-measure"]').length).to.equal(1);
        expect(view.$el.find('[value="breakdown"]').length).to.equal(0);
        expect(view.$el.find('[value="breakdown-group"]').length).to.equal(0);
    });

    it('should save value from checkboxes', function() {
        this.model.set('tooltips', {note: false});
        var view = new App.SeriesEditor({model: this.model});
        view.$el.find('[value="note"]').click().change();
        expect(this.model.get('tooltips')['note']).to.be.true;
    });

    it('should precheck checkboxes', function() {
        this.model.set('tooltips', {note: true});
        var view = new App.SeriesEditor({model: this.model});
        expect(view.$el.find('[value="note"]').is(':checked')).to.be.true;
        expect(view.$el.find('[value="flag"]').is(':checked')).to.be.false;
    });

    it('should precheck all checkboxes at first', function() {
        var view = new App.SeriesEditor({model: this.model});
        expect(view.$el.find('[value="unit-measure"]').is(':checked')).to.be.true;
        expect(view.$el.find('[value="note"]').is(':checked')).to.be.true;
        expect(view.$el.find('[value="flag"]').is(':checked')).to.be.true;
    });

    it('should set tooltips to an empty dict when uncheching all', function() {
        this.model.set('tooltips', {note: true});
        var view = new App.SeriesEditor({model: this.model});
        view.$el.find('[value="note"]').click().change();
        expect(this.model.toJSON()['tooltips']).to.deep.equal(_.object());
    });

    it('should leave checkboxes unchanged if previously unchecked', function() {
        this.model.set('tooltips', {});
        var view = new App.SeriesEditor({model: this.model});
        expect(view.$el.find('[value="unit-measure"]').is(':checked')).to.be.false;
        expect(view.$el.find('[value="note"]').is(':checked')).to.be.false;
        expect(view.$el.find('[value="flag"]').is(':checked')).to.be.false;
    });

    it('should save legend choice', function() {
        var view = new App.SeriesEditor({model: this.model});
        view.$el.find('[name="legend-label"]').val('long').change();
        expect(this.model.get('series-legend-label')).to.equal('long');
    });

    it('should show existing legend choice', function() {
        this.model.set('series-legend-label', 'long');
        var view = new App.SeriesEditor({model: this.model});
        expect(view.$el.find('[name="legend-label"]').val()).to.equal('long');
    });

    it('should save point label choice', function() {
        var view = new App.SeriesEditor({model: this.model});
        view.$el.find('[name="point-label"]').val('short').change();
        expect(this.model.get('series-point-label')).to.equal('short');
    });

    it('should show existing point label choice', function() {
        this.model.set('series-point-label', 'short');
        var view = new App.SeriesEditor({model: this.model});
        expect(view.$el.find('[name="point-label"]').val()).to.equal('short');
    });

    it('should save ending label choice', function() {
        var view = new App.SeriesEditor({model: this.model});
        view.$el.find('[name="ending-label"]').val('long').change();
        expect(this.model.get('series-ending-label')).to.equal('long');
    });

    it('should show existing ending label choice', function() {
        this.model.set('series-ending-label', 'long');
        var view = new App.SeriesEditor({model: this.model});
        expect(view.$el.find('[name="ending-label"]').val()).to.equal('long');
    });

});


describe('FormatEditor', function() {

    /*it('should save chart height', function() {
        var view = new App.FormatEditor({model: new Backbone.Model()});
        view.$el.find('[name="height"]').val('123').change();
        expect(view.model.get('height')).to.equal('123');
    });

    it('should display existing chart height', function() {
        var view = new App.FormatEditor({model: new Backbone.Model({
            height: '123'
        })});
        expect(view.$el.find('[name="height"]').val()).to.equal('123');
    });
    */

    it('should display 4 textareas', function() {
        var view = new App.FormatEditor({model: new Backbone.Model()});
        var textareas = view.$el.find('textarea[name$="text"]');
        expect(textareas.length).to.equal(4);
    });

    it('should save filters area text', function() {
        var view = new App.FormatEditor({model: new Backbone.Model()});
        var textarea = view.$el.find('textarea[id="upper-left"]:eq(0)')
        textarea.val('blah').trigger('change');
        var text = view.model.get('text');
        expect(text[0]).to.deep.equal(
            {value: "blah",
             position: "upper-left"}
        );
    });

    it('should load filters area text', function() {
        var view = new App.FormatEditor({model: new Backbone.Model({
            text: [{value: "blah",
                    position: "upper-left"}]
        })});
        var textarea = view.$el.find('textarea[id="upper-left"]:eq(0)')
        expect(textarea.val()).to.deep.equal("blah");
    });

    it('should save chart credits', function() {
        var view = new App.FormatEditor({model: new Backbone.Model()});
        view.$el.find('[name="credits-text"]').val('blah one').change();
        view.$el.find('[name="credits-link"]').val('blah two').change();
        var credits = view.model.get('credits');
        expect(credits['text']).to.equal('blah one');
        expect(credits['link']).to.equal('blah two');
    });

    it('should display existing chart height', function() {
        var view = new App.FormatEditor({model: new Backbone.Model({
            credits: {text: 'blah one', link: 'blah two'}
        })});
        expect(view.$el.find('[name="credits-text"]').val()
            ).to.equal('blah one');
        expect(view.$el.find('[name="credits-link"]').val()
            ).to.equal('blah two');
    });

});


describe('AnnotationsEditor', function() {

    it('should add selected items to model', function() {
        var model = new Backbone.Model({
            facets: [{name: 'dim1', type: 'select'},
                     {name: 'dim2', type: 'select'}],
        });
        var view = new App.AnnotationsEditor({model: model});
        view.$el.find('[name="annotation"][value="dim2"]').click().change();
        var names = _(model.get('annotations')['filters']).pluck('name');
        expect(names).to.not.contain('dim1');
        expect(names).to.contain('dim2');
    });

    it('should preselect defaults', function() {
        var model = new Backbone.Model({
            facets: [{name: 'dim1', type: 'select', dimension: 'indicator'},
                     {name: 'dim2', type: 'select', dimension: 'breakdown'},
                     {name: 'dim3', type: 'select', dimension: 'unit-measure'},
                     {name: 'dim4', type: 'select', dimension: 'breakdown'},
                     {name: 'dim5', type: 'select', dimension: 'other'}]
        });
        var view = new App.AnnotationsEditor({model: model});
        var get_checkbox = function(name) {
            return view.$el.find('[name="annotation"][value="' + name + '"]');
        }
        expect(get_checkbox('dim1').is(':checked')).to.be.true;
        expect(get_checkbox('dim2').is(':checked')).to.be.true;
        expect(get_checkbox('dim3').is(':checked')).to.be.true;
        expect(get_checkbox('dim4').is(':checked')).to.be.true;
        expect(get_checkbox('dim5').is(':checked')).to.be.false;
    });

    it('should not preselect defaults', function() {
        var model = new Backbone.Model({
            facets: [{name: 'dim1', type: 'select', dimension: 'indicator'},
                     {name: 'dim2', type: 'select', dimension: 'breakdown'}],
            annotations: {filters: [{name: 'dim2'}]}
        });
        var view = new App.AnnotationsEditor({model: model});
        var get_checkbox = function(name) {
            return view.$el.find('[name="annotation"][value="' + name + '"]');
        }
        expect(get_checkbox('dim1').is(':checked')).to.be.false;
        expect(get_checkbox('dim2').is(':checked')).to.be.true;
    });

    it('should preselect checkboxes with current value', function() {
        var model = new Backbone.Model({
            facets: [{name: 'dim1', type: 'select'},
                     {name: 'dim2', type: 'select'}],
            annotations: {filters: [{name: 'dim2'}]}
        });
        var view = new App.AnnotationsEditor({model: model});
        var get_checkbox = function(name) {
            return view.$el.find('[name="annotation"][value="' + name + '"]');
        }
        expect(get_checkbox('dim1').is(':checked')).to.be.false;
        expect(get_checkbox('dim2').is(':checked')).to.be.true;
    });

    it('should save annotations texts', function() {
        var view = new App.AnnotationsEditor({model: new Backbone.Model()});
        view.$el.find('[name="title"]').val('blah one').change();
        view.$el.find('[name="notes"]').val('blah two').change();
        var annotations = view.model.get('annotations');
        expect(annotations['title']).to.equal('blah one');
        expect(annotations['notes']).to.equal('blah two');
    });

    it('should display existing annotations texts', function() {
        var view = new App.AnnotationsEditor({model: new Backbone.Model({
            annotations: {title: 'blah one', notes: 'blah two'}
        })});
        expect(view.$el.find('[name="title"]').val()).to.equal('blah one');
        expect(view.$el.find('[name="notes"]').val()).to.equal('blah two');
    });

});


describe('AdvancedEditor', function() {
    "use strict";

    it('should display current value', function() {
        var data = {a: 'b', c: ['d', 'e'], f: {g: true}};
        var model = new Backbone.Model(data);
        var view = new App.AdvancedEditor({model: model});
        var textarea_data = JSON.parse(view.$el.find('textarea').val());
        expect(textarea_data).to.deep.equal(data);
    });

    it('should save value to model and trigger event', function() {
        var data = {a: 'b', c: ['d', 'e'], f: {g: true}};
        var model = new Backbone.Model({x: 'y'});
        var view = new App.AdvancedEditor({model: model});
        var events = 0;
        view.on('save', function() { events += 1; });
        view.$el.find('textarea').val(JSON.stringify(data));
        view.$el.find('button').click();
        expect(model.toJSON()).to.deep.equal(data);
        expect(events).to.equal(1);
    });

});
