import { Request, Response, NextFunction } from './types';
import { parse } from 'url';
import path from 'path';
import fs from 'fs-extra';
import mime from 'mime-types';

export async function serveStatic(
  root: string,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsedUrl = parse(req.url as string, true);
    const tempPath = parsedUrl.pathname!;
    const segments = tempPath.split('/');
    const lastSegment = segments[segments.length - 1];
    const pathname = decodeURIComponent(lastSegment);

    const filePath = path.resolve(root, pathname);

    if (!filePath.startsWith(root)) {
      return next(new Error('File Path Is Not Correct'));
    }

    const fileExists = await fs.pathExists(filePath);
    if (!fileExists) {
      return next(new Error("File Doesn't Exist"));
    }

    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      return next(new Error('Requested Path Is a Directory'));
    }

    res.status(200);
    res.setHeader('Content-Type', mime.lookup(filePath) || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => res.end());
    stream.on('error', (err) => next(err));
  } catch (error) {
    next(error);
  }
}
