/*global App, Backbone, _ */
/*jshint sub:true */


/*
 * un chart lines ... cu doua liste de indicatori (x, y)
 * pe o sigunra tara
 * doi indicatori
 * pe x - date time
 *
 */

(function($) {
"use strict";


App.scenario2_filters_schema = {
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
    ],
    "title": "Definitions and scopes"
  },
  "category_facet": "time-period",  // xaxis
  "chart_type": "lines", 
  "credits": {
    "text": "European Commission, Digital Agenda Scoreboard",
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
  },
  "facets": [
    {
      "constraints": {}, // de cine depinde
      "default_value": "#random",
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "Indicator group",
      "name": "indicator-group", // x-indicator y- indicator ( scenario3.js ) 
      "position": "upper-left",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group"
      },
      "default_value": "#random",
      "dimension": "indicator",
      "label": "Indicator",
      "name": "indicator",
      "position": "upper-left",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator"
      },
      "default_value": "#random",
      "dimension": "breakdown-group",
      "include_wildcard": true,
      "label": "Breakdown group",
      "name": "breakdown-group",
      "position": "upper-left",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group"
      },
      "default_value": "#random",
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "breakdown",
      "position": "upper-left",
      "sortBy": "inner_order",
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
      "default_value": "#random",
      "dimension": "unit-measure",
      "label": "Unit of measure",
      "name": "unit-measure",
      "position": "upper-left",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
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
      "dimension": "ref-area",
      "default_value": ["EU27", "#random"],
      "label": "Select the countries",
      "name": "ref-area",
      "position": "upper-left",
      "sortBy": "label",
      "sortOrder": "asc",
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
      "label": "Time period",
      "name": "time-period",
      "type": "all-values"
    },
    {
      "name": "value",
      "type": "all-values",
      "dimension": "value"
    }
  ],
  "labels": {
    "breakdown": {
      "facet": "breakdown"
    },
    "indicator": {
      "facet": "indicator"
    },
    "unit-measure": {
      "facet": "unit-measure"
    }
  },
  "multiple_series": "ref-area",
  "plotlines": {},
  "series-legend-label": "none",
  "series-ending-label": "long",
  "series-point-label": "long",
  "sort": {
    "by": "category",
    "order": -1,
    "each_series": true
  },
  "titles": {
    "title": [
      {
        "prefix": null,
        "suffix": null,
        "facet_name": "indicator",
        "format": "label"
      },
      {
        "facet_name": "breakdown",
        "prefix": ", by ",
        "suffix": null,
        "format": "label"
      }
    ],
    "subtitle": [],
    "xAxisTitle": [],
    "yAxisTitle": [
      {
        "prefix": null,
        "suffix": null,
        "facet_name": "unit-measure",
        "format": "short_label"
      }
    ]
  },
  "tooltips": {
    "flag": true,
    "note": true,
    "unit-measure": true
  }
};


App.scenario2_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario2_filters_schema);
};


})(App.jQuery);
