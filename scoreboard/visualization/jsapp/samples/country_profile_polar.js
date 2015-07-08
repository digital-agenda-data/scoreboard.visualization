{
  "chart_type": "country_profile_polar",
  "chart_subtype": "polar",
  "series-legend-label": "long",
  "series-point-label": "long",
  "category_facet": "indicator",
  "multiple_series": "ref-area",
  "facets": [
    {
      "type": "select",
      "name": "indicator-group",
      "label": "Indicator group",
      "dimension": "indicator-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "constraints": {}
     },
    {
      "type": "select",
      "name": "time-period",
      "label": "Period",
      "dimension": "time-period",
      "sortBy": "label",
      "sortOrder": "reverse",
      "constraints": {
        "indicator-group": "indicator-group"
      }
    },
    {
      "type": "multiple_select",
      "name": "ref-area",
      "label": "Country",
      "dimension": "ref-area",
      "default_value": ["#random","EU27"],
      "sortBy": "label",
      "sortOrder": "asc",
      "constraints": {
        "indicator-group": "indicator-group",
        "time-period": "time-period"
      }
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "time-period": "time-period"
      },
      "dimension": "indicator",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "name": "indicator",
      "type": "all-values",
      "label": "Indicator"
    },
    {
      "type": "all-values",
      "dimension": "value"
    }
  ],
  "labels": {
    "indicator-group": {
      "facet": "indicator-group"
    },
    "ref-area": {
      "facet": "ref-area"
    },
    "time-period": {
      "facet": "time-period"
    }
  },
  "sort": {
    "by": "order",
    "order": 1,
    "each_series": false
  },
  "text": [
    {"value": "The bars present the relative position of a country on all the key indicators of a thematic group, compared on a common scale with the lowest, average and highest European countries values.",
     "position": "lower-right"
    }
  ],
  "titles": {
    "title": [
      {
        "prefix": "Country profile for ",
        "suffix": null,
        "facet_name": "ref-area",
        "format": "label"
      },
      {
        "prefix": ", ",
        "suffix": " indicators",
        "facet_name": "indicator-group",
        "format": "label"
      }
    ],
    "subtitle": [
      {
        "prefix": null,
        "suffix": null,
        "facet_name": "time-period",
        "format": "short_label"
      }
    ],
    "xAxisTitle": [],
    "yAxisTitle": []
  }
}