const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { merge } = require('lodash');

module.exports = (config = {}) => {

  config = merge({
    extractStyle: false,  // extract style from module
    extractStyleConfig: '[name].css',
    entry: {},
    dist: path.join(__dirname, '../dist'),
    publicPath: 'dist',
    style: {},
  }, config);

  let plugins = [];
  if(config.extractStyle){
    plugins.push(new ExtractTextPlugin(extractStyleConfig));
  }

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

  // less
  if(config.style.lessFiles){
    config.style.lessFiles.forEach(file => {
      const ExtractTextIns = new ExtractTextPlugin(file);
      plugins.push(ExtractTextIns);
      rules.push({
        test: file,
        use: ExtractTextIns.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: true,
                sourceMap: !!config.style.sourceMap,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !!config.style.sourceMap,
                ident: 'postcss',
                // plugins: [require('autoprefixer')],
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: !!config.style.sourceMap,
              }
            },
          ]
        }),
      });
    });
  }

  return {
    entry: config.entry,
    output: {
      path: config.dist,
      filename: '[name]',
      chunkFilename: '[name].[chunkhash:4].chunk.js',
      publicPath: config.publicPath,
    },
    plugins,
    module: {
      rules,
    },
  };
};
