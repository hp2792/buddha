'use strict';

const electron = require('electron');
const {
    app,
    Menu
} = require('electron');
const nativeImage = require('electron').nativeImage;
const log = require('electron-log');
const {
    autoUpdater
} = require("electron-updater");
// const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {
    shell
} = require('electron');

const {
    dialog
} = require('electron')
//For File and...save
const fs = require('fs');
const qs = require("querystring");

const path = require('path');
const url = require('url');
//var express = require('express');

var testFolder = __dirname;
var xhtmlURL = null;
var pdfURL = null;

//let mainWindow;
var mainWindow = null;

//var another = require(__dirname+'/index.js');


function fileread() {
    pdfURL = testFolder;
    /* console.log(pdfURL.replace(/^.*[\\\/]/, ''));*/
    xhtmlURL = testFolder.replace('.pdf', '.xhtml');
    //dialog.showMessageBox({message:xhtmlURL.toString()});
    if (fs.existsSync(xhtmlURL.toString())) {
        fs.readFile(xhtmlURL, 'utf8', callBackFunction);
    } else {
        dialog.showMessageBox({
            message: 'Mapped xhtml file not found in the selected path'
        });
    }
}


function editor() {

    xhtmlURL = testFolder;
    pdfURL = testFolder.replace('.xhtml', '.pdf');
    fs.readFile(xhtmlURL, 'utf8', callBackopen);
}

