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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatExpansionModule } from "@angular/material/expansion";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app-component/app.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractCreationComponent } from "./components/contract-creation/contract-creation.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { NurseComponent } from "./components/nurse-component/nurse/nurse.component";
import { HttpClientModule } from "@angular/common/http";
import { ErrorMessageDialogComponent } from "./components/error-message-dialog/error-message-dialog.component";
import { WeightComponent } from "./components/weight/weight.component";
import { AlternativeShiftComponent } from "./components/alternative-shift/alternative-shift.component";
import { PatternElementComponent } from "./components/pattern-element/pattern-element.component";
import { UnwantedPatternsComponent } from "./components/unwanted-patterns/unwanted-patterns.component";
import { NumericInputComponent } from "./components/numeric-input/numeric-input.component";
import { TestingComponent } from "./components/testing/testing.component";
import { IntegerConstraintComponent } from "./components/integer-constraint/integer-constraint.component";
import { ShiftConstraintComponent } from "./components/shift-constraint/shift-constraint.component";
import { MinMaxConsecutiveShiftComponent } from "./components/min-max-consecutive-shift/min-max-consecutive-shift.component";
import { BooleanConstraintComponent } from "./components/boolean-constraint/boolean-constraint.component";
import { SidenavNurseComponent } from './components/nurse-component/sidenav-nurse/sidenav-nurse.component';
import { CreateNurseDialogComponent } from './components/nurse-component/create-nurse-dialog/create-nurse-dialog.component';
import { CreateNurseGroupDialogComponent } from './components/nurse-component/create-nurse-group-dialog/create-nurse-group-dialog.component';
import { NurseGroupComponent } from './components/nurse-component/nurse-group/nurse-group.component';
import { MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';

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
    IntegerConstraintComponent,
    AlternativeShiftComponent,
    ShiftConstraintComponent,
    MinMaxConsecutiveShiftComponent,
    UnwantedPatternsComponent,
    BooleanConstraintComponent,
    SidenavNurseComponent,
    CreateNurseDialogComponent,
    CreateNurseGroupDialogComponent,
    NurseGroupComponent,
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
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
