"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../config");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = config_1.config.ALLOWED_FILE_TYPES;
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    if (fileExtension && allowedTypes.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: config_1.config.MAX_FILE_SIZE,
        files: 1
    }
});
exports.uploadSingle = exports.upload.single('document');
//# sourceMappingURL=upload.js.map