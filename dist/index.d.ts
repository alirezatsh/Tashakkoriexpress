import { Request, Response, NextFunction, RequestHandler } from './types';
declare class TashakkoriExpress {
    private router;
    constructor();
    use(handler: RequestHandler): void;
    use(path: string, handler: RequestHandler): void;
    all(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void;
    get(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void;
    post(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void;
    put(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void;
    delete(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void;
    patch(path: string, handler: RequestHandler, ...handlers: RequestHandler[]): void;
    static(root: string): RequestHandler;
    listen(port: number, callback?: () => void): void;
    private handleRequest;
    json(): RequestHandler;
}
export declare function tashakkoriexpress(): TashakkoriExpress;
export { Request, Response, NextFunction, RequestHandler };
