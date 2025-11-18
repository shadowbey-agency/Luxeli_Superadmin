/**
 * Staff role-based access control
 * Maps staff roles to allowed pages and dashboard sections
 */

export type StaffRole = 
  | 'housekeeper'
  | 'booking assistant'
  | 'custom service agent'
  | 'activity supervisor'
  | 'laundary attendant'
  | 'delivery staff';

/**
 * Pages that each staff role can access
 */
export const staffRolePages: Record<StaffRole, string[]> = {
  'housekeeper': [
    '/partner/pages/dashboard',
    '/partner/pages/housekeeping/requests',
    '/partner/pages/housekeeping/house-cleaning',
    '/partner/pages/housekeeping/requests-management',
    '/partner/pages/settings',
  ],
  'booking assistant': [
    '/partner/pages/dashboard',
    '/partner/pages/booking/requests',
    '/partner/pages/booking/settings',
    '/partner/pages/settings',
  ],
  'custom service agent': [
    '/partner/pages/dashboard',
    '/partner/pages/customized-services/requests',
    '/partner/pages/settings',
  ],
  'activity supervisor': [
    '/partner/pages/dashboard',
    '/partner/pages/activity-alerts/requests',
    '/partner/pages/activity-alerts/activities',
    '/partner/pages/settings',
  ],
  'laundary attendant': [
    '/partner/pages/dashboard',
    '/partner/pages/laundry/requests',
    '/partner/pages/laundry/settings',
    '/partner/pages/settings',
  ],
  'delivery staff': [
    '/partner/pages/dashboard',
    '/partner/pages/room-delivery/requests',
    '/partner/pages/room-delivery/restaurants',
    '/partner/pages/settings',
  ],
};

/**
 * Dashboard service sections that each staff role can see
 */
export const staffRoleDashboardSections: Record<StaffRole, string[]> = {
  'housekeeper': ['Housekeeping'],
  'booking assistant': ['Bookings interns'],
  'custom service agent': ['Customized services'],
  'activity supervisor': ['Activity alerts'],
  'laundary attendant': ['Laundry'],
  'delivery staff': ['In-room delivery'],
};

/**
 * Check if a staff role can access a specific route
 */
export function canStaffAccessRoute(role: string | null | undefined, route: string): boolean {
  // Partners and partner members use permission system, not role-based
  if (!role) return false;
  
  const staffRole = role.toLowerCase() as StaffRole;
  const allowedPages = staffRolePages[staffRole];
  
  if (!allowedPages) {
    // Unknown role - no access
    return false;
  }
  
  // Check if route matches any allowed page
  return allowedPages.some(allowedRoute => 
    route === allowedRoute || route.startsWith(allowedRoute + '/')
  );
}

/**
 * Get allowed pages for a staff role
 */
export function getAllowedPagesForRole(role: string | null | undefined): string[] {
  if (!role) return [];
  
  const staffRole = role.toLowerCase() as StaffRole;
  return staffRolePages[staffRole] || [];
}

/**
 * Get allowed dashboard sections for a staff role
 */
export function getAllowedDashboardSections(role: string | null | undefined): string[] {
  if (!role) return [];
  
  const staffRole = role.toLowerCase() as StaffRole;
  return staffRoleDashboardSections[staffRole] || [];
}

/**
 * Check if a dashboard service section should be visible for a staff role
 */
export function canStaffSeeDashboardSection(role: string | null | undefined, sectionName: string): boolean {
  if (!role) return false;
  
  const allowedSections = getAllowedDashboardSections(role);
  return allowedSections.includes(sectionName);
}

