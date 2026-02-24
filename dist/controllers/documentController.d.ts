import { Response } from 'express';
import { IAuthRequest } from '../types';
export declare const uploadDocument: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const getDocuments: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const searchDocuments: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const getSuggestions: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const downloadDocument: (req: IAuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=documentController.d.ts.map