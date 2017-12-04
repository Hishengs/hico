const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./base.config.js');

module.exports = (options = {}) => {
	const base = baseConfig(options);
	// set env
	base.plugins.push(new webpack.DefinePlugin({
	  'process.env.NODE_ENV': JSON.stringify('development')
	}));

	// base.plugins.push(new webpack.SourceMapDevToolPlugin({
	//   filename: '[file].map',
	//   exclude: ['vendor.js']
	// }));

	// build analysis
	// if(config.analyse){
	//   // tool 1
	//   const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	//   base.plugins.push(new BundleAnalyzerPlugin());
	//   // tool 2
	//   // const Visualizer = require('webpack-visualizer-plugin');
	//   // base.plugins.push(new Visualizer({
	//   //   filename: 'visualizer.html'
	//   // }));
	// }

	if(options.devServer){
		const devServer = Object.assign({
		  hot: true,
		  compress: true,
		  port: parseInt(Math.random() * 10000),
		  inline: true,
		  contentBase: path.join(__dirname, '../'),  
		}, options.devServer);

		return Object.assign(base, {
		  devServer,
		});
	}else return base;
};