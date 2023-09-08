import { app, BrowserWindow, screen, ipcMain, IpcMainEvent } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { IPCChannels, WindowFunc } from '../src/app/shared/electron-com';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;
  const width = Math.trunc(size.width * 2 / 3);
  const height = Math.trunc(size.height * 2 / 3);

  // Create the browser window.
  win = new BrowserWindow({
    x: Math.trunc((size.width - width) / 2),
    y: Math.trunc((size.height - height) / 2),
    width: width,
    height: height,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.on('maximize', () => {
    win.webContents.send(IPCChannels.windowRes, [{max: true}]);
  });

  win.on('unmaximize', () => {
    win.webContents.send(IPCChannels.windowRes, [{max: false}]);
  });

  ipcMain.on(IPCChannels.windowFunc, (event: IpcMainEvent, winFunc: WindowFunc) => {
    if(win[winFunc] && typeof win[winFunc] == 'function') {
      win[winFunc]();
    }
  });

  ipcMain.on(IPCChannels.windowMax, () => {
    let winMax = win.isMaximized();
    win.webContents.send(IPCChannels.windowRes, [{max: winMax}]);
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    // Clean up all ipcMain listeners
    for(let channel of Object.keys(IPCChannels)) {
      ipcMain.removeAllListeners(channel);
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}