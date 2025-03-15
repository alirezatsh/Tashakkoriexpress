import { Request, Response, NextFunction } from './types';
export declare function serveStatic(root: string, req: Request, res: Response, next: NextFunction): Promise<void>;
