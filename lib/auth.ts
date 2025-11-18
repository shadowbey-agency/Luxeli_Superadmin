import jwt from 'jsonwebtoken';
import type { SignOptions, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  userType?: 'superadmin' | 'member' | 'partner' | 'guest' | 'partnermember' | 'partnerstaff';
  permissions?: string[] | any; // Can be array for members or object for partner members
  // Guest-specific fields
  partnerId?: string;
  roomId?: string;
  roomName?: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: TokenPayload): string {
  const options = { expiresIn: JWT_EXPIRES_IN } as any;
  return jwt.sign(payload as object, JWT_SECRET as Secret, options);
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Generate guest token with room and partner info
 */
export function generateGuestToken(payload: {
  userId: string;
  guestName: string;
  guestEmail?: string;
  partnerId: string;
  roomId: string;
  roomName: string;
}): string {
  const tokenPayload: TokenPayload = {
    userId: payload.userId,
    email: payload.guestEmail || '',
    role: 'guest',
    userType: 'guest',
    partnerId: payload.partnerId,
    roomId: payload.roomId,
    roomName: payload.roomName,
  };
  
  const options = { expiresIn: JWT_EXPIRES_IN } as any;
  return jwt.sign(tokenPayload as object, JWT_SECRET as Secret, options);
}
