const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const sequelize = require('./sql/sequelize');
const Customer = require('./sql/models/customer');
const Dog = require('./sql/models/dog');
const Groomer = require('./sql/models/groomer');
const Scheduler = require('./sql/models/scheduler');

/*
* creating the windows and front end
*/
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('./renderer/index.html');
    //mainWindow.removeMenu();
}

sequelize.sync({ alter: true }).then(() => {
    console.log('Connection has been established successfully.');
    app.whenReady().then(() => {
        createWindow();
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

ipcMain.on('add-groomer', (e, options) => {
    new_groomer(options);
});

async function new_groomer({ groomer_first_name, groomer_last_name }) {
    try {
        const g = await Groomer.create({ firstName: groomer_first_name, lastName: groomer_last_name });
    }
    catch(err){
        console.log(err);
    }
}

ipcMain.on('get-groomers', () => {
    get_groomers();
});

async function get_groomers() {
    try {
        Groomer.findAll().then(g_data => {
            mainWindow.webContents.send('got-groomers', JSON.stringify(g_data, null, 2));
        });
    }
    catch(err) {
        console.log(err)
    }
}