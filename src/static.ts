import { Request, Response, NextFunction } from './types';
import { parse } from 'url';
import path from 'path';
import fs from 'fs-extra';
import mime from 'mime-types';

class FileError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function isValidPath(filePath: string, root: string): boolean {
  const resolvedPath = path.resolve(filePath);
  return resolvedPath.startsWith(root);
}

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

    if (!isValidPath(filePath, root)) {
      return next(new FileError('Path Traversal Detected', 400));
    }

    const fileExists = await fs.pathExists(filePath);
    if (!fileExists) {
      return next(new FileError("File Doesn't Exist", 404));
    }

    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      return next(new FileError('Requested Path Is a Directory', 400));
    }

    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    if (mimeType.startsWith('image/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    res.status(200);
    res.setHeader('Content-Type', mimeType);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('finish', () => res.end());
    stream.on('error', (err) => next(err));
  } catch (error) {
    if (error instanceof FileError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      next(error);
    }
  }
}
