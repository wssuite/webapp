import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app-component/app.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ConsultScheduleComponent } from './components/consult-schedule/consult-schedule.component';
import { ContractCreationComponent } from './components/contract-creation/contract-creation.component';
import { ScheduleGenerationComponent } from './components/schedule-generation/schedule-generation.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ConsultScheduleComponent,
    ContractCreationComponent,
    ScheduleGenerationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
