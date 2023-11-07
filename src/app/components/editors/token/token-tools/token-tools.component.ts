import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from '../../../../services/electron.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { AssetType, EditorType, FileTypeSet } from '../../../../shared/ttc-types';
import { ProjectService } from '../../../../services/project.service';
import { EditorSwitchService } from '../../../../services/editor-switch.service';
import { Token } from '../../../../models/token.model';

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

  private editorSub: Subscription;
  ngOnInit(): void {
    this.editorSub = this.editorSwitchService.activeEditorUpdate.subscribe(
      (value: EditorType) => {
        if(value === EditorType.TOKEN) { 
          this.activeToken = this.projectService.getAsset(AssetType.TOKEN, this.editorSwitchService.getActiveEditor().index);
        }
        else { this.activeToken = null; }
      }
    );
  }

  ngOnDestroy(): void {
    this.editorSub.unsubscribe();
  }

  onNewImage() {
    this.electronService.openFile([FileTypeSet.imageTypes], false);
    firstValueFrom(this.electronService.fileResults).then((value: Buffer[]) => {
      // console.log(value);
      if(value.length === 1){
        const fileReader = new FileReader;
        fileReader.onload = () => {
          this.projectService;
        }
        fileReader.readAsDataURL(new Blob(value));
      }
    });
  }

  setBackgroundImage() {
    this.electronService.openFile([FileTypeSet.imageTypes], false);
    firstValueFrom(this.electronService.fileResults).then(
      (value: Buffer[]) => {
        if(value.length === 1) {
          const fileReader = new FileReader;
          fileReader.onload = () => {
            if(this.activeToken) { 
              this.activeToken.backgroundImgURL = fileReader.result as string;
              // console.log(this.activeToken.backgroundImgURL);
              // console.log(this.projectService.getAsset(AssetType.TOKEN, this.editorSwitchService.getActiveEditor().index) as Token)
            }
          }
          fileReader.readAsDataURL(new Blob(value));
        }
      }
    );
  }
}
