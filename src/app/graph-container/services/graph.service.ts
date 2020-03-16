import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { last, withLatestFrom } from 'rxjs/operators';

import { ILimitation } from '../models/group.model';
import { ILine } from '../models/line.model';
import { IPoint } from '../models/point.model';
import { Serie } from '../models/serie.model';
import { ITargetFunction } from '../models/target-function.model';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  /* TODO: deleting old points,
    updating >= series by x axis and y axis
  */
  private readonly border: IPoint;
  private commonPoints: IPoint[];
  private readonly series: Serie[];
  private readonly ineqlist: any[];
  private targetFunction: {
    X1: number;
    X2: number;
    func(point: IPoint): number;
  };
  private biggestFunctionValue;

  public constructor() {
    this.series = [];
    this.border = {
      x: 0,
      y: 0,
    };
    this.commonPoints = [];
    this.ineqlist = [];
    this.targetFunction = {
      func: () => 0,
      X1: 0,
      X2: 0,
    };
    this.biggestFunctionValue = {
      value: 0,
      point: {
        x: 0,
        y: 0,
      },
    };
  }

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
  public createBiggestLine(chart: any): void {
    const newpoints = [];
    if (this.biggestFunctionValue.point.x !== 0) {
      newpoints.push({
        x: 0,
        y: this.biggestFunctionValue.value / this.targetFunction.X2,
      });
    }
    if (this.biggestFunctionValue.point.y !== 0) {
      newpoints.push({
        x: this.biggestFunctionValue.value / this.targetFunction.X1,
        y: 0,
      });
    }
    chart.ref$.pipe(last()).subscribe((chart2) => {
      chart2.get('big').update({
        name: 'big',
        type: 'line',
        id: 'big',
        data: [this.biggestFunctionValue.point, ...newpoints],
        findNearestPointBy: 'xy',
      });
    });
  }

  public createSerie(chart$: Observable<any>, line: ILimitation, chart2: any): void {
    this.updateBorderY();
    this.updateBorderX();
    this.updateIneqList(line);
    const nline = this.castLimitationToLine(line);
    const serie = new Serie(nline, this.border);
    const index = this.series.findIndex((a) => a.id === serie.id);
    if (index !== -1 && this.checkIfSeriesAreEqual(this.series[index], serie)) {
      return;
      }
    if (index !== -1) {
      chart$.subscribe((chart) => {
        chart.get(serie.id).update({
          type: serie.type,
          data: serie.data,
          });
        this.series.splice(index, 1);
      });
    }
    const series$ = from(this.series);
    series$.pipe(withLatestFrom(chart$))
      .subscribe(([elem, chart]) => {
        const newPoint = this.getCommonPoint(elem, serie);
        if (!isNaN(newPoint.x) && !isNaN(newPoint.y)) {
          const j = elem.addPoint(newPoint, this.border);
          serie.addPoint(newPoint, this.border);
          chart.get(elem.id).addPoint(elem.data[j]);
        }
      });
    this.series.push(serie);
    if (index === -1) {
      chart$.subscribe((chart) => chart.addSeries(this.series[this.series.length - 1], true, true));
    }
    this.commonPoints = this.findCommonPoints();
    this.updateBiggestFunctionValue();
    this.createBiggestLine(chart2);
    chart2.removeSeries(3);

    chart2.addSeries({
        name: 'common',
        type: 'area',
        id: 'common',
        data: this.commonPoints,
        findNearestPointBy: 'xy',
      });
  }

  public createTargetFunction(params: ITargetFunction): (arg0: IPoint) => number {
    this.targetFunction = {
      X1: params.X1,
      X2: params.X2,
      func: (point: IPoint) => params.X1 * point.x + params.X2 * point.y,
    };
    this.updateBiggestFunctionValue();

    return (point: IPoint) => params.X1 * point.x + params.X2 * point.y;
  }

  public findCommonPoints(): IPoint[] {
    let tmp = [];
    if (this.checkPointForInequalities({x: 0, y: 0})) {
      tmp.push({x: 0, y: 0, min: 1});
    }
    this.series.forEach((serie) => {
     serie.points.forEach((elem) => {
       if (this.checkPointForInequalities(elem)) {
         if (serie.type !== 'area' || elem.x === 0 || elem.y === 0) {
          tmp.push({
            ...elem,
            min: 1,
          });
        } else {
          tmp.push({
            ...elem,
            min: 0,
        });
      }
    }
    });
  });
    for (let i = 0; i < tmp.length; i++) {
      for (let j = i + 1; j < tmp.length; j++) {
        if (tmp[i].x === tmp[j].x && tmp[i].y === tmp[j].y) {
          tmp.splice(i, 1);
          j = tmp.length;
          i--;
        }
      }
    }
    tmp = tmp.sort((a, b) => {
      if (a.min && b.min) {
        return a.x - b.x ? a.x - b.x : b.y - a.y;
      }

      return b.min - a.min;
    });
    tmp.push(tmp[0]);

    return tmp;
  }

  public updateBiggestFunctionValue() {
    this.biggestFunctionValue = {
      value: 0,
      point: {},
    };
    this.commonPoints.forEach((elem) => {
      if (this.targetFunction.func(elem) > this.biggestFunctionValue.value) {
        this.biggestFunctionValue.value = this.targetFunction.func(elem);
        this.biggestFunctionValue.point = elem;
      }
    });

  }

  public checkPointForInequalities(point) {
    return this.ineqlist.every((ineq) => ineq.func(point.x, point.y));
  }

  public updateIneqList(inequality: ILimitation) {
    for (let i = 0; i < this.ineqlist.length; i++) {
      if (this.ineqlist[i].index === inequality.lineNumber) {
        this.ineqlist.splice(i, 1);
      }
    }
    if (inequality.sign === '<=') {
    this.ineqlist.push({
      index: inequality.lineNumber,
      func: (x, y) =>
      inequality.X1 * x + inequality.X2 * y - inequality.limit <= 0,
    });
  }
    if (inequality.sign === '=') {
      this.ineqlist.push({
        index: inequality.lineNumber,
        func: (x, y) =>
        inequality.X1 * x + inequality.X2 * y - inequality.limit === 0,
      });
    }
    if (inequality.sign === '>=') {
      this.ineqlist.push({
        index: inequality.lineNumber,
        func: (x, y) =>
        inequality.X1 * x + inequality.X2 * y - inequality.limit >= 0,
      });
    }
  }

  private checkIfSeriesAreEqual(line1: Serie, line2: Serie): boolean {
    const lastPointInLine1 = line1.data[line1.data.length - 1];
    const lastPointInLine2 = line2.data[line2.data.length - 1];
    if (line1.type !== line2.type) {
      return false;
    }
    if (JSON.stringify(line1.data[0]) !== JSON.stringify(line2.data[0])) {
      return false;
    }
    if (JSON.stringify(lastPointInLine1) !== JSON.stringify(lastPointInLine2)) {
      return false;
    }

    return true;
  }

  private getCommonPoint(elem: Serie, serie: Serie): IPoint {
    console.log(this.series);
    const points = elem.points;
    const points2 = serie.points;
    const k1 = -points[points.length - 2].y / points[points.length - 1].x;
    const k2 = -points2[points2.length - 2].y / points2[points2.length - 1].x;
    const b = points2[points2.length - 2].y - points[points.length - 2].y;
    const x = b / (k1 - k2);
    const y = x * k1 + points[points.length - 2].y;
    if (elem.x) {
      return {
        x: elem.x,
        y: points2[points2.length - 2].y - elem.x * k2,
      };
    }
    if (elem.y) {
      return {
        x: (points[points.length - 2].y - elem.y) / k1,
        y: elem.y,
      };
    }
    if (serie.x) {
      return {
        x: serie.x,
        y: points[points.length - 2].y - serie.x * k1,
      };
    }
    if (serie.y) {
      return {
        x: (points2[points2.length - 2].y - serie.y) / k2,
        y: serie.y,
      };
    }
    if (x < 0 || y < 0) {
      return {x: undefined, y: undefined};
    }

    return {x, y};
  }

  private updateBorderX(): void {
    this.border.x = 0;
    this.series.forEach((serie) => {
      if (serie.points[serie.points.length - 1].x > this.border.x) {
        this.border.x = serie.points[serie.points.length - 1].x;
      }
    });
  }

  private updateBorderY(): void {
    this.border.y = 0;
    this.series.forEach((serie) => {
      if (serie.points[0].y > this.border.y) {
        this.border.y = serie.points[0].y;
      }
    });
  }
}
