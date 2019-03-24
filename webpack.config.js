const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './app/src/app.js',
	output: {
		path: path.resolve(__dirname, 'app/dist'),
		filename: 'bundle.js'
	},
	node: {
		__dirname: true
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.esm.js'
		}
	},
	target: 'electron-renderer',
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	}
}
