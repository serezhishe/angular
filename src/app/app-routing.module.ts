import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GraphContainerComponent } from './graph-container/graph-container.component';

const routes: Routes = [
  { path: 'graph', component: GraphContainerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
