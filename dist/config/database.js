"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./index");
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState === 1)
        return;
    try {
        const conn = await mongoose_1.default.connect(index_1.config.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Database connection error:', error);
        if (!process.env.VERCEL)
            process.exit(1);
        throw error;
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('MongoDB Disconnected');
    }
    catch (error) {
        console.error('Database disconnection error:', error);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=database.js.map