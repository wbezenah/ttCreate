import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckToolsComponent } from './deck-tools.component';

describe('DeckToolsComponent', () => {
  let component: DeckToolsComponent;
  let fixture: ComponentFixture<DeckToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeckToolsComponent]
    });
    fixture = TestBed.createComponent(DeckToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
