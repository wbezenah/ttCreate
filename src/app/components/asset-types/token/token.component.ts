import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Token } from '../../../models/token.model';
import { ElectronService } from '../../../services/electron.service';
import { Circle, Rectangle, Shape, Square, toRectangle } from '../../../shared/shapes-math';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit, AfterViewInit{
  
  public tokenInfo: Token = new Token();
  
  width: number = 50;
  height: number = 50;

  get backgroundImage():string {
    return `url('${this.tokenInfo.backgroundImgURL}')`;
  }

  constructor(
    private electronService: ElectronService
  ) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    switch(this.tokenInfo.shape.shape_type.toLowerCase()) {
      case 'square':
        const square = this.tokenInfo.shape as Square;
        this.width = square.sideLength;
        this.height = square.sideLength;
        this.tokenInfo.shape = toRectangle(square);
        break;
      case 'rectangle':
        const rect = this.tokenInfo.shape as Rectangle;
        this.width = rect.width;
        this.height = rect.length;
        break;
      case 'circle':
        const circ = this.tokenInfo.shape as Circle;
        this.width = this.height = circ.radius * 2;
        break;
      default:
        break;
    }
    let token_element = document.getElementsByClassName('token').item(0) as HTMLElement;
    token_element.classList.add(this.tokenInfo.shape.shape_type.toLowerCase());
    // console.log(shape_element)
  }

  private placeToken() {
    if(this.tokenInfo) {
      
    }
  }

}
