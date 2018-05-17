const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./base.config.js');

module.exports = (config = {}) => {
  const base = baseConfig(config);
  // set env
  base.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
  }));
  // if watch mode
  if(config.watch){
    base.watch = true;
  }

  // 模块热更新
  if(config.hmr){
    const devServer = Object.assign({
      hot: true,
      inline: true,
      compress: true,
      port: 823,
      contentBase: config.hmr.contentBase || path.join(process.cwd(), '../'),
    }, config.hmr);

    return Object.assign(base, {
      devServer,
    });
  }else return base;
};
