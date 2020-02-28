import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { switchMap, distinctUntilChanged, map } from 'rxjs/operators';
import { ListComponent } from './list/list.component';
import { InitComponent } from './init/init.component';
import { Limitation } from './num-input/group.model';
import { Line } from '../line.model';
import { ConditionsService } from './conditions.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css'],
})
export class ConditionsComponent implements OnInit, OnDestroy, AfterViewInit {
  public formIndexes: number[];
  private list$: Observable<Line>;
  private initSubs: Subscription;
  @ViewChild(ListComponent) List: {Ineq: Observable<Limitation>};
  @ViewChild(InitComponent) Init: {Initial: Observable<{inequalities: number}>, FunctionParams: Observable<{ X1: number, X2: number}>};
  @Output() public points: EventEmitter<any> = new EventEmitter();

  constructor(public conditionService: ConditionsService) { }
  ngOnInit(): void {
    this.formIndexes = [];
  }
  ngAfterViewInit() {
    this.initSubs = this.Init.Initial.subscribe(event => {
      this.conditionService.changeIndexesLength(this.formIndexes, event.inequalities);
    });

    this.list$ = this.List.Ineq.pipe(
      map(limitation => this.conditionService.castLimitationToLine(limitation)),
      distinctUntilChanged((prev, next) => this.conditionService.checkChanges(prev, next)),
      switchMap(line => new Observable<Line>(subscriber => {
        subscriber.next(line);
      }))
    );

    this.Init.FunctionParams.subscribe((someData: { X1: number, X2: number}) => {
      console.log(someData);
    });
  }

  ngOnDestroy() {
    this.initSubs.unsubscribe();
  }
}
