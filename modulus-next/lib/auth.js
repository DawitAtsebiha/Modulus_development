import jwt from 'jsonwebtoken';
import { pool } from '@/lib/database';
import { parse } from 'cookie';
import { cookies } from 'next/headers';

/**
 * Extract JWT token from Authorization header or cookie.
 */
export function getTokenFromReq(req) {
  // Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  
  // Fallback to cookie named 'token'
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const { token } = parse(cookieHeader);
    return token;
  }
  
  return null;
}

/**
 * Given a Next.js API request, verify the JWT and fetch the user record.
 * Returns the user object from the database or null if not authenticated.
 */
export async function getUserFromReq(req) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return null;

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const { rows: [user] } = await pool.query(
      `SELECT user_id AS id,
              first_name AS "firstName",
              last_name  AS "lastName",
              email,
              date_of_birth AS "dateOfBirth",
              school_status AS "schoolStatus",
              uni_affiliation AS "uniAffiliation"
         FROM public.users
        WHERE user_id = $1`,
      [payload.id]
    );
    
    return user || null;
  } catch (err) {
    console.error('getUserFromReq error:', err.message);
    return null;
  }
}

/**
 * Get user from server-side session (for Server Components)
 */
export async function getUserFromSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return null;

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const { rows } = await pool.query(
      `SELECT user_id AS id,
              first_name AS "firstName",
              last_name  AS "lastName",
              email,
              date_of_birth AS "dateOfBirth",
              school_status AS "schoolStatus",
              uni_affiliation AS "uniAffiliation"
         FROM public.users
        WHERE user_id = $1`,
      [payload.id]
    );
    
    return rows[0] || null;
  } catch (err) {
    console.error("getUserFromSession error:", err.message);
    return null;
  }
}

/**
 * Higher-order function to protect Next.js API routes.
 * Wrap your handler: export default requireAuth(async (req, res) => { ... })
 */
export function requireAuth(handler) {
  return async (req, res) => {
    const user = await getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Attach user to req for your handler
    req.currentUser = user;
    return handler(req, res);
  };
}

/**
 * Create a JWT token for a user
 */
export function createToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}

/**
 * Set auth cookie (for login)
 */
export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
}

/**
 * Clear auth cookie (for logout)
 */
export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
}