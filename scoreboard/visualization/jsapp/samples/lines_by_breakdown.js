{
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
  "axis-horizontal-rotated": false,
  "axis-horizontal-title": "none",
  "axis-vertical-title": "short",
  "category_facet": "time-period",
  "chart_type": "lines",
  "facets": [
    {
      "constraints": {},
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "Indicator group",
      "name": "indicator-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group"
      },
      "dimension": "indicator",
      "label": "Indicator",
      "name": "indicator",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator"
      },
      "dimension": "breakdown-group",
      "label": "Breakdown group",
      "name": "breakdown-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group"
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
        "unit-measure": "unit-measure"
      },
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "breakdown",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group",
        "unit-measure": "unit-measure"
      },
      "dimension": "ref-area",
      "default_value": "EU",
      "ignore_values": ["AL", "ASS", "BA", "BIH", "CH", "EU_AVERAGE", "EU_HARMONISED", "IL", "JP", "MD", "ME", "MK", "OTHER", "RS", "SL", "SP", "TR", "US", "XK"],
      "label": "Country",
      "name": "ref-area",
      "sortBy": "label",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group",
        "indicator": "indicator",
        "breakdown-group": "breakdown-group",
        "unit-measure": "unit-measure",
        "ref-area": "ref-area"
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
  "height": 450,
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
    "ref-area": {
        "facet": "ref-area"
    }
  },
  "multiple_series": "breakdown",
  "series-legend-label": "long",
  "series-ending-label": "none",
  "series-point-label": "none",
  "sort": {
    "by": "category",
    "order": 1,
    "each_series": true
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
        "facet_name": "ref-area",
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
}