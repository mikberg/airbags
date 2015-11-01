/* eslint no-var:0 vars-on-top:0 */
require('babel/register')({
  stage: 0,
});
var common = require('./webpack.common');

var config = Object.assign({}, common, {
  devtool: 'eval',
});

module.exports = config;
