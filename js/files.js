
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
	if (!dirs) return [];
	
	// some javascript sorcery	
		
	var result = [];

	dirs.forEach(dir => {
		result.push({
			// `loadDir` returns an promise that returns an array of promises which return a file's metadata
			promise: loadDir(dir),
			// return dirname so that a new column can be displayed with the current directory's name
			dirname: path.basename(dir)	
		});
	});

	return result;
}
function isSupported(extension) {
	return SUPPORTED_FILETYPES.indexOf(extension) >= 0;
}
function getType(extension) {
	return extension === 'mp4' ? 'video' : 'audio';
}
function readdirPromise(path) {
	// promise wrapper for asynchronous readdir function
	return new Promise((resolve, reject) => {
		fs.readdir(path, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}
function statPromise(path) {
	// promise wrapper for asynchronous stat function
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

function loadDir(dir, depth) {
	if (!depth) depth = 0;

	function filePromise(path, birthtime, type) {
		// helper function this fixes birthtime and duration being overwritten by other files in the async promise
		// since birthtime and type are parameters they are finalized and don't change while waiting for the duration
		return new Promise(async (resolve, reject) => {
			// read video/audio duration
			var info = await ffprobe(file, { path: ffprobeStatic.path });
			// return metadata
			resolve({
				birthtime: birthtime,
				duration: parseInt(info.streams[0].duration),
				path: file,
				type: type
			});
		});
	}

	return new Promise(async (resolve, reject) => {
		var promises = [];
		
		// get an array of files and directories inside the current directory
		var files = await readdirPromise(dir);
		for (file of files) {
			file = path.join(dir, file);
			var stat = await statPromise(file);

			
			if (stat.isDirectory() && depth <= MAX_DEPTH) {
				// recursion, go into the sub-directory and find all files in there
				promises = promises.concat(await loadDir(file, depth + 1));
			} else if (stat.isFile()) {
				var extension = path.extname(file).substr(1);
				if (!isSupported(extension)) continue;

				var type = getType(extension), birthtime = Math.round(stat.birthtimeMs);
				// add promise of current file to the array
				promises.push(filePromise(path, birthtime, type));
			}
		}

		// array of Promises, each of them handle a single file that is inside the directory or it's sub-directory.
		// the Promises return the files information (birthtime, duration, path, type) and can be displayed in the timeline
		resolve(promises);
	});
}

