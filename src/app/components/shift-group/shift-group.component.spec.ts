import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftGroupComponent } from './shift-group.component';

describe('ShiftGroupComponent', () => {
  let component: ShiftGroupComponent;
  let fixture: ComponentFixture<ShiftGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
