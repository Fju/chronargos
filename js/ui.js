/*var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');

draggableItem.setAttribute('draggable', true);
draggableItem.ondragstart = (e) => {
	e.dataTransfer.effectAllowed = 'copy';
	e.preventDefault();
	
	ipcRenderer.send('ondragstart', '/test.txt');
}*/

function vue_template_header_item() {
	return }

function updatePosition() {
	var elements = document.querySelectorAll('.content-item'), i;
	for (i = 0; i != elements.length; ++i) {
		elements[i].style.top = 5;
	}
}


var columnContainer = document.getElementById('column-container');
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


var columns = [
	{
		type: 'audio',
		title: 'test',
		items: [
			0, 1, 2	
		]
   	},
]

var header = new Vue({
	el: '#header',
	data: {
		cols: columns
	}
});
var column_container = new Vue({
	el: '#column-container',
	data: {
		cols: columns
	}	
});


document.getElementById('open-dir').addEventListener('click', () => {
	openDirectory().forEach(element => {
		// create new column
		console.log(element.dirname);

		element.promise.then(data => {
			header_item.type = 'video';
			console.log('successful', data);
		}).catch(err => {
			columnContainer.removeChild(column);
			console.log('error', err);
		});			
	});
});
