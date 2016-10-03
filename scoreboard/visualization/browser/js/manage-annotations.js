if(window.scoreboard === undefined){
    var scoreboard = {
        version: '1.0'
    };
}

if(scoreboard.visualization === undefined){
    scoreboard.visualization = {};
}

scoreboard.visualization.annotations_manager = {
    global_annotations: null,
    datasets: null,
    dataset: null,
    fragment: null,

    sort_key: function(i1, i2) {
        var parent1 = 9999, parent2 = 9999;
        if (i1['parent_order']) {
            parent1 = i1['parent_order'][0] || 9999;
        }
        if (i2['parent_order']) {
            parent2 = i2['parent_order'][0] || 9999;
        }
        if (parent1 != parent2) {
            return parent1-parent2;
        }
        var order1 = 9999, order2 = 9999;
        if (i1['order']) {
            order1 = i1['order'][0];
        }
        if (i2['order']) {
            order2 = i2['order'][0];
        }
        return order1-order2;
    },

    messageError: function(message) {
        jQuery("#message").text(message).removeClass("alert-success").addClass("alert-danger").show();
    },

    messageInfo: function(message) {
        jQuery("#message").text(message).removeClass("alert-danger").addClass("alert-success").show();
    },

    initialize: function() {
        CKEDITOR.disableAutoInline = true;
        var self = scoreboard.visualization.annotations_manager;
        self.dataset = jQuery('#datasets option:selected').val();
        self.global_annotations = JSON.parse(document.querySelector('#global_annotations').textContent);
        self.datasets = JSON.parse(document.querySelector('#datacubes').textContent);
        self.fragment = document.createDocumentFragment();
        self.render([]);
        jQuery('#datasets').on('change', function() {
            jQuery("#datasets").prop('disabled', true);
            self.dataset = this.value;
            if (!self.global_annotations[self.dataset]) {
                self.global_annotations[self.dataset] = {};
            }
            self.render([]);
            if (self.dataset) {
                // load indicators for this dataset
                self.messageInfo("Loading...");
                jQuery.getJSON(self.datasets[self.dataset]['url'] + "/dimension_metadata", function(result){
                    jQuery("#datasets").prop('disabled', false);
                    self.render(result.indicator.sort(self.sort_key));
                    jQuery("#message").hide();
                }).error(function(jqXHR, textStatus, errorThrown) {
                    jQuery("#datasets").prop('disabled', false);
                    self.messageError(textStatus + " : " + errorThrown);
                    self.render([]);
                })
            }
        });
    },

    render: function(indicators) {
        var self = scoreboard.visualization.annotations_manager;
        var table = jQuery('#annotations-table');
        if (indicators.length > 0) {
            self.constructTable(indicators);
            table.find('tbody').html(self.fragment);

            jQuery("div[contenteditable]").each(function(index, value ) {
                self.constructCkeditor(this);
            });

            jQuery(".btn-add").click(self.click);
            jQuery(".btn-delete").click(self.click);
            table.show();
        } else {
            table.hide();
        }
    },

    constructCkeditor(div, hasFocus=false) {
        var self = scoreboard.visualization.annotations_manager;
        var annotation = jQuery(div).html(); // save a copy of the old value
        var indicator = jQuery(div).parent().parent().attr('data-notation');
        CKEDITOR.inline(indicator, {
            extraPlugins: 'sourcedialog,save',
            startupFocus: hasFocus,
            inlinecancel: {
                onCancel: function(editor) {
                    // reset to old value
                    editor.element.setHtml(annotation);
                    //editor.destroy();
                }
            },
            inlinesave: {
                useColorIcon: true,
                postUrl: self.datasets[self.dataset]['url'] + '/saveAnnotation',
                postData: {
                    indicator: indicator,
                    dataset: self.dataset
                    // + editabledata
                },
                onSave: function(editor) {
                    return editor.getData() != self.global_annotations[self.dataset][indicator];
                },
                onSuccess: function(editor, data) {
                    self.global_annotations[self.dataset][indicator] = editor.getData();
                    self.messageInfo(data);
                },
                onFailure: function(editor, status, request) {
                    if ( status == -1 ) {
                       self.messageInfo("Not changed."); 
                    } else {
                       self.messageError("Save failed. (" + status + ")");
                    }
                },
            }
        });
        CKEDITOR.instances[indicator].on('blur', function(event) {
            // save data
            var old = self.global_annotations[self.dataset][indicator];
            var data = event.editor.getData();
            if ( old != data ) {
                event.editor.execCommand('inlinesave');
            }
        });
        CKEDITOR.instances[indicator].on('focus', function(event) {
            jQuery("#message").hide();
        });
    },

    click: function(event) {
        event.stopPropagation();
        var self = scoreboard.visualization.annotations_manager;
        var notation = jQuery(this).parent().parent().attr('data-notation');
        var td = jQuery(this).parent().parent().children("td:nth-child(2)");
        if (jQuery(this).text() == 'Add') {
            // add a div
            var div = jQuery('<div>', {
                    'id': notation,
                    'contenteditable': true
            }).appendTo(td);
            self.constructCkeditor(div, true);
            jQuery(this).removeClass("btn-add").addClass("btn-danger btn-delete").text('Delete');
        } else {
            // delete
            var div = jQuery("#"+notation);
            var annotation = div.text();
            delete self.global_annotations[self.dataset][notation];
            div.empty();
            CKEDITOR.instances[notation].execCommand('inlinesave');
            CKEDITOR.instances[notation].destroy();
            div.remove();
            jQuery(this).removeClass("btn-danger btn-delete").addClass("btn-add").text('Add');
        }
    },

    constructTable: function(indicators) {
        var self = scoreboard.visualization.annotations_manager;
        for ( var e = 0, d_length = indicators.length; e < d_length; e++ ) {

            var notation = indicators[e]['notation'];
            var row = jQuery('<tr>', {
                'data-notation': notation
            });
            jQuery('<td>', {
                'class': 'odd',
            }).append(
                "<strong>" + indicators[e]['label'] + "</strong>" +
                "<br>Notation: " + notation +
                "<br>Group: " + indicators[e]['group_name']
            ).appendTo(row);

            var annotation = null;
            if (self.global_annotations[self.dataset]) {
                annotation = self.global_annotations[self.dataset][notation];
            };
            var td = jQuery('<td>', {
                'class': 'even',
            });
            if (annotation) {
                jQuery('<div>', {
                    'id': notation,
                    'contenteditable': true
                }).append(annotation).appendTo(td);
            }
            td.appendTo(row);

            // construct links
            td = jQuery('<td>').appendTo(row);
            if ( annotation) {
                jQuery('<a>', {
                    class: "btn btn-xs btn-danger btn-delete",
                    role: "button",
                    text: "Delete"
                }).appendTo(td);
            } else {
                jQuery('<a>', {
                    class: "btn btn-xs btn-add",
                    role: "button",
                    text: "Add"
                }).appendTo(td);
            }

            self.fragment.appendChild(row[0]);
        }
    },
};

jQuery(document).ready(function(){
    scoreboard.visualization.annotations_manager.initialize();
});
