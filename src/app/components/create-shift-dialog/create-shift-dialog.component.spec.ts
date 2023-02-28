import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShiftDialogComponent } from './create-shift-dialog.component';

describe('CreateShiftDialogComponent', () => {
  let component: CreateShiftDialogComponent;
  let fixture: ComponentFixture<CreateShiftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateShiftDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShiftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
