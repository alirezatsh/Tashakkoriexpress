import { Route, Request, RequestHandler, HttpMethod } from './types';
export declare class Router {
  private routes;
  addRoute(method: HttpMethod, path: string, handlers: RequestHandler[]): void;
  matchRoute(method: HttpMethod, pathname: string, req: Request): Route[];
  private checkPath;
}
