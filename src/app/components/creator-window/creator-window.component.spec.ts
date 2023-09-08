import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorWindowComponent } from './creator-window.component';

describe('CreatorWindowComponent', () => {
  let component: CreatorWindowComponent;
  let fixture: ComponentFixture<CreatorWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorWindowComponent]
    });
    fixture = TestBed.createComponent(CreatorWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
