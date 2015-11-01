/* eslint no-var:0 vars-on-top:0 */
require('babel/register')({
  stage: 0,
});
var webpack = require('webpack');
var common = require('./webpack.common');

var config = Object.assign({}, common, {
  // nothing yet
});

var plugins = [
  new webpack.optimize.UglifyJsPlugin(),
];
config.plugins.concat(plugins);

module.exports = config;
