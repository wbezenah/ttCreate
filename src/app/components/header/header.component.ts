import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { IPCChannels, WindowFunc } from '../../shared/electron-com';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  menus: {label: string, open: boolean, submenu: any[]}[] = [
    { label: 'File', open: false, submenu: [{label: 'Save File'}, {label: 'Open File'}, {label: 'Settings'}, {label: 'Exit'}] },
    { label: 'Edit', open: false, submenu: [{label: 'Undo'}, {label: 'Redo'}, {label: 'Cut'}, {label: 'Copy'}, {label: 'Paste'}] },
    { label: 'Help', open: false, submenu: [{label: 'About'}, {label: 'Discord!'}] }
  ];

  menuButtons: HTMLCollectionOf<Element>;
  menuDropdowns: HTMLCollectionOf<Element>;

  private titlebarOpen: boolean = false;

  constructor(
    private electronService: ElectronService,
  ) { }

  ngOnInit(): void {
    // Add click listeners for all appropriate header elements (close, maximize, etc.)
    document.getElementById('close-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(IPCChannels.windowFunc, WindowFunc.close);
    });

    document.getElementById('min-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(IPCChannels.windowFunc, WindowFunc.min);
    });

    document.getElementById('restore-button').addEventListener("click", event => {
      this.electronService.send(IPCChannels.windowFunc, WindowFunc.unmax);
    });

    document.getElementById('max-button').addEventListener('click', (event: MouseEvent) => {
      this.electronService.send(IPCChannels.windowFunc, WindowFunc.max);
    });

    // Listen for window maximize updates
    this.electronService.addRendererListener(IPCChannels.windowRes, (event, args: any[]) => {
      for(let i = 0; i < args.length; i++) {
        if('max' in args[i]) {
          let titlebarElement: HTMLElement = document.getElementById('titlebar');
  
          if(args[i].max) {
            titlebarElement.classList.add('maximized');
  
          }else {
            titlebarElement.classList.remove('maximized');
          }
        }
      }
    });

    // Check if window is initially maximized
    this.electronService.send(IPCChannels.windowMax);
  }

  /*
    ngAfterViewInit()
    - Angular lifecycle hook that sets computed styles for menu elements added via ngFor
  */
  ngAfterViewInit(): void {
    this.menuButtons = document.getElementsByClassName('menu-button');
    this.menuDropdowns = document.getElementsByClassName('dropdown-content');
    for(let i = 0; i < this.menuButtons.length; i++) {
      let currElement = this.menuButtons.item(i) as HTMLElement;
      currElement.style.gridColumn = (i + 2) + '';

      if(i < this.menuDropdowns.length) {
        let menuElement = this.menuDropdowns.item(i) as HTMLElement;
        menuElement.style.left = currElement.getBoundingClientRect().left.toString() + 'px';
        let titlebarElement: HTMLElement = document.getElementById('titlebar');
        menuElement.style.top = (titlebarElement.getBoundingClientRect().bottom - 4).toString() + 'px';
      }
    }
  }

  /*
    onWindowClick
    - listens for mouse clicks and shows/hides appropriate menus
  */
  @HostListener('window:click', ['$event']) onWindowClick(event: MouseEvent) {
    if(!this.menuButtons) { return; }
    if(this.titlebarOpen) {
      this.closeMenus();
      this.titlebarOpen = false;
      return;
    }

    for(let i = 0; i < this.menuButtons.length; i++) {
      let currElement: HTMLElement = this.menuButtons.item(i) as HTMLElement;
      if(currElement.contains(event.target as any)) {
        this.titlebarOpen = true;
        currElement.classList.add('dropdown-open');
        return;
      }
    }
  }

  /*
    onMouseMove
    - listens for mousemove events and updates menu dropdowns if the titlebar is open
  */
  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if(!this.titlebarOpen) { return; }
    for(let i = 0; i< this.menuButtons.length; i++) {
      let currElement: HTMLElement = this.menuButtons.item(i) as HTMLElement;
      if(currElement.contains(event.target as any)) {
        this.closeMenus([i]);
        currElement.classList.add('dropdown-open');
      }
    }
  }

  /*
    closeMenus(excludeIndices?: number[])
    - closes all titlebar menus except for the ones at this.menuButtons indices specified by excludeIndices
  */
  private closeMenus(excludeIndices?: number[]): void {
    for(let i = 0; i < this.menuButtons.length; i++) {
      let currElement: HTMLElement = this.menuButtons.item(i) as HTMLElement;
      if((!excludeIndices || !excludeIndices.includes(i)) && currElement.classList.contains('dropdown-open')) {
        currElement.classList.remove('dropdown-open');
      }
    }
  }
}
