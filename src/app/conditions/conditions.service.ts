import { Injectable } from '@angular/core';
import { ILine } from '../shared/models/line.model';
import { ILimitation } from '../shared/models/group.model';

@Injectable({
  providedIn: 'root',
})
export class ConditionsService {
  constructor() { }
  castLimitationToLine(limit: ILimitation): ILine {
    return {
      points: [{
        x: limit.X1 ? limit.limit / limit.X1 : 0,
        y: 0,
      }, {
        x: 0,
        y: limit.X2 ? limit.limit / limit.X2 : 0,
      }
    ],
    lineNumber: limit.lineNumber,
    sign: limit.sign,
    };
  }

  checkChanges(previous: ILine, current: ILine): boolean {
    for (const ind in previous) {
      if (JSON.stringify(previous[ind]) !== JSON.stringify(current[ind])) {
        return false;
      }
    }
    return true;
  }

  changeIndexesLength(indexes: number[], length: number): void {
    if (length > indexes.length) {
      for (let j = indexes.length; j <= length; j++) {
        indexes.push(j);
      }
    }
    if (length < indexes.length) {
      indexes.length = length;
    }
  }
}
