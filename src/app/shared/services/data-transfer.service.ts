import { ConditionsService } from './../../conditions/conditions.service';
import { ILine } from './../models/line.model';
import { ITargetFunction } from './../models/target-function.model';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ILimitation } from '../models/group.model';
import { map, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataTransferService {
  private targetFunction$: Subject<ITargetFunction>;
  private inequalities$: Subject<ILimitation>;

  constructor(private conditionsService: ConditionsService) {
    this.targetFunction$ = new Subject();
    this.inequalities$ = new Subject();
  }

  updateInequalities(value: ILimitation): void {
    this.inequalities$.next(value);
  }

  getLineStream(): Observable<ILine> {
    return this.inequalities$.pipe(
      map(limitation => this.conditionsService.castLimitationToLine(limitation)),
      distinctUntilChanged((prev, next) => this.conditionsService.checkChanges(prev, next)),
      switchMap(line => new Observable<ILine>((subscriber) => {
        subscriber.next(line);
      })),
    );
  }

  updateTargetFunction(value: ITargetFunction): void {
    this.targetFunction$.next(value);
  }

  getTargetFunctionStream(): Observable<ITargetFunction> {
    return this.targetFunction$;
  }
}
