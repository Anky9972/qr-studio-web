import { Request, Response, NextFunction } from 'express';
import { serverConfig } from '../config/smtp.config';
import { logger } from '../utils/logger';

export function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Authentication failed: No authorization header', {
      ip: req.ip,
      path: req.path,
    });
    res.status(401).json({
      success: false,
      error: 'Authorization header required',
    });
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    logger.warn('Authentication failed: Invalid authorization format', {
      ip: req.ip,
      path: req.path,
    });
    res.status(401).json({
      success: false,
      error: 'Invalid authorization format. Use: Bearer <api_key>',
    });
    return;
  }

  if (token !== serverConfig.apiKey) {
    logger.warn('Authentication failed: Invalid API key', {
      ip: req.ip,
      path: req.path,
    });
    res.status(401).json({
      success: false,
      error: 'Invalid API key',
    });
    return;
  }

  logger.debug('Authentication successful', {
    ip: req.ip,
    path: req.path,
  });

  next();
}
