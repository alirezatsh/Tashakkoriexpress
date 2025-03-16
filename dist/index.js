/* eslint-disable require-yield */
/* eslint-disable no-undef */
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
Object.defineProperty(exports, '__esModule', { value: true });
exports.tashakkoriexpress = tashakkoriexpress;
/* eslint-disable no-dupe-class-members */
const http_1 = require('http');
const routers_1 = require('./routers');
const static_1 = require('./static');
const middlewares_1 = require('./middlewares');
const types_1 = require('./types');
const url_1 = require('url');
class TashakkoriExpress {
  constructor() {
    this.router = new routers_1.Router();
  }
  use(pathOrHandler, handler) {
    if (typeof pathOrHandler === 'string' && handler) {
      this.router.addRoute(types_1.HttpMethod.ALL, pathOrHandler, [handler]);
    } else if (typeof pathOrHandler === 'function') {
      this.router.addRoute(types_1.HttpMethod.ALL, '*', [pathOrHandler]);
    }
  }
  registerRoute(method, path, handlers) {
    this.router.addRoute(method, path, handlers);
  }
  all(path, ...handlers) {
    this.registerRoute(types_1.HttpMethod.ALL, path, handlers);
  }
  get(path, ...handlers) {
    this.registerRoute(types_1.HttpMethod.GET, path, handlers);
  }
  post(path, ...handlers) {
    this.registerRoute(types_1.HttpMethod.POST, path, handlers);
  }
  put(path, ...handlers) {
    this.registerRoute(types_1.HttpMethod.PUT, path, handlers);
  }
  delete(path, ...handlers) {
    this.registerRoute(types_1.HttpMethod.DELETE, path, handlers);
  }
  static(root) {
    return (req, res, next) =>
      __awaiter(this, void 0, void 0, function* () {
        yield (0, static_1.serveStatic)(root, req, res, next);
      });
  }
  listen(port, callback) {
    const server = (0, http_1.createServer)((req, res) => {
      const request = req;
      const response = res;
      (0, types_1.attachResponseMethods)(response, res);
      this.handleRequest(request, response);
    });
    server.listen(port, callback);
  }
  handleRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { method, url } = req;
      const parsedUrl = (0, url_1.parse)(url, true);
      const pathname = parsedUrl.pathname;
      req.query = {};
      for (const key in parsedUrl.query) {
        const value = parsedUrl.query[key];
        req.query[key] = Array.isArray(value) ? value.join(',') : value;
      }
      const segments = pathname.split('/');
      const lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.includes('.')) {
        segments.pop();
      }
      let modifiedPathname = segments.join('/');
      if (!modifiedPathname.startsWith('/')) {
        modifiedPathname = '/' + modifiedPathname;
      }
      if (!method) {
        res.status(400).send('Bad Request: Method is undefined');
        return;
      }
      const matchingRoutes = this.router.matchRoute(
        method.toLowerCase(),
        modifiedPathname,
        req
      );
      if (matchingRoutes.length === 0) {
        if (!res.writableEnded) {
          res.status(404).send('Not Found');
        }
        return;
      }
      const handlers = matchingRoutes.flatMap((route) => route.handlers);
      let index = 0;
      const next = (err) =>
        __awaiter(this, void 0, void 0, function* () {
          if (err) {
            const errorHandler = handlers.find((handler) => handler.length === 4);
            if (errorHandler) {
              if (!res.writableEnded) {
                yield errorHandler(err, req, res, next);
              }
            } else {
              if (!res.writableEnded) {
                res.status(500).send('Internal Server Error');
              }
            }
            return;
          }
          if (index >= handlers.length) {
            if (!res.writableEnded) {
              res.status(500).send('Internal Server Error');
            }
            return;
          }
          const handler = handlers[index++];
          if (handler.length === 4) {
            next(err);
          } else if (handler.length === 3) {
            if (!res.writableEnded) {
              yield handler(req, res, next);
            }
          } else {
            if (!res.writableEnded) {
              yield handler(req, res);
            }
            next();
          }
        });
      next();
    });
  }
  json() {
    return (0, middlewares_1.bodyParserMiddleware)();
  }
}
function tashakkoriexpress() {
  return new TashakkoriExpress();
}
