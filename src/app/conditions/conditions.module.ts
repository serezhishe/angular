import { NgModule } from '@angular/core';
import { ListModule } from './list/list.module';
import { InitModule } from './init/init.module';

@NgModule({
  declarations: [
  ],
  imports: [
    ListModule,
    InitModule,
  ],
  exports: [
    ListModule,
    InitModule,
  ]
})
export class ConditionsModule { }
