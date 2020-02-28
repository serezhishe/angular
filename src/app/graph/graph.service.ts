import { Injectable } from '@angular/core';
import { GraphModule } from './graph.module';

@Injectable({
  providedIn: GraphModule,
})
export class GraphService {

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

  public createSerie(chart, params, seriesArray) {
    // THIS SERVICE IS REALLY BAD LOOKING, BUT ALL THIS CODE HAS ALMOST NOTHING IN COMMON WITH ANGULAR, SO I WILL REWRITE THIS LATER
    // IT JUST WORKS, SO I CAN SEE THE RESULT
    const { sign, points, lineNumber } = params;
    if (chart) {
      const serie = {
        name: `Limitation ${lineNumber + 1}`,
        type: sign === '=' ? 'line' : 'area',
        data: points.sort((a: {x: number}, b: {x: number}) => a.x - b.x),
      };
      const index = seriesArray.findIndex((a) => a.name === serie.name);
      // tslint:disable-next-line: max-line-length
      if (index !== -1 && seriesArray[index].type === serie.type && JSON.stringify(seriesArray[index].data[0]) === JSON.stringify(serie.data[0])
        // tslint:disable-next-line: max-line-length
        && JSON.stringify(seriesArray[index].data[seriesArray[index].data.length - 1]) === JSON.stringify(serie.data[serie.data.length - 1])) {
        return;
      }
      if (index !== -1) {
        chart.removeSeries(index + 1);
        seriesArray.splice(index, 1);
      }
      let t = seriesArray.length;
      for (let i = 0; i < t; i++) {
        const elem = seriesArray[i];
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
        const u = seriesArray.splice(i, 1);
        seriesArray.push(...u);
        i--;
        t--;
      }
      seriesArray.push(serie);
      chart.addSeries(seriesArray[seriesArray.length - 1], true, true);
    }
  }
}
