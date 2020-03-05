import { Injectable } from '@angular/core';

import { ILimitation } from '../models/group.model';
import { ILine } from '../models/line.model';

@Injectable({
  providedIn: 'root',
})
export class ConditionsService {
  public castLimitationToLine(limit: ILimitation): ILine {
    return {
      lineNumber: limit.lineNumber,
      points: [
        {
          x: limit.X1 !== 0 ? limit.limit / limit.X1 : 0,
          y: 0,
        },
        {
          x: 0,
          y: limit.X2 !== 0 ? limit.limit / limit.X2 : 0,
        },
      ],
      sign: limit.sign,
    };
  }

  public changeIndexesLength(indexes: number[], length: number): void {
    if (length > indexes.length) {
      for (let j: number = indexes.length; j <= length; j++) {
        indexes.push(j);
      }
    }
    if (length < indexes.length) {
      indexes.length = length;
    }
  }

  public checkChanges(previous: ILimitation, current: ILimitation): boolean {
    for (const ind in previous) {
      if (JSON.stringify(previous[ind]) !== JSON.stringify(current[ind])) {
        return false;
      }
    }

    return true;
  }
}
