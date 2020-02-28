import { Injectable } from '@angular/core';
import { Line } from '../line.model';
import { Limitation } from './num-input/group.model';
import { ConditionsModule } from './conditions.module';

@Injectable({
  providedIn: ConditionsModule,
})
export class ConditionsService {
  constructor() { }
  castLimitationToLine(limit: Limitation): Line {
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

  checkChanges(previous: Line, current: Line): boolean {
    for (const ind in previous) {
      if (JSON.stringify(previous[ind]) !== JSON.stringify(current[ind])) {
        return false;
      }
    }
    return true;
  }

  changeIndexesLength(indexes: number[], length) {
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
