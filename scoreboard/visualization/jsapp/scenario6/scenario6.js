/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.scenario6_filters_schema = {
    facets: [
        {type: 'select',
         name: 'indicator-group',
         label: 'Indicator group',
         dimension: 'indicator-group',
         constraints: {}},
        {type: 'select',
         name: 'indicator',
         label: 'Indicator',
         dimension: 'indicator',
         constraints: {
             'indicator-group': 'indicator-group'
         }
        },
        {type: 'select',
         name: 'breakdown',
         label: 'Breakdown',
         dimension: 'breakdown',
         constraints: {
             'indicator-group': 'indicator-group',
             'indicator': 'indicator'
         }},
        {type: 'select',
         name: 'unit-measure',
         label: 'Unit of measure',
         dimension: 'unit-measure',
         constraints: {
             'indicator-group': 'indicator-group',
             'indicator': 'indicator',
             'breakdown': 'breakdown'
         }},
        {type: 'multiple_select',
         name: 'ref-area',
         label: 'Countries',
         dimension: 'ref-area',
         default_value: ['BE', 'BG', 'CZ', 'DK', 'DE', 'EE', 'IE', 'EL', 'ES', 'FR', 'IT', 'CY', 'LV', 'LT', 'LU', 'HU', 'MT', 'NL', 'AT', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE', 'UK'],
         constraints: {
             'indicator-group': 'indicator-group',
             'indicator': 'indicator',
             'breakdown': 'breakdown',
             'unit-measure': 'unit-measure'
         }},
         {type: 'all-values',
          dimension: 'time-period',
          constraints: {
              'indicator-group': 'indicator-group',
              'indicator': 'indicator',
              'breakdown': 'breakdown',
              'unit-measure': 'unit-measure'
          },
          name: 'time-period'},
         {type: 'all-values', dimension: 'value'}
    ],
    category_facet: 'ref-area',
    multiple_series: 'time-period',
    animation: true,
    plotlines: {y: 'values'},
    annotations: {
        filters: [{name: 'indicator'},
                  {name: 'breakdown-group'},
                  {name: 'breakdown'},
                  {name: 'unit-measure'}]
    },
    chart_type: 'columns',
    tooltips: {
        'unit-measure': true,
        'flag': true,
        'note': true
    },
    sort: {
        "by": "value",
        "order": -1,
    },
    labels: {
        title: {facet: 'indicator', field: 'short_label'},
        ordinate: {facet: 'unit-measure', field: 'short_label'}
    }
};


App.scenario6_initialize = function() {
    App.create_visualization($('#scenario-box')[0],
                             App.scenario6_filters_schema);
};


})(App.jQuery);
