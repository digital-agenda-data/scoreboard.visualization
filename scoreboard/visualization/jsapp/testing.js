/*global App */

(function($) {
"use strict";

App.testing = {};


App.testing.choose_option = function(select, value) {
    var options = $('option', select).filter('[value=' + value + ']');
    options.attr('selected', 'selected').change();
};


App.testing.choose_radio = function(inputs, value) {
    inputs.attr('checked', null);
    inputs.filter('[value="' + value + '"]').attr('checked', 'checked').change();
};


App.testing.choose_scenario = function(inputs, value){
    inputs.attr('selected', null);
    var div = inputs.filter('#' + value + '').attr('class', 'selected')
    div.find('img').click();
};


App.testing.url_param = function(url, name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) { return null; }
    return decodeURIComponent(results[1]);
};


App.respond_json = function(request, data) {
    // Make sure we respond to a SENT request!
    if (request.readyState !== request.UNSENT) {
        var headers = {'Content-Type': 'application/json'};
        request.respond(200, headers, JSON.stringify(data));
    }
};


})(App.jQuery);
