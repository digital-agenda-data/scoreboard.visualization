{
  "animation": false,
  "annotations": {
    "filters": [
      {
        "name": "breakdown"
      }
    ]
  },
  "category_facet": "ref-area",
  "chart_type": "columns",
  "credits": {
      "text": "European Commission, Digital Agenda Scoreboard",
      "link": "http://ec.europa.eu/digital-agenda/en/graphs/"
  },
  "facets": [
    {
      "constraints": {},
      "dimension": "indicator-group",
      "include_wildcard": false,
      "label": "Indicator group",
      "name": "indicator-group",
      "type": "all-values",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc"
    },
    {
      "constraints": {
      },
      "dimension": "indicator",
      "label": "Indicator",
      "default_value": "dai",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "name": "indicator",
      "type": "hidden-select"
    },
    {
      "name": "breakdown-group",
      "dimension": "breakdown-group",
      "include_wildcard": false,
      "label": "Breakdown group",
      "default_value": "#random",
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "all-values",
      "constraints": {
        "indicator": "indicator"
      }
    },
    {
      "constraints": {
        "indicator": "indicator"
      },
      "dimension": "breakdown",
      "label": "Breakdown",
      "name": "breakdown",
      "default_value": ["dai_broadband", "dai_dsm", "dai_skills", "dai_iuse", "dai_psi", "dai_rdi"],
      "sortBy": "order_in_codelist",
      "sortOrder": "asc",
      "type": "composite"
    },
    {
      "constraints": {
        "indicator": "indicator"
      },
      "dimension": "unit-measure",
      "default_value": ["pc_dai"],
      "label": "Unit of measure",
      "name": "unit-measure",
      "type": "hidden-select"
    },
    {
      "constraints": {
        "indicator": "indicator",
        "unit-measure": "unit-measure"
      },
      "default_value": [
        "BE","BG","CZ","DK","DE","EE","IE","EL","ES","FR",
        "IT","CY","LV","LT","LU","HU","MT","NL","AT","PL",
        "PT","RO","SI","SK","FI","SE","UK","EU27"
      ],
      "dimension": "ref-area",
      "label": "Select the countries",
      "name": "ref-area",
      "type": "all-values"
    },
    {
      "constraints": {
        "indicator": "indicator",
        "unit-measure": "unit-measure"
      },
      "dimension": "time-period",
      "label": "Period",
      "name": "time-period",
      "sortBy": "label",
      "sortOrder": "reverse",
      "type": "select"
    },
    {
      "name": "value",
      "type": "all-values",
      "dimension": "value"
    }
  ],
  "highlights": ["EU27"],
  "labels": {
      "indicator": {
        "facet": "indicator"
      },
      "unit-measure": {
        "facet": "unit-measure"
      },
      "time-period": {
        "facet": "time-period"
      }
  },
  "multiple_series": "breakdown",
  "series-legend-label": "long",
  "series-point-label": "none",
  "sort": {
      "by": "value",
      "each_series": false,
      "order": -1
  },
  "titles": {
    "title": [
      {
        "facet_name": "indicator",
        "prefix": null,
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