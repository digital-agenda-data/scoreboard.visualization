{
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
        "indicator": "indicator",
        "indicator-group": "indicator-group"
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
      "label": "Breakdown",
      "name": "breakdown",
      "position": "upper-left",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "breakdown": "breakdown",
        "indicator": "indicator",
        "indicator-group": "indicator-group"
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
        "breakdown": "breakdown",
        "indicator": "indicator",
        "indicator-group": "indicator-group",
        "unit-measure": "unit-measure"
      },
      "default_value": [
        "AT",
        "BE",
        "BG",
        "CY",
        "CZ",
        "DE",
        "DK",
        "EE",
        "EL",
        "ES",
        "EU",
        "FI",
        "FR",
        "HR",
        "HU",
        "IE",
        "IS",
        "IT",
        "LI",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "NO",
        "PL",
        "PT",
        "RO",
        "SE",
        "SI",
        "SK",
        "UK"
      ],
      "ignore_values": ["AL", "ASS", "BA", "BIH", "CH", "EU_AVERAGE", "EU_HARMONISED", "IL", "JP", "MD", "ME", "MK", "OTHER", "RS", "SL", "SP", "TR", "US", "XK"],
      "dimension": "ref-area",
      "highlights": [
        "EU27",
        "EU28",
        "EU"
      ],
      "label": "Select the countries",
      "name": "ref-area",
      "position": "upper-right",
      "sortBy": "label",
      "sortOrder": "asc",
      "type": "multiple_select"
    },
    {
      "constraints": {},
      "default_value": "#random",
      "dimension": "breakdown-group",
      "include_wildcard": true,
      "label": "Breakdown group",
      "name": "breakdown-group",
      "position": "upper-left",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values"
    },
    {
      "constraints": {
        "breakdown": "breakdown",
        "indicator": "indicator",
        "indicator-group": "indicator-group",
        "unit-measure": "unit-measure"
      },
      "dimension": "time-period",
      "label": "Period",
      "name": "time-period",
      "position": "upper-left",
      "sortBy": "notation",
      "sortOrder": "reverse",
      "type": "all-values"
    },
    {
      "dimension": "value",
      "name": "value",
      "type": "all-values"
    }
  ],
  "labels": {
    "breakdown": {
      "facet": "breakdown"
    },
    "indicator": {
      "facet": "indicator"
    },
    "unit-measure": {
      "facet": "unit-measure"
    }
  },
  "multiple_series": "time-period",
  "plotlines": {},
  "series-ending-label": "long",
  "series-legend-label": "none",
  "series-point-label": "none",
  "sort": {
    "by": "value",
    "each_series": true,
    "order": -1
  },
  "titles": {
    "subtitle": [],
    "title": [
      {
        "facet_name": "indicator",
        "format": "label",
        "prefix": null,
        "suffix": null
      },
      {
        "facet_name": "breakdown",
        "format": "label",
        "prefix": ", ",
        "suffix": null
      }
    ],
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