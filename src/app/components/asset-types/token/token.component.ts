import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Token } from '../../../models/assets/token.model';
import { ElectronService } from '../../../services/electron.service';
import { toRectangle } from '../../../shared/shapes-math';
import { ProjectService } from '../../../services/project.service';
import { Subscription } from 'rxjs';
import { AssetType } from '../../../shared/ttc-types';
import { AssetComponent } from '../asset/asset.component';

@Component({
  selector: 'app-token',
  // templateUrl: './token.component.html',
  templateUrl: '../asset/asset.component.html',
  styleUrls: ['../asset/asset.component.css']
})
export class TokenComponent implements OnInit, AfterViewInit, OnDestroy{
  
  public tokenInfo: Token = new Token('', -1);
  private element: HTMLElement;

  // get boundary() {
  //   return {top: -1, left: -1, width: -1, height: -1};
  // }
  
  width: number = 50;
  height: number = 50;

  get backgroundImage():string {
    return `url('${this.tokenInfo.backgroundImgURL}')`;
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private electronService: ElectronService,
    private projectService: ProjectService,
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
    const boundingRect = this.element.getBoundingClientRect();
    this.projectService.updateAsset(AssetType.TOKEN, this.tokenInfo.index, {property: 'top', val: boundingRect.top}, {property: 'left', val: boundingRect.left});
    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.element.style.left = this.tokenInfo.left + 'px';
    this.element.style.top = this.tokenInfo.top + 'px';

    this.updateDisplayShape();
  }

  private updateDisplayShape() {
    const shapeRect = toRectangle(this.tokenInfo.shape);
    this.width, this.height = shapeRect.width, shapeRect.length;
    this.element.classList.forEach((value: string) => {if(value != 'token-comp') {this.element.classList.remove(value);};});
    this.element.classList.add(this.tokenInfo.shape.shape_type.toLowerCase());
  }

}
