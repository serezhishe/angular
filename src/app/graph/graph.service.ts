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
  private seriesArray: Array<any> = [];
  constructor() { }
  private solve(points: {x: number, y: number}[], points2: {x: number, y: number}[]) {
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

  public createSerie(chart, { sign, points, lineNumber }) {
    const serie = {
        name: `Limitation ${lineNumber + 1}`,
        type: sign === '=' ? 'line' : 'area',
        data: points.sort((a: {x: number}, b: {x: number}) => a.x - b.x),
      };
    const index = this.seriesArray.findIndex((a) => a.name === serie.name);
      // tslint:disable-next-line: max-line-length
    if (index !== -1 && this.seriesArray[index].type === serie.type && JSON.stringify(this.seriesArray[index].data[0]) === JSON.stringify(serie.data[0])
        // tslint:disable-next-line: max-line-length
        && JSON.stringify(this.seriesArray[index].data[this.seriesArray[index].data.length - 1]) === JSON.stringify(serie.data[serie.data.length - 1])) {
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
        elem.data.sort((a: {x: number}, b: {x: number}) => a.x - b.x);
        serie.data.push(newPoint);
        serie.data.sort((a: {x: number}, b: {x: number}) => a.x - b.x);
        chart.removeSeries(i + 1);
        chart.addSeries(elem, true, true);
        const u = this.seriesArray.splice(i, 1);
        this.seriesArray.push(...u);
        i--;
        t--;
      }
    this.seriesArray.push(serie);
    chart.addSeries(this.seriesArray[this.seriesArray.length - 1], true, true);
  }
}
