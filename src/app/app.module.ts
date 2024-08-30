import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { CardComponent } from './components/asset-types/card/card.component';
import { CreatorHostComponent } from './components/creator-host/creator-host.component';
import { BoardToolsComponent } from './components/editors/board/board-tools/board-tools.component';
import { BoardEditorComponent } from './components/editors/board/board-editor/board-editor.component';
import { BoardAssetsComponent } from './components/editors/board/board-assets/board-assets.component';
import { MainAssetsComponent } from './components/editors/main/main-assets/main-assets.component';
import { MainToolsComponent } from './components/editors/main/main-tools/main-tools.component';
import { MainEditorComponent } from './components/editors/main/main-editor/main-editor.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { DeckAssetsComponent } from './components/editors/deck/deck-assets/deck-assets.component';
import { DeckEditorComponent } from './components/editors/deck/deck-editor/deck-editor.component';
import { DeckToolsComponent } from './components/editors/deck/deck-tools/deck-tools.component';
import { TokenAssetsComponent } from './components/editors/token/token-assets/token-assets.component';
import { TokenEditorComponent } from './components/editors/token/token-editor/token-editor.component';
import { TokenToolsComponent } from './components/editors/token/token-tools/token-tools.component';
import { TokenComponent } from './components/asset-types/token/token.component';
import { AssetHostDirective } from './directives/asset-host.directive';
import { AssetComponent } from './components/asset-types/asset/asset.component';
import { ModalComponent } from './components/modal/modal.component';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorPageComponent,
    CardComponent,
    CreatorHostComponent,
    BoardToolsComponent,
    BoardEditorComponent,
    BoardAssetsComponent,
    MainAssetsComponent,
    MainToolsComponent,
    MainEditorComponent,
    TooltipDirective,
    DeckAssetsComponent,
    DeckEditorComponent,
    DeckToolsComponent,
    TokenAssetsComponent,
    TokenEditorComponent,
    TokenToolsComponent,
    TokenComponent,
    AssetHostDirective,
    AssetComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
