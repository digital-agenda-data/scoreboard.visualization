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
    "text": "European Commission, Digital Agenda Scoreboard"
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
      "default_value": "desi_sliders",
      "ignore_values": ["desi", "desi_1_conn", "desi_1a_comp", "desi_1a1_fpc", "desi_1b_fbb", "desi_1b1_fbbc", "desi_1b2_fbbtu", "desi_1c_mbb", "desi_1c1_mbbtu", "desi_1c2_spec", "desi_1d_speed", "desi_1d1_ngac", "desi_1d2_sfbb", "desi_1e_aff", "desi_1e1_fbbp", "desi_2_hc", "desi_2a_bsu", "desi_2a1_iu", "desi_2a2_abds", "desi_2b_asd", "desi_2b1_ictspec", "desi_2b2_stemg", "desi_3_ui", "desi_3a_cont", "desi_3a1_news", "desi_3a2_mvg", "desi_3a3_vod", "desi_3a4_iptv", "desi_3b_comm", "desi_3b1_vidcall", "desi_3b2_socnet", "desi_3c_trans", "desi_3c1_bank", "desi_3c2_shop", "desi_4_idt", "desi_4a_bd", "desi_4a1_eis", "desi_4a2_rfid", "desi_4a3_socmed", "desi_4a4_einv", "desi_4b_ecomm", "desi_4b1_smeso", "desi_4b2_ecomturn", "desi_4b3_sellcb", "desi_5_dps", "desi_5a_egov", "desi_5a1_egovu", "desi_5a2_prefform", "desi_5a3_osercomp", "desi_5b_ehealth", "desi_5b1_mdataexch", "desi_5b2_epresc"],
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
      "label": "Period",
      "name": "time-period",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
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
  "series-point-label": "none",
  "sort": {
    "by": "category",
    "each_series": false,
    "order": 1
  },
  "titles": {
    "subtitle": [],
    "title": [],
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
  },
  "custom_properties": {
     "dai-breakdown-chart": "dai-by-component"
  }
}