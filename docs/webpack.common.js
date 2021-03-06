/* eslint no-var:0 vars-on-top:0 */
var path = require('path');
var webpack = require('webpack');
var AirbagsPlugin = require('../src/webpack/AirbagsPlugin');
var airbagsApi = require('./airbagsApi');
var renderPath = require('./renderPath');
var renderers = require('../src/render');

var renderJson = renderers.renderJson;
var createReactRenderer = renderers.createReactRenderer;

module.exports = {
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
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
      { test: /\.css$/, loaders: ['style', 'css'] },
    ],
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        __BROWSER__: true,
      },
    }),
    new AirbagsPlugin({
      sourceFiles: ['./pages/*.md'],
      api: airbagsApi,
      renderers: [
        renderJson,
        createReactRenderer(renderPath),
      ],
    }),
  ],
};
