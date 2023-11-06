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
  
  private token_info: Token = new Token();
  
  width: number = 50;
  height: number = 50;

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    switch(this.token_info.shape.shape_type.toLowerCase()) {
      case 'square':
        const square = this.token_info.shape as Square;
        this.width = square.sideLength;
        this.height = square.sideLength;
        this.token_info.shape = toRectangle(square);
        break;
      case 'rectangle':
        const rect = this.token_info.shape as Rectangle;
        this.width = rect.width;
        this.height = rect.length;
        break;
      case 'circle':
        const circ = this.token_info.shape as Circle;
        this.width = this.height = circ.radius * 2;
        break;
      default:
        break;
    }
    let shape_element = document.getElementsByClassName('shape').item(0) as HTMLElement;
    shape_element.classList.add(this.token_info.shape.shape_type.toLowerCase());
    // console.log(shape_element)
  }

  get tokenInfo(): Token {
    return JSON.parse(JSON.stringify(this.token_info));
  }

  set tokenInfo(token: Token) {
    if(this.token_info.shape.shape_type !== token.shape.shape_type) {
      //handle changing shape
    }
    this.token_info = token;
  }

  set shape(shape: Shape) {
    if(this.token_info.shape.shape_type !== shape.shape_type) {
      //handle changing shape
    }
    this.token_info.shape = shape;
  }

  set backgroundIMG(img_path: string) {
    this.token_info.backgroundImgPath = img_path;
  }

}
