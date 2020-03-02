import { NgModule } from '@angular/core';
import { InequalitiesListComponent } from './inequalities-list.component';
import { InequalityFormModule } from '../inequality-form/inequality-form.module';

@NgModule({
  declarations: [
    InequalitiesListComponent,
  ],
  imports: [
    InequalityFormModule,
  ],
  exports: [
    InequalitiesListComponent,
    InequalityFormModule,
  ],
})
export class InequalitiesListModule { }
