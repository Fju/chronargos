/*var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');

draggableItem.setAttribute('draggable', true);
draggableItem.ondragstart = (e) => {
	e.dataTransfer.effectAllowed = 'copy';
	e.preventDefault();
	
	ipcRenderer.send('ondragstart', '/test.txt');
}*/

function updatePosition() {
	var elements = document.querySelectorAll('.content-item'), i;
	for (i = 0; i != elements.length; ++i) {
		elements[i].style.top = 5;
	}
}


var scrollContainer = document.querySelector('.content-scroll');
//var bodyContainer = document.querySelector('.content-body');
var offset = 0;

document.addEventListener('wheel', (e) => {
	// detect scrolling
	e.preventDefault();
	
	if (e.deltaY < 0) offset -= 40;
	else if (e.deltaY > 0) offset += 40;
	
	// limit offset
	offset = Math.min(Math.max(offset, -500), 500);	
	scrollContainer.style.top = offset + 'px';

	// TODO: implement zooming
	console.log(e.ctrlKey);

});
document.getElementById('open-dir').addEventListener('click', () => {
	openDirectory().forEach(promise => {
		// create new column
		
		var 
		console.log('Create new column');
		
		promise.then(data => {
			console.log('successful', data);
		}).catch(err => {
			console.log('error', err);
		});			
	});
});
