import { Response } from './types';
import { ServerResponse } from 'http';
export declare function mountResponseMethods(
  response: Response,
  res: ServerResponse
): void;
