import Router from './routers';
import MiddlewareManager from './middlewares';
import serveStatic from './static';
import { ApplicationConfig , Request , Response } from './types';

class TashakkoriExpress {
  private router: Router;
  private middlewareManager: MiddlewareManager;
  private config: ApplicationConfig;

  constructor(config: ApplicationConfig) {
    this.router = new Router();
    this.middlewareManager = new MiddlewareManager();
    this.config = config;

    this.config.middlewares.forEach((middleware) => {
      this.middlewareManager.use(middleware);
    });
  }

  addRoute(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    handler: any
  ) {
    this.router.addRoute(method, path, handler);
  }

  listen() {
    const { port, routes } = this.config;
    const server = require('http').createServer(
      (req: Request, res: Response) => {
        this.middlewareManager.execute(req, res, () => {
          this.router.handleRequest(req, res);
        });
      }
    );

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}

const tashakkoriExpress = (config: ApplicationConfig) => new TashakkoriExpress(config);

tashakkoriExpress.static = serveStatic;

export default tashakkoriExpress;
