# Housekeeping Request Security Update

## Summary
Updated the housekeeping request system to ensure partners can only update requests created by guests (via Flutter app), not create new ones. Added partner ID verification to all modification endpoints.

## Changes Made

### 1. Removed Partner's Ability to Create Requests
**File:** `app/api/partner/housekeeping-requests/route.ts`
- ❌ Removed: `POST /api/partner/housekeeping-requests` endpoint
- ✅ Partners can no longer create new housekeeping requests
- ✅ Only guests via Flutter app can create requests using `/api/housekeeping-requests`

### 2. Added Partner ID Verification to All Update Operations

#### Modified API Routes
All partner housekeeping routes now verify partner ownership before allowing modifications:

**File:** `app/api/partner/housekeeping-requests/[id]/route.ts`
- Added `partnerId` extraction from JWT token
- Updated `GET`, `PATCH`, and `DELETE` methods to pass `partnerId` to controller

**File:** `app/api/partner/housekeeping-requests/[id]/status/route.ts`
- Added `partnerId` extraction and verification
- Updated `PATCH` method to pass `partnerId` to controller

**File:** `app/api/partner/housekeeping-requests/[id]/assign/route.ts`
- Added `partnerId` extraction and verification
- Updated `POST` method to pass `partnerId` to controller

#### Modified Controller Methods
**File:** `controllers/partner/housekeeping/HousekeepingRequestController.ts`

1. **getRequestById(requestId, partnerId)**
   - Added partner ownership verification
   - Returns 403 if request doesn't belong to partner

2. **updateRequest(requestId, partnerId, data)**
   - Added partner ownership verification
   - Returns 403 if request doesn't belong to partner
   - Partners can only update requests from their own hotel

3. **deleteRequest(requestId, partnerId)**
   - Added partner ownership verification
   - Returns 403 if request doesn't belong to partner
   - Partners can only delete requests from their own hotel

4. **updateRequestStatus(requestId, partnerId, status)**
   - Added partner ownership verification
   - Returns 403 if request doesn't belong to partner
   - Partners can only update status of requests from their own hotel

5. **assignStaff(requestId, partnerId, assignee)**
   - Added partner ownership verification
   - Returns 403 if request doesn't belong to partner
   - Partners can only assign staff to requests from their own hotel

## Security Improvements

### Before
- ❌ Partners could create new housekeeping requests
- ❌ Partners could modify ANY request by ID (security vulnerability)
- ❌ Partners could delete ANY request by ID
- ❌ Partners could assign staff to ANY request
- ❌ Partners could change status of ANY request

### After
- ✅ Only guests (via Flutter) can create housekeeping requests
- ✅ Partners can only view requests from their own hotel
- ✅ Partners can only update requests from their own hotel
- ✅ Partners can only delete requests from their own hotel
- ✅ Partners can only assign staff to requests from their own hotel
- ✅ Partners can only change status of requests from their own hotel
- ✅ All operations verify `partnerId` matches the request's partner

## API Behavior

### Guest/Flutter App (Unchanged)
- `POST /api/housekeeping-requests` - Create new request ✅
- `GET /api/housekeeping-requests/my` - View own requests ✅
- `GET /api/housekeeping-requests/[id]` - View own request ✅
- `PATCH /api/housekeeping-requests/[id]/cancel` - Cancel own request ✅

### Partner Dashboard (Updated)
- ~~`POST /api/partner/housekeeping-requests`~~ - ❌ REMOVED
- `GET /api/partner/housekeeping-requests` - View own hotel's requests ✅
- `GET /api/partner/housekeeping-requests/[id]` - View own request (verified) ✅
- `PATCH /api/partner/housekeeping-requests/[id]` - Update own request (verified) ✅
- `PATCH /api/partner/housekeeping-requests/[id]/status` - Update status (verified) ✅
- `POST /api/partner/housekeeping-requests/[id]/assign` - Assign staff (verified) ✅
- `DELETE /api/partner/housekeeping-requests/[id]` - Delete own request (verified) ✅

## Verification Logic

Each partner operation now includes:

```typescript
// 1. Extract partnerId from JWT token
const partnerId = getPartnerId(request);

// 2. Fetch the request
const request = await HousekeepingRequest.findById(requestId);

// 3. Verify ownership
if (request.partnerId !== partnerId) {
  return NextResponse.json(
    { success: false, error: 'You do not have permission to [action] this request' },
    { status: 403 }
  );
}

// 4. Perform the operation
// ... update/delete/assign logic
```

## Error Responses

### 401 Unauthorized
- Missing or invalid partner JWT token
- Partner ID not found in token

### 403 Forbidden
- Request exists but belongs to a different partner
- Message: "You do not have permission to [view/update/delete/assign staff to] this request"

### 404 Not Found
- Request ID doesn't exist in database

## Testing Checklist

- [ ] Guest can create housekeeping request via Flutter app
- [ ] Partner can view all requests from their hotel
- [ ] Partner can update requests from their hotel
- [ ] Partner CANNOT update requests from other hotels (403)
- [ ] Partner can assign staff to their hotel's requests
- [ ] Partner CANNOT assign staff to other hotels' requests (403)
- [ ] Partner can change status of their hotel's requests
- [ ] Partner CANNOT change status of other hotels' requests (403)
- [ ] Partner can delete their hotel's requests
- [ ] Partner CANNOT delete other hotels' requests (403)
- [ ] Partner CANNOT create new housekeeping requests (endpoint removed)

## Notes

- All existing housekeeping requests remain unchanged in the database
- The `partnerId` field in housekeeping requests is used for verification
- Requests created by guests via Flutter automatically include the correct `partnerId`
- The security fix prevents cross-hotel data access and manipulation

