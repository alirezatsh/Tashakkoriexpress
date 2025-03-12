"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveStatic = serveStatic;
const url_1 = require("url");
const path_1 = require("path");
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * Middleware function to serve static files.
 * @param {string} root - Root directory for serving static files.
 * @param {Request} req - The incoming request.
 * @param {Response} res - The outgoing response.
 * @param {NextFunction} next - The next function in the middleware stack.
 */
function serveStatic(root, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parsedUrl = (0, url_1.parse)(req.url, true);
            const tempPath = parsedUrl.pathname;
            // Ensure the path is valid
            const segments = tempPath.split('/');
            const lastSegment = segments[segments.length - 1];
            const pathname = decodeURIComponent(lastSegment);
            const filePath = (0, path_1.normalize)((0, path_1.join)(root, pathname));
            // Prevent directory traversal attacks by ensuring the file path stays within the root directory
            if (!filePath.startsWith(root)) {
                return next(new Error('File Path Is Not Correct'));
            }
            // Check if file exists and is not a directory
            const fileExists = yield fs_extra_1.default.pathExists(filePath);
            const stats = yield fs_extra_1.default.stat(filePath);
            if (!fileExists || stats.isDirectory()) {
                return next(new Error("File Doesn't Exist"));
            }
            // Send file content with proper headers
            res.status(200);
            const stream = fs_extra_1.default.createReadStream(filePath);
            // Pipe the file to the response
            stream.pipe(res);
            stream.on('end', () => res.end());
            stream.on('error', (err) => next(err));
        }
        catch (err) {
            // Handle unexpected errors
            next(err);
        }
    });
}
