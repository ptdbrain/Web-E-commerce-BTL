import { verifyToken } from '../utils/jwt.js';

// Gắn req.user nếu có Bearer token hợp lệ, tiếp tục như guest nếu không có.
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifyToken(token);
    } catch {
      // token không hợp lệ → xử lý như guest
    }
  }
  return next();
};
