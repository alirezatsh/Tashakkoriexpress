'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.serveStatic = serveStatic;
const url_1 = require('url');
const path_1 = __importDefault(require('path'));
const fs_extra_1 = __importDefault(require('fs-extra'));
const mime_types_1 = __importDefault(require('mime-types'));
class FileError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
function isValidPath(filePath, root) {
  const resolvedPath = path_1.default.resolve(filePath);
  return resolvedPath.startsWith(root);
}
function serveStatic(root, req, res, next) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const parsedUrl = (0, url_1.parse)(req.url, true);
      const tempPath = parsedUrl.pathname;
      const segments = tempPath.split('/');
      const lastSegment = segments[segments.length - 1];
      const pathname = decodeURIComponent(lastSegment);
      const filePath = path_1.default.resolve(root, pathname);
      if (!isValidPath(filePath, root)) {
        return next(new FileError('Path Traversal Detected', 400));
      }
      const fileExists = yield fs_extra_1.default.pathExists(filePath);
      if (!fileExists) {
        return next(new FileError("File Doesn't Exist", 404));
      }
      const stats = yield fs_extra_1.default.stat(filePath);
      if (stats.isDirectory()) {
        return next(new FileError('Requested Path Is a Directory', 400));
      }
      const mimeType =
        mime_types_1.default.lookup(filePath) || 'application/octet-stream';
      res.status(200);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      const stream = fs_extra_1.default.createReadStream(filePath);
      stream.pipe(res);
      stream.on('end', () => res.end());
      stream.on('error', (err) => next(err));
    } catch (error) {
      if (error instanceof FileError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        next(error);
      }
    }
  });
}
