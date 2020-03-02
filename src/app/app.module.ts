import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConditionsComponent } from './conditions/conditions.component';
import { GraphComponent } from './graph/graph.component';
import { GraphModule } from './graph/graph.module';
import { ConditionsModule } from './conditions/conditions.module';

@NgModule({
  declarations: [
    AppComponent,
    ConditionsComponent,
    GraphComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GraphModule,
    ConditionsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
