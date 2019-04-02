import fs from 'fs';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import path from 'path';

import os from 'os';

import { remote } from 'electron';

const FILETYPES = {
	'mp4': 'video',
	'mov': 'video',
	'mp3': 'audio'
};
const FILE_EXTENSIONS = Object.keys(FILETYPES);
const MAX_DEPTH = 4;


var ffprobe_local_path = ''; 
if (IS_BUILD) ffprobe_local_path = os.platform() === 'win32' ? 'ffprobe.exe' : 'ffprobe';
else ffprobe_local_path = ffprobeStatic.path;

function isSupported(extension) {
	return FILE_EXTENSIONS.indexOf(extension) >= 0;
}
function getType(extension) {
	return FILETYPES[extension];
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

	function filePromise(file_path, birthtime, type) {
		// helper function this fixes birthtime and duration being overwritten by other files in the async promise
		// since birthtime and type are parameters they are finalized and don't change while waiting for the duration
		return new Promise(async (resolve, reject) => {
			// read video/audio duration
			var info = await ffprobe(file_path, { path: ffprobe_local_path });
			// return metadata
			resolve({
				birthtime: birthtime,
				duration: parseInt(info.streams[0].duration),
				path: file_path,
				type: type
			});
		});
	}

	return new Promise(async (resolve, reject) => {
		var promises = [];
		try {
			// get an array of files and directories inside the current directory
			var files = await readdirPromise(dir);

			for (var file of files) {
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
					promises.push(filePromise(file, birthtime, type));
				}
			}

			// array of Promises, each of them handle a single file that is inside the directory or it's sub-directory.
			// the Promises return the files information (birthtime, duration, path, type) and can be displayed in the timeline
			resolve(promises);
		} catch (err) {
			reject(err);
		}
	});
}

export function openDirectory() {
	// open file dialog where the user can select one or multiple directories
	var dirs = remote.dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });

	// no directory opened
	if (!dirs) return [];
	
	var result = [];
	return dirs.map(dir => {
		return {
			// `loadDir` returns an promise that returns an array of promises which return a file's metadata
			promise: loadDir(dir),
			// return dirname so that a new column can be displayed with the current directory's name
			dirname: path.basename(dir) || dir	
		};
	});
}

