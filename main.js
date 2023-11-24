const path = require('path');
const { app, BrowserWindow } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 700
    });

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
    mainWindow.removeMenu();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});