import { Request, Response } from 'express';
import { IAuthRequest } from '../types';
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getProfile: (req: IAuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map