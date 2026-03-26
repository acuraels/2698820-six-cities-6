/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpMethod = 'get' | 'post' | 'delete' | 'patch' | 'put';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (...args: any[]) => any;
  middlewares?: Array<(...args: any[]) => any>;
}
