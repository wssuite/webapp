import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTypeCreationComponent } from './shift-type-creation.component';

describe('ShiftTypeCreationComponent', () => {
  let component: ShiftTypeCreationComponent;
  let fixture: ComponentFixture<ShiftTypeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftTypeCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTypeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
