const { app, BrowserWindow, ipcMain, Tray, dialog } = require('electron');

const path = require('path');
const os = require('os');
const ffprobe = require('ffprobe');

const FFPROBE_PATH = os.platform() === 'win32' ? 'ffprobe.exe' : 'ffprobe';


let mainWindow;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		frame: false,
		//radii: [5, 5, 5, 5],
		width: 300,
		minWidth: 300,
		height: 640,
		backgroundColor: '#292c33',
		skipTaskbar: true,
		icon: __dirname + '/images/icon_64x64.png',
		webPreferences: {
			nodeIntegration: false, // is default value after Electron v5
			contextIsolation: true, // protect against prototype pollution
			enableRemoteModule: false, // turn off remote
			preload: __dirname + '/preload.js' // use a preload script
		}
	});

	// and load the index.html of the app.
	mainWindow.loadFile(__dirname + '/index.html');

	//win.setMenuBarVisibility(false)
	//win.setMenu(null);

	mainWindow.on('closed', () => {
		mainWindow = null;
	})
	
	// create tray icon
	const appTray = new Tray(__dirname + '/images/icon_48x48.png');
	appTray.setToolTip('chronargos');
	appTray.on('click', () => {
		if (mainWindow.isMinimized()) mainWindow.restore();
	});
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	});
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

ipcMain.handle('app:open-directory-dialog', (event) => {
	// open file dialog where the user can select one or multiple directories
	const dirs = dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] });

	if (!dirs) return [];
	return dirs;
});

ipcMain.on('app:close-window', () => {
	app.quit();
});

ipcMain.on('app:minimize-window', () => {
	mainWindow.minimize();
});

ipcMain.on('app:maximize-window', () => {
	if (mainWindow.isMaximized()) mainWindow.unmaximize();
	else mainWindow.maximize();
});

ipcMain.handle('app:get-ffprobe-metadata', async (event, file_path) => {
	console.log(file_path)
	const result = await ffprobe(file_path, { path: FFPROBE_PATH });
	return result;
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/*ipcMain.on('ondragstart', (event, filePaths) => {
	console.log(filePaths);
	event.sender.startDrag({
		files: filePaths,
		icon: 'images/drag_icon.png'
	});
});*/
