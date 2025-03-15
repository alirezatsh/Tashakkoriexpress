/* eslint-disable no-undef */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountResponseMethods = mountResponseMethods;
// METHODS
function mountResponseMethods(response, res) {
    response.status = (code) => {
        res.statusCode = code;
        return res;
    };
    response.json = (data) => {
        if (!res.hasHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json');
        }
        res.end(JSON.stringify(data));
    };
    response.redirect = (url) => {
        res.statusCode = 302;
        res.setHeader('Location', url);
        res.end(`Redirecting to ${url}`);
    };
    response.send = (data) => {
        if (typeof data === 'object' && data !== null && !Buffer.isBuffer(data)) {
            if (!res.hasHeader('Content-Type')) {
                res.setHeader('Content-Type', 'application/json');
            }
            res.end(JSON.stringify(data));
        }
        else {
            const contentType = Buffer.isBuffer(data)
                ? 'application/octet-stream'
                : 'text/plain';
            if (!res.hasHeader('Content-Type')) {
                res.setHeader('Content-Type', contentType);
            }
            res.end(data);
        }
    };
}
