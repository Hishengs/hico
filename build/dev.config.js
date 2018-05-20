const path = require('path');
const webpack = require('webpack');
const assign = require('lodash.assign');
const baseConfig = require('./base.config.js');

module.exports = (config = {}) => {
  const base = baseConfig(config);
  // set env
  base.mode = 'development';

  // if watch mode
  if(config.watch){
    base.watch = true;
  }

  // 模块热更新
  if(config.devServer){
    base.plugins.push(new webpack.NamedModulesPlugin());
    base.plugins.push(new webpack.HotModuleReplacementPlugin());

    const devServer = assign({
      hot: true,
      // hotOnly: true,
      inline: true,
      compress: true,
      port: 823,
      contentBase: path.resolve(process.cwd(), '../'),
    }, config.devServer);

    return assign(base, {
      devServer,
    });
  }else return base;
};
