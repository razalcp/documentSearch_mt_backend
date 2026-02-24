import { Request } from 'express';
export interface IUser {
    _id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IDocument {
    _id: string;
    title: string;
    content: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISearchResult {
    document: IDocument;
    score: number;
    highlights: string[];
}
export interface ISearchQuery {
    q: string;
    page?: number;
    limit?: number;
    sortBy?: 'relevance' | 'date' | 'title';
    sortOrder?: 'asc' | 'desc';
    fileType?: string;
    dateFrom?: string;
    dateTo?: string;
}
export interface IAuthRequest extends Request {
    user?: any;
}
export interface IUploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
//# sourceMappingURL=index.d.ts.map