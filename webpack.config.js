const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './app/js/main.js',
	output: {
		path: path.resolve(__dirname, './app/'),
		filename: 'bundle.js'
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
				test: /\.vue$/,
				loader: 'vue-loader'
			}
		]
	}
}
