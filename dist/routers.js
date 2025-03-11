"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_url_1 = require("node:url");
class Router {
    constructor() {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            DELETE: [],
            PATCH: []
        };
    }
    addRoute(method, path, handler) {
        this.routes[method].push({ method, path, handler });
    }
    handleRequest(req, res) {
        var _a;
        const parsedUrl = (0, node_url_1.parse)(req.url || '', true);
        const method = req.method;
        const pathname = parsedUrl.pathname || '/';
        const request = req;
        request.query = parsedUrl.query;
        const response = res;
        response.status = function (code) {
            this.statusCode = code;
            return this;
        };
        response.json = function (data) {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(data));
        };
        response.redirect = function (path) {
            this.writeHead(302, { Location: path });
            this.end();
        };
        const route = (_a = this.routes[method]) === null || _a === void 0 ? void 0 : _a.find((r) => this.matchRoute(r.path, pathname));
        if (route) {
            request.params = this.extractParams(route.path, pathname);
            return route.handler(request, response, () => { });
        }
        response.status(404).json({ error: 'Route not found' });
    }
    matchRoute(routePath, reqPath) {
        const routeSegments = routePath.split('/');
        const reqSegments = reqPath.split('/');
        return (routeSegments.length === reqSegments.length &&
            routeSegments.every((seg, i) => seg.startsWith(':') || seg === reqSegments[i]));
    }
    extractParams(routePath, reqPath) {
        const params = {};
        routePath.split('/').forEach((seg, i) => {
            if (seg.startsWith(':'))
                params[seg.slice(1)] = reqPath.split('/')[i];
        });
        return params;
    }
}
exports.default = Router;
