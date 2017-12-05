const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./base.config.js');

module.exports = (options = {}) => {
	const base = baseConfig(options);
	// set env
	base.plugins.push(new webpack.DefinePlugin({
	  'process.env.NODE_ENV': JSON.stringify('production')
	}));

	return base;
};