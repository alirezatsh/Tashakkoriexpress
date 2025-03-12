import { Request, Response, NextFunction, RequestHandler } from './types';

/**
 * @returns {RequestHandler}
 */
export function jsonMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
      return next();
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (body) {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          return next(e);
        }
      }
      next();
    });
  };
}
