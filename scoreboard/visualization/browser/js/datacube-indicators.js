if(window.scoreboard === undefined){
    var scoreboard = {
        version: '1.0'
    };
};

if(scoreboard.visualization === undefined){
    scoreboard.visualization = {};
};

if(scoreboard.visualization.datacube === undefined){
    scoreboard.visualization.datacube = {};
};

scoreboard.visualization.datacube.indicators = {
    renderDatasetToC: function(tbody){
        var self = this;
        var captions = jQuery('tr[id]', tbody);
        var toc = jQuery('#indicators-toc');
        var toc_ul = jQuery('<ul>');
        toc.append(toc_ul);
        jQuery.each(captions, function(i, o){
            var tr = jQuery(o);
            var li = jQuery('<li>');
            var a = jQuery('<a>');
            a.attr('href', 'indicators#' + tr.attr('id'));
            a.text(tr.text());
            li.append(a);
            toc_ul.append(li);
        });
    },
    addNavigation: function(){
      var locationPath = window.location.href.split('/');
      var location = locationPath.slice(0, locationPath.length - 1).join('/');
      var navigation = new Scoreboard.Views.DatasetNavigationView({
          el: jQuery('#dataset-navigation'),
          cube_url: location,
          selected_url: location,
          url_extension: '/indicators'
      });
    }
};

jQuery(document).ready(function(){
    scoreboard.visualization.datacube.indicators.renderDatasetToC(jQuery("table.list_indicators tbody"));
    scoreboard.visualization.datacube.indicators.addNavigation();
});
