const baseConfig = require('./base.config.js');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = (config = {}) => {
  const base = baseConfig(config);
  // set env
  base.mode = 'production';

  // minify code
  base.plugins.push(new MinifyPlugin({
    removeConsole: true,
    removeDebugger: true,
    removeUndefined: true,
  }, {
    comments: false,
    sourceMap: true,
  }));

  return base;
};
