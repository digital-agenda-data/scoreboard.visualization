/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario3_scatter_animation_filters_schema = {
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
        {type: 'all-values',
         multidim_common: true,
         name: 'time-period',
         sortBy: 'label',
         sortOrder: 'reverse', 
         dimension: 'time-period',
         constraints: {
             'x-indicator':    'x-indicator',
             'x-breakdown':    'x-breakdown',
             'x-unit-measure': 'x-unit-measure',
             'y-indicator':    'y-indicator',
             'y-breakdown':    'y-breakdown',
             'y-unit-measure': 'y-unit-measure'
         }},
        {type: 'multiple_select',
         multidim_common: true,
         name: 'ref-area',
         label: 'Country / Countries',
         dimension: 'ref-area',
         default_value: ['BE', 'BG', 'CZ', 'DK', 'DE', 'EE', 'IE', 'EL', 'ES', 'FR', 'IT', 'CY', 'LV', 'LT', 'LU', 'HU', 'MT', 'NL', 'AT', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE', 'UK'],
         constraints: {
             'x-indicator':    'x-indicator',
             'x-breakdown':    'x-breakdown',
             'x-unit-measure': 'x-unit-measure',
             'y-indicator':    'y-indicator',
             'y-breakdown':    'y-breakdown',
             'y-unit-measure': 'y-unit-measure'
         }},
         {type: 'all-values', dimension: 'value', multidim_value: true}
    ],
    category_facet: 'ref-area',
    multiple_series: 'time-period',
    annotations: {
        filters: [{name: 'x-indicator'},
                  {name: 'x-breakdown-group'},
                  {name: 'x-breakdown'},
                  {name: 'x-unit-measure'},
                  {name: 'y-indicator'},
                  {name: 'y-breakdown-group'},
                  {name: 'y-breakdown'},
                  {name: 'y-unit-measure'}]
    },
    chart_type: 'scatter',
    multidim: 2,
    legend: true,
    plotlines: {x: 'values', y: 'values'},
    animation: true,
    labels: {
        title_x: {facet: 'x-indicator', field: 'short_label'},
        title_y: {facet: 'y-indicator', field: 'short_label'},
        x_unit_label: {facet: 'x-unit-measure', field: 'short_label'},
        y_unit_label: {facet: 'y-unit-measure', field: 'short_label'}
    }
};


App.scenario3_scatter_animation_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario3_scatter_animation_filters_schema);
};


})(App.jQuery);
