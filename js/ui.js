/*var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');

draggableItem.setAttribute('draggable', true);
draggableItem.ondragstart = (e) => {
	e.dataTransfer.effectAllowed = 'copy';
	e.preventDefault();
	
	ipcRenderer.send('ondragstart', '/test.txt');
}*/


var directories = [
	 {
	 	name: 'test',
		type: 'audio',
		state: 'loading',
		items: [
			{ path: 'asdf', start: 0.4, end: 0.8 },
		]
	 },
	 {
	 	name: 'test2',
		type: 'video',
		state: 'loading',
		items: [
			{ path: 'asdf', start: 0, end: 0.5, row: 0 },
			{ path: 'test', start: 0.55, end: 1, row: 1 }	
		]
	 }

];

var main = new Vue({
	el: '#main',
	data: {
		directories: directories,
		zoom: 1.0,
		offset: 0,
		range_start: 0,
		range_end: 1
	}	
});

document.addEventListener('wheel', (e) => {
	// detect scrolling
	e.preventDefault();

	// TODO: implement zooming
	
	var sign = e.deltaY > 0 ? 1 : -1;

	if (e.ctrlKey) {
		main.zoom = Math.max(1, main.zoom * Math.pow(1.2, -sign));
	} else {
		//main.offset = Math.min(1, Math.max(0, main.offset + sign/10));
	}

	main.range_end = 1 / main.zoom;

	//console.log(main.zoom, main.offset);
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

