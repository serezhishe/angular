import { IPoint } from './point.model';
export interface ILine {
  lineNumber: number;
  points: IPoint[];
  sign: string;
}
