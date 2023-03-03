import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNurseGroupDialogComponent } from './create-nurse-group-dialog.component';

describe('CreateNurseGroupDialogComponent', () => {
  let component: CreateNurseGroupDialogComponent;
  let fixture: ComponentFixture<CreateNurseGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNurseGroupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNurseGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
