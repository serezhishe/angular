import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumInputComponent } from './num-input.component';

describe('NumInputComponent', () => {
  let component: NumInputComponent;
  let fixture: ComponentFixture<NumInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
