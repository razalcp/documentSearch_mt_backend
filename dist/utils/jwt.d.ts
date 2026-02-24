export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}
export declare const generateToken: (user: {
    _id: any;
    email: string;
}) => string;
export declare const verifyToken: (token: string) => JwtPayload;
export declare const decodeToken: (token: string) => JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map