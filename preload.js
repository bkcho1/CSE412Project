const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    once: (channel, func) => ipcRenderer.once(channel, (event, ...args) => func(...args)),
    getgdata: (callback) => ipcRenderer.once('got-groomers', callback),
    getcdata: (callback) => ipcRenderer.once('got-customers', callback),
    getadata: (callback) => ipcRenderer.once('got-appointments', callback)
});