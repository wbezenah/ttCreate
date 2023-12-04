import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Card } from '../../../models/assets/card.model';
// import { CardInfo } from '../../models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  // cardInfo: CardInfo = {title: 'New Card'};
  cardInfo: Card;

  @Input('width') width: number;
  @Input('height') height: number;
  @Input('left') left: number;
  @Input('top') top: number;

  private element: HTMLElement;
  private parentElement: HTMLElement;
  private readonly MARGIN_PX: number = 6;

  get boundary(): {top: number, left: number, width: number, height: number} {
    if(this.parentElement) {
      let boundingRect = this.elRef.nativeElement.parentElement.getBoundingClientRect();
      return {
        top: boundingRect.top + this.MARGIN_PX,
        left: boundingRect.left + this.MARGIN_PX,
        width: boundingRect.width + this.MARGIN_PX,
        height: boundingRect.height + this.MARGIN_PX 
      };
    }
    return null;
  }

  constructor(
    private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.element = this.elRef.nativeElement;
    if(this.element.parentElement) {
      this.parentElement = this.element.parentElement;
    }
  }
}
