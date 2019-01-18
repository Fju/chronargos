/*var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');

draggableItem.setAttribute('draggable', true);
draggableItem.ondragstart = (e) => {
	e.dataTransfer.effectAllowed = 'copy';
	e.preventDefault();
	
	ipcRenderer.send('ondragstart', '/test.txt');
}*/

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
