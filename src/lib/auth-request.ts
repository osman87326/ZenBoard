import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  avatar: string;
};

export function getUserFromRequest(req: NextRequest): AuthUser | null {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'zenboard-secret-key-12345-temporary'
    ) as Partial<AuthUser> & { userId?: string; id?: string };

    return {
      userId: decoded.userId || decoded.id || '',
      name: decoded.name || '',
      email: decoded.email || '',
      avatar: decoded.avatar || '',
    };
  } catch {
    return null;
  }
}
