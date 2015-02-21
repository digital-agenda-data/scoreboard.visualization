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
  "credits": {
    "text": "European Commission, Digital Agenda Scoreboard",
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
  },
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
      "type": "all-values"
    },
    {
      "constraints": {
      },
      "dimension": "indicator",
      "ignore_values": ["DESI_SLIDERS", "DESI_1A_COMP", "DESI_1A1_FPC", "DESI_1A1_FBBC", "DESI_1A2_FBBTU",
      "DESI_1B1_FBBC", "DESI_1B1_MBBTU", "DESI_1B2_FBBTU", "DESI_1B2_SPEC",
      "DESI_1C1_MBBTU", "DESI_1C1_NGAC", "DESI_1C2_SPEC", "DESI_1C2_SFBB",
      "DESI_1D1_NGAC", "DESI_1D2_SFBB", "DESI_1D1_FBBP", "DESI_1E1_FBBP", 
      "DESI_2A1_IU", "DESI_2A2_ABDS", "DESI_2A2_BDS", "DESI_2B1_ICTSPEC", "DESI_2B2_STEMG", 
      "DESI_3A1_NEWS", "DESI_3A2_MVG", "DESI_3A3_VOD", "DESI_3A4_IPTV", "DESI_3B1_VIDCALL", "DESI_3B2_SOCNET", "DESI_3C1_BANK", "DESI_3C2_SHOP", 
      "DESI_4A1_EIS", "DESI_4A2_RFID", "DESI_4A3_SOCMED", "DESI_4A4_EINV", "DESI_4A5_CLOUD", "DESI_4B1_SMESO", "DESI_4B2_ECOMTURN", "DESI_4B3_SELLCB", 
      "DESI_5A1_EGOVU", "DESI_5A2_PREFFORM", "DESI_5A3_OSERCOMP", "DESI_5A4_OPENDATA", "DESI_5B1_MDATAEXCH", "DESI_5B2_EPRESC"],
      "label": "Indicator",
      "name": "indicator",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "type": "select"
    },
    {
      "constraints": {
        "indicator": "indicator"
      },
      "dimension": "breakdown-group",
      "label": "Breakdown group",
      "name": "breakdown-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "default_value": "#random",
      "ignore_values": ["DESI_TOTALS"],
      "type": "select"
    },
    {
      "constraints": {
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
        "indicator": "indicator",
        "breakdown-group": "breakdown-group",
        "unit-measure": "unit-measure"
      },
      "dimension": "ref-area",
      "default_value": "EU28",
      "label": "Country",
      "name": "ref-area",
      "sortBy": "label",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
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
        "facet_name": "time-period",
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
