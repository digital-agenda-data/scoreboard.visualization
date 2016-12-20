/*global App, Backbone, _ */
/*jshint sub:true */
import _ from "underscore";

(function($) {
"use strict";

App.LayoutEditorField = Backbone.View.extend({
    template: App.get_template('editor/layout-field.html'),

    events: {
        'change [name="position"]': 'on_change_position'
    },

    initialize: function(options) {
        if(!this.model.has('position')){
            this.model.set('position', this.position_options[0]['value']);
        }
        this.render();
    },

    position_options:[
        {value: 'upper-left', label: "upper left"},
        {value: 'upper-right', label: "upper right"},
        {value: 'bottom-left', label: "lower left"},
        {value: 'bottom-right', label: "lower right"}
    ],

    render: function() {
        var context = _({
            position_options: _(this.position_options).map(function(pos){
                var selected = this.model.get('position') == pos['value'];
                return _({
                    selected: selected
                }).extend(pos);
            }, this)
        }).extend(this.model.toJSON());
        this.$el.html(this.template(context));
    },

    on_change_position: function(evt) {
        this.model.set({
            position: this.$el.find('[name="position"]').val()
        });
    }
});

App.LayoutEditor = Backbone.View.extend({

    template: App.get_template('editor/layout.html'),

    title: "Layout",

    initialize: function(options) {
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        this.facet_views = _.object(this.model.layout_collection.map(function(facet_model) {
            var facet_view = new App.LayoutEditorField({
                model: facet_model
            });
            return [facet_model.cid, facet_view];
        }, this));
        _(this.facet_views).each(function(facet_view) {
            facet_view.render();
            this.$el.find('div.layout-editor-slot').append(facet_view.el);
            facet_view.delegateEvents();
        }, this);
    }

});

})(App.jQuery);
