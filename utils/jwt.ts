import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Verifies a JWT against the given secret. Returns a discriminated
 * { success, data | error } shape rather than throwing, so callers
 * (proxy.ts in particular) can branch on an expired/invalid token
 * without a try/catch at every call site.
 */
const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true as const,
      data: verifiedToken,
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Invalid token',
    };
  }
};

export const jwtUtils = {
  verifyToken,
};
