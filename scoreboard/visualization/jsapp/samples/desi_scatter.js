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
  "category_facet": "ref-area",
  "chart_type": "scatter",
  "credits": {
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/",
    "text": "European Commission, Digital Scoreboard"
  },
  "facets": [
    {
      "constraints": {},
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "(X) indicator group",
      "name": "x-indicator-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values"
    },
    {
      "constraints": {},
      "default_value": "#random",
      "dimension": "indicator",
      "label": "(X) indicator",
      "name": "x-indicator",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "ignore_values": ["DESI_SLIDERS"],
      "type": "select"
    },
    {
      "constraints": {
        "indicator": "x-indicator"
      },
      "dimension": "breakdown-group",
      "label": "(X) breakdown group",
      "multidim_common": true,
      "name": "x-breakdown-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values"
    },
    {
      "constraints": {
        "indicator": "x-indicator"
      },
      "default_value": [
        "1M_websites",
        "HH_total",
        "IND_TOTAL",
        "RURAL_POP",
        "TOTAL",
        "TOTAL_FBB",
        "TOTAL_MBB",
        "TOTAL_MOB",
        "TOTAL_POP",
        "TOTAL_POPHH",
        "TOTAL_TEL",
        "ent_all_xfin",
        "orgclass_total",
        "tot_ict_products",
        "total_offers8plus"
      ],
      "dimension": "breakdown",
      "label": "(X) breakdown",
      "name": "x-breakdown",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "breakdown": "x-breakdown",
        "indicator": "x-indicator"
      },
      "default_value": "#random",
      "dimension": "unit-measure",
      "label": "(X) unit of measure",
      "name": "x-unit-measure",
      "type": "select"
    },
    {
      "constraints": {},
      "default_value": "#random",
      "dimension": "indicator-group",
      "include_wildcard": true,
      "label": "(Y) indicator group",
      "name": "y-indicator-group",
      "position": "upper-right",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values"
    },
    {
      "constraints": {},
      "default_value": "#random",
      "dimension": "indicator",
      "label": "(Y) indicator",
      "name": "y-indicator",
      "position": "upper-right",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "ignore_values": ["DESI_SLIDERS"],
      "type": "select"
    },
    {
      "constraints": {
        "indicator": "y-indicator"
      },
      "dimension": "breakdown-group",
      "label": "(Y) breakdown group",
      "multidim_common": true,
      "name": "y-breakdown-group",
      "position": "upper-right",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values"
    },
    {
      "constraints": {
        "indicator": "y-indicator"
      },
      "default_value": [
        "1M_websites",
        "HH_total",
        "IND_TOTAL",
        "RURAL_POP",
        "TOTAL",
        "TOTAL_FBB",
        "TOTAL_MBB",
        "TOTAL_MOB",
        "TOTAL_POP",
        "TOTAL_POPHH",
        "TOTAL_TEL",
        "ent_all_xfin",
        "orgclass_total",
        "tot_ict_products",
        "total_offers8plus"
      ],
      "dimension": "breakdown",
      "label": "(Y) breakdown",
      "name": "y-breakdown",
      "position": "upper-right",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "breakdown": "y-breakdown",
        "indicator": "y-indicator"
      },
      "default_value": "#random",
      "dimension": "unit-measure",
      "label": "(Y) unit of measure",
      "name": "y-unit-measure",
      "position": "upper-right",
      "type": "select"
    },
    {
      "constraints": {
        "x-breakdown": "x-breakdown",
        "x-indicator": "x-indicator",
        "x-unit-measure": "x-unit-measure",
        "y-breakdown": "y-breakdown",
        "y-indicator": "y-indicator",
        "y-unit-measure": "y-unit-measure"
      },
      "dimension": "time-period",
      "label": "DESI Period",
      "multidim_common": true,
      "name": "time-period",
      "sortBy": "notation",
      "sortOrder": "reverse",
      "type": "select"
    },
    {
      "constraints": {
        "time-period": "time-period",
        "x-breakdown": "x-breakdown",
        "x-indicator": "x-indicator",
        "x-unit-measure": "x-unit-measure",
        "y-breakdown": "y-breakdown",
        "y-indicator": "y-indicator",
        "y-unit-measure": "y-unit-measure"
      },
      "default_value": [
        "BE",
        "BG",
        "CZ",
        "DK",
        "DE",
        "EE",
        "IE",
        "EL",
        "ES",
        "FR",
        "HR",
        "IT",
        "CY",
        "LV",
        "LT",
        "LU",
        "HU",
        "MT",
        "NL",
        "AT",
        "PL",
        "PT",
        "RO",
        "SI",
        "SK",
        "FI",
        "SE",
        "UK",
        "IS",
        "NO"
      ],
      "dimension": "ref-area",
      "ignore_values": [
        "EU27",
        "EU28"
      ],
      "label": "Country / Countries",
      "multidim_common": true,
      "name": "ref-area",
      "type": "all-values"
    },
    {
      "dimension": "value",
      "multidim_value": true,
      "name": "value",
      "type": "all-values"
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
    "x-unit-measure": {
      "facet": "x-unit-measure"
    },
    "y-breakdown": {
      "facet": "y-breakdown"
    },
    "y-indicator": {
      "facet": "y-indicator"
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
      "position": "bottom-left",
      "value": ""
    },
    {
      "position": "bottom-right",
      "value": ""
    }
  ],
  "titles": {
    "subtitle": [],
    "title": [
      {
        "facet_name": "time-period",
        "format": "label",
        "prefix": null,
        "suffix": null
      }
    ],
    "xAxisTitle": [
      {
        "facet_name": "x-indicator",
        "format": "label",
        "prefix": null,
        "suffix": null
      },
      {
        "facet_name": "x-breakdown",
        "format": "label",
        "prefix": ", by ",
        "suffix": null
      },
      {
        "facet_name": "x-unit-measure",
        "format": "label",
        "prefix": " (",
        "suffix": ")"
      }
    ],
    "yAxisTitle": [
      {
        "facet_name": "y-indicator",
        "format": "label",
        "prefix": null,
        "suffix": null
      },
      {
        "facet_name": "y-breakdown",
        "format": "label",
        "prefix": "<br>by ",
        "suffix": null
      },
      {
        "facet_name": "y-unit-measure",
        "format": "label",
        "prefix": "<br>(",
        "suffix": ")"
      }
    ]
  },
  "tooltips": {
    "flag": true,
    "note": true,
    "unit-measure": true
  }
}