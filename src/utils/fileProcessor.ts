import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { config } from '../config';

export interface ProcessedFile {
  content: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export const processFile = async (file: Express.Multer.File): Promise<ProcessedFile> => {
  const fileName = file.originalname;
  const fileType = path.extname(fileName).toLowerCase().substring(1);
  const fileSize = file.size;

  let content = '';

  try {
    switch (fileType) {
      case 'txt':
      case 'md':
        content = file.buffer.toString('utf-8');
        break;
      
      case 'pdf':
        const pdfData = await pdf(file.buffer);
        content = pdfData.text;
        break;
      
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Clean and normalize content
    content = content
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
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
  } catch (error) {
    throw new Error(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const validateFile = (file: Express.Multer.File): void => {
  // Check file size
  if (file.size > config.MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${config.MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Check file type
  const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
  if (!config.ALLOWED_FILE_TYPES.includes(fileExtension)) {
    throw new Error(`File type ${fileExtension} is not allowed. Allowed types: ${config.ALLOWED_FILE_TYPES.join(', ')}`);
  }

  // Check if file has content
  if (file.size === 0) {
    throw new Error('File is empty');
  }
};
