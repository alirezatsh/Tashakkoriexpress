import { IncomingMessage, ServerResponse } from 'node:http';
import { Methods, CallbackTemplate } from './types';
declare class Router {
    private routes;
    addRoute(method: Methods, path: string, handler: CallbackTemplate): void;
    handleRequest(req: IncomingMessage, res: ServerResponse): void | Promise<void>;
    private matchRoute;
    private extractParams;
}
export default Router;
