/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario6_filters_schema = {
  "animation": true,
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
      "sortBy": "nosort",
      "sortOrder": "asc"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group"
      },
      "dimension": "indicator",
      "label": "Indicator",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "name": "indicator",
      "default_value": "#random",
      "type": "select"
    },
    {
      "name": "breakdown-group",
      "dimension": "breakdown-group",
      "include_wildcard": true,
      "label": "Breakdown group",
      "sortBy": "nosort",
      "sortOrder": "asc",
      "default_value": "#random",
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
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "default_value": "#random",
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
      "name": "time-period",
      "type": "all-values"
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
  "multiple_series": "time-period",
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


App.scenario6_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario6_filters_schema);
};


})(App.jQuery);
