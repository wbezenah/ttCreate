import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {

  constructor() { }

  private width: number = 800;
  private height: number = 450;

  windowSizeUpdate: Subject<{width: number, height: number}> = new Subject<{width: number, height: number}>();

  get windowWidth(): number {
    return this.width;
  }

  get windowHeight(): number {
    return this.height;
  }

  setWindowWidth(width: number) {
    this.width = width;
    this.windowSizeUpdate.next({width: this.width, height: this.height});
  }

  setWindowHeight(height: number) {
    this.height = height;
    this.windowSizeUpdate.next({width: this.width, height: this.height});
  }

  setWindowDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.windowSizeUpdate.next({width: this.width, height: this.height});
  }
}
