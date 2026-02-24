import mongoose, { Document as MongooseDocument } from 'mongoose';
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
export declare const Document: mongoose.Model<IDocumentDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentDocument, {}, {}> & IDocumentDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Document.d.ts.map