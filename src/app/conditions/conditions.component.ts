import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConditionsService } from './conditions.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css'],
})
export class ConditionsComponent implements OnInit, AfterViewInit {
  public formIndexes: number[];

  constructor(private conditionsService: ConditionsService) { }

  ngOnInit(): void {
    this.formIndexes = [];
  }

  ngAfterViewInit(): void {
  }

  onInitial(event: {inequalities: number}): void {
    this.conditionsService.changeIndexesLength(this.formIndexes, event.inequalities);
  }
}
