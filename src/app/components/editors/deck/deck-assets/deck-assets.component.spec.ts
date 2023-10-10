import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckAssetsComponent } from './deck-assets.component';

describe('DeckAssetsComponent', () => {
  let component: DeckAssetsComponent;
  let fixture: ComponentFixture<DeckAssetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeckAssetsComponent]
    });
    fixture = TestBed.createComponent(DeckAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
