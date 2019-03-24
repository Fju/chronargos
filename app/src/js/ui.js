import { openDirectory } from './files.js';


export var data = {
	directories: [],
	zoom: 1.0,
	window_start: 0,
	window_end: 0,
	range_start: 0,
	range_end: 0,
	mouse_pos_y: 0,
	prev_window: false
}

document.addEventListener('wheel', e => {
	// detect scrolling
	e.preventDefault();

	var range = data.range_end - data.range_start;
	if (range === 0) return;

	var window_height = data.window_end - data.window_start;
	var sign = e.deltaY > 0 ? 1 : -1;

	if (e.ctrlKey) {
		var zoom = window_height !== 0 ? (range / window_height) : 1;	
		var zoom_step = zoom;
		
		zoom = Math.max(1, zoom / Math.pow(1.33, sign));
		zoom_step = zoom / zoom_step;

		var new_start = data.window_start + data.mouse_pos_y * window_height * (1 - 1 / zoom_step);
		var new_end = data.window_end - (1 - data.mouse_pos_y) * window_height * (1 - 1 / zoom_step);

		window_height = range / zoom;

		if (new_start < data.range_start) {
			new_start = data.range_start;
			new_end = new_start + window_height;
		} 
	   	if (new_end > data.range_end) {
			new_end = data.range_end;
			new_start = new_end - window_height;
		}

		setWindow(new_start, new_end);
		//console.log('zoom', zoom, data.window_start, data.window_end);
	} else {
		var step = window_height * sign * 0.05;
		if (sign > 0) {
			// scroll down, limit the window end
			data.window_end = Math.min(data.range_end, data.window_end + step);
			data.window_start = data.window_end - window_height;
		} else {
			// scroll up, limit the window start
			data.window_start = Math.max(data.range_start, data.window_start + step);
			data.window_end = data.window_start + window_height;
		}
		//console.log('scroll', data.window_start, data.window_end);
	}
});

export function setRange(start, end) {
	data.range_start = start;
	data.range_end = end;
}

export function setWindow(start, end) {
	data.window_start = start;
	data.window_end = end;
}

export function loadDirectory() {
	openDirectory().forEach(dir => {
		// create default object with the directory's name
		var new_dir = {
			name: dir.dirname,
			types: [],
			files: {},
			state: 'loading'
		}
		
		data.directories.push(new_dir);

		var new_files = {};

		dir.promise.then(async promises => {
			// wait until all files' metadata has been read
			var files = await Promise.all(promises);

			var range_start = data.range_start;
			var range_end = data.range_end;
			
			for (var file of files) {
				// create new array for a specific file type if none already exists
				if (!(file.type in new_files)) new_files[file.type] = [];

				var start = file.birthtime, end = start + file.duration * 1000;
				
				if (!range_start || range_start > start) range_start = start;
				if (!range_end || range_end < end) range_end = end;

				// add file to array
				new_files[file.type].push({
					path: file.path,
					start: start,
					end: end
				});
			}

			new_dir.files = new_files;

			setRange(range_start, range_end);
			setWindow(range_start, range_end);
	
			new_dir.state = 'done';
			new_dir.types = Object.keys(new_dir.files);
		}).catch(err => {
			console.log('error', err);
			new_dir.state = 'error';
		});
	});
}
