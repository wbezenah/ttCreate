const { Menu } = require('electron');

//ADDED CODE TO SET MENU
const template = [
  {
    label: 'File',
    submenu: [
      { 
        label: 'Save File',
        accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S'
      },
      {
        role: 'Quit'
      }
    ]
  },
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
      }
    ]
   },
   
   {
    label: 'View',
    submenu: [
      {
        role: 'reload'
      },
      {
        role: 'toggledevtools'
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
   },
   
   {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      }
    ]
   },
   
   {
    role: 'help',
    submenu: [
      {
        label: 'Learn More'
      }
    ]
   }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
//MENU DONE

exports.ApplicationMenu = menu;