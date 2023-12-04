import { Component, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { EditorSwitchService } from '../../../../services/editor-switch.service';
import { Token } from '../../../../models/assets/token.model';
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
  private componentRef: ComponentRef<TokenComponent>;
  private subscriptions: Subscription[] = [];

  @ViewChild(AssetHostDirective, {static: true}) assetHost!: AssetHostDirective;

  constructor(
    private projectService: ProjectService,
    private editorSwitchService: EditorSwitchService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.editorSwitchService.activeEditorUpdate.subscribe(
      (value: EditorType) => {
        if(value === EditorType.TOKEN) {
          this.activeToken = this.projectService.getAsset(AssetType.TOKEN, this.editorSwitchService.getActiveEditor().assetIndex);
          const viewContainerRef = this.assetHost.viewContainerRef;
          viewContainerRef.clear();
          this.componentRef = viewContainerRef.createComponent<TokenComponent>(TokenComponent);
          this.componentRef.instance.tokenInfo = this.activeToken;
        }
        else { this.activeToken = null; }
      }
    ));
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }
    if(this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
