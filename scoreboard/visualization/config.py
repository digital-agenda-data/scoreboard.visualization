"""Common configuration constants
"""
PROJECTNAME = 'scoreboard.visualization'

ADD_PERMISSIONS = {
    'ScoreboardVisualization':
        'scoreboard.visualization: Add ScoreboardVisualization',
}

from zope.i18nmessageid.message import MessageFactory
_ = MessageFactory('scoreboard')

# This list is used for initializing new visualizations
DEFAULTS = {
    "facets": [
        {
          "constraints": {},
          "dimension": "indicator-group",
          "label": "Indicator group",
          "name": "indicator-group",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group"
          },
          "dimension": "indicator",
          "label": "Indicator",
          "sortBy": "inner_order",
          "sortOrder": "asc",
          "name": "indicator",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator"
          },
          "name": "breakdown-group",
          "dimension": "breakdown-group",
          "label": "Breakdown group",
          "sortOrder": "asc",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group"
          },
          "dimension": "breakdown",
          "label": "Breakdown",
          "name": "breakdown",
          "sortBy": "inner_order",
          "sortOrder": "asc",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group",
            "breakdown": "breakdown"
          },
          "dimension": "unit-measure",
          "label": "Unit of measure",
          "name": "unit-measure",
          "type": "select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group",
            "breakdown": "breakdown",
            "unit-measure": "unit-measure"
          },
          "dimension": "ref-area",
          "label": "Select the countries",
          "name": "ref-area",
          "type": "multiple_select"
        },
        {
          "constraints": {
            "indicator-group": "indicator-group",
            "indicator": "indicator",
            "breakdown-group": "breakdown-group",
            "breakdown": "breakdown",
            "unit-measure": "unit-measure"
          },
          "dimension": "time-period",
          "label": "Period",
          "name": "time-period",
          "type": "select"
        },
        {
          "name": "value",
          "type": "all-values",
          "dimension": "value"
        }
    ],
    "titles":
        {
          "title":
            [
                { "facet_name": "indicator",
                  "prefix": None,
                  "suffix": None,
                  "format": "label" }
            ],

          "subtitle": [ ],

          "yAxisTitle":
            [
                { "facet_name": "unit-measure",
                  "prefix": None,
                  "suffix": None,
                  "format": "short_label" }
            ]
        },

    "sort": {
        "by": 'category',
        "order": 1,
        "each_series": False
    }
}

# This list is used by country_profile chart and can be customized within
# ZMI > portal_properties > scoreboard_properties
EU = {
    "BE": "Belgium",
    "BG": "Bulgaria",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DE": "Germany",
    "EE": "Estonia",
    "IE": "Ireland",
    "EL": "Greece",
    "ES": "Spain",
    "FR": "France",
    "IT": "Italy",
    "CY": "Cyprus",
    "LV": "Latvia",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "HU": "Hungary",
    "MT": "Malta",
    "NL": "Netherlands",
    "AT": "Austria",
    "PL": "Poland",
    "PT": "Portugal",
    "RO": "Romania",
    "SI": "Slovenia",
    "SK": "Slovakia",
    "FI": "Finland",
    "SE": "Sweden",
    "UK": "United Kingdom",
    "HR": "Croatia"
}

# This list is used by country_profile chart and can be customized within
# ZMI > portal_properties > scoreboard_properties

WHITELIST = {}
