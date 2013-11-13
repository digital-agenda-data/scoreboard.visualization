/*global App, _, chroma, Kartograph */
/*jshint sub:true */

(function($) {
"use strict";

function get_value_for_code(code, series){
    if (code == 'GB'){
        code = 'UK';
    }
    if (code == 'GR'){
        code = 'EL';
    }
    var data = _.chain(series).pluck('data').first().
                 find(function(item){
                     return item['code'] == code;
                 }).value();
    if(data){
        return data['y'];
    }
}


function draw_legend(paper, colorscale, x0, y0, min, max, unit, orientation) {
    var box_width = 40;
    var box_height = 30;
    var n_boxes = 6;

    var max_value = min + (min + max) / (n_boxes - 1) * n_boxes;
    var magnitude = (max_value>0)?Math.floor(Math.log(max_value) / Math.LN10):0;
    var multiply = (magnitude>3)?'x10^' + magnitude + " ":"";
    _(_.range(n_boxes)).forEach(function(n) {
        var x = x0;
        var y = y0;
        if (orientation == 'vertical'){
            y = y0 + box_height * n;
        }
        else{
            x = x0 + box_width * n;
        }
        var value = min + (min + max) / (n_boxes - 1) * n;
        var color = colorscale.getColor(value);
        var text = "";
        if (unit.is_pc){
            text += Math.floor(value);
        }
        else{
            var print_value = value;
            if (magnitude > 3){
                if (value>0){
                    print_value = print_value / Math.pow(10, magnitude);
                }
                text += App.round(print_value, 4);
            }
            else{
                text += App.round(value, 4);
            }
        }
        if (orientation == 'vertical'){
            paper.rect(x0 + 35, y, box_width, box_height).attr({fill: color});
            paper.text(x0 + box_width + 80, y + box_height/2, text).attr({
                'font-size': '12',
                'text-anchor': 'end',
                'font-family': 'Segoe UI, Verdana, Arial, sans-serif'});
        }
        else{
            paper.rect(x, y0, box_width, box_height).attr({fill: color});
            paper.text(x + box_width/2, y0 + box_height + 10, text);
        }
    });
    //paper.text(x0 + box_width * (n_boxes + 1/2), y0 + box_height + 10, unit);
    if (orientation == 'vertical'){
        paper.text(x0 + 10, y0 + box_height * n_boxes/2, multiply + unit.text).attr({
                'font-size': '14',
                'text-anchor': 'middle',
                'font-family': 'Segoe UI, Verdana, Arial, sans-serif'
        }).rotate(270);
    }
    else{
        paper.text(x0 + box_width * n_boxes / 2, y0 + box_height + 20, multiply + unit.text);
    }
};


App.chart_library['map'] = function(view, options) {
    var container = view.el
    var map_div = $('<div/>').addClass('map-chart');
    /*$(container).empty().append($('<p>', {
        'id': 'map-title',
        'text': options.titles.title
    }));
    */
    $(container).append(map_div);

    // add a form to request a png download
    $(container).append(
        $('<form method="POST" action="' + App.URL + '/svg2png"></form>').append(
            $("<input/>").attr("type", "hidden").attr("name", "svg")
        ).append(
            $("<input/>").attr("type", "submit").attr("value", "Download").addClass('mapExportPngButton')
        )
    );

    var series = App.format_series(
                    options['series'],
                    options['sort'],
                    options['multidim'],
                    options['unit_is_pc'],
                    options['category_facet'],
                    options['highlights']);

    var max_value = _.chain(series).pluck('data').
                      first().pluck('y').max().value();
    var colorscale = new chroma.ColorScale({
        colors: chroma.brewer['YlOrBr'],
        limits: [0, max_value]
    });
    var unit = options['meta_data']['unit-measure'];

    var n = 0;
    var map = Kartograph.map(map_div[0], 1000, 845);
    App.kartograph_map = map;
    map.loadMap(App.JSAPP + '/europe.svg', function() {
        map.addLayer('countries', {
            titles: function(feature) {
                return feature.id;
            },
            styles: {
                stroke: '0.5px'
            },
            tooltips: function(feature) {
                var code = feature['code'];
                var value = get_value_for_code(code, series);
                var name = (code == 'MK'
                            ? name = "Macedonia, FYR"
                            : feature['name']);
                var value_text = (value
                                  ? App.round(value, 3) + ' ' + unit.short_label
                                  : 'n/a');
                return [name, value_text];
            }
        });
        map.getLayer('countries').style({
            fill: function(feature) {
                var value = get_value_for_code(feature.code, series);
                if(_.isUndefined(value)) {
                    return '#ccc';
                }
                else {
                    return colorscale.getColor(value);
                }
            }
        });

        //horizontal
        /*
        draw_legend(map.paper, colorscale, 10, 420, 0, max_value,
                {text: unit, is_pc: options.unit_is_pc[0]});
        */
        //vertical
        draw_legend(map.paper, colorscale, 10, 300, 0, max_value,
                {text: unit.short_label, is_pc: options.unit_is_pc[0]},
                'vertical');
        // add title
        map.paper.rect(0, 0, 1000, 25).attr({fill: '#FEFEFE', 'stroke-width': 0});
        map.paper.text(500, 10, options.titles.title).attr({
            'font-size': '16',
            'font-weight': 'bold',
            'text-anchor': 'middle',
            'font-family': '"Segoe UI Semibold", Verdana, Arial, sans-serif'
        });
        // load svg html into the form for png download
        // use toSVG function provided by raphael.export.js (IE 8 compatibility)
        $("input[name='svg']").val(map.paper.toSVG());
    });

    var metadata = {
        'chart-title': options.titles.title,
        'chart-subtitle': options.titles.subtitle,
        'chart-xAxisTitle': options.titles.xAxisTitle,
        'chart-yAxisTitle': options.titles.yAxisTitle,
        'source-dataset': options.credits.text,
        'chart-url': document.URL,
        'filters-applied': _(this.model.attributes).pairs()
    };
    view.trigger('chart_ready', series, metadata);
};

})(App.jQuery);
