import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { last, withLatestFrom } from 'rxjs/operators';

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
    finding point at which target fuction at it's max value
    creating target function value line through this point
  */
  private readonly border: IPoint;
  private readonly series: Serie[];

  public constructor() {
    this.series = [];
    this.border = {
      x: 0,
      y: 0,
    };
  }

  public createSerie(chart: any, line: ILine): void {
    this.updateBorderY();
    this.updateBorderX();
    const serie = new Serie(line, this.border);
    const chart$ = (chart.ref$ as Observable<any>).pipe(last());
    const index = this.series.findIndex((a) => a.id === serie.id);
    if (index !== -1 && this.checkIfSeriesAreEqual(this.series[index], serie)) {
      return;
      }
    if (index !== -1) {
      chart$.subscribe((obs) => obs.get(serie.id).update({
          type: serie.type,
          data: serie.data,
        }));
      }

    const series$ = from(this.series);
    series$.pipe(withLatestFrom(chart$))
      .subscribe(([elem, chartik]) => {
        const newPoint = this.getCommonPoint(elem.points, serie.points);
        if (!isNaN(newPoint.x) && !isNaN(newPoint.y)) {
          const j = elem.addPoint(newPoint, this.border);
          serie.addPoint(newPoint, this.border);
          chartik.get(elem.id).addPoint(elem.data[j]);
        }
      });
    if (index === -1) {
      this.series.push(serie);
      chart$.subscribe((obs) => obs.addSeries(this.series[this.series.length - 1], true, true));
    }
  }

  public createTargetFunction(params: ITargetFunction): (arg0: IPoint) => number {
    return (point: IPoint) => params.X1 * point.x + params.X2 * point.y;
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

  private getCommonPoint(points: IPoint[], points2: IPoint[]): IPoint {
    const k1 = -points[0].y / points[points.length - 1].x;
    const k2 = -points2[0].y / points2[points2.length - 1].x;
    const b = points2[0].y - points[0].y;
    const x = b / (k1 - k2);
    const y = x * k1 + points[0].y;
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
