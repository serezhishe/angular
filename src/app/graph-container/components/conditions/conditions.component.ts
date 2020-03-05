import { Component, OnInit } from '@angular/core';

import { ConditionsService } from '../../services/conditions.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css'],
})
export class ConditionsComponent implements OnInit {
  public formIndexes: number[];

  public constructor(private readonly conditionsService: ConditionsService) { }

  public ngOnInit(): void {
    this.formIndexes = [];
  }

  public onInitial(event: {inequalities: number}): void {
    this.conditionsService.changeIndexesLength(this.formIndexes, event.inequalities);
  }
}
