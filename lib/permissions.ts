/**
 * Permission utilities for partner members
 * Maps routes to permission keys and provides helper functions
 */

export interface PartnerMemberPermissions {
  dashboard: boolean;
  room: {
    rooms: boolean;
    requests: boolean;
  };
  support: {
    myTickets: boolean;
    ticketSaved: boolean;
  };
  team: {
    members: boolean;
    staff: boolean;
  };
  housekeeping: {
    requests: boolean;
    houseCleaning: boolean;
    requestManagement: boolean;
  };
  booking: {
    internalRequests: {
      allCategories: boolean;
      categoryName: boolean;
    };
    bookingSetting: boolean;
  };
  activityAlert: {
    requests: boolean;
    activities: boolean;
  };
  laundry: {
    requests: boolean;
    setting: boolean;
  };
  inRoomDelivery: {
    requests: boolean;
    restaurantName: boolean;
    restaurantSetting: boolean;
  };
}

/**
 * Route to permission mapping
 * Maps each partner route to its required permission
 */
export const routePermissionMap: Record<string, string> = {
  // Dashboard
  '/partner/pages/dashboard': 'dashboard',
  
  // Room
  '/partner/pages/room': 'room.rooms',
  '/partner/pages/room/requests': 'room.requests',
  
  // Support
  '/partner/pages/support': 'support.myTickets',
  '/partner/pages/support/saved': 'support.ticketSaved',
  
  // Team
  '/partner/pages/team': 'team.members', // Team shows members
  '/partner/pages/member': 'team.members',
  '/partner/pages/staff': 'team.staff',
  
  // Housekeeping
  '/partner/pages/housekeeping/requests': 'housekeeping.requests',
  '/partner/pages/housekeeping/house-cleaning': 'housekeeping.houseCleaning',
  '/partner/pages/housekeeping/requests-management': 'housekeeping.requestManagement',
  
  // Booking
  '/partner/pages/booking/requests': 'booking.internalRequests.allCategories',
  '/partner/pages/booking/settings': 'booking.bookingSetting',
  
  // Activity Alert
  '/partner/pages/activity-alert/requests': 'activityAlert.requests',
  '/partner/pages/activity-alert/activities': 'activityAlert.activities',
  
  // Laundry
  '/partner/pages/laundry/requests': 'laundry.requests',
  '/partner/pages/laundry/setting': 'laundry.setting',
  
  // Room Delivery (In-room delivery)
  '/partner/pages/room-delivery/requests': 'inRoomDelivery.requests',
  '/partner/pages/room-delivery/restaurants': 'inRoomDelivery.restaurantName',
  '/partner/pages/room-delivery/restaurant-settings': 'inRoomDelivery.restaurantSetting',
  
  // Settings and Subscription are always accessible
  '/partner/pages/settings': 'always',
  '/partner/pages/subscription': 'always',
}

/**
 * Get nested permission value from permission object
 */
function getNestedPermission(permissions: any, path: string): boolean {
  if (path === 'always') return true;
  
  const keys = path.split('.');
  let current = permissions;
  
  for (const key of keys) {
    if (current === undefined || current === null) return false;
    current = current[key];
  }
  
  return current === true;
}

/**
 * Check if user has permission to access a route
 */
export function hasRoutePermission(
  route: string,
  permissions: PartnerMemberPermissions | null | undefined,
  userType?: string
): boolean {
  // Partners and staff have full access
  if (userType === 'partner' || userType === 'partnerstaff') {
    return true;
  }
  
  // For partnermember, if no permissions object, only allow dashboard and settings
  if (userType === 'partnermember' && !permissions) {
    // Allow dashboard and settings even without permissions
    if (route === '/partner/pages/dashboard' || route === '/partner/pages/settings') {
      return true;
    }
    return false;
  }
  
  // For other user types (superadmin, member), allow access if no permissions object
  if (!permissions && userType !== 'partnermember') {
    return true;
  }
  
  // Find matching route
  const permissionKey = routePermissionMap[route];
  
  // If no permission mapping found, check if it's a parent route
  // For parent routes (like /partner/pages/housekeeping), check if any sub-route has permission
  if (!permissionKey) {
    // Check if this is a parent route by looking for routes that start with this path
    const hasSubRoutePermission = Object.keys(routePermissionMap).some(mappedRoute => {
      if (mappedRoute.startsWith(route + '/')) {
        const subPermissionKey = routePermissionMap[mappedRoute];
        if (subPermissionKey && permissions) {
          return getNestedPermission(permissions, subPermissionKey);
        }
      }
      return false;
    });
    
    // If it's a parent route and has sub-route permissions, allow access
    if (hasSubRoutePermission) {
      return true;
    }
    
    // Otherwise deny access for partnermember
    if (userType === 'partnermember') {
      return false;
    }
    
    // For other types, allow if no mapping (backward compatibility)
    return true;
  }
  
  // Check the permission
  return getNestedPermission(permissions, permissionKey);
}

/**
 * Check if user has permission for any route in a list
 */
export function hasAnyRoutePermission(
  routes: string[],
  permissions: PartnerMemberPermissions | null | undefined,
  userType?: string
): boolean {
  return routes.some(route => hasRoutePermission(route, permissions, userType));
}

/**
 * Get all accessible routes for a user
 */
export function getAccessibleRoutes(
  permissions: PartnerMemberPermissions | null | undefined,
  userType?: string
): string[] {
  // Partners and staff have access to all routes
  if (userType === 'partner' || userType === 'partnerstaff') {
    return Object.keys(routePermissionMap);
  }
  
  if (!permissions) {
    return [];
  }
  
  return Object.keys(routePermissionMap).filter(route => 
    hasRoutePermission(route, permissions, userType)
  );
}

/**
 * Get first accessible route (useful for redirect after login)
 */
export function getFirstAccessibleRoute(
  permissions: PartnerMemberPermissions | null | undefined,
  userType?: string
): string {
  const accessibleRoutes = getAccessibleRoutes(permissions, userType);
  return accessibleRoutes.length > 0 ? accessibleRoutes[0] : '/partner/pages/dashboard';
}

