import { ISerie } from './../shared/models/serie.model';
import { ITargetFunction } from './../shared/models/target-function.model';
import { ILine } from './../shared/models/line.model';
import { IPoint } from './../shared/models/point.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  /*THIS SERVICE IS REALLY BAD LOOKING, BUT ALL THIS CODE HAS ALMOST NOTHING IN COMMON WITH ANGULAR,
      SO I WILL REWRITE THIS LATER, IT JUST WORKS, SO I CAN SEE THE RESULT
      TODO: CLEAN THIS CODE,
      ADD SOLVING THE MAIN EQUATION LOGIC,
      HOVER RESULT VIEWING
      REWRITE DATA SHARING LOGIC WITH NO USING APP COMPONENT
  */
  private seriesArray: Array<ISerie>;
  private biggestY: number;
  private biggestX: number;

  constructor() {
    this.biggestY = 0;
    this.biggestX = 0;
    this.seriesArray = [];
  }

  private solve(points: IPoint[], points2: IPoint[]): IPoint {
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

  private checkIfLinesAreEqual(line1: ISerie, line2: ISerie): boolean {
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

  private updateBiggestY(): void {
    this.seriesArray.forEach(serie => {
      if (serie.data[0].y > this.biggestY) {
        this.biggestY = serie.data[0].y;
      }
    });
  }

  private updateBiggestX(): void {
    this.seriesArray.forEach(serie => {
      if (serie.data[serie.data.length - 1].x > this.biggestX) {
        this.biggestX = serie.data[serie.data.length - 1].x;
      }
    });
  }

  public createTargetFunction(params: ITargetFunction): (arg0: IPoint) => number {
    return (point: IPoint) => params.X1 * point.x + params.X2 * point.y;
  }

  public updateSeries(chart): void {
    this.seriesArray.forEach(serie => {
      chart.addSeries(serie);
    });
  }

  public createSerie(chart, line: ILine): void {
    this.updateBiggestY();
    this.updateBiggestX();
    const { sign, points, lineNumber } = line;
    let type: string;
    switch (sign) {
      case '<=':
        type = 'area';
        break;
      case '=':
        type = 'line';
        break;
      case '>=':
        type = 'arearange';
        break;
    }
    const serie = {
        name: `Limitation ${lineNumber + 1}`,
        data: points.sort((a: IPoint, b: IPoint) => a.x - b.x),
        type,
      };
    const index = this.seriesArray.findIndex((a) => a.name === serie.name);
    if (index !== -1 && this.checkIfLinesAreEqual(this.seriesArray[index], serie)) {
        return;
      }
    if (index !== -1) {
        chart.removeSeries(index + 1);
        this.seriesArray.splice(index, 1);
      }
    let t = this.seriesArray.length;
    for (let i = 0; i < t; i++) {
        const elem = this.seriesArray[i];
        const newPoint = this.solve(elem.data, serie.data);
        if (isNaN(newPoint.x) || isNaN(newPoint.y)) {
          continue;
        }
        elem.data.push(newPoint);
        elem.data.sort((a: IPoint, b: IPoint) => a.x - b.x);
        serie.data.push(newPoint);
        serie.data.sort((a: IPoint, b: IPoint) => a.x - b.x);
        chart.removeSeries(i + 1);
        chart.addSeries(elem, true, true);
        const u = this.seriesArray.splice(i, 1);
        this.seriesArray.push(...u);
        i--;
        t--;
      }
    if (serie.type === 'arearange') {
      const tmpSerie = {
        data: [],
        type: 'arearange',
        name: serie.name
      };
      tmpSerie.data = serie.data.map((point: any) => {
        if (point.y > this.biggestY) {
          this.biggestY = point.y;
        }
        if (point.x > this.biggestX) {
          this.biggestX = point.x;
        }
        return point = [point.x, point.y, this.biggestY + 1];
      });
      console.log(this.biggestX);
      if (this.biggestX > tmpSerie.data[tmpSerie.data.length - 1][0]) {
        console.log(tmpSerie.data);
        tmpSerie.data.push([this.biggestX + 1, 0, this.biggestY + 1]);
      }
      console.log(tmpSerie.data);
      this.seriesArray.push(tmpSerie);
    } else {
      this.seriesArray.push(serie);
    }
    chart.addSeries(this.seriesArray[this.seriesArray.length - 1], true, true);
  }
}
