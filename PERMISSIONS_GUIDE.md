# Partner Member Permissions System

## Overview
This system provides role-based access control for partner members. Partners and staff have full access, while partner members only see/access pages they have permissions for.

## Features
- ✅ **Permission-based sidebar** - Only shows menu items user has access to
- ✅ **Route protection** - Automatically redirects unauthorized access
- ✅ **Simple API** - Easy to use hooks and components
- ✅ **Automatic filtering** - Services with no accessible sub-items are hidden

---

## How It Works

### 1. Permission Structure
Partner members have a `permissions` object stored in the database:

```typescript
{
  dashboard: boolean,
  room: {
    rooms: boolean,
    requests: boolean
  },
  support: {
    myTickets: boolean,
    ticketSaved: boolean
  },
  team: {
    members: boolean,
    staff: boolean
  },
  housekeeping: {
    requests: boolean,
    houseCleaning: boolean,
    requestManagement: boolean
  },
  booking: {
    internalRequests: {
      allCategories: boolean,
      categoryName: boolean
    },
    bookingSetting: boolean
  },
  activityAlert: {
    requests: boolean,
    activities: boolean
  },
  laundry: {
    requests: boolean,
    setting: boolean
  },
  inRoomDelivery: {
    requests: boolean,
    restaurantName: boolean,
    restaurantSetting: boolean
  }
}
```

### 2. Route Mapping
Routes are mapped to permissions in `lib/permissions.ts`:

```typescript
'/partner/pages/dashboard' → 'dashboard'
'/partner/pages/housekeeping/requests' → 'housekeeping.requests'
'/partner/pages/booking/settings' → 'booking.bookingSetting'
```

---

## Usage

### 1. Protecting Individual Pages

Wrap your page content with `ProtectedRoute`:

```typescript
"use client"

import ProtectedRoute from "@/app/partner/components/ProtectedRoute"

export default function HousekeepingRequestsPage() {
  return (
    <ProtectedRoute requiredRoute="/partner/pages/housekeeping/requests">
      <div>
        {/* Your page content */}
        <h1>Housekeeping Requests</h1>
        {/* ... */}
      </div>
    </ProtectedRoute>
  )
}
```

**What happens:**
- If user has permission → Page loads normally
- If user lacks permission → Redirects to `/partner/pages/dashboard`
- Shows loading spinner while checking

### 2. Using the Permissions Hook

Check permissions dynamically in your components:

```typescript
"use client"

import { usePermissions } from "@/hooks/usePermissions"

export default function MyComponent() {
  const { 
    hasPermission, 
    hasAnyPermission,
    isPartner,
    isPartnerMember,
    isPartnerStaff,
    permissions,
    loading 
  } = usePermissions()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {/* Conditional rendering */}
      {hasPermission('/partner/pages/housekeeping/requests') && (
        <button>View Housekeeping</button>
      )}

      {/* Check role */}
      {isPartner && <button>Admin Settings</button>}
      
      {/* Check multiple routes */}
      {hasAnyPermission([
        '/partner/pages/booking/requests',
        '/partner/pages/booking/settings'
      ]) && (
        <div>Booking Section</div>
      )}

      {/* Access raw permissions */}
      {permissions?.housekeeping.requests && (
        <span>Can view housekeeping requests</span>
      )}
    </div>
  )
}
```

### 3. Sidebar Integration

The sidebar **automatically filters** menu items:

```typescript
// In sidebar.tsx (already implemented)
const { hasPermission } = usePermissions()

// Filters menu items
const visibleMenuItems = menuItems.filter(item => 
  hasPermission(item.href)
)

// Filters service sub-items
const visibleServicesItems = servicesItems.map(service => {
  const visibleSubItems = service.subItems.filter(subItem => 
    hasPermission(subItem.href)
  )
  return { ...service, subItems: visibleSubItems }
}).filter(service => service.subItems.length > 0)
```

**Result:** Users only see menu items they can access!

---

## User Types

### 🔑 Partner
- **Full Access** - Can access all routes
- **No restrictions** - Permissions always return `true`

### 👥 Partner Staff  
- **Full Access** - Can access all routes
- **No restrictions** - Same as partner

### 📋 Partner Member
- **Limited Access** - Only sees pages with `permission: true`
- **Auto-filtered** - Sidebar and routes checked automatically

