{
  "chart_type": "polar",
  "series-legend-label": "long",
  "series-point-label": "long",
  "category_facet": "indicator",
  "multiple_series": null,
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
      "name": "ref-area",
      "label": "Country",
      "dimension": "ref-area",
      "default_value": "#random",
      "sortBy": "label",
      "sortOrder": "asc",
      "constraints": {
        "indicator-group": "indicator-group"
      }
    },
    {
      "type": "select",
      "name": "time-period",
      "label": "Period",
      "dimension": "time-period",
      "sortBy": "label",
      "sortOrder": "reverse",
      "constraints": {
        "indicator-group": "indicator-group",
        "ref-area": "ref-area"
      }
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "ref-area": "ref-area",
        "time-period": "time-period"
      },
      "dimension": "indicator",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "name": "indicator",
      "type": "whitelist",
      "label": "Indicator"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "ref-area": "ref-area",
        "time-period": "time-period"
      },
      "dimension": "breakdown",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "name": "breakdown",
      "type": "whitelist",
      "label": "Breakdown"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "ref-area": "ref-area",
        "time-period": "time-period"
      },
      "dimension": "unit-measure",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "name": "unit-measure",
      "type": "whitelist",
      "label": "Unit"
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
    "by": "category",
    "order": -1,
    "each_series": true
  },
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