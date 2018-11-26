const electron = require('electron');
const url = require('url');
const path = require('path');
const Store = require('./store.js');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

const store = new Store({
    configName: 'user-preferences',
    defaults: {
      windowBounds: { width: 800, height: 600 }
    }
  });

// LISTEN FOR THE APP TO BE READY
app.on('ready', function(){

    let { width, height } = store.get('windowBounds');
    console.log(width);
    

    // CREATE NEW WINDOW
    mainWindow = new BrowserWindow({
        width,
        height,
        frame: false,
        minWidth: 600,
        minHeight: 450,
        backgroundColor: '#142031'
    });

    mainWindow.on('resize', () => {
        let { width, height } = mainWindow.getBounds();
        store.set('windowBounds', { width, height });
    });

    // LOAD HTML FILE INTO WINDOW
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    // BUILD MENU FROM TEMPLATE
    // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // INSERT MENU
    // Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', app.quit);
