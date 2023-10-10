import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditorComponent } from './deck-editor.component';

describe('DeckEditorComponent', () => {
  let component: DeckEditorComponent;
  let fixture: ComponentFixture<DeckEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeckEditorComponent]
    });
    fixture = TestBed.createComponent(DeckEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
