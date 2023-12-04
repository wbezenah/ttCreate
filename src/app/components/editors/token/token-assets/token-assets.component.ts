import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { EditorSwitchService } from '../../../../services/editor-switch.service';
import { Subscription } from 'rxjs';
import { AssetType, EditorType } from '../../../../shared/ttc-types';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-token-assets',
  templateUrl: './token-assets.component.html',
  styleUrls: ['./token-assets.component.css', '../token.css', '../../editors.css']
})
export class TokenAssetsComponent implements OnInit, OnDestroy {

  private activeToken: Token;

  constructor(
    private projectService: ProjectService,
    private editorSwitchService: EditorSwitchService
  ) { }


  private editorSub: Subscription;
  ngOnInit(): void {
    this.editorSub = this.editorSwitchService.activeEditorUpdate.subscribe(
      (value: EditorType) => {
        if(value === EditorType.TOKEN) { 
          this.activeToken = this.projectService.getAsset(AssetType.TOKEN, this.editorSwitchService.getActiveEditor().assetIndex);
        }
        else { this.activeToken = null; }
      }
    );
  }

  ngOnDestroy(): void {
    this.editorSub.unsubscribe();
  }

}
