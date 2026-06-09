import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
    }

    const decoded = verifyToken(token);
    req.user = decoded; 
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};


export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = verifyToken(token);
    } catch {
      
    }
  }
  return next();
};


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'Not authenticated or role missing' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Your role does not have access' });
    }
    
    return next();
  };
};


export const isSelfOrAuthorizedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const requestUserId = req.params.id; 

    if (!requestUserId) {
      return res.status(400).json({ success: false, message: 'Missing id parameter in URL' });
    }

    if (String(req.user.id) === String(requestUserId) || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  };
};

export default { authenticateToken, optionalAuth, authorizeRoles, isSelfOrAuthorizedRoles };