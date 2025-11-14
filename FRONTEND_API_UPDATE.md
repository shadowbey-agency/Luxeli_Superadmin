# Frontend API Update - Room Assignment Fix

## Issue
Getting error: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` when assigning guests to rooms.

## Root Cause
The frontend was calling deprecated API endpoints that were deleted during the Room Schema Cleanup:
- ❌ `POST /api/partner/rooms/[id]/assign` (deleted)
- ❌ `POST /api/partner/rooms/[id]/unassign` (deleted)

When these endpoints don't exist, Next.js returns a 404 HTML page, which causes the JSON parsing error.

## Solution
Updated the frontend to use the new correct endpoints:
- ✅ `POST /api/partner/assign-room` (for guest assignment)
- ✅ `POST /api/partner/checkout-guest` (for guest checkout)

## Changes Made

### File: `app/partner/pages/room/page.tsx`

#### 1. Updated Guest Assignment (handleSaveAssignment)

**Before:**
```typescript
const response = await fetch(`/api/partner/rooms/${roomToAssign.id}/assign`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    resident: assignResident.trim(),
    residentEmail: assignResidentEmail.trim() || null,
    residentPhoneNo: assignResidentPhoneNo.trim() || null,
    checkInDate: assignCheckInDate || undefined,
    checkInTime: assignCheckInTime || null,
    checkOutDate: assignCheckOutDate || null,
    checkOutTime: assignCheckOutTime || null,
  }),
})
```

**After:**
```typescript
const response = await fetch(`/api/partner/assign-room`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    guestName: assignResident.trim(),
    guestEmail: assignResidentEmail.trim() || undefined,
    guestPhone: assignResidentPhoneNo.trim() || undefined,
    roomId: roomToAssign.id,
    roomName: roomToAssign.roomName,
    checkInDate: assignCheckInDate || undefined,
    checkOutDate: assignCheckOutDate || undefined,
  }),
})
```

**Changes:**
- ✅ Endpoint: `/api/partner/assign-room` (no room ID in URL)
- ✅ Field names updated: `resident` → `guestName`, `residentEmail` → `guestEmail`, `residentPhoneNo` → `guestPhone`
- ✅ Added required fields: `roomId` and `roomName`
- ✅ Removed time fields: `checkInTime`, `checkOutTime` (not used in new API)
- ✅ Success message updated to mention QR code generation

#### 2. Updated Guest Checkout (confirmUnassign)

**Before:**
```typescript
const response = await fetch(`/api/partner/rooms/${roomToUnassign.id}/unassign`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
```

**After:**
```typescript
const response = await fetch(`/api/partner/checkout-guest`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    roomId: roomToUnassign.id
  })
})
```

**Changes:**
- ✅ Endpoint: `/api/partner/checkout-guest` (no room ID in URL)
- ✅ Room ID passed in request body instead of URL
- ✅ Success message updated to "Guest checked out successfully"

## API Endpoints Reference

### Guest Assignment
```
POST /api/partner/assign-room
Authorization: Bearer <partner_jwt_token>

Body:
{
  "guestName": "John Doe",
  "guestEmail": "john@example.com",     // optional
  "guestPhone": "+1234567890",          // optional
  "roomId": "room_id_here",
  "roomName": "Room 101",
  "checkInDate": "2025-11-14",          // optional, ISO date
  "checkOutDate": "2025-11-16"          // optional, ISO date
}

Response:
{
  "success": true,
  "data": {
    "userId": "guest_id",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "roomId": "room_id",
    "roomName": "Room 101",
    "token": "jwt_token_for_guest",
    "qrCode": "data:image/png;base64,..."  // QR code as base64
  }
}
```

### Guest Checkout
```
POST /api/partner/checkout-guest
Authorization: Bearer <partner_jwt_token>

Body:
{
  "roomId": "room_id_here"
}

Response:
{
  "success": true,
  "message": "Guest checked out successfully",
  "data": {
    "guestId": "guest_id",
    "guestName": "John Doe",
    "checkOutDate": "2025-11-14T10:30:00.000Z"
  }
}
```

## Benefits of New Approach

### 1. Proper Guest Management
- Creates Guest records with QR codes
- Generates JWT tokens for guest access
- Tracks guest history (isActive field)

### 2. Better Data Separation
- Guest info stored in Guest model
- Room only tracks availability status
- No data duplication

### 3. QR Code Generation
- Automatic QR code generation on assignment
- Guest can scan QR to access services
- Token includes guest and room information

### 4. Simplified Room Model
- Room only has: partnerId, roomId, roomName, roomStatus
- No redundant guest fields

## Testing

After this fix:
- ✅ Assigning a guest to a room works correctly
- ✅ No more "Unexpected token" errors
- ✅ QR code is generated for guest access
- ✅ Guest record is created in database
- ✅ Room status updates to "full"
- ✅ Checking out a guest works correctly
- ✅ Room status updates to "empty"
- ✅ Guest record is preserved with isActive=false

## Related Changes

This fix is part of the Room Schema Cleanup that:
1. Removed redundant guest fields from Room model
2. Centralized guest data in Guest model
3. Deprecated old room assignment endpoints
4. Introduced proper guest management with QR codes

See `ROOM_SCHEMA_CLEANUP.md` for complete details.

