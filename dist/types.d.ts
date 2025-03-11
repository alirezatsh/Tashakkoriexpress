import { IncomingMessage, ServerResponse } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';
export interface Request extends IncomingMessage {
  query?: ParsedUrlQuery;
  params?: {
    [key: string]: string;
  };
}
export interface Response extends ServerResponse {
  status(code: number): Response;
  json(data: object): void;
  redirect(path: string): void;
}
export type NextFunction = (err?: Error) => void;
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type Callback = (req: Request, res: Response, next: NextFunction) => void;
export type AsyncCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
export type CallbackTemplate = Callback | AsyncCallback;
export type ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
export type Route = {
  method: Methods;
  path: string;
  handler: CallbackTemplate;
};
export type RouteMap = Record<Methods, Route[]>;
export interface ApplicationConfig {
  port: number;
  middlewares: Middleware[];
  routes: Route[];
}
