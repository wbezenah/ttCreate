import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEditorComponent } from './main-editor.component';

describe('MainEditorComponent', () => {
  let component: MainEditorComponent;
  let fixture: ComponentFixture<MainEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainEditorComponent]
    });
    fixture = TestBed.createComponent(MainEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
