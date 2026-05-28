import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

function isAuthPayload(payload: string | JwtPayload): payload is JwtPayload & { id: string; email: string; role: string } {
  return typeof payload === 'object'
    && typeof payload.id === 'string'
    && typeof payload.email === 'string'
    && typeof payload.role === 'string';
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.length > 4096) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });

    if (!isAuthPayload(decoded)) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
