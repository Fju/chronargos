const { app, BrowserWindow, ipcMain, Tray } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		frame: false,
		//radii: [5, 5, 5, 5],
		//transparent: true,
		//opacity: 1,
		width: 300,
		minWidth: 300,
		height: 640,
		backgroundColor: '#292c33',
		skipTaskbar: true,
		icon: __dirname + '/images/icon_64x64.png'
	});

	// and load the index.html of the app.
	win.loadFile(__dirname + '/index.html');

	win.setMenuBarVisibility(false)
	//win.setMenu(null);
	
	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});

	// create tray icon
	var appTray = new Tray(__dirname + '/images/icon_48x48.png');
	appTray.setToolTip('chronargos');
	appTray.on('click', () => {
		if (win.isMinimized()) win.restore();
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('ondragstart', (event, filePaths) => {
	console.log(filePaths);
	event.sender.startDrag({
		files: filePaths,
		icon: 'images/drag_icon.png'
	});
});
