const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
      console.log('\n\n============== webpack building done ==============\n');
    }),
  ];
  let CommonExtractText;
  if(config.extractStyle){
    CommonExtractText = new ExtractTextPlugin(config.extractStyleConfig);
    plugins.push(CommonExtractText);
  }

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: config.env === 'production',
      sourceMap: config.env === 'production',
    },
  };
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: config.env === 'production',
      ident: 'postcss',
      plugins: [require('autoprefixer')],
    },
  };
  const cssRules = [
    { name: 'less', test: /\.less/ },
    { name: 'sass', test: /\.s[ac]ss/ },
    { name: 'stylus', test: /\.styl/ },
  ].map(item => {
    return {
      test: item.test,
      use: config.extractStyle ? CommonExtractText.extract({
        fallback: 'style-loader',
        use: [cssLoader, postcssLoader, `${item.name}-loader`],
      }) : ['style-loader', cssLoader, `${item.name}-loader`],
      exclude: [],
    };
  });

  const rules = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
    {
      test: /\.css$/,
      use: config.extractStyle ? CommonExtractText.extract({
        fallback: 'style-loader',
        use: [cssLoader, postcssLoader],
      }) : ['style-loader', postcssLoader, cssLoader],
      exclude: [],
    },
    ...cssRules,
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
        },
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
      filename: '[name].js',
      chunkFilename: '[name]_[chunkhash:8].chunk.js',
      publicPath: config.publicPath,
    },
    plugins,
    module: {
      rules,
    },
  };
};
