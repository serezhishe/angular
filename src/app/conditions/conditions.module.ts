import { NgModule } from '@angular/core';
import { InequalitiesListComponent } from './inequalities-list/inequalities-list.component';
import { InequalityFormComponent } from './inequality-form/inequality-form.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { InitComponent } from './init/init.component';

@NgModule({
  declarations: [
    InequalitiesListComponent,
    InequalityFormComponent,
    InitComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    InequalitiesListComponent,
    InitComponent,
  ]
})
export class ConditionsModule { }
