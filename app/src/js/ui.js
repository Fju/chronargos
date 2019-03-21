var directories = [];

export var data = {
	directories: directories,
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
		console.log('scroll', data.window_start, data.window_end);
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
