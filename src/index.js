
const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut } = require('electron');
const path = require('path');
const Timer = require('./app/Timer');

const icon = nativeImage.createFromPath(`${__dirname}/assets/IconTemplate@2x.png`);
let window;
let tray;
let timer = new Timer(updateIcon, icon);
let lastTimer = 'descansar';

const menu = Menu.buildFromTemplate([
  { label: 'codar',  click() { timer.start(process.env.TIMER_JOB || 40) } },
  { label: 'descansar',  click() { timer.start(process.env.TIMER_REST || 10) } },
  { label: 'quanto tempo falta?',  click() { timer.remainingTime() } },
  { label: 'continuar',  click() { if(timer.started || timer.endTime <= 0) return;  timer.continue() } },
  { label: 'pausar',  click() { if(!timer.started) return; timer.pause() } },
  { label: 'fechar', click() { app.quit() } }
]);

function createWindow() {
  window = new BrowserWindow({ show: false, icon });
  window.loadURL(`file://${__dirname}/index.html`);
  window.on('closed', () => { window = null; });
}

function createTrayIcon() {
  tray = new Tray(icon);
  tray.setContextMenu(menu);
  tray.on('click', () => {
    if(timer.toggle() === 'pause') return;
    run();    
  } )
}

function updateIcon() {
  if(!timer.started) return tray.setImage(icon);
  const json = JSON.stringify({ ...timer });
  window.webContents.executeJavaScript(`makeImage(${json})`, false, (dataURL) => {
    tray.setImage(nativeImage.createFromDataURL(dataURL));
  });
}

function registerShortcuts() {
  globalShortcut.register("F6", () => {
    if(timer.toggle() === 'pause') return;
    run();
  });
}

function run() {
  if(lastTimer === 'descansar'){ 
    lastTimer = 'trabalhar';
    return timer.start(process.env.TIMER_JOB || 40) 
  } 
  
  lastTimer = 'descansar';
  return timer.start(process.env.TIMER_REST || 10)
}

app.on('ready', () => { createWindow(); createTrayIcon(); registerShortcuts(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!win) createWindow(); });