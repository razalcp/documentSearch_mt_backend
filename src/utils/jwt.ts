import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (user: { _id: any; email: string }): string => {
  const payload: JwtPayload = {
    userId: user._id,
    email: user.email
  };

  const options: SignOptions = {
    // jsonwebtoken's typings use a StringValue type; cast to satisfy TS
    expiresIn: config.JWT_EXPIRE as any
  };

  return jwt.sign(payload, config.JWT_SECRET as Secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
