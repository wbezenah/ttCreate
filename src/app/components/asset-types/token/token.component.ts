import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../../models/token.model';
import { ElectronService } from '../../../services/electron.service';
import { Square } from '../../../shared/shapes-math';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit{
  
  @Input() tokenInfo: Token;
  
  width: number = 50;
  height: number = 50;

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    
  }

}
