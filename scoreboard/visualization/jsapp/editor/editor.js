/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.EditForm = Backbone.View.extend({

    initialize: function(options) {
        this.input = this.$el.find('input[name=configuration]');
        this.model.set(JSON.parse(this.input.val()));
        this.model.on('change', this.save, this);
    },

    save: function() {
        this.input.val(JSON.stringify(this.model, null, 2));  // indent 2 spaces
    }

});


App.Editor = Backbone.View.extend({

    className: 'editor-box',

    template: App.get_template('editor/editor.html'),

    events: {
        'click .editor-steps a': 'on_click_step'
    },

    step_cls: [
        'ChartTypeEditor',
        'FiltersEditor'
    ],

    initialize: function(options) {
        this.all_steps = _(this.step_cls).map(function(name) {
            var Cls = App[name];
            var step = new Cls({
                model: this.model,
                cube_url: options['cube_url']
            });
            step.$el.addClass('editor-current-step');
            return step;
        }, this);
        this.step = this.all_steps[0];
        this.render();
    },

    render: function() {
        this.$el.html(this.template({
            step: this.step,
            all_steps: this.all_steps
        }));
        this.$el.append(this.step.el);
    },

    on_click_step: function(evt) {
        evt.preventDefault();
        var step_cid = $(evt.target).data('step-cid');
        this.step = _(this.all_steps).where({cid: step_cid})[0];
        this.render();
    }

});


App.create_editor = function(form) {
    var configuration = new Backbone.Model();
    App.editor_form = new App.EditForm({
        model: configuration,
        el: form
    });
    App.editor = new App.Editor({
        model: configuration,
        cube_url: App.URL
    });
    App.editor.$el.insertBefore(form);
};


})(App.jQuery);
