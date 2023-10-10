import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenEditorComponent } from './token-editor.component';

describe('TokenEditorComponent', () => {
  let component: TokenEditorComponent;
  let fixture: ComponentFixture<TokenEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenEditorComponent]
    });
    fixture = TestBed.createComponent(TokenEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
