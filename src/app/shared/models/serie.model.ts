import { ILine } from './line.model';
import { IPoint } from './point.model';
export class Serie {

  public data: IPoint[] | number[][];
  public name: string;
  public points: IPoint[];
  public type: string;

  public constructor({ sign, points, lineNumber }: ILine, border: IPoint) {
    this.name = `Limitation ${lineNumber + 1}`;
    this.points = points.sort((a: IPoint, b: IPoint) => a.x - b.x);
    switch (sign) {
      case '=':
        this.type = 'line';
        break;
      case '>=':
        this.type = 'arearange';
        break;
      default:
        this.type = 'area';
    }
    if (this.type === 'arearange') {
      this.data = this.points.map((point: IPoint) => {
        if (point.y > border.y) {
          // tslint:disable-next-line: no-parameter-reassignment
          border.y = point.y;
        }
        if (point.x > border.y) {
          // tslint:disable-next-line: no-parameter-reassignment
          border.y = point.x;
        }

        return [point.x, point.y, border.y + 1];
      });
      if (border.y > this.points[this.points.length - 1][0]) {
        this.data.push([border.x + 1, 0, border.y + 1]);
      }
      this.data.sort((a, b) => a[0] - b[0]);
    } else {
      this.data = points;
    }
  }

  public addPoint(point: IPoint, border: IPoint): void {
    this.points.push(point);
    this.points.sort((a: IPoint, b: IPoint) => a.x - b.x);
    if (this.type === 'arearange') {
      this.data[this.data.length] = [point.x, point.y, border.y + 1];
      this.data.sort((a: number[] | IPoint, b: number[] | IPoint) => a[0] - b[0]);
    } else {
      this.data[this.data.length] = point;
      this.data.sort((a: any, b: any) => a.x - b.x);
    }
  }
}
