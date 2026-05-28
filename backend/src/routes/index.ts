import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authRoutes from './auth.routes';
import professionalRoutes from './professional.routes';

const router = Router();

// Auth rate limiter to protect authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

// Centralized route mounts
router.use('/auth', authLimiter, authRoutes);
router.use('/professionals', professionalRoutes);

export default router;
