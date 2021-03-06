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
  "custom_properties": {
    "dai-breakdown-chart": "desi-components"
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
      "default_value": "desi_sliders",
      "dimension": "indicator",
      "ignore_values": [
        "desi",
        "desi_1_conn",
        "desi_1a1_fbbc",
        "desi_1a2_fbbtu",
        "desi_1a_fbb",
        "desi_1b1_4g",
        "desi_1b1_mbbtu",
        "desi_1b2_4g",
        "desi_1b2_mbbtu",
        "desi_1b3_spec",
        "desi_1b_mbb",
        "desi_1c1_ngac",
        "desi_1c2_sfbb",
        "desi_1c_speed",
        "desi_1d1_fbbp",
        "desi_1d1_ubbc",
        "desi_1d2_ubbta",
        "desi_1d_aff",
        "desi_1d_ultra",
        "desi_1e1_bbpi",
        "desi_1e_bbpi",
        "desi_2_hc",
        "desi_2a1_iu",
        "desi_2a2_bds",
        "desi_2a_bsu",
        "desi_2b1_ictspec",
        "desi_2b2_stemg",
        "desi_2b_asd",
        "desi_3_ui",
        "desi_3a1_news",
        "desi_3a2_mvg",
        "desi_3a3_vod",
        "desi_3a_cont",
        "desi_3b1_vidcall",
        "desi_3b2_socnet",
        "desi_3b_comm",
        "desi_3c1_bank",
        "desi_3c2_shop",
        "desi_3c_trans",
        "desi_4_idt",
        "desi_4a1_eis",
        "desi_4a2_rfid",
        "desi_4a3_socmed",
        "desi_4a4_einv",
        "desi_4a5_cloud",
        "desi_4a_bd",
        "desi_4b1_smeso",
        "desi_4b2_ecomturn",
        "desi_4b3_sellcb",
        "desi_4b_ecomm",
        "desi_5_dps",
        "desi_5a1_egovu",
        "desi_5a2_prefform",
        "desi_5a3_osercomp",
        "desi_5a4_opendata",
        "desi_5a4_psb",
        "desi_5a5_opendata",
        "desi_5a_egov",
        "desi_5b1_ehs",
        "desi_5b_ehs"
      ],
      "label": "Indicator",
      "name": "indicator",
      "sortBy": "inner_order",
      "sortOrder": "asc",
      "type": "hidden_select"
    },
    {
      "constraints": {
        "indicator": "indicator"
      },
      "default_value": {
        "desi_1_conn": 5,
        "desi_2_hc": 5,
        "desi_3_ui": 3,
        "desi_4_idt": 4,
        "desi_5_dps": 3
      },
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "breakdown",
      "position": "upper-right",
      "sortBy": "inner_order",
      "sortOrder": "asc",
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
      "highlights": [
        "EU27",
        "EU28",
        "EU"
      ],
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
    "order": -1,
    "total_stacked": true
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
  }
}