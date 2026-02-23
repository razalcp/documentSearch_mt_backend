import { Request, Response } from 'express';
import { IAuthRequest } from '../types';
export declare const uploadDocument: (req: IAuthRequest, res: Response) => Promise<void>;
export declare const getDocuments: (req: Request, res: Response) => Promise<void>;
export declare const searchDocuments: (req: Request, res: Response) => Promise<void>;
export declare const getSuggestions: (req: Request, res: Response) => Promise<void>;
export declare const downloadDocument: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=documentController.d.ts.map