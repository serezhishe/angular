import { DataTransferService } from 'src/app/shared/services/data-transfer.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { InitComponent } from './init/init.component';
import { ILine } from '../shared/models/line.model';
import { ConditionsService } from './conditions.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css'],
})
export class ConditionsComponent implements OnInit, AfterViewInit {
  public formIndexes: number[];
  private list$: Observable<ILine>;

  constructor(private conditionsService: ConditionsService, private dataTransferService: DataTransferService) { }

  ngOnInit(): void {
    this.formIndexes = [];
  }

  ngAfterViewInit(): void {
    this.list$ = this.dataTransferService.getLineStream();
  }

  onInitial(event: {inequalities: number}): void {
    this.conditionsService.changeIndexesLength(this.formIndexes, event.inequalities);
  }
}
