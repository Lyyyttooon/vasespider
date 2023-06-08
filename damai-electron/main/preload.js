/* eslint-disable no-undef */
// All the Node.js APIs are available in the preload process.

const { contextBridge } = require('electron')

// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('damaiRequest', {
  getTicketsIfo: getTicketsIfo
})

function getTicketsIfo() {
  console.log('get tickets info')
}
