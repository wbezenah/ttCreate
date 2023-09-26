import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorHostComponent } from './creator-host.component';

describe('CreatorHostComponent', () => {
  let component: CreatorHostComponent;
  let fixture: ComponentFixture<CreatorHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatorHostComponent]
    });
    fixture = TestBed.createComponent(CreatorHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
