// electron/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const distIndex = path.join(__dirname, '..', 'dist', 'glass-house', 'browser','index.html');

  if (fs.existsSync(distIndex)) {
    win.loadFile(distIndex);
  } else {
    win.loadURL('http://localhost:4200');
  }
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
