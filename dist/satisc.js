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
const url_1 = require('url');
const path_1 = require('path');
const fs_extra_1 = __importDefault(require('fs-extra'));
const serveStatic = (root) => {
  return (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        const tempPath = parsedUrl.pathname;
        const segments = tempPath.split('/');
        const lastSegment = segments[segments.length - 1];
        const pathname = decodeURIComponent(lastSegment);
        const filePath = (0, path_1.normalize)((0, path_1.join)(root, pathname));
        if (!filePath.startsWith(root)) {
          return next(new Error('File Path Is Not Correct'));
        }
        const fileExists = yield fs_extra_1.default.pathExists(filePath);
        const stats = yield fs_extra_1.default.stat(filePath);
        if (!fileExists || stats.isDirectory()) {
          return next();
        }
        res.setHeader('Content-Type', getMimeType(filePath));
        const stream = fs_extra_1.default.createReadStream(filePath);
        stream.pipe(res);
        stream.on('end', () => res.end());
        stream.on('error', (err) =>
          next(err instanceof Error ? err : new Error('Unknown Error'))
        );
      } catch (err) {
        next(err instanceof Error ? err : new Error('Unknown Error'));
      }
    });
};
const getMimeType = (filePath) => {
  var _a;
  const ext =
    (_a = filePath.split('.').pop()) === null || _a === void 0
      ? void 0
      : _a.toLowerCase();
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
exports.default = serveStatic;
