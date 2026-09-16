"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.once('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
