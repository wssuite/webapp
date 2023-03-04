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
import { MatCheckboxModule } from "@angular/material/checkbox";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./components/app-component/app.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractCreationComponent } from "./components/contract-creation/contract-creation.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { NurseComponent } from "./components/nurse/nurse.component";
import { HttpClientModule } from "@angular/common/http";
import { ErrorMessageDialogComponent } from "./components/error-message-dialog/error-message-dialog.component";
import { TestingComponent } from "./components/testing/testing.component";
import { WeightComponent } from "./components/weight/weight.component";
import { LoginComponent } from './components/login/login.component';
import { AccountCreationComponent } from './components/account-creation/account-creation.component';
import { AccountCreationDialogComponent } from './components/account-creation/account-creation-dialog/account-creation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ConsultScheduleComponent,
    ContractCreationComponent,
    ScheduleGenerationComponent,
    NurseComponent,
    ErrorMessageDialogComponent,
    TestingComponent,
    WeightComponent,
    LoginComponent,
    AccountCreationComponent,
    AccountCreationDialogComponent,
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
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
