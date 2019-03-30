const webpack = require('webpack');
const less = require('less');
const fs = require('fs');
const path = require('path');
const packager = require('electron-packager');

//const webpackConfig = require('./webpack.config.js');

var mode = process.argv[2];
var build = process.argv[3] === 'build';

if (mode !== 'development' && mode !== 'production') {
	console.log('Mode is not defined!');
	return;
}

var webpackConfig = {
	entry: './app/src/app.js',
	output: {
		path: path.resolve(__dirname, 'app/dist'),
		filename: 'bundle.js'
	},
	node: {
		// neccessary for ffprobe-static
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
	},
	plugins: [
		new webpack.DefinePlugin({
			FFPROBE_PATH: JSON.stringify(build ? '' : 'ffprobe')
		})
	]
}

webpackConfig.mode = mode;

webpack(webpackConfig, (err, stats) => {
	if (err) console.log(err);
	console.log(stats.toString({ colors: true }));
});

// bundles less files into a single bundled css file
less.render(
	fs.readFileSync('./app/src/less/main.less').toString(),
	{ paths: [ './app/src/less/' ], compress: mode === 'production' },
	(err, output) => {
		if (!err) fs.writeFileSync('./app/dist/bundle.css', output.css);
		else console.log('error writing css file');
	}
);

