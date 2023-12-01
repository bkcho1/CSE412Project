const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');

const express = require('express');
const expressApp = express();
const custRouter = require('./routes/customers');
const appmntRouter = require('./routes/appointments');

expressApp.set('view engine', 'ejs');

expressApp.use(express.static("renderer"));
expressApp.use('/customers', custRouter);
expressApp.use('/appointments', appmntRouter);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.removeMenu();
}

app.whenReady().then(() => {
    createWindow();

    const server = expressApp.listen(3000, () => {
        console.log('Express server is running on http://localhost:3000');
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('before-quit', () => {
    server.close();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});