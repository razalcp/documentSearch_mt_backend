"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestionsQuerySchema = exports.searchQuerySchema = exports.loginSchema = exports.signupSchema = exports.validateQuery = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({
                error: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
            return;
        }
        next();
    };
};
exports.validateRequest = validateRequest;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            res.status(400).json({
                error: 'Query validation error',
                details: error.details.map(detail => detail.message)
            });
            return;
        }
        next();
    };
};
exports.validateQuery = validateQuery;
exports.signupSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(50).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
exports.searchQuerySchema = joi_1.default.object({
    q: joi_1.default.string().min(1).max(100).required(),
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(50).default(10),
    sortBy: joi_1.default.string().valid('relevance', 'date', 'title').default('relevance'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc'),
    fileType: joi_1.default.string().valid('pdf', 'txt', 'md').optional(),
    dateFrom: joi_1.default.date().optional(),
    dateTo: joi_1.default.date().optional()
});
exports.suggestionsQuerySchema = joi_1.default.object({
    q: joi_1.default.string().min(1).max(50).required(),
    limit: joi_1.default.number().integer().min(1).max(10).default(5)
});
//# sourceMappingURL=validation.js.map