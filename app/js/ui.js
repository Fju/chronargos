var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');


const COL_PADDING = 8;
const COL_ITEM_WIDTH = 40;

/*var directories = [
	 {
	 	name: 'test',
		types: ['audio'],
		state: 'loading',
		files: {
			'audio': [
				{ path: 'a.txt', start: 0, end: 2 },
				{ path: 'b.txt', start: 3, end: 4 },
				{ path: 'c.txt', start: 4.5, end: 8 },
				{ path: 'd.txt', start: 24, end: 50 }
			],
			'video': [
				{ path: 'e.txt', start: 10, end: 40 }	
			]
		}
	 },
];*/
var directories = [];

var main = new Vue({
	el: '#main',
	data: {
		directories: directories,
		zoom: 2.0,
		offset: 0,
		window_start: 0,
		window_end: 0,
		range_start: 0,
		range_end: 0,
		mouse_pos_y: 0,
		prev_window: false
	},
	methods: {
		// save mouse position for scrolling
		onMousemove: (e) => {
			main.mouse_pos_y = e.offsetY / e.target.clientHeight;
		},
		// zoom in on objects when double clicked on or zoom back out if double cliked again
		onMainDoubleClick: (e) => {
			if (e.target.className === 'main') {
				// clicked on background zoom out to full range
				main.setZoom(main.range_start, main.range_end);
				main.prev_window = false;
			} else if (e.target.className === 'main-item') {
				if (main.prev_window) {
					// zoom out back to previous window range
					main.setZoom(main.prev_window_start, main.prev_window_end);
					main.prev_window = false;
				} else {
					// zoom in on object					
					var start = parseInt(e.target.getAttribute('data-start'));
					var end = parseInt(e.target.getAttribute('data-end'));

					if (isNaN(start) || isNaN(end)) return;

					// store current window range
					main.prev_window = true;
					main.prev_window_start = main.window_start;
					main.prev_window_end = main.window_end;

					main.setZoom(start, end);
				}
			}
		},
		// drag event
		onDragStart: (e) => {
			e.dataTransfer.effectAllowed = 'copy';
			e.preventDefault();
			
			//var path = e.target.getAttribute('data-path');
			//ipcRenderer.send('ondragstart', path);
			//console.log('dragstart', e.target.getAttribute('data-path'));
		},
		getMainItems: (self) => {
			console.log('render', this);
			// store as final variable to use inside forEach function
			var window_start = self.window_start, window_end = self.window_end;
		
			var min_height = 22 / self.$el.offsetHeight;
			return this.directories.map(dir => {
				var files = [];
				var col_width = COL_ITEM_WIDTH + 2 * COL_PADDING;

				if (window_end - window_start <= 0) {
					return {
						files: files,
						style: { width: col_width + 'px' }
					}
				}
				
				var cols = 0;
				for (var type in dir.files) {
					for (var j = 0; j < dir.files[type].length; ++j) {
						var file = dir.files[type][j];

						var top = (file.start - window_start) / (window_end - window_start);				
						var height = (file.end - file.start) / (window_end - window_start);

						var new_item = {
							type: type,
							start: file.start,
							end: file.end,
							paths: [file.path]
						}

						for (var k = j + 1; k < dir.files[type].length; ++k) {
							var file_next = dir.files[type][k];
							var top_next = (file_next.start - window_start) / (window_end - window_start);
							var height_next = (file_next.end - file_next.start) / (window_end - window_start);

							if (top + Math.max(min_height, height) > top_next) {
								// items overlap group together								
								new_item.paths.push(file_next.path);
								new_item.end = file_next.end;
								height = top_next - top + height_next;

							} else break;
						}
						j = k - 1;

						new_item.style = {
							top: top * 100 + '%',
							height: Math.max(min_height, height) * 100 + '%',
							left: cols * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING + 'px',
							width: COL_ITEM_WIDTH + 'px'
						};

						// TODO: check if item is visible (top < 100% || top + height > 0%)							
						files.push(new_item);
					}
					++cols;
				}
				
				if (cols > 1) col_width += (cols - 1) * (COL_ITEM_WIDTH + COL_PADDING)
				return {
					files: files,
					style: { width: col_width + 'px' }
				}
			});			
		},
		getTimelineItems: (self) => {
			var range = self.window_end - self.window_start;

			if (range <= 0) {
				return [];
			}
			var nice_powers = [1000, 60000, 3600000]; // 1 second, 1 minute, 1 hour (unit: milliseconds)
			var nice_steps = [0.5, 1, 2, 5, 10, 15]; // nice step sizes

			var max_steps = Math.floor(self.$el.offsetHeight / 600 * 8);

			var step = 0;
			var i = 0, j = 0;
			for (i = 0, j = 0; i + j < nice_powers.length + nice_steps.length; i = (i + 1) % nice_steps.length) {
				step = nice_powers[j] * nice_steps[i];
				if (range / step < max_steps) {
					break;	
				}

				if (i === nice_steps.length - 1) ++j;
			}

			var timestamps = [];
			for (var t = Math.ceil(self.window_start / step) * step; t <= self.window_end; t += step) {
				var style = {
					top: (t - self.window_start) / (self.window_end - self.window_start) * 100 + '%'
				}
				var date = new Date(t);

				var hours = date.getUTCHours();
				var minutes = date.getUTCMinutes();
				var seconds = date.getUTCSeconds();

				hours = (hours >= 10 ? '' : '0') + hours;
				minutes = (minutes >= 10 ? '' : '0') + minutes;
				seconds = (seconds >= 10 ? '' : '0') + seconds;

				var time = hours + ':' + minutes;
				if (step < 60 * 1000) {
					time += ':' + seconds;
				}

				timestamps.push({
					style: style,
					time: time
				});
			}
			return timestamps;
		},
		setRange: (start, end) => {
			var a = new Date(start);
			var b = new Date(end);

			main.range_start = start;
			main.range_end = end;
			main.setZoom(start, end);
		},
		setZoom: (start, end) => {
			main.window_start = start;
			main.window_end = end;
			main.zoom = (main.range_end - main.range_start) / (end - start);
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
			this.directories.forEach(dir => {
				var width = Math.max(1, dir.types.length) * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;				
				data.push({
					name: dir.name,
					types: dir.types,
					state: dir.state,
					style: { width: width + 'px' }
				});
			});
			
			return data;
		},
		onHeaderSettingsClick: e => {
			dialog.showErrorBox('Error', 'Lorem ipsum dolor sit amet.');
			//console.log('open settings');
		},
		onHeaderCloseClick: e => {
			var index = e.target.getAttribute('data-index');

			directories.splice(index, 1);
			header.$forceUpdate();
			main.$forceUpdate();
		}
	}
});

