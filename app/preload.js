const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        openDirectoryDialog() {
            return ipcRenderer.invoke("app:open-directory-dialog");
        },
        closeWindow() {
            ipcRenderer.send('app:close-window');
        },
        minimizeWindow() {
            ipcRenderer.send('app:minimize-window');
        },
        maximizeWindow() {
            ipcRenderer.send('app:maximize-window');
        },
        getFFProbeMetadata(file_path) {
            return ipcRenderer.invoke("app:get-ffprobe-metadata", file_path);
        }
    }
);

