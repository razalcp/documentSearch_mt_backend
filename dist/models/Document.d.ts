import mongoose, { Document } from 'mongoose';
import { IDocument } from '../types';
export interface IDocumentDocument extends IDocument, Document {
}
export declare const Document: mongoose.Model<IDocumentDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentDocument, {}, {}> & IDocumentDocument & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Document.d.ts.map