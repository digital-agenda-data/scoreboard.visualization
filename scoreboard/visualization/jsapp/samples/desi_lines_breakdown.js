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
      "default_value": "#random",
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "Indicator group",
      "name": "indicator-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values"
    },
    {
      "constraints": {},
      "default_value": "#random",
      "dimension": "indicator",
      "ignore_values": [
        "desi_sliders"
      ],
      "label": "Indicator",
      "name": "indicator",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "indicator": "indicator"
      },
      "default_value": "#random",
      "dimension": "breakdown-group",
      "ignore_values": [],
      "label": "Breakdown group",
      "name": "breakdown-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "hidden_select"
    },
    {
      "constraints": {
        "breakdown-group": "breakdown-group",
        "indicator": "indicator"
      },
      "default_value": "#random",
      "dimension": "unit-measure",
      "label": "Unit of measure",
      "name": "unit-measure",
      "type": "hidden_select"
    },
    {
      "constraints": {
        "breakdown-group": "breakdown-group",
        "indicator": "indicator",
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
        "breakdown-group": "breakdown-group",
        "indicator": "indicator",
        "unit-measure": "unit-measure"
      },
      "default_value": "EU",
      "dimension": "ref-area",
      "label": "Country",
      "name": "ref-area",
      "position": "upper-right",
      "sortBy": "label",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "breakdown-group": "breakdown-group",
        "indicator": "indicator",
        "ref-area": "ref-area",
        "unit-measure": "unit-measure"
      },
      "dimension": "time-period",
      "label": "Time period",
      "name": "time-period",
      "type": "all-values"
    },
    {
      "dimension": "value",
      "name": "value",
      "type": "all-values"
    }
  ],
  "height": 450,
  "labels": {
    "breakdown-group": {
      "facet": "breakdown-group"
    },
    "indicator": {
      "facet": "indicator"
    },
    "unit-measure": {
      "facet": "unit-measure"
    }
  },
  "multiple_series": "breakdown",
  "series-ending-label": "none",
  "series-legend-label": "long",
  "series-point-label": "none",
  "sort": {
    "by": "category",
    "each_series": true,
    "order": 1
  },
  "titles": {
    "subtitle": [
      {
        "facet_name": "time-period",
        "format": "label",
        "prefix": null,
        "suffix": null
      }
    ],
    "title": [
      {
        "facet_name": "indicator",
        "format": "label",
        "prefix": null,
        "suffix": null
      },
      {
        "facet_name": "breakdown-group",
        "format": "label",
        "prefix": ", by ",
        "suffix": null
      }
    ],
    "xAxisTitle": [],
    "yAxisTitle": [
      {
        "facet_name": "unit-measure",
        "format": "short_label",
        "prefix": null,
        "suffix": null
      }
    ]
  },
  "tooltips": {
    "flag": true,
    "note": true,
    "unit-measure": true
  }
}