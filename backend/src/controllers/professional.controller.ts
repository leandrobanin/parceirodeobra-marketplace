import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_QUERY_LENGTH = 80;
const MAX_SLUG_LENGTH = 120;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// =============================================================================
// UTILITY & NORMALIZATION HELPERS
// =============================================================================

/**
 * Sanitizes and checks boundary length of filter query parameter values.
 * 
 * @param value - Raw query string parameter.
 * @param maxLength - Maximum boundary size.
 * @returns Cleaned query string, or null.
 */
function normalizeQueryString(value: unknown, maxLength = MAX_QUERY_LENGTH): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > maxLength) return null;
  return normalized;
}

/**
 * Safely parses string query limits or page counters into positive integers.
 * 
 * @param value - The input value to parse.
 * @param fallback - Default fallback value if parse fails.
 * @param max - Maximum permitted bound.
 * @returns Positive parsed integer.
 */
function parsePositiveInt(value: unknown, fallback: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

/**
 * Validates and limits review rating scores.
 * 
 * @param value - Input rating value.
 * @returns Score number between 1-5, or null.
 */
function parseRating(value: unknown): number | null {
  if (value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) return null;
  return parsed;
}

/**
 * Safely parses stored JSON string arrays of specialties.
 * 
 * @param specialties - JSON string from database.
 * @returns Array of parsed specialty labels.
 */
function parseSpecialties(specialties: string | null): string[] {
  try {
    const parsed = specialties ? JSON.parse(specialties) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string').slice(0, 10)
      : [];
  } catch {
    return [];
  }
}

/**
 * Transforms database Professional records into aggregated API responses.
 * Calculates review counts and computed average ratings.
 * 
 * @param pro - Raw database record.
 * @returns Formatted response object.
 */
function formatProfessional(pro: any) {
  const reviewCount = pro.reviews.length;
  const avgRating = reviewCount > 0
    ? pro.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewCount
    : 0;

  return {
    id: pro.id,
    name: pro.name,
    profilePhoto: pro.profilePhoto,
    slug: pro.slug,
    specialties: parseSpecialties(pro.specialties),
    city: pro.city,
    state: pro.state,
    description: pro.description,
    whatsapp: pro.whatsapp,
    availability: pro.availability,
    createdAt: pro.createdAt,
    updatedAt: pro.updatedAt,
    reviewCount,
    rating: Number(avgRating.toFixed(1)),
    categoryList: pro.categories.map((c: any) => c.category.name),
    categories: pro.categories.map((c: any) => c.category),
    portfolioPhotos: pro.portfolioPhotos.map((photo: any) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
    })),
  };
}

// =============================================================================
// CONTROLLER HANDLERS
// =============================================================================

/**
 * GET /api/professionals
 * Searches and paginates list of professional contractors with filters.
 */
export const searchProfessionals = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = normalizeQueryString(req.query.category);
    const location = normalizeQueryString(req.query.location);
    const minRating = parseRating(req.query.rating);
    const sort = normalizeQueryString(req.query.sort, 20);
    const page = parsePositiveInt(req.query.page, 1, 1000);
    const limit = parsePositiveInt(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT);

    const filters: Prisma.ProfessionalWhereInput = {};

    if (location) {
      filters.OR = [
        { city: { contains: location } },
        { state: { contains: location.toUpperCase() } },
      ];
    }

    if (category) {
      if (!/^[a-z0-9-]+$/.test(category)) {
        res.status(400).json({ error: 'Invalid category filter' });
        return;
      }

      filters.categories = {
        some: {
          category: {
            slug: category,
          }
        }
      };
    }

    // Sort processing
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'rating') {
      orderBy = {
        reviews: {
          _count: 'desc'
        }
      };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sort && sort !== 'relevance') {
      res.status(400).json({ error: 'Invalid sort option' });
      return;
    }

    const professionals = await prisma.professional.findMany({
      where: filters,
      include: {
        categories: {
          include: {
            category: true,
          }
        },
        reviews: {
          select: {
            rating: true,
          }
        },
        portfolioPhotos: {
          take: 1
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedProfessionals = professionals.map(formatProfessional);

    // Filter by rating if query requires it
    let finalResults = formattedProfessionals;
    if (minRating !== null) {
      finalResults = finalResults.filter((pro: any) => pro.rating >= minRating);
    }

    res.json(finalResults);
  } catch (error) {
    console.error('Search professionals error:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
};

/**
 * GET /api/professionals/:slug
 * Retrieves full details, reviews, and portfolio images of a specific professional profile.
 */
export const getProfessionalBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const normalizedSlug = normalizeQueryString(slug, MAX_SLUG_LENGTH);

    if (!normalizedSlug || !/^[a-z0-9-]+$/.test(normalizedSlug)) {
      res.status(400).json({ error: 'Invalid professional slug' });
      return;
    }

    const professional: any = await prisma.professional.findUnique({
      where: { slug: normalizedSlug },
      include: {
        categories: {
          include: {
            category: true,
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            customer: {
              select: {
                name: true,
                city: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
        portfolioPhotos: true,
      }
    });

    if (!professional) {
      res.status(404).json({ error: 'Professional not found' });
      return;
    }

    res.json({
      ...formatProfessional(professional),
      reviews: professional.reviews,
    });
  } catch (error) {
    console.error('Get professional error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
