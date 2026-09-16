"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const posts_1 = __importDefault(require("./routes/posts"));
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(requestLogger_1.requestLogger);
app.use('/api/posts', posts_1.default);
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});
app.use(errorHandler_1.errorHandler);
const port = Number(process.env.PORT ?? 4210);
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
