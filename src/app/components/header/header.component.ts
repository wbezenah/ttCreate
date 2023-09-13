import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { IPCChannels, WindowFunc } from '../../shared/electron-com';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  fileMenuOpen: boolean = false;
  editMenuOpen: boolean = false;
  windowMenuOpen: boolean = false;
  helpMenuOpen: boolean = false;

  menus: {label: string, open: boolean, submenu: any[]}[] = [
    { label: 'File', open: false, submenu: [{label: 'Save File'}, {label: 'Open File'}, {label: 'Settings'}, {label: 'Exit'}] },
    { label: 'Edit', open: false, submenu: [{label: 'Undo'}, {label: 'Redo'}, {label: 'Cut'}, {label: 'Copy'}, {label: 'Paste'}] },
    { label: 'Help', open: false, submenu: [{label: 'About'}, {label: 'Discord!'}] }
  ];

  menuButtons: HTMLCollectionOf<Element>;

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

  ngAfterViewInit(): void {
    this.menuButtons = document.getElementsByClassName('menu-button');
    let menuDropdowns = document.getElementsByClassName('dropdown-content');
    for(let i = 0; i < this.menuButtons.length; i++) {
      let currElement = this.menuButtons.item(i) as HTMLElement;
      currElement.addEventListener('click', (event) => {
        this.menus[i].open = !this.menus[i].open;
      });
      currElement.style.gridColumn = (i + 2) + '';

      if(i < menuDropdowns.length) {
        let menuElement = menuDropdowns.item(i) as HTMLElement;
        console.log(menuElement);
        menuElement.style.left = currElement.getBoundingClientRect().left.toString() + 'px';
        menuElement.style.top = (currElement.getBoundingClientRect().top + currElement.getBoundingClientRect().height).toString() + 'px';
      }
    }
  }
}
