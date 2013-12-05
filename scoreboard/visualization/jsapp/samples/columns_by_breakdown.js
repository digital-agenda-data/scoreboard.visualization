/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario7_filters_schema = {
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
    "category_facet": "ref-area",
    "chart_type": "columns",
    "credits": {
        "text": "European Commission, Digital Agenda Scoreboard",
        "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
    },
    "facets": [
    {
        "constraints": {},
        "default_value": "#random",
        "dimension": "indicator-group",
        "include_wildcard": true,
        "label": "Indicator group",
        "name": "indicator-group",
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
        "include_wildcard": false,
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
            "unit-measure": "unit-measure"
        },
        "dimension": "time-period",
        "label": "Period",
        "name": "time-period",
        "position": "upper-left",
        "sortBy": "label",
        "sortOrder": "reverse",
        "type": "select"
    },
    {
        "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group",
            "unit-measure": "unit-measure",
            "time-period": "time-period"
        },
        "default_value": ["EU27", "#random"],
        "dimension": "ref-area",
        "highlights": [],
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
            "unit-measure": "unit-measure",
            "time-period": "time-period"
        },
        "dimension": "breakdown",
        "label": "Breakdown",
        "name": "breakdown",
        "position": "upper-left",
        "sortBy": "order_in_codelist",
        "sortOrder": "asc",
        "type": "all-values"
    },
    {
        "name": "value",
        "type": "all-values",
        "dimension": "value"
    }
    ],
    "labels": {
        "indicator": {
          "facet": "indicator"
        },
        "unit-measure": {
          "facet": "unit-measure"
        },
        "breakdown-group": {
          "facet": "breakdown-group"
        },
        "time-period": {
          "facet": "time-period"
        }
    },
    "multiple_series": "breakdown",
    "series-legend-label": "long",
    "series-point-label": "none",
    "sort": {
        "by": "value",
        "each_series": false,
        "order": -1
    },
    "titles": {
        "title": [
          {
            "facet_name": "indicator",
            "prefix": null,
            "suffix": null,
            "format": "label"
          },
          {
            "facet_name": "breakdown-group",
            "prefix": ", by ",
            "suffix": null,
            "format": "label"
          }
        ],
        "subtitle": [
          {
            "facet_name": "time-period",
            "prefix": null,
            "suffix": null,
            "format": "label"
          }
        ],
        "xAxisTitle": [],
        "yAxisTitle": [
          {
            "facet_name": "unit-measure",
            "prefix": null,
            "suffix": null,
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


App.scenario7_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario7_filters_schema);
};


})(App.jQuery);
