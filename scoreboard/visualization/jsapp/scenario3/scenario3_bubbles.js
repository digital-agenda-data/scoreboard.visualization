/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario3_bubbles_filters_schema = {
    facets: [
        {type: 'select',
         name: 'x-indicator-group',
         label: "(X) indicator group",
         dimension: 'indicator-group',
         constraints: {}},
        {type: 'select',
         name: 'x-indicator',
         label: "(X) indicator",
         dimension: 'indicator',
         constraints: {
             'indicator-group': 'x-indicator-group'
         }},
        {type: 'select',
         name: 'x-breakdown-group',
         label: "(X) breakdown group",
         dimension: 'breakdown-group',
         constraints: {
             'indicator':       'x-indicator'
         }},
        {type: 'select',
         name: 'x-breakdown',
         label: "(X) breakdown",
         dimension: 'breakdown',
         constraints: {
             'indicator':       'x-indicator',
             'breakdown-group': 'x-breakdown-group'
         }},
        {type: 'select',
         name: 'x-unit-measure',
         label: "(X) unit of measure",
         dimension: 'unit-measure',
         constraints: {
             'indicator':       'x-indicator',
             'breakdown':       'x-breakdown'
         }},

        {type: 'select',
         name: 'y-indicator-group',
         label: "(Y) indicator group",
         dimension: 'indicator-group',
         constraints: {}},
        {type: 'select',
         name: 'y-indicator',
         label: "(Y) indicator",
         dimension: 'indicator',
         constraints: {
             'indicator-group': 'y-indicator-group'
         }},
        {type: 'select',
         name: 'y-breakdown-group',
         label: "(Y) breakdown group",
         dimension: 'breakdown-group',
         constraints: {
             'indicator':       'y-indicator'
         }},
        {type: 'select',
         name: 'y-breakdown',
         label: "(Y) breakdown",
         dimension: 'breakdown',
         constraints: {
             'indicator':       'y-indicator',
             'breakdown-group': 'y-breakdown-group'
         }},
        {type: 'select',
         name: 'y-unit-measure',
         label: "(Y) unit of measure",
         dimension: 'unit-measure',
         constraints: {
             'indicator':       'y-indicator',
             'breakdown':       'y-breakdown'
         }},
        {type: 'select',
         name: 'z-indicator-group',
         label: "(Z) indicator group",
         dimension: 'indicator-group',
         constraints: {}},
        {type: 'select',
         name: 'z-indicator',
         label: "(Z) indicator",
         dimension: 'indicator',
         constraints: {
             'indicator-group': 'z-indicator-group'
         }},
        {type: 'select',
         name: 'z-breakdown-group',
         label: "(Z) breakdown group",
         dimension: 'breakdown-group',
         constraints: {
             'indicator':       'x-indicator'
         }},
        {type: 'select',
         name: 'z-breakdown',
         label: "(Z) breakdown",
         dimension: 'breakdown',
         constraints: {
             'indicator':       'z-indicator',
             'breakdown-group': 'z-breakdown-group'
         }},
        {type: 'select',
         name: 'z-unit-measure',
         label: "(Z) unit of measure",
         dimension: 'unit-measure',
         constraints: {
             'indicator':       'z-indicator',
             'breakdown':       'z-breakdown'
         }},
        {type: 'select',
         xyz: true,
         name: 'time-period',
         label: "Year",
         dimension: 'time-period',
         constraints: {
             'x-indicator':    'x-indicator',
             'x-breakdown':    'x-breakdown',
             'x-unit-measure': 'x-unit-measure',
             'y-indicator':    'y-indicator',
             'y-breakdown':    'y-breakdown',
             'y-unit-measure': 'y-unit-measure',
             'z-indicator':    'z-indicator',
             'z-breakdown':    'z-breakdown',
             'z-unit-measure': 'z-unit-measure'
         }},
        {type: 'multiple_select',
         xyz: true,
         name: 'ref-area',
         on_client: true,
         label: 'Country / Countries',
         dimension: 'ref-area',
         default_all: true,
         position: '.right_column',
         constraints: {
             'x-indicator':    'x-indicator',
             'x-breakdown':    'x-breakdown',
             'x-unit-measure': 'x-unit-measure',
             'y-indicator':    'y-indicator',
             'y-breakdown':    'y-breakdown',
             'y-unit-measure': 'y-unit-measure',
             'z-indicator':    'z-indicator',
             'z-breakdown':    'z-breakdown',
             'z-unit-measure': 'z-unit-measure',
             'time-period': 'time-period'
         }},
         {type: 'all-values', dimension: 'value', xyz: true}
    ],
    category_facet: 'ref-area',
    annotations: {
        source: '/dimension_value_metadata',
        filters: [{name: 'x-indicator', part: 'label'},
                  {name: 'x-breakdown-group', part: 'label'},
                  {name: 'x-breakdown', part: 'label'},
                  {name: 'x-unit-measure', part: 'label'},
                  {name: 'y-indicator', part: 'label'},
                  {name: 'y-breakdown-group', part: 'label'},
                  {name: 'y-breakdown', part: 'label'},
                  {name: 'y-unit-measure', part: 'label'}]
    },
    chart_type: 'bubbles',
    xyz: true,
    plotlines: {x: 'values', y: 'values'},
    chart_meta_labels: [
        {targets: ['indicator_x_label'],
         filter_name: 'x-indicator',
         type: 'short_label'},
        {targets: ['indicator_y_label'],
         filter_name: 'y-indicator',
         type: 'short_label'},
        {targets: ['period_label'],
         filter_name: 'time-period',
         type: 'label'},
        {targets: ['x_unit_label'],
         filter_name: 'x-unit-measure',
         type: 'short_label'},
        {targets: ['y_unit_label'],
         filter_name: 'y-unit-measure',
         type: 'short_label'},
        {targets: ['z_unit_label'],
         filter_name: 'z-unit-measure',
         type: 'short_label'}
    ]
};


App.scenario3_bubbles_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario3_bubbles_filters_schema);
};


})(App.jQuery);