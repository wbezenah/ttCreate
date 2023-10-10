import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenToolsComponent } from './token-tools.component';

describe('TokenToolsComponent', () => {
  let component: TokenToolsComponent;
  let fixture: ComponentFixture<TokenToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenToolsComponent]
    });
    fixture = TestBed.createComponent(TokenToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
