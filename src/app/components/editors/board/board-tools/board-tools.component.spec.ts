import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardToolsComponent } from './board-tools.component';

describe('BoardToolsComponent', () => {
  let component: BoardToolsComponent;
  let fixture: ComponentFixture<BoardToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardToolsComponent]
    });
    fixture = TestBed.createComponent(BoardToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
