/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario3_filters_schema = {
    "annotations": {
        "filters": [
        {
            "name": "x-indicator"
        },
        {
            "name": "x-breakdown-group"
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
            "name": "y-breakdown-group"
        },
        {
            "name": "y-breakdown"
        },
        {
            "name": "y-unit-measure"
        }
        ]
    },
    "category_facet": "ref-area",
    "chart_type": "scatter",
    "credits": {
        "text": "European Commission, Digital Agenda Scoreboard",
        "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
    },
    "facets": [
    {
        "name": "x-indicator-group",
        "label": "(X) indicator group",
        "constraints": {},
        "dimension": "indicator-group",
        "include_wildcard": true,
        "sortBy": "order_in_codelist",
        "sortOrder": "asc",
        "type": "select"
    },
    {
        "name": "x-indicator",
        "label": "(X) indicator",
        "constraints": {
            "indicator-group": "x-indicator-group"
        },
        "default_value": "#random",
        "dimension": "indicator",
        "sortBy": "inner_order",
        "sortOrder": "asc",
        "type": "select"
    },
    {
        "name": "x-breakdown-group",
        "label": "(X) breakdown group",
        "constraints": {
            "indicator-group": "x-indicator-group",
            "indicator": "x-indicator"
        },
        "dimension": "breakdown-group",
        "sortBy": "order_in_codelist",
        "sortOrder": "asc",
        "type": "ignore"
    },
    {
        "name": "x-breakdown",
        "label": "(X) breakdown",
        "constraints": {
            "indicator-group": "x-indicator-group",
            "indicator": "x-indicator"
        },
        "default_value": "#random",
        "dimension": "breakdown",
        "sortBy": "inner_order",
        "sortOrder": "asc",
        "type": "select"
    },
    {
        "name": "x-unit-measure",
        "label": "(X) unit of measure",
        "constraints": {
            "indicator-group": "x-indicator-group",
            "indicator": "x-indicator",
            "breakdown": "x-breakdown"
        },
        "default_value": "#random",
        "dimension": "unit-measure",
        "type": "select"
    },
    {
        "name": "y-indicator-group",
        "label": "(Y) indicator group",
        "constraints": {},
        "default_value": "#random",
        "dimension": "indicator-group",
        "include_wildcard": true,
        "sortBy": "order_in_codelist",
        "sortOrder": "asc",
        "position": "upper-right",
        "type": "select"
    },
    {
        "name": "y-indicator",
        "label": "(Y) indicator",
        "constraints": {
            "indicator-group": "y-indicator-group"
        },
        "default_value": "#random",
        "dimension": "indicator",
        "sortBy": "inner_order",
        "sortOrder": "asc",
        "position": "upper-right",
        "type": "select"
    },
    {
        "name": "y-breakdown-group",
        "label": "(Y) breakdown group",
        "constraints": {
            "indicator-group": "y-indicator-group",
            "indicator": "y-indicator"
        },
        "dimension": "breakdown-group",
        "sortBy": "order_in_codelist",
        "sortOrder": "asc",
        "position": "upper-right",
        "type": "ignore"
    },
    {
        "name": "y-breakdown",
        "label": "(Y) breakdown",
        "constraints": {
            "indicator-group": "y-indicator-group",
            "indicator": "y-indicator"
        },
        "default_value": "#random",
        "dimension": "breakdown",
        "sortBy": "inner_order",
        "sortOrder": "asc",
        "position": "upper-right",
        "type": "select"
    },
    {
        "name": "y-unit-measure",
        "label": "(Y) unit of measure",
        "constraints": {
            "indicator-group": "y-indicator-group",
            "indicator": "y-indicator",
            "breakdown": "y-breakdown"
        },
        "default_value": "#random",
        "dimension": "unit-measure",
        "position": "upper-right",
        "type": "select"
    },
    {
        "constraints": {
            "x-indicator-group": "x-indicator-group",
            "x-indicator": "x-indicator",
            "x-breakdown": "x-breakdown",
            "x-unit-measure": "x-unit-measure",
            "y-indicator-group": "y-indicator-group",
            "y-indicator": "y-indicator",
            "y-breakdown": "y-breakdown",
            "y-unit-measure": "y-unit-measure"
        },
        "dimension": "time-period",
        "label": "Period",
        "multidim_common": true,
        "name": "time-period",
        "sortBy": "label",
        "sortOrder": "reverse",
        "type": "select"
    },
    {
        "constraints": {
            "x-indicator-group": "x-indicator-group",
            "x-indicator": "x-indicator",
            "x-breakdown": "x-breakdown",
            "x-unit-measure": "x-unit-measure",
            "y-indicator-group": "y-indicator-group",
            "y-indicator": "y-indicator",
            "y-breakdown": "y-breakdown",
            "y-unit-measure": "y-unit-measure",
            "time-period": "time-period"
        },
        "default_value": ["BE", "BG", "CZ", "DK", "DE",
        "EE", "IE", "EL", "ES", "FR",
        "IT", "CY", "LV", "LT", "LU",
        "HU", "MT", "NL", "AT", "PL",
        "PT", "RO", "SI", "SK", "FI",
        "SE", "UK"],
        "dimension": "ref-area",
        "ignore_values": ["EU27"],
        "label": "Country / Countries",
        "multidim_common": true,
        "name": "ref-area",
        "type": "all-values"
    },
    {
        "name": "value",
        "type": "all-values",
        "dimension": "value",
        "multidim_value": true
    }
    ],
    "labels": {
        "time-period": {
          "facet": "time-period"
        },
        "x-breakdown": {
          "facet": "x-breakdown"
        },
        "x-indicator": {
          "facet": "x-indicator"
        },
        "y-breakdown": {
          "facet": "y-breakdown"
        },
        "y-indicator": {
          "facet": "y-indicator"
        },
        "x-unit-measure": {
          "facet": "x-unit-measure"
        },
        "y-unit-measure": {
          "facet": "y-unit-measure"
        }
    },
    "multidim": 2,
    "multiple_series": null,
    "plotlines": {
        "x": "values",
        "y": "values"
    },
    "series-legend-label": "long",
    "series-point-label": "short",
    "sort": {
        "by": "category",
        "each_series": false,
        "order": 1
    },
    "text": [
      {
        "position": "upper-left",
        "value": "Horizontal axis"
      },
      {
        "position": "upper-right",
        "value": "Vertical axis"
      },
      {
        "value": "",
        "position": "bottom-left"
      },
      {
        "value": "",
        "position": "bottom-right"
      }      
    ],
    "titles": {
        "title": [
          {
            "prefix": null,
            "suffix": null,
            "facet_name": "time-period",
            "format": "short_label"
          }
        ],
        "subtitle": [],
        "xAxisTitle": [
          {
            "prefix": null,
            "suffix": null,
            "facet_name": "x-indicator",
            "format": "label"
          },
          {
            "prefix": ", by ",
            "suffix": null,
            "facet_name": "x-breakdown",
            "format": "label"
          },
          {
            "prefix": " (",
            "suffix": ")",
            "facet_name": "x-unit-measure",
            "format": "label"
          }
        ],
        "yAxisTitle": [
          {
            "prefix": null,
            "suffix": null,
            "facet_name": "y-indicator",
            "format": "label"
          },
          {
            "prefix": "<br>by ",
            "suffix": null,
            "facet_name": "y-breakdown",
            "format": "label"
          },
          {
            "prefix": "<br>(",
            "suffix": ")",
            "facet_name": "y-unit-measure",
            "format": "label"
          }
        ]
    },
    "tooltips": {
        "flag": true,
        "note": true,
        "unit-measure": true
    }
};


App.scenario3_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario3_filters_schema);
};


})(App.jQuery);
