import { Route, Request, RequestHandler } from './types';
export declare class Router {
    private routes;
    constructor();
    addRoute(method: string, path: string, handlers: RequestHandler[]): void;
    matchRoute(method: string, pathname: string, req: Request): Route[];
    private checkPath;
}
