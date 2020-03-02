import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-inequalities-list',
  templateUrl: './inequalities-list.component.html',
  styleUrls: ['./inequalities-list.component.css'],
})
export class InequalitiesListComponent implements OnInit {
  @Input()
  public formsCount: number[];

  ngOnInit(): void {
  }
}
