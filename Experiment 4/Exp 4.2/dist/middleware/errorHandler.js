"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const apiError_1 = require("../errors/apiError");
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({ message: err.errors.map((entry) => entry.message).join(', ') });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
};
exports.errorHandler = errorHandler;
