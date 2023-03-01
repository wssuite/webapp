import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShiftTypeDialogComponent } from './create-shift-type-dialog.component';

describe('CreateShiftTypeDialogComponent', () => {
  let component: CreateShiftTypeDialogComponent;
  let fixture: ComponentFixture<CreateShiftTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateShiftTypeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShiftTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
