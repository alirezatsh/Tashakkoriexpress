import { Request, Response, NextFunction, RequestHandler } from './types';
declare class TashakkoriExpress {
  private router;
  constructor();
  use(handler: RequestHandler): void;
  // eslint-disable-next-line no-dupe-class-members
  use(path: string, handler: RequestHandler): void;
  private registerRoute;
  all(path: string, ...handlers: RequestHandler[]): void;
  get(path: string, ...handlers: RequestHandler[]): void;
  post(path: string, ...handlers: RequestHandler[]): void;
  put(path: string, ...handlers: RequestHandler[]): void;
  delete(path: string, ...handlers: RequestHandler[]): void;
  static(root: string): RequestHandler;
  listen(port: number, callback?: () => void): void;
  private handleRequest;
  json(): RequestHandler;
}
export declare function tashakkoriexpress(): TashakkoriExpress;
export { Request, Response, NextFunction, RequestHandler };
