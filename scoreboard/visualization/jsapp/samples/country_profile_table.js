/*global App */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario9_table_filters_schema = {
  chart_type: "country_profile",
  chart_subtype: 'table',
  category_facet: "indicator",
  multiple_series: null,
  facets: [
    {
      type: "select",
      name: "indicator-group",
      label: "Indicator group",
      dimension: "indicator-group",
      sortBy: "order_in_codelist",
      sortOrder: "asc",
      "default_value": "#random",
      constraints: {}
     },
    {
      type: "select",
      name: "ref-area",
      label: "Country",
      dimension: "ref-area",
      "default_value": "#random",
      sortBy: "label",
      sortOrder: "asc",
      constraints: {
        "indicator-group": "indicator-group"
      }
    },
    {
      type: "select",
      name: "time-period",
      label: "Year",
      dimension: "time-period",
      sortBy: 'label',
      sortOrder: 'reverse',
      constraints: {
        "indicator-group": "indicator-group",
        "ref-area": "ref-area"
      }
    },
    {
      type: "all-values",
      dimension: "value"
    }
  ],
  labels: {
    'title': {facet: 'ref-area', field: 'label'},
    'indicator-group': {facet: 'indicator-group', field: 'label'},
    'ref-area': {facet: 'ref-area', field: 'label'},
    'time-period': {facet: 'time-period', field: 'label'}
  }
};


App.scenario9_table_initialize = function() {
    App.create_visualization($("#scenario-box")[0],
                             App.scenario9_table_filters_schema);
};


})(App.jQuery);
