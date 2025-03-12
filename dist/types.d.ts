import { IncomingMessage, ServerResponse } from 'http';
/**
 * Type for a NextFunction in middleware.
 * @param {any} [err] - Optional error object.
 * @returns {void}
 */
export type NextFunction = (err?: any) => void;
/**
 * Interface for a Request which extends the IncomingMessage from Node.js HTTP module.
 * @property {Record<string, string>} query - An object containing the URL query parameters.
 * @property {Record<string, string>} params - An object containing the route parameters.
 * @property {any} [body] - The body of the request (optional).
 */
export interface Request extends IncomingMessage {
  query: Record<string, string>;
  params: Record<string, string>;
  body?: any;
}
/**
 * Interface for a Response which extends the ServerResponse from Node.js HTTP module.
 * @property {Function} json - Method to send a JSON response.
 * @property {Function} redirect - Method to redirect to a specified URL.
 * @property {Function} status - Method to set the status code of the response.
 * @property {Function} send - Method to send a response.
 */
export interface Response extends ServerResponse {
  json(data: any): void;
  redirect(url: string): void;
  status(code: number): Response;
  send(data: any): void;
}
/**
 * Type for a simple request handler.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void | Promise<void>}
 */
export type SimpleHandler = (req: Request, res: Response) => void | Promise<void>;
/**
 * Type for a next request handler.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware stack.
 * @returns {void | Promise<void>}
 */
export type NextHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
/**
 * Type for an error request handler.
 * @param {any} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware stack.
 * @returns {void | Promise<void>}
 */
export type ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
/**
 * Type for a request handler which can be a simple, next, or error handler.
 */
export type RequestHandler = SimpleHandler | NextHandler | ErrorHandler;
/**
 * The Route type defines the structure of a route object with method, path, and handlers properties.
 * @property {string} method - The HTTP method for the route (GET, POST, etc.).
 * @property {string} path - The URL path for the route.
 * @property {RequestHandler[]} handlers - Array of handler functions for the route.
 */
export type Route = {
  method: string;
  path: string;
  handlers: RequestHandler[];
};
