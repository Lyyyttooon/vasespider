// All the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('damaiRequest', {
  getTicketsInfo: () => ipcRenderer.send('getTicketsInfo')
})
