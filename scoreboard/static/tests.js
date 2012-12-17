function choose_option(select, value) {
    var options = $('option', select).filter('[value=' + value + ']');
    options.attr('selected', 'selected').change();
}


function choose_radio(inputs, value) {
    inputs.attr('checked', null);
    inputs.filter('[value=' + value + ']').attr('checked', 'checked').change();
}


describe('FiltersView', function() {
    "use strict";

    beforeEach(function() {
        this.filters_data = {'indicators': [
            {'uri': 'ind1', 'years': ["2009", "2010"]},
            {'uri': 'ind2', 'years': ["2010", "2011"]}
        ]};
        this.model = new Backbone.Model;
        this.view = new App.FiltersView({
            model: this.model,
            filters_data: this.filters_data
        });
    });

    describe('indicators selector', function() {

        it('should update model', function() {
            choose_option(this.view.$el.find('select'), 'ind1');
            expect(this.model.get('indicator')).to.equal('ind1');
        });

        it('should select the current indicator', function() {
            this.model.set({'indicator': 'ind2'});
            choose_option(this.view.$el.find('select'), 'ind2');
        });

        it('should set year=null if missing from new indicator', function() {
            choose_option(this.view.$el.find('select'), 'ind2');
            expect(this.model.get('year')).to.equal(null);
        });

        it('should make an initial selection', function() {
            expect(this.model.get('indicator')).to.equal('ind1');
        });

    });

    describe('year radio buttons', function() {

        it('should update model', function() {
            this.model.set({'indicator': 'ind1'});
            choose_radio(this.view.$el.find('input[name=year]'), '2010');
            expect(this.model.get('year')).to.equal('2010');
        });

        it('should select the current year', function() {
            this.model.set({'indicator': 'ind1', 'year': '2010'});
            var year_two = this.view.$el.find('input[name=year][value=2010]');
            expect(year_two.attr('checked')).to.equal('checked');
        });

        it('should update list of years when indicator changes', function() {
            this.model.set({'indicator': 'ind1', 'year': '2010'});
            this.model.set({'indicator': 'ind2'});

            var years = this.view.$el.find('input[name=year]').map(function() {
                return $(this).val();
            }).get();
            expect(years).to.deep.equal(['2010', '2011']);
        });

        it('should make an initial selection', function() {
            expect(this.model.get('year')).to.equal('2009');
        });

    });

});


var url_param = function(url, name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) { return null; }
    return decodeURIComponent(results[1]);
}


describe('ChartView', function() {
    "use strict";

    var server, render_highcharts;

    beforeEach(function() {
        server = sinon.fakeServer.create();
        render_highcharts = sinon.stub(App, 'render_highcharts');

        this.model = new Backbone.Model;
        this.chart = new App.ChartView({model: this.model});
        this.model.set({
            'indicator': 'asdf',
            'year': '2002'
        });
    });

    afterEach(function () {
        server.restore();
        render_highcharts.restore();
    });

    it('should fetch data from server', function() {
        var url = server.requests[0].url;
        expect(url).to.have.string(App.URL + '/data?')
        expect(url_param(url, 'method')).to.equal('get_one_indicator_year');
        expect(url_param(url, 'indicator')).to.equal('asdf');
        expect(url_param(url, 'year')).to.equal(
            'http://data.lod2.eu/scoreboard/year/2002');
    });

    it('should fetch metadata from server', function() {
        var url2 = server.requests[1].url;
        expect(url2).to.have.string(App.URL + '/data?')
        expect(url_param(url2, 'method')).to.equal('get_indicator_meta');
        expect(url_param(url2, 'indicator')).to.equal('asdf');
    });

    it('should render chart with the data and metadata received', function() {
        var ajax_data = [{'country_name': "Austria", 'value': 0.18},
                         {'country_name': "Belgium", 'value': 0.14}];
        server.requests[0].respond(
            200, {'Content-Type': 'application/json'},
            JSON.stringify(ajax_data));

        var ajax_metadata = [{
            'label': "The Label!",
            'comment': "The Definition!",
            'publisher': "The Source!"
        }];
        server.requests[1].respond(200, {'Content-Type': 'application/json'},
                                   JSON.stringify(ajax_metadata));

        var container = this.chart.$el.find('.highcharts-chart')[0];
        expect(render_highcharts.calledOnce).to.equal(true);
        var call_args = render_highcharts.getCall(0).args;
        expect(call_args[0]).to.equal(container);
        expect(call_args[1]['data']).to.deep.equal(ajax_data);
        expect(call_args[1]['indicator_label']).to.equal(
            ajax_metadata[0]['label']);
    });

});


describe('MetadataView', function() {
    "use strict";

    var server;

    beforeEach(function() {
        server = sinon.fakeServer.create();
    });

    afterEach(function () {
        server.restore();
    });

    it('should display data from server', function() {
        var view = new App.MetadataView({
            model: new Backbone.Model({'indicator': 'asdf', 'year': '2002'})
        });

        expect(server.requests.length).to.equal(1);
        var url = server.requests[0].url;
        expect(url_param(url, 'method')).to.equal('get_indicator_meta');
        expect(url_param(url, 'indicator')).to.equal('asdf');
        expect(url_param(url, 'year')).to.equal(
            'http://data.lod2.eu/scoreboard/year/2002');

        var ajax_data = [{
            'label': "The Label!",
            'comment': "The Definition!",
            'publisher': "The Source!"
        }];
        server.requests[0].respond(200, {'Content-Type': 'application/json'},
                                   JSON.stringify(ajax_data));

        expect(view.$el.find('h3').text()).to.equal("The Label!");
        expect(view.$el.find('li:first').text()).to.contain.string(
            "The Definition!");
        expect(view.$el.find('li:last').text()).to.contain.string(
            "The Source!");
    });

});
