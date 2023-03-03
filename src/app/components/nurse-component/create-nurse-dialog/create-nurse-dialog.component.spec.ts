import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNurseDialogComponent } from './create-nurse-dialog.component';

describe('CreateNurseDialogComponent', () => {
  let component: CreateNurseDialogComponent;
  let fixture: ComponentFixture<CreateNurseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNurseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNurseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
