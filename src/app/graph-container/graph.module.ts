import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';

import { ConditionsComponent } from './components/conditions/conditions.component';
import { GraphComponent } from './components/graph/graph.component';
import { InequalitiesListComponent } from './components/inequalities-list/inequalities-list.component';
import { InequalityFormComponent } from './components/inequality-form/inequality-form.component';
import { InitialFormComponent } from './components/initial-form/initial-form.component';
import { GraphContainerComponent } from './graph-container.component';

@NgModule({
  declarations: [
    InequalitiesListComponent,
    InequalityFormComponent,
    InitialFormComponent,
    ConditionsComponent,
    GraphComponent,
    GraphContainerComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    GraphContainerComponent,
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more ] },
  ],
})
export class GraphModule { }
