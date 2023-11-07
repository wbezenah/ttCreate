import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { EditorSwitchService } from '../../../../services/editor-switch.service';
import { Token } from '../../../../models/token.model';
import { AssetType, EditorType } from '../../../../shared/ttc-types';
import { Subscription } from 'rxjs';
import { AssetHostDirective } from '../../../../directives/asset-host.directive';
import { TokenComponent } from '../../../asset-types/token/token.component';

@Component({
  selector: 'app-token-editor',
  templateUrl: './token-editor.component.html',
  styleUrls: ['./token-editor.component.css', '../token.css', '../../editors.css']
})
export class TokenEditorComponent implements OnInit, OnDestroy {
  
  private activeToken: Token;

  @ViewChild(AssetHostDirective, {static: true}) assetHost!: AssetHostDirective;

  constructor(
    private projectService: ProjectService,
    private editorSwitchService: EditorSwitchService
  ) { }

  private editorSub: Subscription;
  ngOnInit(): void {
    this.editorSub = this.editorSwitchService.activeEditorUpdate.subscribe(
      (value: EditorType) => {
        if(value === EditorType.TOKEN) { 
          this.activeToken = this.projectService.getAsset(AssetType.TOKEN, this.editorSwitchService.getActiveEditor().index);
          const viewContainerRef = this.assetHost.viewContainerRef;
          viewContainerRef.clear();
          const componentRef = viewContainerRef.createComponent<TokenComponent>(TokenComponent);
          componentRef.instance.tokenInfo = this.activeToken;
        }
        else { this.activeToken = null; }
      }
    );
  }

  ngOnDestroy(): void {
    this.editorSub.unsubscribe();
  }
}
