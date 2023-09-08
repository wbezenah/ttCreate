import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { Channels, WindowFunc } from '../../shared/electron-com';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {
    document.getElementById('close-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(Channels.windowFunc, [WindowFunc.close]);
    });

    document.getElementById('min-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(Channels.windowFunc, [WindowFunc.min]);
    });

    document.getElementById('restore-button').addEventListener("click", event => {
      this.electronService.send(Channels.windowFunc, [WindowFunc.unmax]);
    });

    document.getElementById('max-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(Channels.windowFunc, [WindowFunc.max]);
    });

    this.electronService.addRendererListener(Channels.windowRes, (event, args: any[]) => {
      if(args.length == 1 && 'max' in args[0]) {
        let maxButton = document.getElementById('max-button');
        let restoreButton = document.getElementById('restore-button');

        if(args[0].max) {
          maxButton.classList.add('maximized');
          restoreButton.classList.add('maximized');

        }else {
          maxButton.classList.remove('maximized');
          restoreButton.classList.remove('maximized');
        }
      }
    });
  }
}
