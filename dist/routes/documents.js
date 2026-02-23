"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_1 = require("../controllers/documentController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, upload_1.uploadSingle, documentController_1.uploadDocument);
router.get('/', documentController_1.getDocuments);
router.get('/search', (0, validation_1.validateQuery)(validation_1.searchQuerySchema), auth_1.optionalAuth, documentController_1.searchDocuments);
router.get('/search/suggestions', (0, validation_1.validateQuery)(validation_1.suggestionsQuerySchema), documentController_1.getSuggestions);
router.get('/:id/download', documentController_1.downloadDocument);
exports.default = router;
//# sourceMappingURL=documents.js.map