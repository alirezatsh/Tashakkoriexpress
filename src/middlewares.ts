import { Request, Response, NextFunction, RequestHandler } from './types';
import { URLSearchParams } from 'url';

export function bodyParserMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'];

    if (!contentType) return next();

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (!body) return next();

      try {
        if (contentType.includes('application/json')) {
          req.body = JSON.parse(body);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(body);
          req.body = Object.fromEntries(params);
        }
      } catch (error) {
        return next(error);
      }

      next();
    });
  };
}
