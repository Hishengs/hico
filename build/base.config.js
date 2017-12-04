const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (options = {}) => {
  options = Object.assign({
    entry: {},
    dist: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
  }, options || {});
  const plugins = [
    // clean your dist folder before build
    new CleanWebpackPlugin([options.dist], {
      root: path.join(options.dist, '../')
    }),
  ];

  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
    { test: /\.(png|jpg|gif|svg|ttf|eot|woff)$/, loader: 'file-loader?name=[name].[hash].[ext]' },
    { test: /\.css$/, loader: ['style-loader', 'css-loader'] },
    { test: /\.less$/, loader: ['style-loader', 'css-loader', 'less-loader'] },
    { test: /\.s[ac]ss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] },
  ];

  return {
    entry: options.entry,
    output: {
      path: options.dist,
      filename: '[name].entry.js',
      chunkFilename: '[name].[chunkhash:4].chunk.js',
      publicPath: options.publicPath,
    },
    plugins,
    module: {
      rules,
    },
  };
};
