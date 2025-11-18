"use client"

import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/auth-utils';
import { 
  hasRoutePermission, 
  hasAnyRoutePermission, 
  getAccessibleRoutes,
  type PartnerMemberPermissions 
} from '@/lib/permissions';
import { 
  canStaffAccessRoute,
  getAllowedPagesForRole,
  type StaffRole 
} from '@/lib/staff-role-access';

export interface UserPermissions {
  permissions: PartnerMemberPermissions | null;
  userType: string | null;
  userRole: string | null; // The actual role (e.g., 'housekeeper', 'booking assistant')
  isPartner: boolean;
  isPartnerMember: boolean;
  isPartnerStaff: boolean;
  hasPermission: (route: string) => boolean;
  hasAnyPermission: (routes: string[]) => boolean;
  accessibleRoutes: string[];
  loading: boolean;
}

/**
 * Hook to access user permissions
 */
export function usePermissions(): UserPermissions {
  const [permissions, setPermissions] = useState<PartnerMemberPermissions | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessibleRoutes, setAccessibleRoutes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserData();
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'))
      : null;
    
    if (user) {
      // Get userType from user object (stored in token)
      const userTypeValue = (user as any).userType || (user as any).role;
      const userRoleValue = (user as any).role || user.role;
      
      // Check if it's a staff role (not partner, partnermember, superadmin, member)
      const staffRoles = ['housekeeper', 'booking assistant', 'custom service agent', 'activity supervisor', 'laundary attendant', 'delivery staff'];
      const isStaffRole = userRoleValue && staffRoles.includes(userRoleValue?.toLowerCase());
      
      if (isStaffRole) {
        // This is a staff member - use role-based access
        setUserType('partnerstaff');
        setUserRole(userRoleValue);
        setPermissions(null);
        setAccessibleRoutes(getAllowedPagesForRole(userRoleValue));
      } else if (userTypeValue === 'partnermember' || userRoleValue === 'partnermember') {
        // Partner members have permissions object
        setUserType('partnermember');
        setUserRole('partnermember');
        const userPermissions = (user as any).permissions;
        setPermissions(userPermissions as PartnerMemberPermissions);
        setAccessibleRoutes(getAccessibleRoutes(userPermissions as PartnerMemberPermissions, 'partnermember'));
      } else {
        // Partners, superadmin, member have full access
        setUserType(userTypeValue || userRoleValue);
        setUserRole(userRoleValue);
        setPermissions(null);
        setAccessibleRoutes(getAccessibleRoutes(null, userTypeValue || userRoleValue));
      }
    }
    
    setLoading(false);
  }, []);

  const hasPermission = (route: string): boolean => {
    // If partner staff, use role-based access
    if (userType === 'partnerstaff' && userRole) {
      return canStaffAccessRoute(userRole, route);
    }
    
    // Otherwise use permission-based access
    return hasRoutePermission(route, permissions, userType || undefined);
  };

  const hasAnyPermission = (routes: string[]): boolean => {
    // If partner staff, use role-based access
    if (userType === 'partnerstaff' && userRole) {
      return routes.some(route => canStaffAccessRoute(userRole, route));
    }
    
    // Otherwise use permission-based access
    return hasAnyRoutePermission(routes, permissions, userType || undefined);
  };

  return {
    permissions,
    userType,
    userRole,
    isPartner: userType === 'partner',
    isPartnerMember: userType === 'partnermember',
    isPartnerStaff: userType === 'partnerstaff',
    hasPermission,
    hasAnyPermission,
    accessibleRoutes,
    loading,
  };
}

