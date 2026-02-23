import { Router } from 'express';
import { uploadDocument, getDocuments, searchDocuments, getSuggestions, downloadDocument } from '../controllers/documentController';
import { validateQuery, searchQuerySchema, suggestionsQuerySchema } from '../middleware/validation';
import { authenticate, optionalAuth } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router = Router();

// Protected routes (require authentication)
router.post('/', authenticate, uploadSingle, uploadDocument);

// Public routes (optional authentication)
router.get('/', optionalAuth, getDocuments);
router.get('/search', validateQuery(searchQuerySchema), optionalAuth, searchDocuments);
router.get('/search/suggestions', validateQuery(suggestionsQuerySchema), optionalAuth, getSuggestions);
router.get('/:id/download', optionalAuth, downloadDocument);

export default router;
