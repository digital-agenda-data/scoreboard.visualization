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
    ],
    "title": "Definitions and scopes"
  },
  "category_facet": "breakdown",
  "chart_type": "columns",
  "credits": {
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/",
    "text": "European Commission, Digital Agenda Scoreboard"
  },
  "facets": [
    {
      "constraints": {},
      "default_value": "#random",
      "ignore_values": ["mobile", "internet-usage", "audiovisual", "egovernment", "ecommerce", "ebusiness", "ict-skills", "ict-sector", "research_eInfra"],
      "dimension": "indicator-group",
      "include_wildcard": false,
      "label": "Indicator group",
      "name": "indicator-group",
      "position": "upper-left",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "hidden_select"
    },
    {
      "constraints": {
        "indicator-group": "indicator-group"
      },
      "default_value": "#random",
      "ignore_values": ["spectrum_WBB", "pay_on_time_projects", "avg_ttg", "ttg_in_scope", "epsi_score", "e_cc_pcpu", "e_CC_GE_ME", "e_cc", "eoa_VoD_estab_otheu", "eoa_Tvchannels_tarfor", "ICT_commit_in_trp", "i_iuse", "i_iu3", "i_ilt12", "i_bfeu", "i_iugov12", "eoa_nn_films", "e_rfpsas", "E_ITSPVAC2", "ict_hgc", "c1_compcyclesprace", "c1_compcyclesegi", "c1_datatraffic", "c1_bandwidth"],
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
      "default_value": "#random",
      "dimension": "breakdown-group",
      "include_wildcard": false,
      "label": "Breakdown group",
      "name": "breakdown-group",
      "position": "upper-left",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "breakdown-group": "breakdown-group",
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
        "breakdown-group": "breakdown-group",
        "indicator": "indicator",
        "indicator-group": "indicator-group",
        "unit-measure": "unit-measure"
      },
      "default_value": [
        "EU27",
        "#random"
      ],
      "dimension": "ref-area",
      "highlights": [],
      "label": "Select the countries",
      "name": "ref-area",
      "position": "upper-left",
      "sortBy": "label",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "breakdown-group": "breakdown-group",
        "indicator": "indicator",
        "indicator-group": "indicator-group",
        "unit-measure": "unit-measure",
        "ref-area": "ref-area"
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
      "constraints": {
        "breakdown-group": "breakdown-group",
        "indicator": "indicator",
        "indicator-group": "indicator-group",
        "unit-measure": "unit-measure",
        "ref-area": "ref-area"
      },
      "dimension": "breakdown",
      "default_value": ["SO_01","SO_02","SO_03","SO_04","SO_05","SO_06","SO_07","SO_08","SO_09","SO_10","SO_11","SO_12","SO_13","SO_14","SO_15","SO_16","SO_17","SO_18","SO_19","SO_20","SO_21","SO_22_1","SO_22_2","SO_22_3","SO_23","SO_24","SO_25","SO_26","eInfra","Total_SOs"],
      "highlights": ["Total_SOs"],
      "label": "Breakdown",
      "name": "breakdown",
      "position": "upper-right",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "multiple_select"
    },
    {
      "dimension": "value",
      "name": "value",
      "type": "all-values"
    }
  ],
  "labels": {
    "breakdown-group": {
      "facet": "breakdown-group"
    },
    "indicator": {
      "facet": "indicator"
    },
    "unit-measure": {
      "facet": "unit-measure"
    },
    "ref-area": {
      "facet": "ref-area"
    }
  },
  "multiple_series": "time-period",
  "series-legend-label": "none",
  "series-point-label": "short",
  "sort": {
    "by": "order",
    "each_series": false,
    "order": 1
  },
  "titles": {
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
    "xAxisTitle": [
      {
        "prefix": null,
        "suffix": null,
        "facet_name": "breakdown",
        "format": "short_label"
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