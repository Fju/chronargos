
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
			promise: loadDir(dir, MAX_DEPTH),
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

	var elements = [];
	
	var files = fs.readdirSync(dir);
	for (file of files) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);
		var extension = path.extname(file).substr(1);

		if (stat.isDirectory() && depth <= MAX_DEPTH) {
			elements = elements.concat(await loadDir(file, depth + 1));
		} else if (stat.isFile() && isSupported(file)) {
			var type = (extension === 'mp4' ? 'video' : 'audio');
			elements.push(new Promise(async (resolve, reject) => {
				var info = await ffprobe(file, { path: ffprobeStatic.path });
				resolve({
					birthtime: Math.round(stat.birthtimeMs),
					duration: parseInt(info.streams[0].duration),
					path: file,
					type: type
				});
			}));
		}
	}
	
	return Promise.all(elements);
	
}

