"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadDocument = exports.getSuggestions = exports.searchDocuments = exports.getDocuments = exports.uploadDocument = void 0;
const Document_1 = require("../models/Document");
const fileProcessor_1 = require("../utils/fileProcessor");
const searchService_1 = require("../services/searchService");
const pdfkit_1 = __importDefault(require("pdfkit"));
const searchEngine = new searchService_1.TFIDFSearchEngine();
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        (0, fileProcessor_1.validateFile)(req.file);
        const processedFile = await (0, fileProcessor_1.processFile)(req.file);
        const document = new Document_1.Document({
            title: processedFile.fileName.replace(/\.[^/.]+$/, ''),
            content: processedFile.content,
            fileName: processedFile.fileName,
            fileType: processedFile.fileType,
            fileSize: processedFile.fileSize,
            uploadedBy: req.user._id
        });
        await document.save();
        res.status(201).json({
            message: 'Document uploaded successfully',
            document: {
                id: document._id,
                title: document.title,
                fileName: document.fileName,
                fileType: document.fileType,
                fileSize: document.fileSize,
                createdAt: document.createdAt
            }
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'File upload failed'
        });
    }
};
exports.uploadDocument = uploadDocument;
const getDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const documents = await Document_1.Document.find()
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Document_1.Document.countDocuments();
        res.json({
            documents,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getDocuments = getDocuments;
const searchDocuments = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'relevance';
        const sortOrder = req.query.sortOrder || 'desc';
        const fileType = req.query.fileType;
        const dateFrom = req.query.dateFrom;
        const dateTo = req.query.dateTo;
        let mongoQuery = {};
        if (fileType) {
            mongoQuery.fileType = fileType;
        }
        if (dateFrom || dateTo) {
            mongoQuery.createdAt = {};
            if (dateFrom)
                mongoQuery.createdAt.$gte = new Date(dateFrom);
            if (dateTo)
                mongoQuery.createdAt.$lte = new Date(dateTo);
        }
        const documents = await Document_1.Document.find(mongoQuery)
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 });
        searchEngine.addDocuments(documents);
        const searchResults = searchEngine.search(query, limit * 2);
        let sortedResults = searchResults;
        if (sortBy === 'date') {
            sortedResults = searchResults.sort((a, b) => {
                const dateA = new Date(a.document.createdAt).getTime();
                const dateB = new Date(b.document.createdAt).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }
        else if (sortBy === 'title') {
            sortedResults = searchResults.sort((a, b) => {
                const titleA = a.document.title.toLowerCase();
                const titleB = b.document.title.toLowerCase();
                return sortOrder === 'asc'
                    ? titleA.localeCompare(titleB)
                    : titleB.localeCompare(titleA);
            });
        }
        const skip = (page - 1) * limit;
        const paginatedResults = sortedResults.slice(skip, skip + limit);
        res.json({
            query,
            results: paginatedResults,
            pagination: {
                page,
                limit,
                total: sortedResults.length,
                pages: Math.ceil(sortedResults.length / limit)
            },
            filters: {
                sortBy,
                sortOrder,
                fileType,
                dateFrom,
                dateTo
            }
        });
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.searchDocuments = searchDocuments;
const getSuggestions = async (req, res) => {
    try {
        const query = req.query.q;
        const limit = parseInt(req.query.limit) || 5;
        const documents = await Document_1.Document.find({});
        searchEngine.addDocuments(documents);
        const suggestions = searchEngine.getSuggestions(query, limit);
        res.json({
            query,
            suggestions
        });
    }
    catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getSuggestions = getSuggestions;
const downloadDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document_1.Document.findById(id);
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }
        const fileName = document.fileName;
        const content = document.content;
        const fileType = document.fileType;
        const encodedFileName = encodeURIComponent(fileName);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
        if (fileType === 'txt' || fileType === 'md') {
            res.setHeader('Content-Type', fileType === 'md' ? 'text/markdown' : 'text/plain');
            res.send(content);
        }
        else if (fileType === 'pdf') {
            res.setHeader('Content-Type', 'application/pdf');
            const doc = new pdfkit_1.default();
            doc.pipe(res);
            doc.fontSize(12).text(content, { align: 'left' });
            doc.end();
        }
        else {
            res.setHeader('Content-Type', 'text/plain');
            res.send(content);
        }
    }
    catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download document' });
    }
};
exports.downloadDocument = downloadDocument;
//# sourceMappingURL=documentController.js.map