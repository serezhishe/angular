import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular-highcharts';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChartModule,
  ],
  exports: [
    ChartModule,
  ]
})
export class GraphModule { }
