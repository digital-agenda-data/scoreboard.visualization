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
    escapeString: function(str){
        return str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
    },
    getDatasetMetadata: function(){
        var self = this;
        jQuery.ajax({
            'url': '@@dataset_metadata',
            'data': {'dataset': jQuery('#dataset-value').val()},
            'success': function(data){
                self.renderDatasetMetadata(data);
            }
        });
    },
    getDatasetDetails: function(){
        var self = this;
        jQuery.ajax({
            'url': '@@dataset_details',
            'success': function(data){
                self.renderDatasetDetails(data);
            },
            'complete': function(data){
                jQuery('#indicatorsSpinner').remove();
            }
        });
    },
    renderDatasetMetadata: function(data){
        jQuery('#dataset-title').text(data.title);
        jQuery('#dataset-description').text(data.description);
    },
    renderDatasetDetails: function(data){
        var self = this;
        var tbody = self.renderDatasetTable(data);
        self.renderDatasetToC(tbody);
    },
    renderDatasetTable: function(data){
        var self = this;
        var table = jQuery('table.list_indicators');
        var tbody = jQuery('tbody', table);
        jQuery.each(data, function(idx, indicator){
            if ( typeof(indicator.groupName) != 'undefined' ){
                var groupId = self.escapeString(indicator.groupName);
                var caption = jQuery('tr#' + groupId, table);
                if(!caption.length){
                    self.addTableCaption(groupId, indicator, tbody);
                }
                self.addTableRow(table, indicator, groupId);
            }
        });
        return tbody;
    },
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
    addTableCaption: function(groupId, indicator, tbody){
        var tr = jQuery('<tr class="groupName">');
        tr.attr('id', groupId);
        var td = jQuery('<td>').text(indicator.groupName);
        td.attr('colspan', '5');
        tr.append(td);
        tbody.append(tr);
    },
    addTableRow: function(table, indicator, groupId){
        var tr = jQuery('<tr>');
        //tr.append('<td class="even">' + indicator.altlabel + '</td>');
        tr.append('<td class="even">' + indicator.longlabel + '</td>');
        var definition = '<td class="odd">';
        if ( indicator.definition) {
            definition = definition.concat('<strong class="definition">Definition: </strong>' + indicator.definition);
        }
        if ( indicator.notes ) {
            definition = definition.concat('<br /><strong class="notes">Notes: </strong>' + indicator.notes);
        }
        definition = definition.concat('</td>');
        tr.append(definition);
        tr.append(
            $('<td/>').addClass('even').css('text-align', 'center')
            .text(indicator.minYear + ' - ' + indicator.maxYear)
        );
        // queries
        var sparql = jQuery('<td class="odd"/>');
        sparql.append('<a target="_blank" href="http://cr.scoreboardtest.edw.ro/sparql?selectedBookmarkName=&query=%23+This+is+a+sample+SPARQL+query+that+returns+the+first+100+countries%0D%0A%23+included+in+the+data+for+indicator+%22TODO%22+and+year+%222012%22%0D%0A%0D%0A%0D%0APREFIX+cube%3A+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+dad-prop%3A+%3Chttp%3A%2F%2Fsemantic.digital-agenda-data.eu%2Fdef%2Fproperty%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fcountry+WHERE+%7B%0D%0A++%3Fobservation+a+cube%3AObservation+.%0D%0A++%3Fobservation+dad-prop%3Aindicator+%3C'
        + encodeURIComponent(indicator.indicator) +
        '%3E+.%0D%0A%23++%3Fobservation+dad-prop%3Atime-period+%3Chttp%3A%2F%2Freference.data.gov.uk%2Fid%2Fgregorian-year%2F2012%3E+.%0D%0A++%3Fobservation+dad-prop%3Aref-area+%5Bskos%3AprefLabel+%3Fcountry%5D%0D%0A%7D%0D%0AORDER+BY+%3Fcountry+%0D%0ALIMIT+100&format=text%2Fhtml&nrOfHits=100&execute=Execute'
        + '">Find countries</a>');
        sparql.append('<br/>');
        sparql.append('<a target="_blank" href="http://cr.scoreboardtest.edw.ro/sparql?selectedBookmarkName=&query=%23+This+is+a+sample+SPARQL+query+that+returns+the+first+100+countries%0D%0A%23+included+in+the+data+for+indicator+%22TODO%22+and+year+%222012%22%0D%0A%0D%0A%0D%0APREFIX+cube%3A+%3Chttp%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+dad-prop%3A+%3Chttp%3A%2F%2Fsemantic.digital-agenda-data.eu%2Fdef%2Fproperty%2F%3E%0D%0A%0D%0ASELECT+DISTINCT+%3Fbreakdown_group+%3Fbreakdown+%28COUNT%28%3Fobservation%29+as+%3Fobservations%29+WHERE+%7B%0D%0A++%3Fobservation+a+cube%3AObservation+.%0D%0A++%3Fobservation+dad-prop%3Aindicator+%3C'
        + encodeURIComponent(indicator.indicator) + 
        '%3E+.%0D%0A++%3Fobservation+dad-prop%3Abreakdown+%3Fbreakdown_uri+.%0D%0A++%3Fbreakdown_uri+skos%3AprefLabel+%3Fbreakdown+.%0D%0A++%3Fbreakdown_uri+dad-prop%3Amembership+%5B%0D%0A++++dad-prop%3Amember-of+%3Fbreakdown_group_uri+%3B%0D%0A++++dad-prop%3Aorder+%3Forder%0D%0A++%5D+.%0D%0A++%3Fbreakdown_group_uri+skos%3AprefLabel+%3Fbreakdown_group+.%0D%0A++%3Fbreakdown_group_uri+dad-prop%3Aorder+%3Fgroup_order.%0D%0A%0D%0A%7D%0D%0AGROUP+BY+%3Fbreakdown_group+%3Fgroup_order+%3Fbreakdown+%3Forder%0D%0AORDER+BY+%3Fgroup_order+%3Forder%0D%0ALIMIT+1000&format=text%2Fhtml&nrOfHits=100&execute=Execute'
        + '">Find breakdowns</a>');
        tr.append(sparql);

        
        var source = jQuery('<td class="odd"/>');
        if(indicator.sourcelink){
          source.append('<a href="' + indicator.sourcelink + '">' + indicator.sourcelabel + '</a>');
        }
        else if(indicator.sourcelabel){
          source.text(indicator.sourcelabel);
        }
        tr.append(source);
        //jQuery('tr#' + groupId).after(tr);
        table.append(tr);
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
    //scoreboard.visualization.datacube.indicators.getDatasetMetadata();
    scoreboard.visualization.datacube.indicators.getDatasetDetails();
    scoreboard.visualization.datacube.indicators.addNavigation();
});
