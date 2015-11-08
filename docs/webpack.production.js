/* eslint no-var:0 vars-on-top:0 */
require('babel/register')({
  stage: 0,
});
var webpack = require('webpack');
var common = require('./webpack.common');

var config = Object.assign({}, common, {
  // nothing yet
});

config.module.loaders = config.module.loaders.concat([
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      stage: 0,
    },
  },
]);

config.plugins = config.plugins.concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production'),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false,
    },
  }),
]);

module.exports = config;
