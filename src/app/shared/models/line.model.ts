export interface ILine {
  lineNumber: number;
  points: Array<{
    x: number;
    y: number;
  }>;
  sign: string;
}
