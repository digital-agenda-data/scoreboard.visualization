{
  "animation": false,
  "annotations": {
    "filters": []
  },
  "category_facet": "GEO",
  "chart_type": "columns",
  "credits": {
    "link": "http://ec.europa.eu/digital-agenda/en/graphs/",
    "text": "European Commission, Digital Scoreboard"
  },
  "facets": [
    {
      "constraints": {},
      "dimension": "FREQ",
      "label": "FREQ",
      "name": "FREQ",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "FREQ": "FREQ"
      },
      "dimension": "INDIC_ED",
      "label": "INDIC_ED",
      "name": "INDIC_ED",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "select"
    },
    {
      "constraints": {
        "FREQ": "FREQ",
        "INDIC_ED": "INDIC_ED"
      },
      "dimension": "GEO",
      "label": "GEO",
      "name": "GEO",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "multiple_select"
    },
    {
      "constraints": {
        "FREQ": "FREQ",
        "INDIC_ED": "INDIC_ED"
      },
      "dimension": "TIME_PERIOD",
      "label": "TIME_PERIOD",
      "name": "TIME_PERIOD",
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
    "INDIC_ED": {
      "facet": "INDIC_ED"
    },
    "TIME_PERIOD": {
      "facet": "TIME_PERIOD"
    }
  },
  "multiple_datasets": false,
  "multiple_series": null,
  "plotlines": {},
  "sort": {
    "by": "value",
    "each_series": false,
    "order": -1
  },
  "titles": {
    "subtitle": [
      {
        "facet_name": "TIME_PERIOD",
        "prefix": null,
        "suffix": null,
        "format": "label"
      }
    ],
    "title": [
      {
        "facet_name": "INDIC_ED",
        "prefix": null,
        "suffix": null,
        "format": "label"
      },
      {
        "facet_name": "INDIC_ED",
        "prefix": "(",
        "suffix": ")",
        "format": "notation"
      }
    ],
    "yAxisTitle": []
  },
  "tooltips": {
    "OBS_FLAG": true,
    "OBS_STATUS": true
  }
}