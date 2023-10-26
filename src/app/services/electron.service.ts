import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { FileFilter, IpcRendererEvent, ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { IPCChannels } from '../shared/electron-com';
import { Subject } from 'rxjs';
import { FileTypeSet } from '../shared/ttc-types';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;

  private winSize: {width: number, height: number};

  fileResults: Subject<Buffer[]> = new Subject<Buffer[]>();

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;
      this.fs = (window as any).require('fs');

      this.childProcess = (window as any).require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });

      this.ipcRenderer.on(IPCChannels.windowRes, (event: IpcRendererEvent, args: any[]) => {
        for(let i = 0; i < args.length; i++) {
          if('width' in args[i] && 'height' in args[i]) {
            this.winSize = args[i];
          }
        }
      });

      this.ipcRenderer.send(IPCChannels.windowMax);

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  destroy() {
    for(let channel of Object.keys(IPCChannels)) {
      this.ipcRenderer.removeAllListeners(channel);
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
  
  get windowSize() {
    return this.winSize;
  }

  send(channel: string, args?: any) {
    if(this.isElectron && this.ipcRenderer) {
      this.ipcRenderer.send(channel, args);
    }
  }

  addRendererListener(channel: string, listener: (event: IpcRendererEvent, args?: any[]) => void) {
    if(this.isElectron && this.ipcRenderer) {
      this.ipcRenderer.on(channel, listener);
    }
  }

  openFile(contentType: (FileFilter | {extensions: string[], name: string})[], multiple: boolean){
    if(this.isElectron && this.ipcRenderer) {
      if(contentType.length === 0) {
        contentType.push(FileTypeSet.allTypes);
      }

      this.ipcRenderer.send(IPCChannels.loadFile, {contentType: contentType, multiple: multiple});

      this.ipcRenderer.once(IPCChannels.fileRes, (event: IpcRendererEvent, res: string[]) => {
        if(res === undefined) {
          this.fileResults.next([]);
        }
        else if(multiple) {
          let buffers = [];
          for(let filePath of res) {
            buffers.push(this.fs.readFileSync(filePath));
          }
          this.fileResults.next(buffers);
        } else {
          const filePath = res[0];
          this.fileResults.next([this.fs.readFileSync(filePath)]);
        }
      });
    }
  }
}