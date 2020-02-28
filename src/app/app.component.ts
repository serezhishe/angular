import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ConditionsComponent } from './conditions/conditions.component';
import { Observable } from 'rxjs';
import { Line } from './line.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(ConditionsComponent) Conditions: {list$: Observable<Line>};
  public line: Line;
  title = 'SAIO';
  ngAfterViewInit(): void {
    this.Conditions.list$.subscribe(data => this.line = data);
  }
}
