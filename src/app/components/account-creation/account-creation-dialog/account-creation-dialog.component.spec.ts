import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreationDialogComponent } from './account-creation-dialog.component';

describe('AccountCreationDialogComponent', () => {
  let component: AccountCreationDialogComponent;
  let fixture: ComponentFixture<AccountCreationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCreationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
