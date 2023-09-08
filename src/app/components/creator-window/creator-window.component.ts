import { Component, ComponentRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CardInfo } from '../../models/card-info.model';
import { CardHostDirective } from '../../directives/card-host.directive';
import { CardComponent } from '../card/card.component';
import { WindowSizeService } from '../../services/window-size.service';

@Component({
  selector: 'app-creator-window',
  templateUrl: './creator-window.component.html',
  styleUrls: ['./creator-window.component.css']
})
export class CreatorWindowComponent implements OnInit, OnDestroy {
  
  @ViewChild(CardHostDirective, {static: true}) cardHost!: CardHostDirective;
  componentRefs: ComponentRef<CardComponent>[] = [];

  cards: CardInfo[] = [];

  constructor (
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    for(let cf of this.componentRefs) {
      if(cf) {
        cf.destroy();
      }
    }
  }

  onNewCard() {
    let newCardInfo: CardInfo = new CardInfo('New Card');
    const viewContainerRef = this.cardHost.viewContainerRef;
    const newComponentRef = viewContainerRef.createComponent(CardComponent);
    newComponentRef.instance.cardInfo = newCardInfo;
    newComponentRef.instance.width = 200;
    newComponentRef.instance.height = 300;
    newComponentRef.instance.left = 100;
    newComponentRef.instance.left = 100;
    this.componentRefs.push(newComponentRef);
  }
}
