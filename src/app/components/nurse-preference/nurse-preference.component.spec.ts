import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursePreferenceComponent } from './nurse-preference.component';

describe('NursePreferenceComponent', () => {
  let component: NursePreferenceComponent;
  let fixture: ComponentFixture<NursePreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursePreferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NursePreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
