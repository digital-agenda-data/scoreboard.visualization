var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');
var _ = require('lodash');

var rootPath = path.join(__dirname, "src/scoreboard.visualization/scoreboard/visualization/jsapp");

module.exports = {
  context: rootPath,
  devtool: debug ? "inline-sourcemap" : null,
  entry: './jsapp.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|lib)/, // TODO perhaps we can let babel process lib too
        loader: 'babel-loader',
      }
    ]
  },
  output: {
    path: rootPath,
    filename: 'jsapp.min.js'
  },
  plugins: debug ? [] : [
                        new webpack.optimize.DedupePlugin(),
                        new webpack.optimize.OccurenceOrderPlugin(),
                        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
                    ]

};
