/*var ipcRenderer = require('electron').ipcRenderer;

var draggableItem = document.getElementById('drag');

draggableItem.setAttribute('draggable', true);
draggableItem.ondragstart = (e) => {
	e.dataTransfer.effectAllowed = 'copy';
	e.preventDefault();
	
	ipcRenderer.send('ondragstart', '/test.txt');
}*/
const COL_PADDING = 6;
const COL_ITEM_WIDTH = 40;

var directories = [
	 {
	 	name: 'test',
		types: ['audio'],
		state: 'loading',
		files: {
			'audio': [
				{ path: 'asdf', start: 0, end: 0.02 },
				{ path: 'asd', start: 0.03, end: 0.04 },
				{ path: 'asdf', start: 0.045, end: 0.2 }
			]
		}
	 },
	 /*{
	 	name: 'test2',
		types: ['video', 'audio'],
		state: 'loading',
		files: [
			{ path: 'asdf', start: 0, end: 0.5, type: 'video' },
			{ path: 'test', start: 0.55, end: 1, type: 'audio' }	
		]
	 }*/
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
		onClick: (e) => {
			var target = e.target;
			if (target.className === 'main-item') {
				var start = parseInt(target.getAttribute('data-start'));
				var end = parseInt(target.getAttribute('data-end'));

				if (!isNaN(start) && !isNaN(end)) {
					main.window_start = start;
					main.window_end = end;

					main.zoom = (main.range_end - main.range_start) / (end - start);
				}
			}
		},
		getMainItems: (self) => {
			// store as final variable to use inside forEach function
			var window_start = self.window_start, window_end = self.window_end;
			
			if (window_end - window_start <= 0) {
				return [];
			}

			var min_height = 0.1;
			return this.directories.map(dir => {
				var col_width = (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;

				if (typeof dir.files !== 'object') {
					return {
						files: [],
				   		style: { width: col_width }
					}
				}
				
				var files = [];
				var i = 0, type;
				for (type in dir.files) {
					for (var j = 0; j < dir.files[type].length; ++j) {
						var file = dir.files[type][j];

						var top = (file.start - window_start) / (window_end - window_start);				
						var height = (file.end - file.start) / (window_end - window_start);

						var new_item = {
							type: type,
							start: file.start,
							end: file.end,
							group: false,
							group_count: 1
						}

						for (var k = j + 1; k < dir.files[type].length; ++k) {
							var file_next = dir.files[type][k];
							var top_next = (file_next.start - window_start) / (window_end - window_start);
							var height_next = (file_next.end - file_next.start) / (window_end - window_start);

							if (top + Math.max(min_height, height) > top_next) {
								// items overlap group together
								
								new_item.group = true;
								new_item.group_count++;
								new_item.end = file_next.end;
								height = top_next - top + height_next;

							} else break;
						}
						j = k - 1;

						console.log(new_item);

						if (!new_item.group) {
							new_item.path = file.path;
						}
						new_item.style = {
							top: top * 100 + '%',
							height: height * 100 + '%',
							left: (i * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING) + 'px',
							width: COL_ITEM_WIDTH + 'px'
						};
						
						files.push(new_item);
					}
					i++;
				}

				var col_width = i * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;				
				return {
					files: files,
					style: { width: col_width }
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

			//var norm_range = range * Math.pow(10, -Math.floor(Math.log10(range)));
	
			var step = 0;
			var i = 0, j = 0;
			for (i = 0, j = 0; i + j < nice_powers.length + nice_steps.length; i = (i + 1) % nice_steps.length) {
				step = nice_powers[j] * nice_steps[i];
				if (range / step < 10) {
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

			//console.log(step);
		
			return timestamps;
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
				if (typeof dir.files !== 'object') return;

				var types = Object.keys(dir.files);
				var width = Math.max(1, types.length) * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;
				
				data.push({
					name: dir.name,
					types: types,
					state: dir.state,
					style: { width: width + 'px' }
				});
			});
			return data;
		}
	}
});

function parseDates() {
	var date_min = 0, date_max = 0;
	directories.forEach(dir =>  {
		dir.files = dir.files.map(f => {
			var start = new Date('2019-01-02 ' + f.start);
			var end = new Date('2019-01-02 ' + f.end);

			f.start = start.getTime();
			f.end = end.getTime();

			if (date_min === 0 || date_min > f.start) date_min = f.start;
			if (date_max === 0 || date_max < f.end) date_max = f.end;

			return f;
		});
	});

	//console.log(directories);

	main.window_start = date_min;
	main.range_start = date_min;

	main.window_end = date_max;
	main.range_end = date_max;

	main.zoom = 1;
}


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
	openDirectory().forEach(element => {
		// create new column
		var new_dir = {
			name: element.dirname,
			types: [],
			state: 'loading' // initialize in loading state to show loader animation
		};

		main.directories.push(new_dir);

		main.$forceUpdate();
		header.$forceUpdate();

		element.promise.then(data => {
			var range_start = main.range_start;
			var range_end = main.range_end;

			var files = {};

			for (item of data) {
				// add 
				if (!(item.type in files)) files[item.type] = [];

				var start = item.birthtime;
				var end = start + item.duration * 1000;
				if (range_start === 0 || range_start > start) {
					// update if current start is bigger than this files start to find the minimum
					range_start = start;
				}
				if (range_end === 0 || range_end < end) {
					range_end = end;
				}

				files[item.type].push({
					path: item.path,
					start: start,
					end: end
				});
			}

			main.range_start = range_start;
			main.range_end = range_end;
			main.window_start = range_start;
			main.window_end = range_end;
			
			new_dir.files = files;
			new_dir.state = 'done';

			console.log(files);
			//main.$forceUpdate();
			header.$forceUpdate();
		}).catch(err => {
			//columnContainer.removeChild(column);
			console.log('error', err);
			new_dir.state = 'error';
		});			
	});
});

