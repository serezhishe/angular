import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inequalities-list',
  styleUrls: ['./inequalities-list.component.css'],
  templateUrl: './inequalities-list.component.html',
})
export class InequalitiesListComponent {
  @Input()
  public formsCount: number[];

}
