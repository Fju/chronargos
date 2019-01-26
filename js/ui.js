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


var directories = [
	 {
	 	dirname: 'test',
		numCols: 2,
		items: [
			{ path: 'asdf', start: 0, end: 1.5, row: 0 },
			{ path: 'test', start: 0.2, end: 1, row: 1 }	
		]
	 },
	{
	 	dirname: 'st',
		numCols: 1,
		items: [
			{ path: 'asdf', start: 1.5, end: 3, row: 0 }	
		]
	 }
];

var offset = 0;
var scroll_container = new Vue({
	el: '#scroll-container',
	data: {
		directories: directories,
		zoom: 1.0,
		offset: 0,
		item_width: 44,
		item_gaps: 8,
		range_start: 0,
		range_end: 3
	}	
});

document.addEventListener('wheel', (e) => {
	// detect scrolling
	e.preventDefault();

	// TODO: implement zooming
	console.log(e.ctrlKey);
	if (e.ctrlKey) {
		scroll_container.zoom = Math.max(1, scroll_container.zoom * (e.deltaY < 0 ? 1.2 : 0.8));
	} else {
		var sign = e.deltaY > 0 ? 1 : -1;

		scroll_container.offset = Math.min(1, Math.max(0, scroll_container.offset + sign/10));
	}
});





/*var header = new Vue({
	el: '#header',
	data: {
		cols: columns
	}
})*/


document.getElementById('open-dir').addEventListener('click', () => {
	openDirectory().forEach(element => {
		// create new column
		console.log(element.dirname);

		element.promise.then(data => {
			console.log('successful', data);
			var newColumn = {
				type: '',
				title: element.dirname,
				items: []
			};

			var types = [];

			for (item of data) {
				if (types.indexOf(item.type) < 0) types.push(item.type);
			}
			console.log(types);

			/*columns.push({
				type: 'audio',
				title: element.dirname,
				items: data
			});*/
		}).catch(err => {
			//columnContainer.removeChild(column);
			console.log('error', err);
		});			
	});
});

