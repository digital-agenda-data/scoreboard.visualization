{
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
    "text": "European Commission, Digital Scoreboard",
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
  },
  "facets": [
  {
    "constraints": {},
    "label": "Dataset",
    "dimension": "__dataset",
    "name": "x-__dataset",
    "position": "upper-left",
    "sortBy": "inner_order",
    "sortOrder": "asc",
    "type": "dataset_select"
  },
  {
    "constraints": {},
    "dimension": "__dataset",
    "label": "Dataset",
    "name": "y-__dataset",
    "position": "upper-right",
    "sortBy": "inner_order",
    "sortOrder": "asc",
    "type": "dataset_select"
  },
  {
    "constraints": {
      "__dataset": "x-__dataset"
    },
    "dimension": "indicator-group",
    "include_wildcard": true,
    "label": "Indicator group",
    "name": "x-indicator-group",
    "sortBy": "order_in_codelist",
    "sortOrder": "asc",
    "default_value": "#random",
    "type": "all-values"
  },
  {
    "constraints": {
    },
    "dimension": "indicator",
    "label": "Indicator",
    "name": "x-indicator",
    "sortBy": "inner_order",
    "sortOrder": "asc",
    "default_value": "#random",
    "type": "select"
  },
  {
    "name": "x-breakdown-group",
    "label": "(X) breakdown group",
    "constraints": {
      "indicator": "x-indicator"
    },
    "dimension": "breakdown-group",
    "sortBy": "order_in_codelist",
    "sortOrder": "asc",
    "type": "all-values"
  },
  {
    "constraints": {
      "indicator": "x-indicator"
    },
    "dimension": "breakdown",
    "default_value": ["1M_websites", "HH_total", "IND_TOTAL", "RURAL_POP", "TOTAL", "TOTAL_FBB", "TOTAL_MBB", "TOTAL_MOB", "TOTAL_POP","TOTAL_POPHH", "TOTAL_TEL", "ent_all_xfin", "orgclass_total", "tot_ict_products", "total_offers8plus"],
    "label": "Breakdown",
    "name": "x-breakdown",
    "sortBy": "inner_order",
    "sortOrder": "asc",
    "type": "select"
  },
  {
    "constraints": {
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
    "constraints": {
      "__dataset": "y-__dataset"
    },
    "dimension": "indicator-group",
    "include_wildcard": true,
    "label": "Indicator group",
    "name": "y-indicator-group",
    "sortBy": "order_in_codelist",
    "sortOrder": "asc",
    "default_value": "#random",
    "position": "upper-right",
    "type": "all-values"
  },
  {
    "constraints": {
    },
    "dimension": "indicator",
    "label": "Indicator",
    "name": "y-indicator",
    "sortBy": "inner_order",
    "sortOrder": "asc",
    "default_value": "#random",
    "position": "upper-right",
    "type": "select"
  },
  {
    "name": "y-breakdown-group",
    "label": "(Y) breakdown group",
    "constraints": {
      "indicator": "y-indicator"
    },
    "dimension": "breakdown-group",
    "sortBy": "order_in_codelist",
    "sortOrder": "asc",
    "position": "upper-right",
    "type": "all-values"
  },
  {
    "constraints": {
      "indicator": "y-indicator"
    },
    "dimension": "breakdown",
    "default_value": ["1M_websites", "HH_total", "IND_TOTAL", "RURAL_POP", "TOTAL", "TOTAL_FBB", "TOTAL_MBB", "TOTAL_MOB", "TOTAL_POP","TOTAL_POPHH", "TOTAL_TEL", "ent_all_xfin", "orgclass_total", "tot_ict_products", "total_offers8plus"],
    "label": "Breakdown",
    "name": "y-breakdown",
    "sortBy": "inner_order",
    "sortOrder": "asc",
    "position": "upper-right",
    "type": "select"
  },
  {
    "constraints": {
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
      "y-breakdown": "y-breakdown",
      "x-__dataset": "x-__dataset",
      "y-__dataset": "y-__dataset"
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
      "x-__dataset": "x-__dataset",
      "y-__dataset": "y-__dataset",
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
    "multiple_datasets": true,
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
        "prefix": " and ",
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
}
