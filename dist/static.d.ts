import { Request, Response, NextFunction } from './types';
/**
 * Middleware function to serve static files.
 * @param {string} root - Root directory for serving static files.
 * @param {Request} req - The incoming request.
 * @param {Response} res - The outgoing response.
 * @param {NextFunction} next - The next function in the middleware stack.
 */
export declare function serveStatic(
  root: string,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>;
