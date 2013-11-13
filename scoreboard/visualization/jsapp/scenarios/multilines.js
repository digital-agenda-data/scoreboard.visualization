/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.multilines_filters_schema = {
  "annotations": {
    "filters": [
      {
        "name": "x-indicator"
      },
      {
        "name": "x-breakdown"
      },
      {
        "name": "x-unit-measure"
      },
      {
        "name": "y-indicator"
      },
      {
        "name": "y-breakdown"
      },
      {
        "name": "y-unit-measure"
      }
    ]
  },
  "axis-horizontal-rotated": false,
  "axis-horizontal-title": "none",
  "axis-vertical-title": "short",
  "category_facet": "time-period",
  "chart_type": "lines",
  "credits": {
    "text": "European Commission, Digital Agenda Scoreboard",
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
  },
  "facets": [
    {
      "constraints": {},
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "Indicator group",
      "name": "x-indicator-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "x-indicator-group"
      },
      "dimension": "indicator",
      "label": "Indicator",
      "name": "x-indicator",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "x-indicator-group",
        "indicator": "x-indicator"
      },
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "x-breakdown",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "x-indicator-group",
        "indicator": "x-indicator",
        "breakdown": "x-breakdown"
      },
      "dimension": "unit-measure",
      "label": "Unit of measure",
      "name": "x-unit-measure",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {},
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "Indicator group",
      "name": "y-indicator-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "position": "upper-right",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "y-indicator-group"
      },
      "dimension": "indicator",
      "label": "Indicator",
      "name": "y-indicator",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "position": "upper-right",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "y-indicator-group",
        "indicator": "y-indicator"
      },
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "y-breakdown",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "position": "upper-right",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "y-indicator-group",
        "indicator": "y-indicator",
        "breakdown": "y-breakdown"
      },
      "dimension": "unit-measure",
      "label": "Unit of measure",
      "name": "y-unit-measure",
      "default_value": "#random",
      "position": "upper-right",
      "type": "select"
    },
    {
      "constraints": {
        "x-indicator": "x-indicator",
        "x-unit-measure": "x-unit-measure",
        "y-indicator": "y-indicator",
        "y-unit-measure": "y-unit-measure",
        "x-breakdown": "x-breakdown",
        "y-breakdown": "y-breakdown"
      },
      "dimension": "ref-area",
      "default_value": "EU27",
      "label": "Country",
      "name": "ref-area",
      "sortBy": "label",
      "sortOrder": "asc",
      "multidim_common": true,
      "type": "select"
    },
    {
      "constraints": {
        "x-indicator": "x-indicator",
        "x-unit-measure": "x-unit-measure",
        "x-breakdown": "x-breakdown",
        "y-indicator": "y-indicator",
        "y-unit-measure": "y-unit-measure",
        "y-breakdown": "y-breakdown",
        "ref-area": "ref-area"
      },
      "dimension": "time-period",
      "label": "Time period",
      "name": "time-period",
      "multidim_common": true,
      "type": "all-values"
    },
    {
      "name": "value",
      "type": "all-values",
      "dimension": "value"
    }
  ],
  "height": 450,
  "labels": {
    "x-indicator": {
        "facet": "x-indicator"
    },
    "x-unit-measure": {
        "facet": "x-unit-measure"
    },
    "x-breakdown": {
        "facet": "x-breakdown"
    },
    "y-indicator": {
        "facet": "y-indicator"
    },
    "y-unit-measure": {
        "facet": "y-unit-measure"
    },
    "y-breakdown": {
        "facet": "y-breakdown"
    },
    "ref-area": {
        "facet": "ref-area"
    }
  },
  "multiple_series": 2,
  "series-legend-label": "long",
  "series-ending-label": "none",
  "series-point-label": "none",
  "sort": {
    "by": "category",
    "order": 1,
    "each_series": true,
  },
  "titles": {
    "title": [
      {
        "facet_name": "x-indicator",
        "prefix": null,
        "suffix": null,
        "format": "label"
      },
      {
        "facet_name": "x-breakdown",
        "prefix": ", by ",
        "suffix": null,
        "format": "label"
      },
      {
        "facet_name": "y-indicator",
        "prefix": ' and ',
        "suffix": null,
        "format": "label"
      },
      {
        "facet_name": "y-breakdown",
        "prefix": ", by ",
        "suffix": null,
        "format": "label"
      }
    ],
    "subtitle": [
      {
        "facet_name": "ref-area",
        "prefix": null,
        "suffix": null,
        "format": "label"
      }
    ],
    "xAxisTitle": [],
    "yAxisTitle": [
      {
        "facet_name": "x-unit-measure",
        "prefix": null,
        "suffix": null,
        "format": "short_label",
        "asArray": true
      },
      {
        "facet_name": "y-unit-measure",
        "prefix": null,
        "suffix": null,
        "format": "short_label",
        "asArray": true
      }
    ]
  },
  "tooltips": {
    "flag": true,
    "note": true,
    "unit-measure": true
  }
};


App.scenario_multilines_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.multilines_filters_schema);
};


})(App.jQuery);
