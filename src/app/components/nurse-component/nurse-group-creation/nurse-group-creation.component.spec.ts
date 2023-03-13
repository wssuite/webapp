import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseGroupCreationComponent } from './nurse-group-creation.component';

describe('NurseGroupCreationComponent', () => {
  let component: NurseGroupCreationComponent;
  let fixture: ComponentFixture<NurseGroupCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NurseGroupCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NurseGroupCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
