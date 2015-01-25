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
      "default_value": "dai",
      "ignore_values": ["dai_broadband", "dai_skills", "dai_dsm", "dai_psi", "dai_rdi", "dai_iuse"],
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