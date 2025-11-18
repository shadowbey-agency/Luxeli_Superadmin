"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute?: string; // The route that requires permission
  fallbackRoute?: string; // Where to redirect if no permission
}

/**
 * Component to protect routes based on user permissions
 * Wraps page content and redirects if user doesn't have permission
 */
export default function ProtectedRoute({ 
  children, 
  requiredRoute, 
  fallbackRoute = '/partner/pages/dashboard' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission, loading, userType } = usePermissions();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    // Use requiredRoute if provided, otherwise use current pathname
    const routeToCheck = requiredRoute || pathname;

    // Partners and staff have full access
    if (userType === 'partner' || userType === 'partnerstaff') {
      setIsChecking(false);
      return;
    }

    // Check if user has permission
    const hasAccess = hasPermission(routeToCheck);

    if (!hasAccess) {
      console.warn(`Access denied to route: ${routeToCheck}`);
      router.push(fallbackRoute);
      return;
    }

    setIsChecking(false);
  }, [loading, hasPermission, pathname, requiredRoute, router, fallbackRoute, userType]);

  // Show loading state while checking permissions
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

