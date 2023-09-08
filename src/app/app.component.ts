import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from './services/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private ngZone: NgZone,
  ) {
    // this.translate.setDefaultLang('en');
    // console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      // console.log(process.env);
      // console.log('Run in electron');
      // console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      // console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      // console.log('Run in browser');
    }
  }

  ngOnInit(): void {
    if(this.electronService.isElectron) {
      
    }
  }
}