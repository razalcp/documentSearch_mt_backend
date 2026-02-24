"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("./config");
const auth_1 = __importDefault(require("./routes/auth"));
const documents_1 = __importDefault(require("./routes/documents"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowed = [
            'http://localhost:3000',
            'http://localhost:5173',
            process.env.FRONTEND_URL,
            process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
            process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
        ].filter(Boolean);
        if (!origin || allowed.some(allowedUrl => origin === allowedUrl) || /\.vercel\.app$/.test(origin || '')) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: '4mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '4mb' }));
app.use('/api/auth', auth_1.default);
app.use('/api/documents', documents_1.default);
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config_1.config.NODE_ENV
    });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'File too large' });
        return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({ error: 'Unexpected file field' });
        return;
    }
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
exports.default = app;
//# sourceMappingURL=app.js.map