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
        "name": "unit-measure"
      }
    ]
  },
  "category_facet": "ref-area",
  "chart_type": "columns",
  "credits": {
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/",
    "text": "European Commission, Digital Scoreboard"
  },
  "facets": [
    {
      "constraints": {},
      "dimension": "indicator-group",
      "label": "Indicator group",
      "name": "indicator-group",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "ignore"
    },
    {
      "constraints": {},
      "dimension": "indicator",
      "label": "Indicator",
      "name": "indicator",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "default_value": "DESI_SLIDERS",
      "ignore_values": [
        "DESI", 
        "DESI_1_CONN",
        "DESI_1A1_FBBC",
        "DESI_1A2_FBBTU",
        "DESI_1A_FBB",
        "DESI_1B1_4G",
        "DESI_1B2_MBBTU",
        "DESI_1B_MBB",
        "DESI_1C1_NGAC",
        "DESI_1C2_SFBB",
        "DESI_1C_SPEED",
        "DESI_1D1_UBBC",
        "DESI_1D2_UBBTA",
        "DESI_1D_ULTRA",
        "DESI_1E1_BBPI",
        "DESI_1E_BBPI",
        "DESI_2_HC",
        "DESI_2A1_IU",
        "DESI_2A2_BDS",
        "DESI_2A_BSU",
        "DESI_2B1_ICTSPEC",
        "DESI_2B2_STEMG",
        "DESI_2B_ASD",
        "DESI_3_UI",
        "DESI_3A1_NEWS",
        "DESI_3A2_MVG",
        "DESI_3A3_VOD",
        "DESI_3A_CONT",
        "DESI_3B1_VIDCALL",
        "DESI_3B2_SOCNET",
        "DESI_3B_COMM",
        "DESI_3C1_BANK",
        "DESI_3C2_SHOP",
        "DESI_3C_TRANS",
        "DESI_4_IDT",
        "DESI_4A1_EIS",
        "DESI_4A2_RFID",
        "DESI_4A3_SOCMED",
        "DESI_4A4_EINV",
        "DESI_4A5_CLOUD",
        "DESI_4A_BD",
        "DESI_4B1_SMESO",
        "DESI_4B2_ECOMTURN",
        "DESI_4B3_SELLCB",
        "DESI_4B_ECOMM",
        "DESI_5_DPS",
        "DESI_5A1_EGOVU",
        "DESI_5A2_PREFFORM",
        "DESI_5A3_OSERCOMP",
        "DESI_5A4_PSB",
        "DESI_5A5_OPENDATA",
        "DESI_5A_EGOV",
        "DESI_5B1_EHS",
        "DESI_5B_EHS"
      ],
      "type": "hidden_select"
    },
    {
      "constraints": {
        "indicator": "indicator"
      },
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "breakdown",
      "position": "upper-right",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "default_value": {"DESI_1_CONN":5,"DESI_2_HC":5,"DESI_3_UI":3,"DESI_4_IDT":4,"DESI_5_DPS":3},
      "type": "composite"
    },
    {
      "constraints": {
        "indicator": "indicator"
      },
      "dimension": "unit-measure",
      "label": "Unit of measure",
      "name": "unit-measure",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "hidden_select"
    },
    {
      "constraints": {
        "unit-measure": "unit-measure"
      },
      "dimension": "time-period",
      "label": "DESI Period",
      "name": "time-period",
      "sortBy": "notation",
      "sortOrder": "reverse",
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
      "type": "all-values"
    },
    {
      "constraints": {
        "indicator": "indicator",
        "time-period": "time-period",
        "unit-measure": "unit-measure"
      },
      "dimension": "ref-area",
      "highlights": ["EU27", "EU28", "EU"],
      "label": "Select the countries",
      "name": "ref-area",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
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
  "multiple_datasets": false,
  "multiple_series": "breakdown",
  "series-legend-label": "long",
  "series-point-label": "long",
  "sort": {
    "by": "value",
    "each_series": false,
    "total_stacked": true,
    "order": -1
  },
  "titles": {
    "subtitle": [
      {
        "facet_name": "time-period",
        "prefix": null,
        "suffix": null,
        "format": "label"
      }
    ],
    "title": [
      {
        "facet_name": "indicator",
        "prefix": null,
        "suffix": null,
        "format": "label"
      }
    ],
    "yAxisTitle": [
      {
        "facet_name": "unit-measure",
        "format": "label",
        "prefix": null,
        "suffix": null
      }
    ]
  },
  "tooltips": {
    "flag": true,
    "note": true,
    "unit-measure": true
  },
  "custom_properties": {
     "dai-breakdown-chart": "desi-components"
  }
}