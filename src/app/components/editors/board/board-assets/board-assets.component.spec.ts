import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAssetsComponent } from './board-assets.component';

describe('BoardAssetsComponent', () => {
  let component: BoardAssetsComponent;
  let fixture: ComponentFixture<BoardAssetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardAssetsComponent]
    });
    fixture = TestBed.createComponent(BoardAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
