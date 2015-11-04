/* eslint no-var:0 vars-on-top:0 */
var path = require('path');
var webpack = require('webpack');
var AirbagsPlugin = require('./AirbagsPlugin');
var airbagsApi = require('./airbagsApi');
var renderPath = require('./renderPath');
var renderJson = require('../src/render/json').default;
var createReactRenderer = require('../src/render/react').createReactRenderer;

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
      { test: /vinyl/, loader: 'null' }, // Remove when `collect` loading Vinyl issue is dealt with
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
      additionalPages: {
        'index': {
          meta: {
            title: 'Home',
            inMenu: true,
          },
        },
      },
    }),
  ],
};