function callBackopen(err, data) {
    if (err) throw err;
    pdfURL = xhtmlURL;
    const param = qs.stringify({
        file: pdfURL
    });
    mainWindow = new BrowserWindow({
        show: false,
        useContentSize: true,
        width: 1422,
        height: 614,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });
    mainWindow.maximize()
    mainWindow.show()
    mainWindow.loadURL('file://' + __dirname + '/pdfjs/web/editor.html?' + param);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function videoOpen() {
    //mainWindow = new BrowserWindow({show: false,
    //useContentSize:true,
    //width: 1422,
    //height: 614,
    //webPreferences: {
    //nodeIntegration: true,
    //webSecurity: false,
    //},
    //});
    //mainWindow.maximize()
    //mainWindow.show()
    //mainWindow.loadURL('https://vimeo.com/240680458');
    //mainWindow.on('closed', function() {
    //mainWindow = null;
    //});
    shell.openItem('https://vimeo.com/240680458');
}



function callBackFunction(err, data) {
    if (err) throw err;
    pdfURL = pdfURL + "::" + xhtmlURL;
    const param = qs.stringify({
        file: pdfURL
    });
    mainWindow = new BrowserWindow({
        useContentSize: true,
        width: 1422,
        height: 612,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });
    mainWindow.loadURL('file://' + __dirname + '/pdfjs/web/index.html?' + param);
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}


app.on('ready', function () {
    mainWindow = new BrowserWindow({
        show: false,
        useContentSize: true,
        width: 1422,
        height: 612,
        minWidth: 802,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });

    /* mainWindow.loadURL('file://' + __dirname + '/pdfjs/web/diffViewer.html'); */
    mainWindow.maximize();
    //    mainWindow.show();
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.hide();
    var image = nativeImage.createFromPath(__dirname + '/images/humbMenu.png');

    const template = [
        {
            label: 'File',
            submenu: [{
                label: 'Open with',
                submenu: [
                    {
                        label: 'wyCiwyg',
                        //        icon: image,
                        click: (item, focusedWindow) => {
                            var error = "";
                            var getFileName = dialog.showOpenDialog({
                                properties: ['openFile'],
                                filters: [{
                                    name: 'PDF Files',
                                    extensions: ['pdf']
                                }
                                ]
                            })
                            if (getFileName != null) {
                                testFolder = getFileName.toString();
                                fileread();
                            }
                        }
                    },
                    {
                        label: 'Editor',
                        click: (item, focusedWindow) => {
                            var error = "";
                            var getFileName = dialog.showOpenDialog({
                                properties: ['openFile'],
                                filters: [{
                                    name: 'XHTML Files',
                                    extensions: ['xhtml']
                                }
                                ]
                            })
                            if (getFileName != null) {
                                testFolder = getFileName.toString();
                                editor();
                            }
                        }
                    }
                ]
            }]
        },
        //     {
        //    label: 'Access',
        //    submenu: [
        //        {
        //        label: "Sign in",
        //        click: () => {
        //            let focusedWindow    = BrowserWindow.getFocusedWindow();
        //            console.log(focusedWindow);
        //          focusedWindow.webContents.executeJavaScript("if(window.location.pathname.toLowerCase().endsWith('offline.html')){window.location.href = 'sign-in.html'}else if(window.location.pathname.toLowerCase().endsWith('index.html')){}else{}");
        //         }
        //      },{
        //        label: "Sign out",
        //        click: () => {
        //            let focusedWindow    = BrowserWindow.getFocusedWindow();
        //          focusedWindow.webContents.executeJavaScript("if(window.location.pathname.toLowerCase().endsWith('index.html')){sessionStorage.setItem('url', '');sessionStorage.setItem('username', '');sessionStorage.setItem('password', '');window.location.href = 'sign-in.html'}else{alert('Please sign in');}");
        //         }
        //      }]},
        {
            label: 'Edit',
            submenu: [
                {
                    role: 'undo'
                },
                {
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
                {
                    role: 'pasteandmatchstyle'
                },
                {
                    role: 'delete'
                },
                {
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload'
                },
                //      {role: 'forcereload'},
                {
                    role: 'toggledevtools'
                },
                //      {type: 'separator'},
                //      {role: 'resetzoom'},
                //      {role: 'zoomin'},
                //      {role: 'zoomout'},
                //      {type: 'separator'},
                //      {role: 'togglefullscreen'}
            ]
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        },
        //  {
        //    role: 'help',
        //    submenu: [
        //      {
        //        label: 'Tour',
        //        click: () => { videoOpen();}
        //      }
        //    ]
        //  },
        {
            label: 'Version',
            submenu: [
                {
                    label: '1.2.1'
                }
            ]
        }
    ]




    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                /*      {role: 'about'},
                      {type: 'separator'},*/
                {
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    role: 'toggledevtools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        })

        // Edit menu
        template[2].submenu.push({
            type: 'separator'
        }, {
                label: 'Speech',
                submenu: [
                    {
                        role: 'startspeaking'
                    },
                    {
                        role: 'stopspeaking'
                    }
                ]
            })

        // Window menu
        template[3].submenu = [
            {
                role: 'close'
            },
            {
                role: 'minimize'
            },
            {
                role: 'zoom'
            },
            {
                type: 'separator'
            }, {
                role: 'reload'
            },
            {
                role: 'front'
            }
        ]
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

app.on('activate', function () {

    if (mainWindow === null) {
        //createWindow();
    }
});


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
let win;

function sendStatusToWindow(text) {
    try {
        log.info(text);
        win.webContents.send('message', text);
    } catch (e) { }
}

function onProgress(progress) {
    // Use values 0 to 1, or -1 to hide the progress bar
    try {
        win.setProgressBar(progress) // Progress bar works on all platforms
    } catch (e) { }
}


function createDefaultWindow() {
    win = new BrowserWindow({
        useContentSize: true,
        width: 300,
        height: 100
    });
    win.hide();
    //win.webContents.openDevTools();
    win.setMenu(null);
    win.on('closed', () => {
        win = null;
    });
    win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
    return win;
}
autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    win.show();
    sendStatusToWindow('Please wait while the update is being installed');
})
autoUpdater.on('update-not-available', (info) => {
    mainWindow.show();
    win.destroy();
})
autoUpdater.on('error', (err) => {
    mainWindow.show();
    //    win.hide();
    win.destroy();
    sendStatusToWindow(err);
})
autoUpdater.on('download-progress', (progressObj) => {

    // onProgress(progressObj.percent);
    var progress = progressObj.percent / 100;
    onProgress(progress);
})
autoUpdater.on('update-downloaded', (info) => {
    //sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
    if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});

if (shouldQuit) {
    app.quit();
    return;
}

/*app.on('ready', function () {
    // Create the Menu


});*/
app.on('window-all-closed', () => {
    app.quit();
});


autoUpdater.on('update-downloaded', (info) => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 5 seconds.
    // You could call autoUpdater.quitAndInstall(); immediately
    setTimeout(function () {
        autoUpdater.quitAndInstall();
    }, 5000)
})

app.on('ready', function () {
    autoUpdater.checkForUpdates();
    createDefaultWindow();
});
