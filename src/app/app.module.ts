import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {MatCardModule} from '@angular/material/card';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';



import {MatPaginatorModule} from '@angular/material/paginator';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app-component/app.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractCreationComponent } from "./components/contract-creation/contract-creation.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { NurseComponent } from "./components/nurse/nurse.component";
import { HttpClientModule } from "@angular/common/http";
import { ErrorMessageDialogComponent } from "./components/error-message-dialog/error-message-dialog.component";
import { ShiftsViewComponent } from './components/shift-component/shifts-view/shifts-view.component';
import { ShiftCreationDialogComponent } from './components/shift-component/shift-creation-dialog/shift-creation-dialog.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CreateShiftGroupDialogComponent } from './components/shift-component/create-shift-group-dialog/create-shift-group-dialog.component';
import { ShiftTypeCreationDialogComponent } from './components/shift-component/shift-type-creation-dialog/shift-type-creation-dialog.component';
import { ShiftsTypeViewComponent } from './components/shift-component/shifts-type-view/shifts-type-view.component';
import { ShiftGroupComponent } from './components/shift-component/shift-group/shift-group.component';
import { SidenavShiftComponent } from './components/shift-component/sidenav-shift/sidenav-shift.component'
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatMenuModule} from '@angular/material/menu';
import { WeightComponent } from './components/weight/weight.component';
import { AlternativeShiftComponent } from './components/alternative-shift/alternative-shift.component';
import { PatternElementComponent } from './components/pattern-element/pattern-element.component';
import { UnwantedPatternsComponent } from "./components/unwanted-patterns/unwanted-patterns.component";
import { NumericInputComponent } from "./components/numeric-input/numeric-input.component";
import { TestingComponent } from "./components/testing/testing.component";
import { IntegerConstraintComponent } from "./components/integer-constraint/integer-constraint.component";
import { ShiftConstraintComponent } from './components/shift-constraint/shift-constraint.component';
import { MinMaxConsecutiveShiftComponent } from './components/min-max-consecutive-shift/min-max-consecutive-shift.component';
import { BooleanConstraintComponent } from "./components/boolean-constraint/boolean-constraint.component";
import { ContractCreationDialogComponent } from './components/contract-creation-dialog/contract-creation-dialog.component';
import { MinMaxConstraintComponent } from './components/min-max-constraint/min-max-constraint.component';
import { ContractsViewComponent } from './components/contracts-view/contracts-view.component';
import { LoginComponent } from './components/login/login.component';
import { AccountCreationComponent } from './components/account-creation/account-creation.component';
import { AccountCreationDialogComponent } from './components/account-creation/account-creation-dialog/account-creation-dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { NotConnectedComponent } from './components/not-connected/not-connected.component';
import { ShiftCreationComponent } from './components/shift-component/shift-creation/shift-creation.component';
import { ShiftTypeCreationComponent } from './components/shift-component/shift-type-creation/shift-type-creation.component';
import { UnwantedSkillsComponent } from './components/unwanted-skills/unwanted-skills.component';
import { CreateProfileDialogComponent } from './components/create-profile-dialog/create-profile-dialog.component';
import { CreateEmptyProfileDialogComponent } from './components/create-profile-dialog/create-empty-profile-dialog/create-empty-profile-dialog.component';
import { ImportProfileDialogComponent } from './components/create-profile-dialog/import-profile-dialog/import-profile-dialog.component';
import { DuplicateProfileComponent } from './components/create-profile-dialog/duplicate-profile/duplicate-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ConsultScheduleComponent,
    ContractCreationComponent,
    ScheduleGenerationComponent,
    NurseComponent,
    ErrorMessageDialogComponent,
    PatternElementComponent,
    NumericInputComponent,
    TestingComponent,
    WeightComponent,
    ShiftsViewComponent,
    ShiftCreationDialogComponent,
    IntegerConstraintComponent,
    AlternativeShiftComponent,
    ShiftConstraintComponent,
    MinMaxConsecutiveShiftComponent,
    UnwantedPatternsComponent,
    CreateShiftGroupDialogComponent,
    ShiftTypeCreationDialogComponent,
    ShiftsTypeViewComponent,
    ShiftGroupComponent,
    SidenavShiftComponent,
    BooleanConstraintComponent,
    LoginComponent,
    AccountCreationComponent,
    AccountCreationDialogComponent,
    HeaderComponent,
    NotConnectedComponent,
    ShiftCreationComponent,
    ShiftTypeCreationComponent,
    ContractCreationDialogComponent,
    MinMaxConstraintComponent,
    ContractsViewComponent,
    LoginComponent,
    AccountCreationComponent,
    AccountCreationDialogComponent,
    HeaderComponent,
    NotConnectedComponent,
    UnwantedSkillsComponent,
    CreateProfileDialogComponent,
    CreateEmptyProfileDialogComponent,
    ImportProfileDialogComponent,
    DuplicateProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    NgxMaterialTimepickerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
