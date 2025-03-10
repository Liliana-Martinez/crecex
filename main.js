const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL('http://localhost:4200');
  win.webContents.openDevTools();
  win.setMenu(null);
  //win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})