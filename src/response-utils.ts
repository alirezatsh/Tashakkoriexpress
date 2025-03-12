/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from './types';
import { ServerResponse } from 'http';

export function mountResponseMethods(response: Response, res: ServerResponse) {
  response.status = (code: number): Response => {
    res.statusCode = code;
    return res as Response;
  };

  response.json = (data: unknown): void => {
    if (!res.hasHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(JSON.stringify(data));
  };

  response.redirect = (url: string): void => {
    res.statusCode = 302;
    res.setHeader('Location', url);
    res.end(`Redirecting to ${url}`);
  };

  response.send = (data: unknown): void => {
    if (typeof data === 'object' && data !== null && !Buffer.isBuffer(data)) {
      if (!res.hasHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(JSON.stringify(data));
    } else {
      const contentType = Buffer.isBuffer(data)
        ? 'application/octet-stream'
        : 'text/plain';
      if (!res.hasHeader('Content-Type')) {
        res.setHeader('Content-Type', contentType);
      }
      res.end(data as string);
    }
  };
}
