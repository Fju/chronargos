/*var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');

draggableItem.setAttribute('draggable', true);
draggableItem.ondragstart = (e) => {
	e.dataTransfer.effectAllowed = 'copy';
	e.preventDefault();
	
	ipcRenderer.send('ondragstart', '/test.txt');
}*/
const COL_PADDING = 6;
const COL_ITEM_WIDTH = 48;

var directories = [
	 {
	 	name: 'test',
		types: ['audio'],
		state: 'loading',
		files: [
			{ path: 'asdf', start: 0.4, end: 0.8, type: 'audio' },
			{ path: 'asd', start: 0.3, end: 0.35, type: 'audio' }
		]
	 },
	 {
	 	name: 'test2',
		types: ['video', 'audio'],
		state: 'loading',
		files: [
			{ path: 'asdf', start: 0, end: 0.5, type: 'video' },
			{ path: 'test', start: 0.55, end: 1, type: 'audio' }	
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
		},
		getMainItems: (self) => {
			// store as final variable to use inside forEach function
			var window_start = self.window_start, window_end = self.window_end;
			console.log(this);
			return this.directories.map(dir => {
				//console.log(dir);
				var col_width = dir.types.length * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;
				var files = dir.files.map(file => {
					var top = (file.start - window_start) / (window_end - window_start);
					var left = dir.types.indexOf(file.type) * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;
					var height = (file.end - file.start) / (window_end - window_start);

					//console.log(top, height);
					return {
						path: file.path,
						type: file.type,
						style: {
							top: top * 100 + '%',
							left: left + 'px',
							height: height * 100 + '%',
							width: COL_ITEM_WIDTH + 'px',							
						}
					}
				});
				
				return {
					files: files,
					style: { width: col_width }
				}
			});			
		}
	}	
});

var header = new Vue({
	el: '#header',
	data: {
		directories: directories
	},
	methods: {
		getHeaderItems: () => {
			var data = [];
			this.directories.forEach(element => {
				var width = element.types.length * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;
				data.push({
					name: element.name,
					types: element.types,
					style: { width: width + 'px' }
				});
			});
			return data;
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
	
		//console.log('zoom', main.zoom, main.window_start, main.window_end);
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
		//console.log('scroll', main.window_start, main.window_end);
	}
});


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

