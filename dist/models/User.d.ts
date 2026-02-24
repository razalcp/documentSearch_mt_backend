import mongoose, { Document as MongooseDocument } from 'mongoose';
export interface IUserDocument extends MongooseDocument {
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map