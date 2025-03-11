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
class MiddlewareManager {
  constructor() {
    this.middlewares = [];
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  execute(req, res, finalHandler) {
    return __awaiter(this, void 0, void 0, function* () {
      let index = 0;
      const next = (err) =>
        __awaiter(this, void 0, void 0, function* () {
          if (err) {
            // eslint-disable-next-line no-undef
            console.error('Middleware error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
          if (index < this.middlewares.length) {
            const middleware = this.middlewares[index];
            index++;
            yield Promise.resolve(middleware(req, res, next));
          } else {
            finalHandler();
          }
        });
      next();
    });
  }
}
exports.default = MiddlewareManager;
