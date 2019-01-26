
const { dialog } = require('electron').remote;

const fs = require('fs');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');


const SUPPORTED_FILETYPES = [
	"mp4", "mp3"
];

const MAX_DEPTH = 8;


// returns an array of promises
function openDirectory() {
	// open file dialog where the user can select one or multiple directories
	var dirs = dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });

	// no directory opened
	if (!dirs) return;
	
	var i, result = [];
	for (i = 0; i < dirs.length; ++i) {
		// parse items


		result.push({
			promise: loadDir(dirs[i]),
			dirname: path.basename(dirs[i])
		});
	}

	return result;
}


// It's probably better to rewrite this to only use Promises instead of synchronous and asynchronous functions
async function loadDir(parent_dir, elements, depth) {
	// create element array if the functions argument was not given
	if (!elements) elements = [];
	if (!depth) depth = 0;

	// iterate through all files and directories inside the current directory
	var files = fs.readdirSync(parent_dir);
	for (file of files) {
		file = parent_dir + '/' + file;
		var stat = fs.statSync(file);
		var extension = path.extname(file).substr(1);

		if (stat.isDirectory() && depth <= MAX_DEPTH) {
			await loadDir(file, elements, depth + 1);
		} else if (stat.isFile() && SUPPORTED_FILETYPES.indexOf(extension) >= 0) {
			var type = extension === 'mp4' ? 'video' : 'audio';
			var info = await ffprobe(file, { path: ffprobeStatic.path });
			
			elements.push({
				birthtime: Math.round(stat.birthtimeMs),
				duration: parseInt(info.streams[0].duration),
				path: file,
				type: type
			});
		}
	}
	return elements;
}