window.addEventListener('resize', e => {
	main.$forceUpdate();
});

document.addEventListener('wheel', e => {
	// detect scrolling
	e.preventDefault();

	var window_height = (main.range_end - main.range_start) / main.zoom;
	var sign = e.deltaY > 0 ? 1 : -1;
	if (e.ctrlKey) {
		var zoom_step = main.zoom;
			
		main.zoom = Math.max(1, main.zoom / Math.pow(1.2, sign));

		zoom_step = main.zoom / zoom_step;

		var new_start = main.window_start + main.mouse_pos_y * window_height * (1 - 1 / zoom_step);
		var new_end = main.window_end - (1 - main.mouse_pos_y) * window_height * (1 - 1 / zoom_step);

		window_height = (main.range_end - main.range_start) / main.zoom;

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
		var step = window_height * sign * 0.05;
		if (sign > 0) {
			// scroll down, limit the window end
			main.window_end = Math.min(main.range_end, main.window_end + step);
			main.window_start = main.window_end - window_height;
		} else {
			// scroll up, limit the window start
			main.window_start = Math.max(main.range_start, main.window_start + step);
			main.window_end = main.window_start + window_height;
		}
		//console.log('scroll', main.window_start, main.window_end);
	}

});

document.getElementById('open-dir').addEventListener('click', () => {
	openDirectory().forEach(dir => {
		// create new column
		var new_dir = {
			name: dir.dirname,
			types: [],
			files: {},
			state: 'loading' // initialize in loading state to show loader animation
		};

		directories.push(new_dir);
		header.$forceUpdate();

		dir.promise.then(async promise => {
			// wait for all file promises to be resolved, `data` is an array containing metadata objects of all files that were found
			var files = await Promise.all(promise);
			
			var range_start = main.range_start;
			var range_end = main.range_end;

			for (var file of files) {
				// create new object in the `files` object
				if (!(file.type in new_dir.files)) new_dir.files[file.type] = [];

				var start = file.birthtime;
				var end = start + file.duration * 1000;
				
				// overwrite range to the minimum/maximum of the files' ranges
				if (!range_start || range_start > start) range_start = start;
				if (!range_end || range_end < end) range_end = end;				

				new_dir.files[file.type].push({
					path: file.path,
					start: start,
					end: end
				});
			}
			// update window and range
			main.setRange(range_start, range_end);
					
			// switch state to done
			new_dir.state = 'done';
			new_dir.types = Object.keys(new_dir.files);

			header.$forceUpdate();
			main.$forceUpdate();
		}).catch(err => {
			console.log('error', err);
			new_dir.state = 'error';
		});		
	});
});

