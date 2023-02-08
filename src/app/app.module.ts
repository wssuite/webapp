import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input'
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app-component/app.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ConsultScheduleComponent } from './components/consult-schedule/consult-schedule.component';
import { ContractCreationComponent } from './components/contract-creation/contract-creation.component';
import { ScheduleGenerationComponent } from './components/schedule-generation/schedule-generation.component';
import { NurseComponent } from './components/nurse/nurse.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ConsultScheduleComponent,
    ContractCreationComponent,
    ScheduleGenerationComponent,
    NurseComponent
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
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
