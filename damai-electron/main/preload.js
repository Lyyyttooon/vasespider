// All the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('damaiRequest', {
  getTicketsDetail: (data) => ipcRenderer.send('getTicketsDetail', data)
})
