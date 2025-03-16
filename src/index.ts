/* eslint-disable no-dupe-class-members */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Router } from './routers';
import { serveStatic } from './static';
import { bodyParserMiddleware } from './middlewares';
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  SimpleHandler,
  ErrorHandler,
  NextHandler,
  attachResponseMethods,
  HttpMethod
} from './types';
import { parse } from 'url';

class TashakkoriExpress {
  private router: Router;

  constructor() {
    this.router = new Router();
  }

  public use(handler: RequestHandler): void;
  public use(path: string, handler: RequestHandler): void;
  public use(pathOrHandler: string | RequestHandler, handler?: RequestHandler): void {
    if (typeof pathOrHandler === 'string' && handler) {
      this.router.addRoute(HttpMethod.ALL, pathOrHandler, [handler]);
    } else if (typeof pathOrHandler === 'function') {
      this.router.addRoute(HttpMethod.ALL, '*', [pathOrHandler]);
    }
  }

  private registerRoute(
    method: HttpMethod,
    path: string,
    handlers: RequestHandler[]
  ): void {
    this.router.addRoute(method, path, handlers);
  }

  public all(path: string, ...handlers: RequestHandler[]): void {
    this.registerRoute(HttpMethod.ALL, path, handlers);
  }

  public get(path: string, ...handlers: RequestHandler[]): void {
    this.registerRoute(HttpMethod.GET, path, handlers);
  }

  public post(path: string, ...handlers: RequestHandler[]): void {
    this.registerRoute(HttpMethod.POST, path, handlers);
  }

  public put(path: string, ...handlers: RequestHandler[]): void {
    this.registerRoute(HttpMethod.PUT, path, handlers);
  }

  public delete(path: string, ...handlers: RequestHandler[]): void {
    this.registerRoute(HttpMethod.DELETE, path, handlers);
  }

  public static(root: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await serveStatic(root, req, res, next);
    };
  }

  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse): void => {
      const request = req as Request;
      const response = res as Response;
      attachResponseMethods(response, res);
      this.handleRequest(request, response);
    });
    server.listen(port, callback);
  }

  private async handleRequest(req: Request, res: Response): Promise<void> {
    const { method, url } = req;
    const parsedUrl = parse(url as string, true);
    const pathname = parsedUrl.pathname!;
    req.query = {};
    for (const key in parsedUrl.query) {
      const value = parsedUrl.query[key];
      req.query[key] = Array.isArray(value) ? value.join(',') : (value as string);
    }

    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && lastSegment.includes('.')) {
      segments.pop();
    }
    let modifiedPathname = segments.join('/');
    if (!modifiedPathname.startsWith('/')) {
      modifiedPathname = '/' + modifiedPathname;
    }

    if (!method) {
      res.status(400).send('Bad Request: Method is undefined');
      return;
    }

    const matchingRoutes = this.router.matchRoute(
      method.toLowerCase() as HttpMethod,
      modifiedPathname,
      req
    );

    if (matchingRoutes.length === 0) {
      if (!res.writableEnded) {
        res.status(404).send('Not Found');
      }
      return;
    }

    const handlers: RequestHandler[] = matchingRoutes.flatMap((route) => route.handlers);

    let index = 0;
    const next: NextFunction = async (err?: any): Promise<void> => {
      if (err) {
        const errorHandler = handlers.find((handler) => handler.length === 4) as
          | ErrorHandler
          | undefined;
        if (errorHandler) {
          if (!res.writableEnded) {
            await errorHandler(err, req, res, next);
          }
        } else {
          if (!res.writableEnded) {
            res.status(500).send('Internal Server Error');
          }
        }
        return;
      }
      if (index >= handlers.length) {
        if (!res.writableEnded) {
          res.status(500).send('Internal Server Error');
        }
        return;
      }

      const handler = handlers[index++];
      if (handler.length === 4) {
        next(err);
      } else if (handler.length === 3) {
        if (!res.writableEnded) {
          await (handler as NextHandler)(req, res, next);
        }
      } else {
        if (!res.writableEnded) {
          await (handler as SimpleHandler)(req, res);
        }
        next();
      }
    };

    next();
  }

  public json(): RequestHandler {
    return bodyParserMiddleware();
  }
}

export function tashakkoriexpress(): TashakkoriExpress {
  return new TashakkoriExpress();
}

export { Request, Response, NextFunction, RequestHandler };
