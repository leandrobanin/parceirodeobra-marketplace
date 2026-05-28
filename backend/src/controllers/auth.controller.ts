import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { AuthRequest } from '../middleware/auth.middleware';
import { env } from '../config/env';
import { prisma } from '../lib/prisma';

// =============================================================================
// CONSTANTS & TYPES
// =============================================================================

const EMAIL_MAX_LENGTH = 254;
const NAME_MAX_LENGTH = 120;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const SPECIALTY_MAX_LENGTH = 60;
const MAX_SPECIALTIES = 10;

type PublicRole = 'CUSTOMER' | 'PROFESSIONAL';

// =============================================================================
// INPUT VALIDATION & NORMALIZATION HELPERS
// =============================================================================

/**
 * Normalizes and cleans a professional's name to generate a URL-safe slug.
 * 
 * @param name - The full name of the professional.
 * @returns A lowercased, slugified string.
 */
function generateSlug(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return slug || `profissional-${randomUUID().slice(0, 8)}`;
}

/**
 * Validates and normalizes email format.
 * 
 * @param value - The raw email value from user input.
 * @returns Normalized lowercase email, or null if invalid.
 */
function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length === 0 || email.length > EMAIL_MAX_LENGTH) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

/**
 * Sanitizes and checks boundary length of required strings.
 * 
 * @param value - The input string to sanitize.
 * @param maxLength - Maximum permitted length.
 * @returns Cleaned string, or null if empty/too long.
 */
function normalizeString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > maxLength) return null;
  return normalized;
}

/**
 * Sanitizes optional strings, returning null if empty or undefined.
 * 
 * @param value - The input value.
 * @param maxLength - Maximum permitted length.
 * @returns Cleaned string, or null.
 */
function normalizeOptionalString(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null || value === '') return null;
  return normalizeString(value, maxLength);
}

/**
 * Formats user role, restricting registrations to public-facing roles only.
 * 
 * @param value - The requested role value.
 * @returns Normalized public role.
 */
function normalizeRole(value: unknown): PublicRole {
  return typeof value === 'string' && value.toUpperCase() === 'PROFESSIONAL'
    ? 'PROFESSIONAL'
    : 'CUSTOMER';
}

/**
 * Cleans, sanitizes, and limits arrays of professional specialty tags.
 * 
 * @param value - The input array/list of specialties.
 * @returns Array of clean, normalized specialty strings.
 */
function normalizeSpecialties(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= SPECIALTY_MAX_LENGTH)
    .slice(0, MAX_SPECIALTIES);
}

/**
 * Generates a signed JWT session token.
 * 
 * @param user - User metadata payload.
 * @returns Signed HS256 JWT string.
 */
function signAuthToken(user: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: '2h', algorithm: 'HS256' }
  );
}

// =============================================================================
// CONTROLLER HANDLERS
// =============================================================================

/**
 * POST /api/auth/register
 * Registers a new User and creates a matching Customer or Professional profile.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, city, state, specialties } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeString(name, NAME_MAX_LENGTH);
    const normalizedCity = normalizeOptionalString(city, 80);
    const normalizedState = normalizeOptionalString(state, 2)?.toUpperCase();

    if (!normalizedEmail || !normalizedName) {
      res.status(400).json({ error: 'Valid email and name are required' });
      return;
    }

    if (
      typeof password !== 'string'
      || password.length < PASSWORD_MIN_LENGTH
      || password.length > PASSWORD_MAX_LENGTH
    ) {
      res.status(400).json({ error: 'Password must be between 8 and 128 characters' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(409).json({ error: 'Unable to create account with these credentials' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userRole = normalizeRole(role);
    const safeSpecialties = normalizeSpecialties(specialties);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
      },
    });

    if (userRole === "PROFESSIONAL") {
      let slug = generateSlug(normalizedName);
      // Ensure unique slug by appending counters if collisions occur
      let counter = 1;
      while (await prisma.professional.findUnique({ where: { slug } })) {
        slug = `${generateSlug(normalizedName)}-${counter}`;
        counter++;
      }

      await prisma.professional.create({
        data: {
          userId: user.id,
          name: normalizedName,
          slug,
          city: normalizedCity || 'Unknown City',
          state: normalizedState || 'SP',
          specialties: JSON.stringify(safeSpecialties),
        },
      });
    } else {
      await prisma.customer.create({
        data: {
          userId: user.id,
          name: normalizedName,
          city: normalizedCity,
        },
      });
    }

    const token = signAuthToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: normalizedName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

/**
 * POST /api/auth/login
 * Authenticates user credentials and returns a JWT token.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Fetch matching profile based on user role
    let profileData = null;
    if (user.role === "PROFESSIONAL") {
      profileData = await prisma.professional.findUnique({ where: { userId: user.id } });
    } else if (user.role === "CUSTOMER") {
      profileData = await prisma.customer.findUnique({ where: { userId: user.id } });
    }

    const token = signAuthToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profileData?.name,
        profileData,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

/**
 * GET /api/auth/profile
 * Retrieves profile data for the currently authenticated session.
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: {
        customer: true,
        professional: true,
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
