const g_$ = window.$;

// import underscore from "underscore";
// window._ = underscore;
import Backbone from "backbone";
window.Backbone = Backbone;
// Augment Backbone's jquery; Backbone needs the extra modules
window.$ = window.jQuery = Backbone.$;
const Highcharts = require("highcharts");
window.Highcharts = Highcharts;
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/map")(Highcharts);
// with our jQuery globally available, multiple-select will upgrade it.
require("multiple-select");
require("select2");

// This is much harder to augment, need to use the jquery factory + require js
// Anyway, note that the bulk of the web app will require jqurey and jquery-ui
// before this part of the front end app is loaded - that's why we let plone js portal load it and we restore the global jquery
// const ui = require("jquery-ui/ui/widget.js");
// window.jQuery(ui);

// restore the jquery used by plone and the rest of the app.
window.$ = g_$;
window.jQuery = g_$;

import common from "./common/common"
import filters from "./filters/filters"
import columns from "./chart/columns"
import country_profile from "./chart/country_profile"
import lines from "./chart/lines"
import scatter from "./chart/scatter"
import bubbles from "./chart/bubbles"
import polar from "./chart/polar"
import country_profile_polar from "./chart/country_profile_polar"
import map from "./chart/map"
import scenario from "./scenario/scenario"
import visualization from "./scenario/visualization"
import country_profile_bar from "./samples/country_profile_bar"
import country_profile_table from "./samples/country_profile_table"
import editor from "./editor/editor"
import chart_type from "./editor/chart_type"
import structure from "./editor/structure"
import layout from "./editor/layout"
import facets from "./editor/facets"
import axes from "./editor/axes"
import series from "./editor/series"
import format from "./editor/format"
import annotations from "./editor/annotations"
import advanced from "./editor/advanced"
