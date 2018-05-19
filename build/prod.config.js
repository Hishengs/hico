const baseConfig = require('./base.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (config = {}) => {
  const base = baseConfig(config);
  // set env
  base.mode = 'production';

  // minify code
  base.plugins.push(new UglifyJsPlugin({
    parallel: true,
    sourceMap: config.sourceMap,
    uglifyOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    extractComments: true,
  }));

  return base;
};
