import { NgModule } from '@angular/core';
import { ListComponent } from './list.component';
import { NumInputModule } from '../num-input/num-input.module';


@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    NumInputModule
  ],
  exports: [
    ListComponent,
    NumInputModule
  ]
})
export class ListModule { }
