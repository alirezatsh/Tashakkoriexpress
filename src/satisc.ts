import { Middleware } from './types';
import { parse } from 'url';
import { join, normalize } from 'path';
import fs from 'fs-extra';

const serveStatic = (root: string): Middleware => {
  return async (req, res, next) => {
    try {
      const parsedUrl = parse(req.url as string, true);
      const tempPath = parsedUrl.pathname!;
      const segments = tempPath.split('/');
      const lastSegment = segments[segments.length - 1];
      const pathname = decodeURIComponent(lastSegment);
      const filePath = normalize(join(root, pathname));

      if (!filePath.startsWith(root)) {
        return next(new Error('File Path Is Not Correct'));
      }

      const fileExists = await fs.pathExists(filePath);
      const stats = await fs.stat(filePath);
      if (!fileExists || stats.isDirectory()) {
        return next();
      }

      res.setHeader('Content-Type', getMimeType(filePath));
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('end', () => res.end());
      stream.on('error', (err: Error | undefined) =>
        next(err instanceof Error ? err : new Error('Unknown Error'))
      );
    } catch (err) {
      next(err instanceof Error ? err : new Error('Unknown Error'));
    }
  };
};

const getMimeType = (filePath: string): string => {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
};

export default serveStatic;
