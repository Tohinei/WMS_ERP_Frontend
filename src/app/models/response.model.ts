export interface Response {
  [x: string]: any;
  statusCode: number;
  type: number; // 0 : Error, 1 : Success, 2 : Warning
  message: string;
  data: any;
}
