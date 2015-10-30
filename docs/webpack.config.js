/* eslint no-var:0 */
var path = require('path');

module.exports = {
  devtool: 'eval',
  entry: [
    './client.js',
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: [
      { test: /vinyl/, loader: 'null' }, // Remove when `collect` loading Vinyl issue is dealt with
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader?stage=0'],
      },
    ],
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
};
