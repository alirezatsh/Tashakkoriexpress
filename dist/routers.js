"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
class Router {
    constructor() {
        this.routes = [];
    }
    addRoute(method, path, handlers) {
        this.routes.push({ method, path, handlers });
    }
    matchRoute(method, pathname, req) {
        return this.routes.filter((route) => (route.method === method.toLowerCase() || route.method === 'all') &&
            this.checkPath(route.path, pathname, req));
    }
    checkPath(path, reqPath, req) {
        if (!path.includes(':')) {
            return path === reqPath || path === '*';
        }
        const pathParts = path.split('/');
        const reqPathParts = reqPath.split('/');
        if (pathParts.length !== reqPathParts.length)
            return false;
        const params = {};
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i].startsWith(':')) {
                params[pathParts[i].substring(1)] = reqPathParts[i];
            }
            else if (pathParts[i] !== reqPathParts[i]) {
                return false;
            }
        }
        req.params = Object.assign({}, params);
        return true;
    }
}
exports.Router = Router;
