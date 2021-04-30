const { app, BrowserWindow } = require('electron');
const path = require('path');
let topWindow;
let childWindow;

function createWindow() {
  topWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
    kiosk: true
  });
  childWindow = new BrowserWindow({
    parent: topWindow,
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    modal: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: true
    }
  });
  
  topWindow.loadURL('http://silvanatagliatella.cloud.med.br');
  childWindow.loadURL(`file://${__dirname}/index.html`);

  childWindow.on('blur', () => { childWindow.hide() })
  
  topWindow.on('closed', () => { topWindow.destroy(); });
  childWindow.on('closed', () => { childWindow.destroy(); });

  topWindow.webContents.openDevTools();

  topWindow.webContents.on('dom-ready', async e => {
    const code = `
      setInterval(() => {
        const containerButton = document.getElementsByClassName('upload').item(0);
        if(containerButton){
          createNewButtonUploader(containerButton)
        }
      }, 1000)

      function createNewButtonUploader(container) {
        const buttonUpload = document.getElementById('newbuttonupload');

        console.log(buttonUpload)
      
        buttonUpload.onclick = () => {
          const camera = document.createElement('div')
          const video = document.createElement('video')
          camera.id = 'my_camera'
          camera.appendChild(video)
      
          container.removeChild(buttonUpload)
          container.appendChild(camera)
          takeAPicture()
        }
        container.appendChild(buttonUpload)
      
      }
      function takeAPicture() {
        console.log(navigator)
      }   
    `
    console.log(await topWindow.webContents.executeJavaScript(code))
  })
}



app.on('ready', () => { 
  createWindow(); 
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });