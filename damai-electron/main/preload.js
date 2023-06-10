// All the Node.js APIs are available in the preload process.
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('damaiRequest', {
  getRequest: (data) => ipcRenderer.invoke('getRequest', data),
  postRequest: (data) => ipcRenderer.invoke('postRequest', data)
})
