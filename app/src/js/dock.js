import { screen, remote } from 'electron';

console.log(screen.getAllDisplays());
console.log(screen.getPrimaryDisplay());
export var displays = [];

export const DONT_DOCK = 0;
export const DOCK_LEFT = 1;
export const DOCK_RIGHT = 2;

export var dock_mode = DOCK_RIGHT;
export var current_display = 0;


export function setWindowLocation() {
	var win = remote.getCurrentWindow();
	var width = win.getSize()[0];

	var display = screen.getPrimaryDisplay();
	

	var x = win.getPosition()[0];
	if (dock_mode === DOCK_LEFT) {
		x = display.workArea.x;
	} else if (dock_mode === DOCK_RIGHT) {
		x = display.workArea.x + display.workArea.width - width;
	}
	win.setBounds({
		x: x,
		y: display.workArea.y,
		width: width,
		height: display.workArea.height
	});
}

export var dock_choices = [
	{ title: 'Don\'t dock', desc: 'Position window manually where you want it to be', value: DONT_DOCK },
	{ title: 'Dock right', desc: 'Window is locked to the right side of the screen', value: DOCK_RIGHT },
	{ title: 'Dock left', desc: 'Window is locked to the left side of the screen', value: DOCK_LEFT }		
];

export var display_choices = [];
updateDisplays();

function updateDisplays() {
	var all = screen.getAllDisplays();
	var primary = screen.getPrimaryDisplay();

	display_choices = all.map(display => {
		return {
			title: 'Display ' + display.id + (display.id === primary.id ? ' (Primary)' : ''),
			desc: '',
			value: display.id
		};
	});
}


screen.on('display-added', updateDisplays);
screen.on('display-removed', updateDisplays);
screen.on('display-metrics-changed', updateDisplays);


export default {
	dock_mode: dock_mode,
	dock_choices: dock_choices,
	display_choices: display_choices,
	
	setWindowLocation: setWindowLocation
};

