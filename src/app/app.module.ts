import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
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
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app-component/app.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractCreationComponent } from "./components/contract-creation/contract-creation.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { NurseComponent } from "./components/nurse/nurse.component";
import { HttpClientModule } from "@angular/common/http";
import { ErrorMessageDialogComponent } from "./components/error-message-dialog/error-message-dialog.component";
import { WeightComponent } from './components/weight/weight.component';
import { AlternativeShiftComponent } from './components/alternative-shift/alternative-shift.component';
import { PatternElementComponent } from './components/pattern-element/pattern-element.component';
import { UnwantedPatternsComponent } from "./components/unwanted-patterns/unwanted-patterns.component";
import { NumericInputComponent } from "./components/numeric-input/numeric-input.component";
import { TestingComponent } from "./components/testing/testing.component";
import { ShiftComponent } from './components/shift-component/shift/shift.component';
import { CreateShiftDialogComponent } from './components/shift-component/create-shift-dialog/create-shift-dialog.component';
import { ShiftConstraintComponent } from './components/shift-constraint/shift-constraint.component';
import { MinMaxConsecutiveShiftComponent } from './components/min-max-consecutive-shift/min-max-consecutive-shift.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CreateShiftGroupDialogComponent } from './components/shift-component/create-shift-group-dialog/create-shift-group-dialog.component';
import { CreateShiftTypeDialogComponent } from './components/shift-component/create-shift-dialog/create-shift-type-dialog/create-shift-type-dialog.component';
import { ShiftTypeComponent } from './components/shift-component/shift-type/shift-type.component';
import { ShiftGroupComponent } from './components/shift-component/shift-group/shift-group.component';
import { SidenavShiftComponent } from './components/shift-component/sidenav-shift/sidenav-shift.component'

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
    ShiftComponent,
    CreateShiftDialogComponent,
    AlternativeShiftComponent,
    ShiftConstraintComponent,
    MinMaxConsecutiveShiftComponent,
    UnwantedPatternsComponent,
    CreateShiftGroupDialogComponent,
    CreateShiftTypeDialogComponent,
    ShiftTypeComponent,
    ShiftGroupComponent,
    SidenavShiftComponent
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
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
