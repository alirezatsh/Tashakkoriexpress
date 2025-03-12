import { IncomingMessage, ServerResponse } from 'http';

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
