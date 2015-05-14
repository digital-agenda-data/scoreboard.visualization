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
        return isNaN(data['y'])?null:data['y'];
    }
}

function wordwrap( str, width, brk, cut ) {
    brk = brk || '\n';
    width = width || 75;
    cut = cut || false;
    if (!str) { return str; }
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
    return str.match( RegExp(regex, 'g') ).join( brk );
}

function draw_legend(paper, colorscale, x0, y0, min, max, unit, orientation, legend_width, legend_height, n_b) {
    var box_width = legend_width;
    var box_height = legend_height;
    var n_boxes = n_b;

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

    var is_embedded = false;
    var n_boxes = 6;
    var viewPortWidth = _.min([$(window).width(), 1130])-30;
    var legendWidth = _.min([viewPortWidth * 0.04, 40]);
    var legendHeight = 20;
    var viewPortHeight = _.min([$(window).height()-100, 845]);
    if ( App.visualization.embedded ) {
        viewPortHeight = _.min([$(window).height(), 470]) - 20;
        is_embedded = true;
    }

    // add a form to request a png download if not embbeded
    if(!is_embedded || (is_embedded && viewPortWidth > 500))
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

    _(series).each(function(serie) {
        _(serie.data).map(function(point){
            if ( point.y == null || isNaN(point.y) ) {
                point.isNA = true;
                point.y = null;
            } else {
                point.isNA = false;
            }
        });
    });
    var max_value = _.chain(series).pluck('data').
                      first().pluck('y').max().value();
    var colorscale = new chroma.ColorScale({
        colors: chroma.brewer['YlOrBr'],
        limits: [0, max_value]
    });
    var unit = options['meta_data']['unit-measure'];

    var map = Kartograph.map(map_div[0], viewPortWidth, viewPortHeight);
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
                                  ? App.round(value, 3) + ' ' + (unit == null?'':unit.short_label)
                                  : 'n/a');
                return [name, value_text];
            }
        });
        map.getLayer('countries').style({
            fill: function(feature) {
                var value = get_value_for_code(feature.code, series);
                if(_.isUndefined(value) || value == null || isNaN(value)) {
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
        if(!is_embedded || (is_embedded && viewPortWidth>500))
            draw_legend(map.paper, colorscale, 10, viewPortHeight/2 - n_boxes/2 * legendHeight + 2* legendHeight, 0, max_value,
                    {text: (unit == null?'':unit.short_label), is_pc: options.unit_is_pc[0]},
                    'vertical',
                    legendWidth, legendHeight, n_boxes);

        // add title over a white box
        var char_per_row;
        var font_size;
        if(viewPortWidth > 900) {char_per_row = 110; font_size = 16;} else
        if(viewPortWidth > 600) {char_per_row = 80;  font_size = 14;} else
        if(viewPortWidth > 400) {char_per_row = 60;  font_size = 11;} else
                                {char_per_row = 50;  font_size = 11;}

        var title = wordwrap(options.titles.title, char_per_row, '\n');
        var lines = (title.match(/\n/g)||[]).length + 1;
        if(viewPortWidth>500) {
            map.paper.rect(0, 0, viewPortWidth, lines*20).attr({fill: '#FEFEFE', 'stroke-width': 0});
            map.paper.text(0.5 * viewPortWidth, 20*lines/2, title).attr({
                'font-size': font_size,
                'font-weight': 'bold',
                'text-anchor': 'middle',
                'font-family': 'Verdana, Arial, sans-serif'
            });
        }
        else {
            map.paper.rect(0, 0, viewPortWidth, 20).attr({fill: '#FEFEFE', 'stroke-width': 0});
            var row_text = title.split('\n')[0];
            map.paper.text(0.5 * viewPortWidth, 10,
                           row_text.substring(0, row_text.length-6).concat('...')).attr({
                'font-size': font_size,
                'font-weight': 'bold',
                'text-anchor': 'middle',
                'font-family': 'Verdana, Arial, sans-serif',
                'title': title
            });
        }
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
