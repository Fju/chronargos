const packager = require('electron-packager');

packager({
	dir: '.',
	out: 'build/',
	platform: 'linux',
	arch: 'x64'
});
