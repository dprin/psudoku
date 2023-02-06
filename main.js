const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true
    })

    win.loadFile('./html/index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (!BrowserWindow.getAllWindows().length) createWindow()
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});