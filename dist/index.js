"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const database_1 = require("./config/database");
const app_1 = __importDefault(require("./app"));
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app_1.default.listen(config_1.config.PORT, () => {
            console.log(`Server running on port ${config_1.config.PORT}`);
            console.log(`Environment: ${config_1.config.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map