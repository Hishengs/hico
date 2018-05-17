const webpack = require('webpack');
const baseConfig = require('./base.config.js');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = (config = {}) => {
  const base = baseConfig(config);
  // set env
  base.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }));

  // minify code
  base.plugins.push(new MinifyPlugin({}, {
    comments: false,
    sourceMap: true,
  }));

  return base;
};
