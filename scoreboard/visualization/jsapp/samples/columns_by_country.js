/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario1_filters_schema = {
  "animation": false,
  "annotations": {
    "filters": [
      {
        "name": "indicator"
      },
      {
        "name": "breakdown"
      },
      {
        "name": "unit-measure"
      }
    ]
  },
  "category_facet": "ref-area",
  "chart_type": "columns",
  "facets": [
    {
      "constraints": {},
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "Indicator group",
      "name": "indicator-group",
      "type": "select",
      "default_value": "#random",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group"
      },
      "dimension": "indicator",
      "label": "Indicator",
      "default_value": "#random",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "name": "indicator",
      "type": "select"
    },
    {
      "name": "breakdown-group",
      "dimension": "breakdown-group",
      "include_wildcard": true,
      "label": "Breakdown group",
      "default_value": "#random",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select",
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator"
      }
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group"
      },
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "breakdown",
      "default_value": "#random",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group",
        "breakdown": "breakdown"
      },
      "dimension": "unit-measure",
      "label": "Unit of measure",
      "name": "unit-measure",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group",
        "breakdown": "breakdown",
        "unit-measure": "unit-measure"
      },
      "default_value": [
        "BE","BG","CZ","DK","DE","EE","IE","EL","ES","FR",
        "IT","CY","LV","LT","LU","HU","MT","NL","AT","PL",
        "PT","RO","SI","SK","FI","SE","UK","EU27"
      ],
      "dimension": "ref-area",
      "label": "Select the countries",
      "name": "ref-area",
      "type": "multiple_select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group",
        "breakdown": "breakdown",
        "unit-measure": "unit-measure"
      },
      "dimension": "time-period",
      "label": "Period",
      "name": "time-period",
      "sortBy": "label",
      "sortOrder": "reverse",
      "type": "select"
    },
    {
      "name": "value",
      "type": "all-values",
      "dimension": "value"
    }
  ],
  "highlights": ["EU27"],
  "labels": {
    "ordinate": {
      "facet": "unit-measure",
      "field": "short_label"
    },
    "title": {
      "facet": "indicator",
      "field": "label"
    },
    "unit-measure": {
      "facet": "unit-measure",
      "field": "short_label"
    },
    "title2": {
      "facet": "breakdown",
      "field": "label"
    }
  },
  "multiple_series": null,
  "height": 450,
  "credits": {
    "text": "European Commission, Digital Agenda Scoreboard",
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
  },
  "sort": {
    "by": "value",
    "order": -1,
    "each_series": true
  },
  "tooltips": {
    "unit-measure": true,
    "flag": true,
    "note": true
  },
  "series-legend-label": "none",
  "series-point-label": "long"
};


App.scenario1_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario1_filters_schema);
};


})(App.jQuery);
