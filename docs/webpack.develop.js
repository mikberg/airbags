/* eslint no-var:0 vars-on-top:0 */
require('babel/register')({
  stage: 0,
});
var webpack = require('webpack');
var common = require('./webpack.common');

var config = Object.assign({}, common, {
  debug: true,
  devtool: 'eval',
});

config.module.loaders = config.module.loaders.concat([
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      stage: 0,
      plugins: ['react-transform'],
      extra: {
        'react-transform': {
          transforms: [{
            transform: 'react-transform-hmr',
            imports: ['react'],
            locals: ['module'],
          }, {
            transform: 'react-transform-catch-errors',
            imports: ['react', 'redbox-react'],
          }],
        },
      },
    },
  },
]);

config.entry.unshift('webpack-hot-middleware/client');

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
]);

module.exports = config;
