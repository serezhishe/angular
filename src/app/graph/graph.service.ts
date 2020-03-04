import { Injectable } from '@angular/core';

import { ILine } from './../shared/models/line.model';
import { IPoint } from './../shared/models/point.model';
import { Serie } from './../shared/models/serie.model';
import { ITargetFunction } from './../shared/models/target-function.model';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private readonly border: IPoint;
  private readonly series: Serie[];

  public constructor() {
    this.series = [];
    this.border = {x: 0, y: 0};
  }

  public createSerie(chart: any, line: ILine): void {
    this.updateBorderY();
    this.updateBorderX();
    const serie = new Serie(line, this.border);

    const index = this.series.findIndex((a) => a.name === serie.name);
    if (index !== -1 && this.checkIfSeriesAreEqual(this.series[index], serie)) {
        return;
      }
    if (index !== -1) {
        chart.removeSeries(index + 1);
        this.series.splice(index, 1);
      }
    let t = this.series.length;
    for (let i = 0; i < t; i++) {
        const elem = this.series[i];
        const newPoint = this.getCommonPoint(elem.points, serie.points);
        if (isNaN(newPoint.x) || isNaN(newPoint.y)) {
          continue;
        }
        elem.addPoint(newPoint, this.border);
        serie.addPoint(newPoint, this.border);
        chart.removeSeries(i + 1);
        chart.addSeries(elem, true, true);
        const u = this.series.splice(i, 1);
        this.series.push(...u);
        i--;
        t--;
      }
    this.series.push(serie);
    chart.addSeries(this.series[this.series.length - 1], true, true);
  }

  public createTargetFunction(params: ITargetFunction): (arg0: IPoint) => number {
    return (point: IPoint) => params.X1 * point.x + params.X2 * point.y;
  }

  public updateSeries(chart: any): void {
    this.series.forEach((serie) => {
      chart.addSeries(serie, true, true);
    });
  }

  private checkIfSeriesAreEqual(line1: Serie, line2: Serie): boolean {
    const lastElemInLine1 = line1[line1.data.length - 1];
    const lastElemInLine2 = line2[line2.data.length - 1];
    if (line1.type !== line2.type) {
      return false;
    }
    if (JSON.stringify(line1.data[0]) !== JSON.stringify(line2.data[0])) {
      return false;
    }
    if (JSON.stringify(lastElemInLine1) !== JSON.stringify(lastElemInLine2)) {
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
