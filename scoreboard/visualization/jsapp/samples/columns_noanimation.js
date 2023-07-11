{
  "animation": false,
  "annotations": {
    "filters": [
      {
        "name": "indicator"
      },
      {
        "name": "breakdown"
      },
      {
        "name": "time-period"
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
        "1m_websites",
        "hh_total",
        "ind_total",
        "rural_pop",
        "total",
        "total_fbb",
        "total_mbb",
        "total_mob",
        "total_pop",
        "total_pophh",
        "total_tel",
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
        "indicator-group": "indicator-group",
        "time-period": "time-period"
      },
      "default_value": "#random",
      "dimension": "unit-measure",
      "label": "Unit of measure",
      "name": "unit-measure",
      "position": "upper-right",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "breakdown": "breakdown",
        "indicator": "indicator",
        "indicator-group": "indicator-group",
        "time-period": "time-period",
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
        "IT",
        "LT",
        "LU",
        "LV",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SE",
        "SI",
        "SK"
      ],
      "dimension": "ref-area",
      "highlights": [
        "EU"
      ],
      "ignore_values": [
        "AL",
        "ASS",
        "BA",
        "BIH",
        "CH",
        "EU_AVERAGE",
        "EU_HARMONISED",
        "IL",
        "JP",
        "MD",
        "ME",
        "MK",
        "OTHER",
        "RS",
        "SL",
        "SP",
        "TR",
        "US",
        "XK"
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
        "indicator-group": "indicator-group"
      },
      "dimension": "time-period",
      "label": "Period",
      "name": "time-period",
      "position": "upper-left",
      "sortBy": "notation",
      "sortOrder": "reverse",
      "type": "select"
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
    "time-period": {
      "facet": "time-period"
    },
    "unit-measure": {
      "facet": "unit-measure"
    }
  },
  "multiple_series": null,
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