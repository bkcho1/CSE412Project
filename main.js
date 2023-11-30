const path = require('path');
const { app, BrowserWindow } = require('electron');
const express = require('express');
const expressApp = express();

expressApp.use(express.static("renderer"))

expressApp.set('view engine', 'ejs');

expressApp.get('/', (req, res) => {
    res.render(path.join(__dirname, './renderer/index.ejs'));
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL('http://localhost:3000');
    mainWindow.removeMenu();
}

app.whenReady().then(() => {
    createWindow();

    const server = expressApp.listen(3000, () => {
        console.log('Express server is running on http://localhost:3000');
    });

    app.on('before-quit', () => {
        server.close();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});