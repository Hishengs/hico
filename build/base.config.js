const fs = require('fs');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackHookPlugin = require('../src/plugin/webpack-hook-plugin.js');

module.exports = (config) => {
  const plugins = [
    new WebpackHookPlugin('done', () => {
      // remove style-puppet.js from dist
      try {
        fs.unlinkSync(path.join(config.dist, 'style-puppet.js'));
      }catch (e){
        //
      }
      console.log('\n============== webpack building done ==============\n');
    }),
    new CleanWebpackPlugin([config.dist], {
      allowExternal: true,
    }),
    new VueLoaderPlugin(),
  ];

  let CommonExtractStyle;
  if(config.extractStyle){
    CommonExtractStyle = new MiniCssExtractPlugin(config.extractStyleConfig);
    plugins.push(CommonExtractStyle);
  }

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: config.env === 'production',
      sourceMap: config.sourceMap,
    },
  };
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: config.sourceMap,
      ident: 'postcss',
      plugins: [require('autoprefixer')],
    },
  };
  const cssRules = [
    { name: 'less', test: /\.less/ },
    { name: 'sass', test: /\.s[ac]ss/ },
    { name: 'stylus', test: /\.styl/ },
  ].map(item => {
    const loaders = ['style-loader', cssLoader, postcssLoader, `${item.name}-loader`];
    if(config.extractStyle){
      loaders[0] = MiniCssExtractPlugin.loader;
    }
    return {
      test: item.test,
      use: loaders,
      exclude: [],
    };
  });

  const rules = [
    {
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: config.extractStyle ? [MiniCssExtractPlugin.loader, cssLoader, postcssLoader] : ['style-loader', cssLoader, postcssLoader],
      exclude: [],
    },
    ...cssRules,
    {
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10240,
        name: '[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.(ttf|eot|woff2?|otf|mp4|webm|ogg|mp3|wav|flac|aac)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
          },
        },
      ],
    },
  ];

  // deal with styles, for sigle style file compile
  const styleRule = {
    css: rules[1],
    less: rules[2],
    sass: rules[3],
    stylus: rules[4],
  };
  const styleTypes = Object.keys(config.style);
  styleTypes.forEach(type => {
    config.style[type].files.forEach(file => {
      styleRule[type].exclude.push(file);

      const ExtractStyleIns = new MiniCssExtractPlugin({
        filename: file.replace(config.src, '').replace(path.extname(file), '.css'),
      });

      plugins.push(ExtractStyleIns);

      const loaders = [
        {
          loader: 'css-loader',
          options: {
            url: true,
            sourceMap: config.sourceMap,
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            // sourceMap: !!config.style.sourceMap,
            ident: 'postcss',
            plugins: [require('autoprefixer')],
          },
        },
      ];

      if(type === 'less'){
        loaders.push({
          loader: 'less-loader',
          options: {
            sourceMap: !!config.style.less.config.sourceMap,
          },
        });
      }

      if(type === 'sass'){
        loaders.push({
          loader: 'sass-loader',
          options: {
            sourceMap: !!config.style.sass.config.sourceMap,
          },
        });
      }

      if(type === 'stylus'){
        loaders.push({
          loader: 'stylus-loader',
          options: {
            sourceMap: !!config.style.stylus.config.sourceMap,
          },
        });
      }

      rules.push({
        test: file,
        use: [MiniCssExtractPlugin.loader, ...loaders],
      });
    });
  });

  return {
    devtool: config.sourceMap ? (config.env === 'production' ? 'source-map' : 'inline-source-map') : false,
    entry: config.entry,
    output: {
      path: config.dist,
      filename: '[name].js',
      chunkFilename: '[name].[chunkhash:8].chunk.js',
      publicPath: config.publicPath,
    },
    plugins,
    module: {
      rules,
    },
  };
};
