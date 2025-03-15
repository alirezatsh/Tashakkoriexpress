/* eslint-disable no-undef */
import { IncomingMessage, ServerResponse } from 'http';

// TYPES
export type NextFunction = (err?: Error | unknown) => void;

export interface Request extends IncomingMessage {
  query: Record<string, string>;
  params: Record<string, string>;
  body?: unknown;
}

export interface Response extends ServerResponse {
  json(data: unknown): void;
  redirect(url: string): void;
  status(code: number): this;
  send(data: unknown): void;
}

export type SimpleHandler = (req: Request, res: Response) => void | Promise<void>;

export type NextHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type ErrorHandler = (
  err: Error | unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type RequestHandler = SimpleHandler | NextHandler | ErrorHandler;

export type Route = {
  method: string;
  path: string;
  handlers: RequestHandler[];
};

// METHODS
export function attachResponseMethods(response: Response, res: ServerResponse) {
  response.status = (code: number): Response => {
    res.statusCode = code;
    return res as Response;
  };

  response.json = (data: unknown): void => {
    if (!res.hasHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(data));
  };

  response.redirect = (url: string): void => {
    res.statusCode = 302;
    res.setHeader('Location', url);
    res.end(`Redirecting to ${url}`);
  };

  response.send = (data: unknown): void => {
    if (typeof data === 'object' && data !== null && !Buffer.isBuffer(data)) {
      if (!res.hasHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(data));
    } else {
      const contentType = Buffer.isBuffer(data)
        ? 'application/octet-stream'
        : 'text/plain';
      if (!res.hasHeader('Content-Type')) {
        res.setHeader('Content-Type', contentType);
      }
      res.end(data as string);
    }
  };
}
