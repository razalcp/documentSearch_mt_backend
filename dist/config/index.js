"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/documentSearch',
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-2024',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'pdf,txt,md').split(',')
};
//# sourceMappingURL=index.js.map