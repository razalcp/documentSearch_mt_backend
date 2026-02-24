import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';
import { IDocument } from '../types';

// Mongoose document type with typed fields
export interface IDocumentDocument extends MongooseDocument {
  title: string;
  content: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: any;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocumentDocument>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [1000000, 'Content cannot exceed 1MB']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['pdf', 'txt', 'md']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [1, 'File size must be greater than 0']
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  }
}, {
  timestamps: true
});

// Create text index for full-text search
documentSchema.index({
  title: 'text',
  content: 'text',
  fileName: 'text'
}, {
  weights: {
    title: 10,
    fileName: 5,
    content: 1
  },
  name: 'text_search_index'
});

// Create compound indexes for filtering
documentSchema.index({ uploadedBy: 1, createdAt: -1 });
documentSchema.index({ fileType: 1, createdAt: -1 });
documentSchema.index({ createdAt: -1 });

export const Document = mongoose.model<IDocumentDocument>('Document', documentSchema);
