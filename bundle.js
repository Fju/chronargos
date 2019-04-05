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
	mode: mode,
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
			IS_DEV: JSON.stringify(mode === 'development'),
			IS_BUILD: JSON.stringify(build)
		})
	]
}

function bundle_js() {
	return new Promise((resolve, reject) => {
		webpack(webpackConfig, (err, stats) => {
			if (err) {
				reject(err);
				return;
			}			
			console.log(stats.toString({ colors: true }));
			resolve();
		});
	});
}

function bundle_css() {
	const LESS_OPTIONS = { paths: [ './app/src/less/' ], compress: mode === 'production' };
	return new Promise((resolve, reject) => {
		// bundles less files into a single bundled css file
		fs.readFile('./app/src/less/main.less', (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			less.render(data.toString(), LESS_OPTIONS, (err, output) => {
				if (err) {
					reject(err);
					return;
				}
				fs.writeFileSync('./app/dist/bundle.css', output.css);
				console.log('css successfully bundled.');
				resolve();
			});
		});
	});
}

function build_app(platform, arch) {
	packager({
		platform: platform,
		arch: arch,
		dir: './',
		out: 'build/',
		overwrite: true,
		//TODO: use icon.icns for macOS
		icon: path.join(__dirname, 'app/images/icon.ico')
	}).then(appPaths => {
		console.log('appPaths', appPaths);

		var ffprobe_name = platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';
		var module_path = path.join(__dirname, 'node_modules/ffprobe-static/bin/', platform, arch, ffprobe_name);
	
		var rel_path = path.relative(path.join(__dirname, appPaths[0]), module_path)
		
		fs.symlinkSync(rel_path, path.join(appPaths[0], ffprobe_name));
	}).catch(err => {
		console.log(err);
	});
}

Promise.all([bundle_css(), bundle_js()]).then(() => {
	if (build) {
		build_app('linux', 'x64');
	}
}).catch(err => {
	console.log(err);
});

