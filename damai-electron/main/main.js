const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

const { getRequest, postRequest } = require('./dm')

// 判断命令行脚本的第二参数
const isDevMode = process.argv[2] === 'dev'
const gotTheLock = app.requestSingleInstanceLock()

let mainWindow = null

// createWindow()方法来将index.html加载进一个新的BrowserWindow实例。
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
    // frame:false, // 有没有边框
  })

  // 判断是否是开发模式
  if (isDevMode) {
    mainWindow.loadURL('http://localhost:5173/') // 前端开发环境地址
    mainWindow.webContents.openDevTools() // 自动打开控制台
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow.destroy()
  })
}

// 启用沙盒
app.enableSandbox()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, _commandLine, _workingDirectory, additionalData) => {
    // Print out data received from the second instance.
    console.log(additionalData)

    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // app主进程的事件和方法
  // 只有在ready事件被激发后才能创建浏览器窗口
  app.whenReady().then(() => {
    // ipc事件
    ipcMain.handle('getRequest', (_, data) => getRequest(data))
    ipcMain.handle('postRequest', (_, data) => postRequest(data))

    createWindow()

    // 针对macos系统，在没有浏览器窗口打开的情况下调用你仅存的 createWindow() 方法
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}

// 关闭所有窗口通常会完全退出一个应用程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
