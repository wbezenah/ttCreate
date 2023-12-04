import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Token } from '../../../models/assets/token.model';
import { ElectronService } from '../../../services/electron.service';
import { Circle, Rectangle, Shape, Square, toRectangle } from '../../../shared/shapes-math';
import { ProjectService } from '../../../services/project.service';
import { Subscription } from 'rxjs';
import { AssetType } from '../../../shared/ttc-types';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit, AfterViewInit, OnDestroy{
  
  public tokenInfo: Token = new Token('', -1);

  // get boundary() {
  //   return {top: -1, left: -1, width: -1, height: -1};
  // }
  
  width: number = 50;
  height: number = 50;

  get backgroundImage():string {
    return `url('${this.tokenInfo.backgroundImgURL}')`;
  }

  private subscriptions: Subscription[] = [];

  private token_element: HTMLElement;

  constructor(
    private electronService: ElectronService,
    private projectService: ProjectService,
    private elRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.projectService.assetUpdate.subscribe(
      (value: {type: AssetType, index: number, updates: {property: string, val: any}[]}) => {
        if(value.type == AssetType.TOKEN && value.index == this.tokenInfo.index) {
          for(let update of value.updates) {
            if(update.property == 'shape') {
              this.updateDisplayShape();
            }
          }
        }
      }
    ));
  }

  ngOnDestroy(): void {
    const boundingRect = this.token_element.getBoundingClientRect();
    this.projectService.updateAsset(AssetType.TOKEN, this.tokenInfo.index, {property: 'top', val: boundingRect.top}, {property: 'left', val: boundingRect.left});
    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.token_element = document.getElementsByClassName('token-comp').item(0) as HTMLElement;
    this.token_element.style.left = this.tokenInfo.left + 'px';
    this.token_element.style.top = this.tokenInfo.top + 'px';

    console.log(this.token_element)

    this.updateDisplayShape();
  }

  private updateDisplayShape() {
    switch(this.tokenInfo.shape.shape_type.toLowerCase()) {
      case 'square':
        const square = this.tokenInfo.shape as Square;
        this.width = square.sideLength;
        this.height = square.sideLength;
        this.tokenInfo.shape = toRectangle(square);
        break;
      case 'rectangle':
        const rect = this.tokenInfo.shape as Rectangle;
        this.width = rect.width;
        this.height = rect.length;
        break;
      case 'circle':
        const circ = this.tokenInfo.shape as Circle;
        this.width  = circ.radius * 2;
        this.height = circ.radius * 2;
        break;
      default:
        break;
    }
    this.token_element.classList.forEach((value: string) => {if(value != 'token-comp') {this.token_element.classList.remove(value);};});
    this.token_element.classList.add(this.tokenInfo.shape.shape_type.toLowerCase());
  }

}
