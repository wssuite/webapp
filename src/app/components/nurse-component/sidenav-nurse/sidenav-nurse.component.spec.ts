import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavNurseComponent } from './sidenav-nurse.component';

describe('SidenavNurseComponent', () => {
  let component: SidenavNurseComponent;
  let fixture: ComponentFixture<SidenavNurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavNurseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavNurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