---

## Permission Utilities

### `hasRoutePermission(route, permissions, userType)`
Check if user can access a specific route.

```typescript
import { hasRoutePermission } from '@/lib/permissions'

const canAccess = hasRoutePermission(
  '/partner/pages/housekeeping/requests',
  userPermissions,
  'partnermember'
)
```

### `getAccessibleRoutes(permissions, userType)`
Get all routes user can access.

```typescript
import { getAccessibleRoutes } from '@/lib/permissions'

const routes = getAccessibleRoutes(userPermissions, 'partnermember')
// Returns: ['/partner/pages/dashboard', '/partner/pages/housekeeping/requests', ...]
```

### `getFirstAccessibleRoute(permissions, userType)`
Get the first accessible route (useful for login redirect).

```typescript
import { getFirstAccessibleRoute } from '@/lib/permissions'

const firstRoute = getFirstAccessibleRoute(userPermissions, 'partnermember')
// Returns: '/partner/pages/dashboard' or first accessible route
```

---

## Login Flow with Permissions

```typescript
// In app/login/page.tsx
const data = await loginUser(email, password, userType)

// Partner member token includes permissions
if (data.userType === 'partnermember') {
  // Permissions are in data.user.permissions
  // Automatically stored in localStorage
  // Automatically loaded by usePermissions hook
  
  router.push('/partner/pages/dashboard')
}
```

---

## Adding New Routes

To add a new protected route:

### 1. Add route mapping to `lib/permissions.ts`:

```typescript
export const routePermissionMap: Record<string, string> = {
  // ... existing routes
  '/partner/pages/new-feature': 'newFeature.access',
}
```

### 2. Add permission field to `PartnerMember` model:

```typescript
// In models/PartnerMember.ts
permissions: {
  // ... existing permissions
  newFeature: {
    access: { type: Boolean, default: false }
  }
}
```

### 3. Update TypeScript interface:

```typescript
// In lib/permissions.ts
export interface PartnerMemberPermissions {
  // ... existing permissions
  newFeature: {
    access: boolean;
  };
}
```

### 4. Protect the page:

```typescript
// In app/partner/pages/new-feature/page.tsx
import ProtectedRoute from "@/app/partner/components/ProtectedRoute"

export default function NewFeaturePage() {
  return (
    <ProtectedRoute requiredRoute="/partner/pages/new-feature">
      {/* Page content */}
    </ProtectedRoute>
  )
}
```

---

## Testing

### Test Partner Member Access:
1. Create a partner member with specific permissions
2. Login as that member
3. Verify only allowed pages appear in sidebar
4. Try accessing restricted routes directly → should redirect

### Test Different Roles:
```typescript
// Partner - sees everything
// Partner Staff - sees everything  
// Partner Member with no permissions - sees only dashboard, settings, subscription
// Partner Member with housekeeping.requests = true - also sees housekeeping menu
```

---

## Troubleshooting

### Issue: All routes appear for partner member
**Solution:** Check that `userType` is correctly set to `'partnermember'` in token

### Issue: No routes appear for partner member  
**Solution:** Check that permissions object is included in JWT token and stored properly

### Issue: Route shows in sidebar but redirects when clicked
**Solution:** Check route path matches exactly in `routePermissionMap`

### Issue: Permission check always returns false
**Solution:** Verify permission path uses dot notation correctly (e.g., `'housekeeping.requests'`)

---

## Security Notes

⚠️ **Client-side only** - This is UI protection, not API security
⚠️ **Backend validation required** - Always check permissions in API routes too
⚠️ **Token-based** - Permissions come from JWT, stored in localStorage

For API protection, use middleware:
```typescript
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request)
  // partnerId ensures partner members only access their partner's data
  const data = await Model.find({ partnerId })
  return NextResponse.json({ data })
})
```

---

## Summary

✅ **Simple** - Just wrap pages with `<ProtectedRoute>` or use `usePermissions()` hook
✅ **Automatic** - Sidebar filters itself based on permissions  
✅ **Flexible** - Easy to add new routes and permissions
✅ **Reliable** - Consistent permission checking across the app
✅ **User-friendly** - Clear loading states and automatic redirects

The system handles all the complexity, so you can focus on building features! 🎉

