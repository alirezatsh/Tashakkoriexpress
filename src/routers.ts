import { IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { Route, Methods, Request, Response, CallbackTemplate } from './types';

class Router {
  private routes: Record<Methods, Route[]> = {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
    PATCH: []
  };

  addRoute(method: Methods, path: string, handler: CallbackTemplate) {
    this.routes[method].push({ method, path, handler });
  }

  handleRequest(req: IncomingMessage, res: ServerResponse) {
    const parsedUrl = parse(req.url || '', true);
    const method = req.method as Methods;
    const pathname = parsedUrl.pathname || '/';

    const request = req as Request;
    request.query = parsedUrl.query;

    const response = res as Response;
    response.status = function (code: number) {
      this.statusCode = code;
      return this;
    };
    response.json = function (data: object) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(data));
    };
    response.redirect = function (path: string) {
      this.writeHead(302, { Location: path });
      this.end();
    };

    const route = this.routes[method]?.find((r) => this.matchRoute(r.path, pathname));

    if (route) {
      request.params = this.extractParams(route.path, pathname);
      return route.handler(request, response, () => {});
    }

    response.status(404).json({ error: 'Route not found' });
  }

  private matchRoute(routePath: string, reqPath: string): boolean {
    const routeSegments = routePath.split('/');
    const reqSegments = reqPath.split('/');

    return (
      routeSegments.length === reqSegments.length &&
      routeSegments.every((seg, i) => seg.startsWith(':') || seg === reqSegments[i])
    );
  }

  private extractParams(routePath: string, reqPath: string): Record<string, string> {
    const params: Record<string, string> = {};
    routePath.split('/').forEach((seg, i) => {
      if (seg.startsWith(':')) params[seg.slice(1)] = reqPath.split('/')[i];
    });
    return params;
  }
}

export default Router;
