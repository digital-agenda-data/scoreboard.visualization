if(window.scoreboard === undefined){
    var scoreboard = {
        version: '1.0'
    };
};

if(scoreboard.visualization === undefined){
    scoreboard.visualization = {};
};

scoreboard.visualization.whitelist_manager = {
    dataset: null,
    whitelist: null,
    whitelist_table: '#whitelist-table',
    fragment: null,
    labels: [],

    initialize: function(){
        var self = scoreboard.visualization.whitelist_manager;
        self.dataset = $('#datasets option:selected').val();
        self.whitelist = $.parseJSON(whitelist_string);
        self.fragment = document.createDocumentFragment();

        var th_elems = $(self.whitelist_table).find('th');
        $.each(th_elems, function(idx, elem) {
            self.labels.push($(elem).text());
        });

        self.render(self.whitelist[self.dataset] || []);

        $('#datasets').on('change', function() {
            var settings = self.whitelist[this.value] || [];
            self.render(settings);
        });
    },

    render: function(dataset_settings) {
        var self = scoreboard.visualization.whitelist_manager;
        var tb = $(self.whitelist_table).find('tbody');
        self.constructTable(dataset_settings);
        self.renderTable(tb);
    },

    constructTable: function(data) {
        var self = scoreboard.visualization.whitelist_manager;

        for ( var e = 0, d_length = data.length; e < d_length; e++ ) {
            var row = $('<tr>');
            $.each(self.labels, function(idx, elem) {
                var cell = $('<td>', {
                    text: data[e][elem]
                });
                cell.appendTo(row);
            });
            self.fragment.appendChild(row[0]);
        }
    },

    renderTable: function(t_body) {
        var self = scoreboard.visualization.whitelist_manager;
        t_body.html(self.fragment);
    }
}

jQuery(document).ready(function($){
    scoreboard.visualization.whitelist_manager.initialize();
});
