import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
  ],
  exports: [
    ChartModule,
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more ] }
  ]
})
export class GraphModule { }
