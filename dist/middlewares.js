'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.jsonMiddleware = jsonMiddleware;
/**
 * @returns {RequestHandler}
 */
function jsonMiddleware() {
  return (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return next();
    }
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (body) {
        try {
          req.body = JSON.parse(body);
        } catch (e) {
          return next(e);
        }
      }
      next();
    });
  };
}
