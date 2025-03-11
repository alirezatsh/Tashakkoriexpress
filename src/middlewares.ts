import { Request, Response, NextFunction, Middleware } from './types';

class MiddlewareManager {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  async execute(req: Request, res: Response, finalHandler: () => void) {
    let index = 0;

    const next: NextFunction = async (err?: Error) => {
      if (err) {
        // eslint-disable-next-line no-undef
        console.error('Middleware error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        await Promise.resolve(middleware(req, res, next));
      } else {
        finalHandler();
      }
    };

    next();
  }
}

export default MiddlewareManager;
