import { ILine } from './line.model';
import { IPoint } from './point.model';
// tslint:disable: strict-boolean-expressions
export class Serie {
  public data: IPoint[] | number[][];
  public findNearestPointBy: string;
  public id: string;
  public name: string;
  public points: IPoint[];
  public type: string;
  public x: number;
  public y: number;

  public constructor({ sign, points, lineNumber }: ILine, border: IPoint) {
    this.id = `lim${lineNumber}`;
    this.name = `Limitation ${lineNumber + 1}`;
    this.points = points.sort((a: IPoint, b: IPoint) => a.x - b.x);
    if (this.points[0].x === 0 && this.points[0].y === 0) {
      this.points = [
        {
          x: 0,
          y: 0,
        }, {
          x: this.points[1].x ? this.points[1].x : border.x + 1,
          y: 0,
        }, {
          x: this.points[1].x ? this.points[1].x : border.x + 1,
          y: this.points[1].y ? this.points[1].y : border.y + 1,
        }, {
          x: 0,
          y: this.points[1].y ? this.points[1].y : border.y + 1,
        },
      ];
      this.x =  this.points[1].x ? this.points[1].x : undefined;
      this.y =  this.points[1].y ? this.points[1].y : undefined;
    }
    this.findNearestPointBy = 'xy';
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
        if (point.x > border.x) {
          // tslint:disable-next-line: no-parameter-reassignment
          border.x = point.x;
        }

        return [point.x, point.y, border.y + 1];
      });
      if (border.x > this.points[this.points.length - 1].x) {
        this.data.push([border.x + 1, 0, border.y + 1]);
      }
      this.data.sort((a, b) => a[0] - b[0]);
    } else {
      console.log(this.points);
      this.data = this.points;
    }
  }

  public addPoint(point: IPoint, border: IPoint): number {
    this.points.push(point);
    this.points.sort((a: IPoint, b: IPoint) => a.x - b.x);
    if (this.type === 'arearange') {
      this.data = this.data as number[][];
      this.data[this.data.length] = [point.x, point.y, border.y + 1];
      this.data.sort((a: number[], b: number[]) => a[0] - b[0]);
    } else {
      this.data = this.data as IPoint[];
      this.data[this.data.length] = point;
      this.data.sort((a: IPoint, b: IPoint) => a.x - b.x);
    }

    return this.points.indexOf(point);
  }
}
