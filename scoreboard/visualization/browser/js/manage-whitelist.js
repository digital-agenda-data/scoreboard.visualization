if(window.scoreboard === undefined){
    var scoreboard = {
        version: '1.0'
    };
}

if(scoreboard.visualization === undefined){
    scoreboard.visualization = {};
}

scoreboard.visualization.whitelist_manager = {
    whitelist: null,
    whitelist_table: '#whitelist-table',
    fragment: null,
    labels: [],
    table: '',
    no_rows: 0,

    initialize: function(){
        var self = scoreboard.visualization.whitelist_manager;
        var dataset = jQuery('#datasets option:selected').val();
        self.whitelist = whitelist;
        self.fragment = document.createDocumentFragment();
        self.render(self.getWhitelistSettings(dataset));

        jQuery('#datasets').on('change', function() {
            self.labels = [];
            self.no_rows = 0;
            self.render(self.getWhitelistSettings(this.value));
        });
    },

    getWhitelistSettings: function(key) {
        var self = scoreboard.visualization.whitelist_manager;
        var dataset_settings = self.whitelist[key];
        if (dataset_settings) {
            return dataset_settings.whitelist;
        }
        return [];
    },
    render: function(dataset_settings) {
        var self = scoreboard.visualization.whitelist_manager;
        self.constructTable(dataset_settings);
        self.renderTable();
    },

    constructTable: function(data) {
        var self = scoreboard.visualization.whitelist_manager;
        var table = jQuery(self.whitelist_table);
        var thead = table.find('thead');

        for ( var e = 0, d_length = data.length; e < d_length; e++ ) {
            if (self.labels.length <=0) {
                thead.html('');
                var hrow = jQuery('<tr>', {
                    'class': 'whitelist-head-row'
                });
                for(var prop in data[e]) {
                    if(data[e].hasOwnProperty(prop)) {
                        var hcell = jQuery('<th>', {
                            text: prop
                        });
                        hcell.appendTo(hrow);
                        self.labels.push(prop);
                    }
                }
                thead.append(hrow);
            }

            var brow = jQuery('<tr>', {
                'class': 'whitelist-body-row'
            });
            jQuery.each(self.labels, function(idx, elem) {
                var cell = jQuery('<td>', {
                    text: data[e][elem]
                });
                cell.appendTo(brow);
            });
            self.fragment.appendChild(brow[0]);
            self.no_rows += 1;
        }
    },

    renderTable: function() {
        var self = scoreboard.visualization.whitelist_manager;
        if (self.no_rows > 0) {
            jQuery(self.whitelist_table).find('tbody').html(self.fragment);
            jQuery(self.whitelist_table).show();
        } else {
            jQuery(self.whitelist_table).hide();
        }
    }
};

jQuery(document).ready(function(){
    scoreboard.visualization.whitelist_manager.initialize();
});
