import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { ILimitation } from '../models/group.model';

import { ConditionsService } from './../../conditions/conditions.service';
import { ILine } from './../models/line.model';
import { ITargetFunction } from './../models/target-function.model';

@Injectable({
  providedIn: 'root',
})
export class DataTransferService {
  private readonly inequalities$: Subject<ILimitation>;
  private readonly targetFunction$: Subject<ITargetFunction>;

  public constructor(private readonly conditionsService: ConditionsService) {
    this.targetFunction$ = new Subject();
    this.inequalities$ = new Subject();
  }

  public getLineStream(): Observable<ILine> {
    return this.inequalities$.pipe(
      distinctUntilChanged((prev, next) => this.conditionsService.checkChanges(prev, next)),
      map((limitation) => this.conditionsService.castLimitationToLine(limitation)),
      switchMap((line) => new Observable<ILine>((subscriber) => {
        subscriber.next(line);
      })),
    );
  }

  public getTargetFunctionStream(): Observable<ITargetFunction> {
    return this.targetFunction$.pipe(distinctUntilChanged());
  }

  public updateInequalities(value: ILimitation): void {
    this.inequalities$.next(value);
  }

  public updateTargetFunction(value: ITargetFunction): void {
    this.targetFunction$.next(value);
  }
}
