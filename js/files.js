
const { dialog } = require('electron').remote;

const fs = require('fs');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');


const SUPPORTED_FILETYPES = [
	"mp4", "mp3"
];

const MAX_DEPTH = 8;


function openDirectory() {
	// open file dialog where the user can select one or multiple directories
	var dirs = dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });

	// no directory opened
	if (!dirs) return;
	
	// some javascript sorcery	
	return dirs.map(dir => {
		return {
			// `loadDir` returns and promise that returns an array of promises which return a file's metadata
			promise: loadDir(dir),
			// return dirname so that a new column can be displayed with the current directory's name
			dirname: path.basename(dir)	
		};
	});
}
function isSupported(file) {
	var extension = path.extname(file).substr(1);
	return SUPPORTED_FILETYPES.indexOf(extension) >= 0;
}
async function loadDir(dir, depth) {
	if (!depth) depth = 0;

	var promises = [];
	
	// get an array of files and directories inside the current directory
	var files = fs.readdirSync(dir);
	for (file of files) {
		// add 
		file = dir + '/' + file;
		var stat = fs.statSync(file);

		if (stat.isDirectory() && depth <= MAX_DEPTH) {
			// recursion, go into the sub-directory and find all files in there
			elements = elements.concat(await loadDir(file, depth + 1));
		} else if (stat.isFile() && isSupported(file)) {
			var extension = path.extname(file).substr(1);
			var type = (extension === 'mp4' ? 'video' : 'audio');
			// add promise of current file to the array
			promises.push(new Promise(async (resolve, reject) => {
				// read video/audio duration
				var info = await ffprobe(file, { path: ffprobeStatic.path });
				// return metadata
				resolve({
					birthtime: Math.round(stat.birthtimeMs),
					duration: parseInt(info.streams[0].duration),
					path: file,
					type: type
				});
			}));
		}
	}
	// array of Promises, each of them handle a single file that is inside the directory or it's sub-directory.
	// the Promises return the files information (birthtime, duration, path, type) and can be displayed in the timeline
	return Promise.all(promises);
	
}

