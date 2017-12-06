const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./base.config.js');

module.exports = (options = {}) => {
	const base = baseConfig(options);
	// set env
	base.plugins.push(new webpack.DefinePlugin({
	  'process.env.NODE_ENV': JSON.stringify('development')
	}));

	if(options.devServer){
		const devServer = Object.assign({
		  hot: true,
		  inline: true,
		  compress: true,
		  port: parseInt(Math.random() * 10000),
		  contentBase: options.devServer.contentBase || path.join(__dirname, '../'),  
		}, options.devServer);

		return Object.assign(base, {
		  devServer,
		});
	}else return base;
};