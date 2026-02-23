"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = exports.processFile = void 0;
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const config_1 = require("../config");
const processFile = async (file) => {
    const fileName = file.originalname;
    const fileType = path_1.default.extname(fileName).toLowerCase().substring(1);
    const fileSize = file.size;
    let content = '';
    try {
        switch (fileType) {
            case 'txt':
            case 'md':
                content = file.buffer.toString('utf-8');
                break;
            case 'pdf':
                const pdfData = await (0, pdf_parse_1.default)(file.buffer);
                content = pdfData.text;
                break;
            default:
                throw new Error(`Unsupported file type: ${fileType}`);
        }
        content = content
            .replace(/\s+/g, ' ')
            .trim();
        if (!content) {
            throw new Error('File appears to be empty or could not be processed');
        }
        return {
            content,
            fileName,
            fileType,
            fileSize
        };
    }
    catch (error) {
        throw new Error(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
exports.processFile = processFile;
const validateFile = (file) => {
    if (file.size > config_1.config.MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum allowed size of ${config_1.config.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase().substring(1);
    if (!config_1.config.ALLOWED_FILE_TYPES.includes(fileExtension)) {
        throw new Error(`File type ${fileExtension} is not allowed. Allowed types: ${config_1.config.ALLOWED_FILE_TYPES.join(', ')}`);
    }
    if (file.size === 0) {
        throw new Error('File is empty');
    }
};
exports.validateFile = validateFile;
//# sourceMappingURL=fileProcessor.js.map