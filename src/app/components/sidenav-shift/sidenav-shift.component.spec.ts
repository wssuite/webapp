import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavShiftComponent } from './sidenav-shift.component';

describe('SidenavShiftComponent', () => {
  let component: SidenavShiftComponent;
  let fixture: ComponentFixture<SidenavShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
