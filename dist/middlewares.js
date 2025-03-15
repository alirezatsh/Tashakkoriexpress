"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParserMiddleware = bodyParserMiddleware;
const url_1 = require("url");
function bodyParserMiddleware() {
    return (req, res, next) => {
        const contentType = req.headers['content-type'];
        if (!contentType)
            return next();
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (!body)
                return next();
            try {
                if (contentType.includes('application/json')) {
                    req.body = JSON.parse(body);
                }
                else if (contentType.includes('application/x-www-form-urlencoded')) {
                    const params = new url_1.URLSearchParams(body);
                    req.body = Object.fromEntries(params);
                }
            }
            catch (error) {
                return next(error);
            }
            next();
        });
    };
}
