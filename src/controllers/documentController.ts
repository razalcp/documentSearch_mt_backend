import { Request, Response } from 'express';
import { Document } from '../models/Document';
import { processFile, validateFile } from '../utils/fileProcessor';
import { IAuthRequest, ISearchQuery } from '../types';
import { TFIDFSearchEngine } from '../services/searchService';
import PDFDocument from 'pdfkit';

const searchEngine = new TFIDFSearchEngine();

export const uploadDocument = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Validate file
    validateFile(req.file);

    // Process file
    const processedFile = await processFile(req.file);

    // Create document
    const document = new Document({
      title: processedFile.fileName.replace(/\.[^/.]+$/, ''), // Remove extension
      content: processedFile.content,
      fileName: processedFile.fileName,
      fileType: processedFile.fileType,
      fileSize: processedFile.fileSize,
      uploadedBy: req.user!._id
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
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'File upload failed' 
    });
  }
};

export const getDocuments = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Show only documents uploaded by the current user; empty when not authenticated
    const query: any = req.user ? { uploadedBy: req.user._id } : { _id: { $in: [] } };
    const documents = await Document.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments(query);

    res.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchDocuments = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'relevance';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const fileType = req.query.fileType as string;
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    // Build MongoDB query - only current user's documents when authenticated; none otherwise
    let mongoQuery: any = {};
    if (req.user) {
      mongoQuery.uploadedBy = req.user._id;
    } else {
      mongoQuery._id = { $in: [] };
    }
    if (fileType) {
      mongoQuery.fileType = fileType;
    }

    if (dateFrom || dateTo) {
      mongoQuery.createdAt = {};
      if (dateFrom) mongoQuery.createdAt.$gte = new Date(dateFrom);
      if (dateTo) mongoQuery.createdAt.$lte = new Date(dateTo);
    }

    // Get documents matching filters
    const documents = await Document.find(mongoQuery)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    // Update search engine with current documents
    searchEngine.addDocuments(documents);

    // Perform TF-IDF search
    const searchResults = searchEngine.search(query, limit * 2); // Get more results for sorting

    // Apply sorting
    let sortedResults = searchResults;
    if (sortBy === 'date') {
      sortedResults = searchResults.sort((a, b) => {
        const dateA = new Date(a.document.createdAt).getTime();
        const dateB = new Date(b.document.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortBy === 'title') {
      sortedResults = searchResults.sort((a, b) => {
        const titleA = a.document.title.toLowerCase();
        const titleB = b.document.title.toLowerCase();
        return sortOrder === 'asc' 
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      });
    }

    // Apply pagination
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
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSuggestions = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 5;

    // Only suggest from current user's documents when authenticated
    const docQuery: any = req.user ? { uploadedBy: req.user._id } : {};
    const documents = await Document.find(docQuery);
    searchEngine.addDocuments(documents);

    const suggestions = searchEngine.getSuggestions(query, limit);

    res.json({
      query,
      suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadDocument = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Only authenticated users can download, and only their own documents
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required to download.' });
      return;
    }
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: 'Access denied. You can only download your own documents.' });
      return;
    }

    const fileName = document.fileName;
    const content = document.content;
    const fileType = document.fileType;

    // Set Content-Disposition for file download
    const encodedFileName = encodeURIComponent(fileName);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);

    if (fileType === 'txt' || fileType === 'md') {
      res.setHeader('Content-Type', fileType === 'md' ? 'text/markdown' : 'text/plain');
      res.send(content);
    } else if (fileType === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      const doc = new PDFDocument();
      doc.pipe(res);
      doc.fontSize(12).text(content, { align: 'left' });
      doc.end();
    } else {
      // Fallback for unknown types - serve as text
      res.setHeader('Content-Type', 'text/plain');
      res.send(content);
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
};
