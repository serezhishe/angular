import { NgModule } from '@angular/core';
import { InequalitiesListModule } from './inequalities-list/inequalities-list.module';
import { InitModule } from './init/init.module';

@NgModule({
  declarations: [
  ],
  imports: [
    InequalitiesListModule,
    InitModule,
  ],
  exports: [
    InequalitiesListModule,
    InitModule,
  ]
})
export class ConditionsModule { }
