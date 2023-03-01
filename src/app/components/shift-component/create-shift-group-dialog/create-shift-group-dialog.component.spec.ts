import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShiftGroupDialogComponent } from './create-shift-group-dialog.component';

describe('CreateShiftGroupDialogComponent', () => {
  let component: CreateShiftGroupDialogComponent;
  let fixture: ComponentFixture<CreateShiftGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateShiftGroupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShiftGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
