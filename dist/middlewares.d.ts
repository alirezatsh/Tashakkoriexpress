import { Request, Response, Middleware } from './types';
declare class MiddlewareManager {
    private middlewares;
    use(middleware: Middleware): void;
    execute(req: Request, res: Response, finalHandler: () => void): Promise<void>;
}
export default MiddlewareManager;
