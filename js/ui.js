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
			{ path: 'asd', start: 0.3, end: 0.35 }
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
		zoom: 2.0,
		offset: 0,
		window_start: 0,
		window_end: 0.5,
		range_start: 0,
		range_end: 1,
		mouse_pos_y: 0
	},
	methods: {
		onMousemove: (e) => {
			main.mouse_pos_y = e.offsetY / e.target.clientHeight;
		}
	}	
});



//document.getElementById('main').addEventListener('mousemove', (e) => {
//	var body = document.querySelector('.main-column-body');
//	main.mouse_pos_y = (e.offsetY - body.offsetTop) / body.clientHeight;

//	console.log(main.mouse_pos_y);
//});

document.addEventListener('wheel', (e) => {
	// detect scrolling
	e.preventDefault();

	var sign = e.deltaY > 0 ? 1 : -1;

	var window_height = (main.range_end - main.range_start) / main.zoom;

	if (e.ctrlKey) {
		var zoom_step = main.zoom;
			
		main.zoom = Math.max(1, main.zoom / Math.pow(1.2, sign));

		zoom_step = main.zoom / zoom_step;

		var new_start = main.window_start + main.mouse_pos_y * window_height * (1 - 1 / zoom_step);
		var new_end = main.window_end - (1 - main.mouse_pos_y) * window_height * (1 - 1 / zoom_step);

		window_height = (main.range_end - main.range_start) / main.zoom;
		//console.log(new_end - new_start, window_height);


		if (new_start < main.range_start) {
			new_start = main.range_start;
			new_end = new_start + window_height;
		} 
	   	if (new_end > main.range_end) {
			new_end = main.range_end;
			new_start = new_end - window_height;
		} 
		main.window_start = new_start;
		main.window_end = new_end;
	
		console.log('zoom', main.zoom, main.window_start, main.window_end);
	} else {
		if (sign > 0) {
			// scroll down, limit the window end
			main.window_end = Math.min(main.range_end, main.window_end + (1 / main.zoom) * sign * 0.1);
			main.window_start = main.window_end - window_height;
		} else {
			// scroll up, limit the window start
			main.window_start = Math.max(main.range_start, main.window_start + (1 / main.zoom) * sign * 0.1);
			main.window_end = main.window_start + window_height;

		}
		console.log('scroll', main.window_start, main.window_end);
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

