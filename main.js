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
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('./renderer/index.html');
    mainWindow.removeMenu();
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

/*
*   Groomer proccesses
*/
ipcMain.on('add-groomer', (e, options) => {
    new_groomer(options);
});

async function new_groomer({ groomer_first_name, groomer_last_name }) {
    try {
        await Groomer.create({ firstName: groomer_first_name, lastName: groomer_last_name });

        mainWindow.webContents.send('groomer-added');
    }
    catch(err){
        console.log(err);
    }
}

ipcMain.on('remove-groomer', (e, options) => {
    remove_groomer(options)
});

async function remove_groomer(gid) {
    try {
        await Scheduler.destroy({
            where: {
                gid: gid
            }
        });
        await Groomer.destroy({
            where: {
                id: gid
            }
        });

        mainWindow.webContents.send('groomer-deleted');
    }
    catch(err) {
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
        console.log(err);
    }
}

/*
*   Customer processes
*/
ipcMain.on('add-customer', (e, options) => {
    new_customer(options);
});

async function new_customer({ cfname, clname, cphonenum, caddress, cemail }) {
    try {
        const cust = await Customer.create({ firstName: cfname, lastName: clname, phoneNum: cphonenum, address: caddress, email: cemail });
        mainWindow.webContents.send('customer-added', cust.dataValues.id);
    }
    catch(err){
        console.log(err);
    }
}

ipcMain.on('add-dog', (e, options) => {
    new_dog(options);
});

async function new_dog({ dname, dbreed, dage, dsi, dhc, dcomment, c_key }){
    try {
        await Dog.create({ name: dname, breed: dbreed, age: dage, specialInstructions: dsi, healthConditions: dhc, comments: dcomment, CustomerId: c_key });
        mainWindow.webContents.send('dog-added');
    }
    catch(err){
        console.log(err);
    }
}

ipcMain.on('remove-customer-by-id', (e, options) => {
    remove_customer_by_id(options)
});

async function remove_customer_by_id(cid) {
    try {
        await Dog.destroy({
            where: {
                CustomerId: cid
            }
        });
        await Scheduler.destroy({
            where: {
                cid: cid
            }
        });
        await Customer.destroy({
            where: {
                id: cid
            }
        });
        mainWindow.webContents.send('customer-deleted');
    }
    catch(err) {
        console.log(err);
    }
}

ipcMain.on('remove-customer-by-namephone', (e, options) => {
    remove_customer_by_namephone(options)
});

async function remove_customer_by_namephone({ fname, lname, phone}) {
    try {
        const cust = await Customer.findOne({
            where: {
                firstName: fname,
                lastName: lname,
                phoneNum: phone
            }
        });

        await Dog.destroy({
            where: {
                CustomerId: cust.dataValues.id
            }
        });
        await Scheduler.destroy({
            where: {
                cid: cust.dataValues.id
            }
        });
        await Customer.destroy({
            where: {
                id: cust.dataValues.id
            }
        });
        mainWindow.webContents.send('customer-deleted');
    }
    catch(err) {
        console.log(err);
    }
}

ipcMain.on('get-customers', () => {
    get_customers();
});

async function get_customers() {
    try {
        await Customer.findAll().then(c_data => {
            mainWindow.webContents.send('got-customers', JSON.stringify(c_data, null, 2))
        });
    }
    catch(err) {
        console.log(err);
    }
}

ipcMain.on('get-one-customer', (e, cid) => {
    get_one_customer(cid);
});

async function get_one_customer(cid) {
    try {
        await Customer.findByPk(cid).then(c_data => {
            mainWindow.webContents.send('got-one-customer', JSON.stringify(c_data, null, 2))
        });
    }
    catch(err) {
        console.log(err);
    }
}

ipcMain.on('get-dogs', (e,cid) => {
    get_dogs(cid);
});

async function get_dogs(cid){
    try {
        await Dog.findAll({
            where:{
                CustomerId: cid
            }
        }).then(g_data => {
            mainWindow.webContents.send('got-dogs', JSON.stringify(g_data, null, 2))
        });
    }
    catch(err) {
        console.log(err);
    }
}

/*
*   Appointment processes
*/

ipcMain.on('add-appointment', (e, options) => {
    new_appointment(options);
});

async function new_appointment({ agid, acfname, aclname, acphonenum, adate, atime }) {
    try {
        const appoint_cust = await Customer.findOne({
            where: {
                firstName: acfname,
                lastName: aclname,
                phoneNum: acphonenum
            }
        });
        await Scheduler.create({
            date: adate,
            time: atime,
            cid: appoint_cust.dataValues.id,
            gid: agid
        });

        mainWindow.webContents.send('appointment-added');
    }
    catch(err) {
        console.log(err);
    }
}

ipcMain.on('remove-appointment', (e, options) => {
    remove_appointment(options)
});

async function remove_appointment({ ragid, racfname, raclname, racphonenum, radate, ratime }) {
    try {
        const rac_cust = await Customer.findOne({
            where: {
                firstName: racfname,
                lastName: raclname,
                phoneNum: racphonenum
            }
        });
        await Scheduler.destroy({
            where: {
                cid: rac_cust.dataValues.id,
                gid: ragid,
                date: radate,
                time: ratime
            }
        });
        mainWindow.webContents.send('appointment-deleted');
    }
    catch(err) {
        console.log(err);
    }
}

ipcMain.on('get-appointments', (e, options) => {
    get_appointments(options);
});

async function get_appointments({ gagid, gadate }) {
    try {
        let appointment_data = []
        const schedule_data = await Scheduler.findAll({
            where: {
                gid: gagid,
                date: gadate
            }
        });

        let data_all = JSON.stringify(schedule_data, null, 2);
        data_all = JSON.parse(data_all)

        let times = [];
        let cids = [];
        for(let i = 0; i < data_all.length; i++){
            times.push(data_all[i].time)
            cids.push(data_all[i].cid)
        }

        let cnames = [];
        let dogs = [];
        for(let i = 0; i < cids.length; i++){
            const cust_data = await Customer.findByPk(cids[i]);
            let data_cust = JSON.stringify(cust_data, null, 2);
            data_cust = JSON.parse(data_cust);
            cnames.push(data_cust.lastName);

            const dog_data = await Dog.findAll({
                where:{
                    CustomerId: cids[i]
                }
            });
            let data_dog_array = [];
            let data_dog = JSON.stringify(dog_data, null, 2);
            data_dog = JSON.parse(data_dog);
            for(let j = 0; j < data_dog.length; j++){
                data_dog_array.push(data_dog[j].name)
            }
            dogs.push(data_dog_array)
        }
        
        for(let i = 0; i < data_all.length; i++){
            let appointment_data_point = {};
            appointment_data_point['time'] = times[i];
            appointment_data_point['name'] = cnames[i];
            appointment_data_point['dogs'] = dogs[i]; 
            appointment_data.push(appointment_data_point);
        }

        //console.log(JSON.stringify(appointment_data));
        mainWindow.webContents.send('got-appointments', JSON.stringify(appointment_data))
    }
    catch(err) {
        console.log(err);
    }
}
