import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { IPCChannels, WindowFunc } from '../../shared/electron-com';

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

    // Add click listeners for all appropriate header elements (close, maximize, etc.)
    document.getElementById('close-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(IPCChannels.windowFunc, [WindowFunc.close]);
    });

    document.getElementById('min-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(IPCChannels.windowFunc, [WindowFunc.min]);
    });

    document.getElementById('restore-button').addEventListener("click", event => {
      this.electronService.send(IPCChannels.windowFunc, [WindowFunc.unmax]);
    });

    document.getElementById('max-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(IPCChannels.windowFunc, [WindowFunc.max]);
    });

    // Listen for window maximize updates
    this.electronService.addRendererListener(IPCChannels.windowRes, (event, args: any[]) => {
      if(args.length == 1 && 'max' in args[0]) {
        let titlebarElement: HTMLElement = document.getElementById('titlebar');

        if(args[0].max) {
          titlebarElement.classList.add('maximized');

        }else {
          titlebarElement.classList.remove('maximized');
        }
      }
    });

    // Check if window is initially maximized
    this.electronService.send(IPCChannels.windowMax);
  }
}
