import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { CardInfo } from '../../models/card-info.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  cardInfo: CardInfo = {title: 'New Card'};

  @Input('width') width: number;
  @Input('height') height: number;
  @Input('left') left: number;
  @Input('top') top: number;

  private element: HTMLElement;
  private parentElement: HTMLElement;

  get boundary(): {top: number, left: number, width: number, height: number} {
    if(this.parentElement) {
      let boundingRect = this.elRef.nativeElement.parentElement.getBoundingClientRect();
      return {
        top: boundingRect.top,
        left: boundingRect.left,
        width: boundingRect.width,
        height: boundingRect.height 
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
