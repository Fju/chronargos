/*var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');

draggableItem.setAttribute('draggable', true);
draggableItem.ondragstart = (e) => {
	e.dataTransfer.effectAllowed = 'copy';
	e.preventDefault();
	
	ipcRenderer.send('ondragstart', '/test.txt');
}*/

var fs = require('fs');

const { dialog } = require('electron').remote;
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');

function loadDir(parent_dir, elements) {
	var files = fs.readdirSync(parent_dir);
	for (file of files) {
		file = parent_dir + '/' + file;
		var extension = path.extname(file);
		var stat = fs.statSync(file);

		if (stat.isDirectory()) {
			loadDir(file, elements);
		} else if (stat.isFile() && extension === '.mp4') {
			ffprobe(file, { path: ffprobeStatic.path }, function (err, info) {
				if (err) {
					console.log(err);
					return;
				}				
				elements.push({
					birthtime: stat.birthtimeMs,
					duration: info.streams[0].duration,
					path: file,
					type: 'video'
				});
			});
		}
	}
	return elements
}


function updatePosition() {
	var elements = document.querySelectorAll('.content-item'), i;
	for (i = 0; i != elements.length; ++i) {
		elements[i].style.top = 5;
	}
}

var scrollContainer = document.querySelector('.content-scroll');

var offset = 0;

document.addEventListener('wheel', (e) => {
	// detect scrolling
	e.preventDefault();
	
	if (e.deltaY < 0) offset -= 40;
	else if (e.deltaY > 0) offset += 40;
	
	// limit offset
	offset = Math.max(offset, 0);	
	scrollContainer.style.top = offset + 'px';

	// TODO: implement zooming
	console.log(e.ctrlKey);

});
document.getElementById('open-dir').addEventListener('click', () => {
	// open FileDialog for choosing a directory to open
	var dirs = dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });
	if (dirs.length > 0) {
		var elementList = loadDir(dirs[0], []);
		console.log(elementList);
	}
});
