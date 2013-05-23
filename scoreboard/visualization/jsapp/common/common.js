/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


var country_data = [
    {code: 'AT',   color: '#AABC66', label: "Austria"},
    {code: 'BE',   color: '#FD8245', label: "Belgium"},
    {code: 'BG',   color: '#21FF00', label: "Bulgaria"},
    {code: 'CY',   color: '#FF5400', label: "Cyprus"},
    {code: 'CZ',   color: '#1C3FFD', label: "Czech Republic"},
    {code: 'DE',   color: '#FFC600', label: "Germany"},
    {code: 'DK',   color: '#45BF55', label: "Denmark"},
    {code: 'EE',   color: '#0EEAFF', label: "Estonia"},
    {code: 'GR',   color: '#6A07B0', label: "Greece"},
    {code: 'EL',   color: '#6A07B0', label: "Greece"}, // duplicate GR
    {code: 'ES',   color: '#044C29', label: "Spain"},
    {code: 'FI',   color: '#7FB2F0', label: "Finland"},
    {code: 'FR',   color: '#15A9FA', label: "France"},
    {code: 'HR',   color: '#33EED2', label: "Croatia"},
    {code: 'HU',   color: '#D40D12', label: "Hungary"},
    {code: 'IE',   color: '#ADF0F6', label: "Ireland"},
    {code: 'IS',   color: '#662293', label: "Iceland"},
    {code: 'IT',   color: '#19BC01', label: "Italy"},
    {code: 'LT',   color: '#9A24ED', label: "Lithuania"},
    {code: 'LU',   color: '#D50356', label: "Luxembourg"},
    {code: 'LV',   color: '#D59AFE', label: "Latvia"},
    {code: 'MT',   color: '#35478C', label: "Malta"},
    {code: 'NL',   color: '#FF40F4', label: "Netherlands"},
    {code: 'NO',   color: '#F70A9B', label: "Norway"},
    {code: 'PL',   color: '#FF1D23', label: "Poland"},
    {code: 'PT',   color: '#FFFC00', label: "Portugal"},
    {code: 'RO',   color: '#1B76FF', label: "Romania"},
    {code: 'SE',   color: '#436B06', label: "Sweden"},
    {code: 'SI',   color: '#648E23', label: "Slovenia"},
    {code: 'SK',   color: '#7DC30F', label: "Slovak Republic"},
    {code: 'TR',   color: '#9900AB', label: "Turkey"},
    {code: 'GB',   color: '#D000C4', label: "United Kingdom"},
    {code: 'UK',   color: '#D000C4', label: "United Kingdom"}, // duplicate GB
    {code: 'EU27', color: '#0B4EA2', label: "European Union"}
];


App.COUNTRY_COLOR = _.object(_(country_data).pluck('code'),
                             _(country_data).pluck('color'));


App.COUNTRY_NAME = _.object(_(country_data).pluck('code'),
                            _(country_data).pluck('label'));

App.SERIES_COLOR = ['#377EB8', '#E41A1C', '#4DAF4A', '#984EA3', '#FF7F00', '#FFFF33', '#A65628', '#F781BF', '#0d233a'];

App.index_by = function(list, prop) {
    return _.object(_(list).pluck(prop), list);
};


App.round = function(value, precision) {
    var magnitude = Math.floor(Math.log(value) / Math.LN10);
    var decimals = precision - magnitude - 1;
    var power = Math.pow(10, decimals);
    return '' + Math.round(value * power) / power;
};


// https://gist.github.com/insin/3619992
Backbone.Collection.prototype.move = function(model, toIndex) {
    var fromIndex = this.indexOf(model);
    if (fromIndex == -1) {
        throw new Error("Can't move a model that's not in the collection");
    }
    if (fromIndex !== toIndex) {
        this.models.splice(toIndex, 0, this.models.splice(fromIndex, 1)[0]);
    }
    this.trigger('sort');
}


})(App.jQuery);
