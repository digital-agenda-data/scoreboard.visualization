/*global App, $script */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario5_filters_schema = {
    "animation": false,
    "annotations": {
        "filters": [{
            "name": "indicator"
        },
        {
            "name": "breakdown"
        },
        {
            "name": "unit-measure"
        }]
    },
    "category_facet": "ref-area",
    "chart_type": "map",
    "credits": {
        "text": "European Commission, Digital Agenda Scoreboard",
        "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
    },
    "facets": [{
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
        "sortBy": "order_in_codelist",
        "sortOrder": "asc",
        "position": "upper-left",
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
        "default_value": ["BE", "BG", "CZ", "DK", "DE",
        "EE", "IE", "EL", "ES", "FR",
        "IT", "CY", "LV", "LT", "LU",
        "HU", "MT", "NL", "AT", "PL",
        "PT", "RO", "SI", "SK", "FI",
        "SE", "UK"],
        "dimension": "ref-area",
        "ignore_values": ["EU27"],
        "label": "Select the countries",
        "name": "ref-area",
        "position": "upper-right",
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
        "label": "Period",
        "name": "time-period",
        "position": "upper-left",
        "sortBy": "label",
        "sortOrder": "reverse",
        "type": "select"
    },
    {
        "name": "value",
        "type": "all-values",
        "dimension": "value"
    }],
    "labels": {
        "unit-measure": {
          "facet": "unit-measure"
        },
        "indicator": {
          "facet": "indicator"
        },
        "breakdown": {
          "facet": "breakdown"
        }
    },
    "multiple_series": null,
    "plotlines": {},
    "sort": {
        "by": "category",
        "order": 1,
        "each_series": false
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
            "prefix": null,
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


App.scenario5_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario5_filters_schema);
};


})(App.jQuery);
