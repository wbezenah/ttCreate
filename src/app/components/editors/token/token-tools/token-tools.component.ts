import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from '../../../../services/electron.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { AssetType, EditorType, FileTypeSet } from '../../../../shared/ttc-types';
import { ProjectService } from '../../../../services/project.service';
import { EditorSwitchService } from '../../../../services/editor-switch.service';
import { Token } from '../../../../models/assets/token.model';
import { toCircle, toRectangle } from '../../../../shared/shapes-math';

@Component({
  selector: 'app-token-tools',
  templateUrl: './token-tools.component.html',
  styleUrls: ['./token-tools.component.css', '../token.css', '../../editors.css']
})
export class TokenToolsComponent implements OnInit, OnDestroy {
  private activeToken: Token;

  constructor(
    private electronService: ElectronService,
    private projectService: ProjectService,
    private editorSwitchService: EditorSwitchService
  ) { }

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(this.editorSwitchService.activeEditorUpdate.subscribe(
      (value: EditorType) => {
        if(value === EditorType.TOKEN) { 
          this.activeToken = this.projectService.getAsset(AssetType.TOKEN, this.editorSwitchService.getActiveEditor().assetIndex);
        }
        else { this.activeToken = null; }
      }
    ),
    this.projectService.assetUpdate.subscribe(
      (value: {type: AssetType, index: number, updates: {property: string, val: any}[]}) => {
        if(value.type == AssetType.TOKEN && value.index == this.activeToken.index) {
          //Add handlers for updated asset... might not be necessary in tools component
        }
      }
    ));
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  onNewImage(background = false) {
    this.electronService.openFile([FileTypeSet.imageTypes], false);
    firstValueFrom(this.electronService.fileResults).then(
      (value: Buffer[]) => {
        if(value.length === 1){
          const fileReader = new FileReader;
          fileReader.onload = () => {
            if(background) {
              this.projectService.updateAsset(AssetType.TOKEN, this.activeToken.index, {property: 'backgroundImgURL', val: (fileReader.result as string)});
            }else {
              //add image to token as asset
            }
          }
          fileReader.readAsDataURL(new Blob(value));
        }
      }
    );
  }

  setCirc() {
    this.projectService.updateAsset(AssetType.TOKEN, this.activeToken.index, {property: 'shape', val: toCircle(this.activeToken.shape)});
  }

  setRect() {
    this.projectService.updateAsset(AssetType.TOKEN, this.activeToken.index, {property: 'shape', val: toRectangle(this.activeToken.shape)});
  }
}
