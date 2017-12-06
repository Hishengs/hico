const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (options = {}) => {
  options = Object.assign({
    entry: {},
    dist: path.join(__dirname, '../dist'),
    publicPath: 'dist',
  }, options || {});
  const plugins = [
    // new ExtractTextPlugin('[name].css'), 
  ];

  const rules = [
    {
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
    {
      test: /\.(png|jpg|gif|svg|ttf|eot|woff)$/,
      use: 'file-loader?name=[name].[hash:8].[ext]',
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      /*use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader']
      }),*/
    },
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader'],
      /*use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader']
      }),*/
    },
    {
      test: /\.s[ac]ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      /*use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      }),*/
    },
  ];

  return {
    entry: options.entry,
    output: {
      path: options.dist,
      filename: '[name]',
      chunkFilename: '[name].[chunkhash:4].chunk.js',
      publicPath: options.publicPath,
    },
    plugins,
    module: {
      rules,
    },
  };
};
