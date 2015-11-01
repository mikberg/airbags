/* eslint no-var:0 vars-on-top:0 */
var path = require('path');
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
  plugins: [
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
