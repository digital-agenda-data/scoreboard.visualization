/*global App, Backbone, _ */
/*jshint sub:true */

(function($) {
"use strict";


App.FormatEditor = Backbone.View.extend({

    template: App.get_template('editor/format.html'),

    title: "Format",

    initialize: function(options) {
        this.$el.html(this.template());
    }

});


})(App.jQuery);