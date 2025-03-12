import { Route, Request, RequestHandler } from './types';

export class Router {
  private routes: Route[];

  constructor() {
    this.routes = [];
  }

  public addRoute(method: string, path: string, handlers: RequestHandler[]): void {
    this.routes.push({ method, path, handlers });
  }

  public matchRoute(method: string, pathname: string, req: Request): Route[] {
    return this.routes.filter(
      (route) =>
        (route.method === method.toLowerCase() || route.method === 'all') &&
        this.checkPath(route.path, pathname, req)
    );
  }

  private checkPath(path: string, reqPath: string, req: Request): boolean {
    if (!path.includes(':')) {
      return path === reqPath || path === '*';
    }

    const pathParts = path.split('/');
    const reqPathParts = reqPath.split('/');
    if (pathParts.length !== reqPathParts.length) return false;

    const params: Record<string, string> = {};
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i].startsWith(':')) {
        params[pathParts[i].substring(1)] = reqPathParts[i];
      } else if (pathParts[i] !== reqPathParts[i]) {
        return false;
      }
    }
    req.params = { ...params };
    return true;
  }
}
