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
    {code: 'EU27', color: '#63b8ff', label: "European Union"},
    {code: 'EU28', color: '#63b8ff', label: "European Union 28"}
];

var predefined_colors = [
    {notation: 'Not_assigned',   color: '#CCCCCC'}
]

App.PREDEFINED_COLORS = _.object(_(predefined_colors).pluck('notation'),
                             _(predefined_colors).pluck('color'));

App.COUNTRY_COLOR = _.object(_(country_data).pluck('code'),
                             _(country_data).pluck('color'));


App.COUNTRY_NAME = _.object(_(country_data).pluck('code'),
                            _(country_data).pluck('label'));

App.EU27 = {
    BE: "Belgium",
    FR: "France",
    BG: "Bulgaria",
    DK: "Denmark",
    DE: "Germany",
    HU: "Hungary",
    FI: "Finland",
    NL: "Netherlands",
    PT: "Portugal",
    LV: "Latvia",
    LT: "Lithuania",
    LU: "Luxembourg",
    RO: "Romania",
    PL: "Poland",
    EL: "Greece",
    EE: "Estonia",
    IT: "Italy",
    CZ: "Czech Republic",
    CY: "Cyprus",
    AT: "Austria",
    IE: "Ireland",
    ES: "Spain",
    SK: "Slovakia",
    MT: "Malta",
    SI: "Slovenia",
    UK: "United Kingdom",
    SE: "Sweden",
    HR: "Croatia"
}

App.SERIES_COLOR = [
    '#63b8ff', '#E41A1C', '#4DAF4A', '#984EA3', '#FF7F00', '#FFFF33', '#A65628', '#F781BF', '#0d233a',
    '#AABC66', '#FD8245', '#21FF00', '#FF5400', '#1C3FFD', '#FFC600', '#45BF55', '#0EEAFF', '#6A07B0',
    '#044C29', '#7FB2F0', '#15A9FA', '#33EED2', '#D40D12', '#ADF0F6', '#662293', '#19BC01', '#9A24ED',
    '#D50356', '#D59AFE', '#35478C', '#FF40F4', '#F70A9B', '#FF1D23', '#FFFC00', '#1B76FF', '#436B06',
    '#648E23', '#7DC30F', '#9900AB', '#D000C4', '#D000C4', '#0B4EA2'
];

App.index_by = function(list, prop) {
    return _.object(_(list).pluck(prop), list);
};


App.round = function(value, precision) {
    if(value == 0) { return 0; }
    var magnitude = Math.floor(Math.log(value) / Math.LN10);
    var decimals = precision - magnitude - 1;
    var power = Math.pow(10, decimals);
    if (decimals >= 0){
        return '' + Math.round(value * power) / power;
    }
    else{
        return '' + value;
    }
};

App.unit_is_percent = function(unit) {
    return unit && typeof unit == "string" && unit.length > 3 && unit.substring(0,3).toLowerCase() == 'pc_';
}
App.multiplicator = function(unit) {
    return App.unit_is_percent(unit)?100:1;
}

App.TIME_PERIOD_DIMENSIONS = ["time-period", "TIME_PERIOD", "refPeriod"]

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

App.isIE78 = function () {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat(RegExp.$1);
            return rv == 7 || rv == 8;
        }
    }
    return false;
}

var chart = null;

App.notation_totals = ["1M_websites", "HH_total", "IND_TOTAL", "RURAL_POP", "TOTAL", "TOTAL_FBB", "TOTAL_MBB", "TOTAL_MOB", "TOTAL_POP","TOTAL_POPHH", "TOTAL_TEL", "ent_all_xfin", "orgclass_total", "tot_ict_products", "total_offers8plus", "all_eGov_le", "total"];

App.width_xs = function() {
  return App.jQuery(window).width() <= 480;
}

App.width_s = function() {
  return App.jQuery(window).width() <= 768;
}

App.width_m = function() {
  return App.jQuery(window).width() <= 1024;
}

App.is_touch_device = function() {
  return ("ontouchstart" in window || navigator.msMaxTouchPoints) && !navigator.userAgent.match('Windows');
}

App.font_family = "Lucida Sans Unicode, Candara, Calibri, Futura, Helvetica";


// Plugin to add support for credits.target in Highcharts.
Highcharts.wrap(Highcharts.Chart.prototype, 'showCredits', function (proceed, credits) {
    proceed.call(this, credits);
    if (credits.enabled && this.credits) {
        if (App.is_touch_device()) {
            this.credits.element.onclick = function () {
                return false;
            }
        } else {
            this.credits.element.onclick = function () {
              // dynamically create an anchor element and click it
              // use the settings defined in highcharts (credits.target)
              var link = document.createElement('a');
              link.href = credits.href;
              link.target = credits.target||'_blank';
              document.body.appendChild(link);
              link.click();
            }
        }
    }
});

})(App.jQuery);
