//import { screen, remote } from 'electron';


const DONT_DOCK = 0;
const DOCK_LEFT = 1;
const DOCK_RIGHT = 2;

var dock = {
	dock_mode: DONT_DOCK,
	display_id: 0,
	setWindowLocation: function() {
		var win = remote.getCurrentWindow();
		var width = win.getSize()[0];

		var display = screen.getPrimaryDisplay();

		var x = 0;
		if (this.dock_mode === DOCK_LEFT) {
			x = display.workArea.x;
		} else if (this.dock_mode === DOCK_RIGHT) {
			x = display.workArea.x + display.workArea.width - width;
		} else {
			//win.setSize(width, 640);
			//win.center();
			//return;
		}

		win.setBounds({
			x: x,
			y: display.workArea.y,
			width: width,
			height: display.workArea.height
		});
	},
	dock_choices: [
		{ title: 'Dock right', desc: 'Window is locked to the right side of the screen', value: DOCK_RIGHT },
		{ title: 'Dock left', desc: 'Window is locked to the left side of the screen', value: DOCK_LEFT }		
	],
	display_choices: [],
	updateDisplays: function() {
		var all = screen.getAllDisplays();
		var primary = screen.getPrimaryDisplay();

		this.display_choices = all.map(display => {
			var dimensions = display.size;
			return {
				title: 'Display ' + display.id + ' (' + dimensions.width + 'x' + dimensions.height + (display.id === primary.id ? ', Primary)' : ')'),
				desc: '',
				value: display.id
			};
		});
	}
}

dock.updateDisplays();

screen.on('display-added', dock.updateDisplays);
screen.on('display-removed', dock.updateDisplays);
screen.on('display-metrics-changed', dock.updateDisplays);

export default dock;

