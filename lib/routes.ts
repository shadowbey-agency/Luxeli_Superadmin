/**
 * API Routes Configuration
 * This file contains all the API route definitions for easy reference and maintenance
 */

export const API_ROUTES = {
  // Authentication Routes
  AUTH: {
    LOGIN: '/api/auth/login',
  },

  // SuperAdmin Routes
  SUPERADMIN: {
    // SuperAdmin Management
    SUPERADMINS: {
      BASE: '/api/superadmin/superadmins',
      BY_ID: (id: string) => `/api/superadmin/superadmins/${id}`,
      CHANGE_PASSWORD: (id: string) => `/api/superadmin/superadmins/${id}/change-password`,
      STATS: '/api/superadmin/superadmins/stats',
    },

    // Partner Management
    PARTNERS: {
      BASE: '/api/superadmin/partners',
      BY_ID: (id: string) => `/api/superadmin/partners/${id}`,
      STATS: '/api/superadmin/partners/stats',
    },

    // Team Management
    TEAM: {
      BASE: '/api/superadmin/team',
      BY_ID: (id: string) => `/api/superadmin/team/${id}`,
      CHANGE_PASSWORD: (id: string) => `/api/superadmin/team/${id}/change-password`,
      STATS: '/api/superadmin/team/stats',
    },
  },

  // Ticket Management
  TICKETS: {
    BASE: '/api/tickets',
    BY_ID: (id: string) => `/api/tickets/${id}`,
    MESSAGES: (id: string) => `/api/tickets/${id}/messages`,
    STATS: '/api/tickets/stats',
  },
} as const;

/**
 * HTTP Methods supported by each route
 */
export const ROUTE_METHODS = {
  // Authentication
  [API_ROUTES.AUTH.LOGIN]: ['POST'],

  // SuperAdmins
  [API_ROUTES.SUPERADMIN.SUPERADMINS.BASE]: ['GET', 'POST'],
  [API_ROUTES.SUPERADMIN.SUPERADMINS.STATS]: ['GET'],

  // Partners
  [API_ROUTES.SUPERADMIN.PARTNERS.BASE]: ['GET', 'POST'],
  [API_ROUTES.SUPERADMIN.PARTNERS.STATS]: ['GET'],

  // Team
  [API_ROUTES.SUPERADMIN.TEAM.BASE]: ['GET', 'POST'],
  [API_ROUTES.SUPERADMIN.TEAM.STATS]: ['GET'],

  // Tickets
  [API_ROUTES.TICKETS.BASE]: ['GET', 'POST'],
  [API_ROUTES.TICKETS.STATS]: ['GET'],
} as const;

/**
 * Route descriptions for documentation
 */
export const ROUTE_DESCRIPTIONS = {
  // Authentication
  [API_ROUTES.AUTH.LOGIN]: 'Authenticate superadmin user',

  // SuperAdmins
  [API_ROUTES.SUPERADMIN.SUPERADMINS.BASE]: 'Get all superadmins / Create new superadmin',
  [API_ROUTES.SUPERADMIN.SUPERADMINS.STATS]: 'Get superadmin statistics',

  // Partners
  [API_ROUTES.SUPERADMIN.PARTNERS.BASE]: 'Get all partners / Create new partner',
  [API_ROUTES.SUPERADMIN.PARTNERS.STATS]: 'Get partner statistics',

  // Team
  [API_ROUTES.SUPERADMIN.TEAM.BASE]: 'Get all team members / Create new team member',
  [API_ROUTES.SUPERADMIN.TEAM.STATS]: 'Get team statistics',

  // Tickets
  [API_ROUTES.TICKETS.BASE]: 'Get all tickets / Create new ticket',
  [API_ROUTES.TICKETS.STATS]: 'Get ticket statistics',
} as const;

/**
 * Helper function to build API URLs with query parameters
 */
export function buildApiUrl(baseUrl: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Helper function to validate route parameters
 */
export function validateRouteParams(params: Record<string, any>, required: string[]): string[] {
  const errors: string[] = [];
  
  for (const field of required) {
    if (!params[field]) {
      errors.push(`${field} is required`);
    }
  }

  return errors;
}

/**
 * Common query parameters for list endpoints
 */
export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
