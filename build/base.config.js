const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { merge } = require('lodash');
const WebpackHookPlugin = require('../src/plugin/webpack-hook-plugin.js');

module.exports = (config = {}) => {

  config = merge({
    extractStyle: true,  // extract style from module
    extractStyleConfig: '[name]_[hash:8].css',
    entry: {},
    src: '',
    dist: path.join(__dirname, '../dist'),
    publicPath: 'dist',
    style: {},
  }, config);

  let plugins = [
    new WebpackHookPlugin('done', function(){
      // remove style-puppet.js from dist
      try {
        fs.unlinkSync(path.join(config.dist, 'style-puppet.js'));
      }catch (e){}
      console.log('\n\n============== webpack building done ==============\n');
    }),
  ];
  let CommonExtractText;
  if(config.extractStyle){
    CommonExtractText = new ExtractTextPlugin(config.extractStyleConfig);
    plugins.push(CommonExtractText);
  }

  const rules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      exclude: [],
    },
    {
      test: /\.less$/,
      use: config.extractStyle ? CommonExtractText.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader'],
      }) : ['style-loader', 'css-loader', 'less-loader'],
      exclude: [],
    },
    {
      test: /\.s[ac]ss$/,
      use: config.extractStyle ? CommonExtractText.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader'],
      }) : ['style-loader', 'css-loader', 'sass-loader'],
      exclude: [],
    },
    {
      test: /\.styl$/,
      use: config.extractStyle ? CommonExtractText.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'stylus-loader'],
      }) : ['style-loader', 'css-loader', 'stylus-loader'],
      exclude: [],
    },
    {
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.(png|jpg|gif|svg|ttf|eot|woff)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
          },
        }
      ],
    },
  ];

  // deal with styles
  const styleRule = {
    css: rules[1],
    less: rules[2],
    sass: rules[3],
  };
  const styleTypes = Object.keys(config.style);
  styleTypes.forEach(type => {
    config.style[type].files.forEach(file => {
      styleRule[type].exclude.push(file);

      const ExtractTextIns = new ExtractTextPlugin(file.replace(config.src, ''));

      plugins.push(ExtractTextIns);

      const loaders = [
        {
          loader: 'css-loader',
          options: {
            url: true,
            sourceMap: !!config.style.css.config.sourceMap,
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            // sourceMap: !!config.style.sourceMap,
            ident: 'postcss',
            plugins: [require('autoprefixer')],
          }
        },
      ];

      if(type === 'less'){
        loaders.push({
          loader: 'less-loader',
          options: {
            sourceMap: !!config.style.less.config.sourceMap,
          }
        });
      }

      if(type === 'sass'){
        loaders.push({
          loader: 'sass-loader',
          options: {
            sourceMap: !!config.style.sass.config.sourceMap,
          }
        });
      }

      if(type === 'stylus'){
        loaders.push({
          loader: 'stylus-loader',
          options: {
            sourceMap: !!config.style.stylus.config.sourceMap,
          }
        });
      }

      rules.push({
        test: file,
        use: ExtractTextIns.extract({
          fallback: 'style-loader',
          use: loaders,
        }),
      });

    });
  });

  return {
    entry: config.entry,
    output: {
      path: config.dist,
      filename: '[name]_[hash:8].js',
      chunkFilename: '[name]_[chunkhash:8].chunk.js',
      publicPath: config.publicPath,
    },
    plugins,
    module: {
      rules,
    },
  };
};
