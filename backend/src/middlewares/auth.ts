// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

// Estendendo a interface Request para incluir o usuario
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

    req.userId = decoded.id;
    req.userRole = decoded.role;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
