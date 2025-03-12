import { Request, Response, NextFunction } from './types';
import { parse } from 'url';
import { join, normalize } from 'path';
import fs from 'fs-extra';

/**
 * Middleware function to serve static files.
 * @param {string} root - Root directory for serving static files.
 * @param {Request} req - The incoming request.
 * @param {Response} res - The outgoing response.
 * @param {NextFunction} next - The next function in the middleware stack.
 */
export async function serveStatic(
  root: string,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsedUrl = parse(req.url as string, true);
    const tempPath = parsedUrl.pathname!;

    // Ensure the path is valid
    const segments = tempPath.split('/');
    const lastSegment = segments[segments.length - 1];
    const pathname = decodeURIComponent(lastSegment);
    const filePath = normalize(join(root, pathname));

    // Prevent directory traversal attacks by ensuring the file path stays within the root directory
    if (!filePath.startsWith(root)) {
      return next(new Error('File Path Is Not Correct'));
    }

    // Check if file exists and is not a directory
    const fileExists = await fs.pathExists(filePath);
    const stats = await fs.stat(filePath);
    if (!fileExists || stats.isDirectory()) {
      return next(new Error("File Doesn't Exist"));
    }

    // Send file content with proper headers
    res.status(200);
    const stream = fs.createReadStream(filePath);

    // Pipe the file to the response
    stream.pipe(res);

    stream.on('end', () => res.end());
    stream.on('error', (err) => next(err));
  } catch (err) {
    // Handle unexpected errors
    next(err);
  }
}
