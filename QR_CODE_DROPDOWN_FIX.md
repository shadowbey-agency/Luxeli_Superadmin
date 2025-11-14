# QR Code Dropdown Issue - Fix Documentation

## Problem

When clicking "Room QR code" from the dropdown menu, the QR code was not showing, even though it worked when assigning a guest.

### Root Cause

1. **QR Code only generated during assignment** - The QR code was only created when a guest was assigned to a room
2. **No QR persistence** - The QR code was not stored in the database, only temporarily in frontend state
3. **Room API doesn't include QR** - The `/api/partner/rooms` endpoint doesn't return QR code data
4. **Dropdown uses stale data** - Clicking dropdown passes the room from the list, which doesn't have `qrCodeImage`

---

## Solution

Created a dedicated API endpoint to fetch/regenerate QR codes for existing guests:

### **New API: GET `/api/partner/rooms/[id]/qr-code`**

**Purpose:** Fetch or regenerate QR code for an active guest in a specific room

**Flow:**
1. Verify room exists and belongs to partner
2. Find active guest assigned to the room
3. Generate fresh JWT token for the guest
4. Create QR code from the token
5. Return QR code + guest data

---

## Implementation

### 1. Created New API Endpoint

**File:** `app/api/partner/rooms/[id]/qr-code/route.ts`

```typescript
GET /api/partner/rooms/[id]/qr-code

Auth: Partner JWT (Bearer token)

Response:
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",  // QR code image
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "roomName": "Room 101",
    "checkInDate": "2025-11-14T10:00:00.000Z",
    "checkOutDate": "2025-11-16T10:00:00.000Z"
  }
}
```

**Features:**
- ✅ Verifies room belongs to partner
- ✅ Finds active guest in room
- ✅ Generates fresh JWT token
- ✅ Creates QR code with token
- ✅ Returns complete guest data

**Error Responses:**
- `404` - Room not found
- `404` - No active guest in room
- `403` - Room doesn't belong to partner
- `401` - Invalid/missing auth token

---

### 2. Updated Frontend Handler

**File:** `app/partner/pages/room/page.tsx`

**Function:** `handleRoomQRCode()`

**Logic:**
```
1. Check if room has guest assigned
   └─ No guest → Show alert

2. Check if QR code already cached
   └─ Has cache → Show modal immediately

3. Fetch QR code from API
   └─ GET /api/partner/rooms/[id]/qr-code

4. Store QR code in state
   └─ Update room.qrCodeImage

5. Show QR modal
```

**Benefits:**
- ✅ Fast when cached (no API call)
- ✅ Always generates fresh token
- ✅ Works for any occupied room
- ✅ User-friendly error messages

---

## How It Works Now

### Scenario 1: Assign Guest (First Time)

```
User: Assigns guest to room
  ↓
API: POST /api/partner/assign-room
  ↓
Response: Returns QR code
  ↓
Frontend: Stores QR in room.qrCodeImage
  ↓
Modal: Opens automatically with QR code
  ↓
✅ QR code displayed
```

---

### Scenario 2: Click Dropdown "Room QR code" (Cached)

```
User: Clicks "Room QR code" dropdown
  ↓
Handler: Checks room.qrCodeImage
  ↓
Found in cache!
  ↓
Modal: Opens immediately
  ↓
✅ QR code displayed (no API call)
```

---

### Scenario 3: Click Dropdown "Room QR code" (Not Cached)

```
User: Clicks "Room QR code" dropdown
  ↓
Handler: room.qrCodeImage is undefined
  ↓
API: GET /api/partner/rooms/[roomId]/qr-code
  ↓
Backend: 
  - Finds active guest
  - Generates fresh JWT token
  - Creates QR code
  ↓
Response: Returns QR code + guest data
  ↓
Frontend: Stores QR in room.qrCodeImage
  ↓
Modal: Opens with QR code
  ↓
✅ QR code displayed
```

---

### Scenario 4: Room Without Guest

```
User: Clicks "Room QR code" on empty room
  ↓
Handler: Checks room.resident
  ↓
No guest found!
  ↓
Alert: "No guest assigned to this room. Please assign a guest first to generate a QR code."
  ↓
❌ Modal doesn't open
```

---

## Code Changes

### File 1: New API Route

**File:** `app/api/partner/rooms/[id]/qr-code/route.ts` (NEW)

```typescript
export const GET = withAuth(async (req, context) => {
  // 1. Get partner ID from token
  const partnerId = getPartnerId(req);
  
  // 2. Get room ID from URL
  const roomId = params.id;
  
  // 3. Verify room exists and belongs to partner
  const room = await Room.findById(roomId);
  if (room.partnerId !== partnerId) return 403;
  
  // 4. Find active guest
  const guest = await Guest.findOne({
    roomId: roomId,
    partnerId: partnerId,
    isActive: true,
  });
  
  // 5. Generate JWT token
  const token = generateGuestToken({ ... });
  
  // 6. Create QR code
  const qrCode = await QRCode.toDataURL(token, { ... });
  
  // 7. Return QR code + guest data
  return { qrCode, guestName, guestEmail, ... };
});
```

---

### File 2: Updated Frontend Handler

**File:** `app/partner/pages/room/page.tsx`

**Before:**
```typescript
const handleRoomQRCode = (room: Room) => {
  setRoomForQR(room)
  setShowQRModal(true)
  // ❌ QR code not available in room data
}
```

**After:**
```typescript
const handleRoomQRCode = async (room: Room) => {
  // Check if guest assigned
  if (!room.resident) {
    alert('No guest assigned...')
    return
  }

  // Use cached QR if available
  if (room.qrCodeImage) {
    setRoomForQR(room)
    setShowQRModal(true)
    return
  }

  // Fetch QR code from API
  const response = await fetch(`/api/partner/rooms/${room.id}/qr-code`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  const result = await response.json()
  
  if (result.success) {
    setRoomForQR({
      ...room,
      qrCodeImage: result.data.qrCode
    })
    setShowQRModal(true)
  }
  // ✅ QR code fetched and displayed
}
```

---

## Benefits

### 1. **Works for All Scenarios** ✅
- ✅ After fresh assignment
- ✅ After page refresh
- ✅ For any occupied room
- ✅ Even if guest was assigned hours ago

### 2. **Performance Optimized** ✅
- ✅ Caches QR code in memory
- ✅ No API call if cached
- ✅ Fast modal opening

### 3. **Fresh Tokens** ✅
- ✅ Generates new JWT each time
- ✅ Token always valid (not expired)
- ✅ Latest guest data

### 4. **User-Friendly** ✅
- ✅ Clear error messages
- ✅ Guidance on what to do
- ✅ Works intuitively

### 5. **Secure** ✅
- ✅ Verifies partner ownership
- ✅ Only shows active guests
- ✅ Requires authentication

---

## Testing

### Test Case 1: Assign New Guest

**Steps:**
1. Click "Assign room" on empty room
2. Fill guest details
3. Click "Save"

**Expected:**
- ✅ QR modal opens automatically
- ✅ QR code displayed
- ✅ Can download QR

---

### Test Case 2: View QR (Cached)

**Steps:**
1. Assign guest (QR modal opens)
2. Close QR modal
3. Click dropdown → "Room QR code"

**Expected:**
- ✅ QR modal opens immediately (no loading)
- ✅ Same QR code displayed
- ✅ No API call made

---

### Test Case 3: View QR (Not Cached)

**Steps:**
1. Assign guest to room
2. Refresh page (clears cache)
3. Click dropdown → "Room QR code"

**Expected:**
- ✅ Brief loading
- ✅ API call to `/api/partner/rooms/[id]/qr-code`
- ✅ QR modal opens with QR code
- ✅ Fresh JWT token generated

---

### Test Case 4: Empty Room

**Steps:**
1. Find room with no guest
2. Click dropdown → "Room QR code"

**Expected:**
- ✅ Alert: "No guest assigned to this room..."
- ✅ Modal doesn't open
- ✅ No API call made

---

### Test Case 5: Checked Out Guest

**Steps:**
1. Assign guest to room
2. Check out guest
3. Click dropdown → "Room QR code"

**Expected:**
- ✅ API returns 404 (no active guest)
- ✅ Alert: "No active guest found in this room"
- ✅ Modal doesn't open

---

## API Specification

### Endpoint

```
GET /api/partner/rooms/{roomId}/qr-code
```

### Headers

```
Authorization: Bearer <partner_jwt_token>
```

### Response Success (200)

```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "roomName": "Room 101",
    "checkInDate": "2025-11-14T10:00:00.000Z",
    "checkOutDate": "2025-11-16T10:00:00.000Z"
  }
}
```

### Response Errors

**404 - Room Not Found**
```json
{
  "success": false,
  "error": "Room not found"
}
```

**404 - No Guest**
```json
{
  "success": false,
  "error": "No active guest found in this room"
}
```

**403 - Wrong Partner**
```json
{
  "success": false,
  "error": "Room does not belong to your hotel"
}
```

**401 - No Auth**
```json
{
  "success": false,
  "error": "Partner ID not found in token"
}
```

---

## Files Modified

1. ✅ `app/api/partner/rooms/[id]/qr-code/route.ts` - New API endpoint
2. ✅ `app/partner/pages/room/page.tsx` - Updated `handleRoomQRCode` function
3. ✅ `QR_CODE_DROPDOWN_FIX.md` - This documentation

---

## Related Features

- ✅ Guest Assignment (`POST /api/partner/assign-room`)
- ✅ Guest Checkout (`POST /api/partner/checkout-guest`)
- ✅ Guest Login (`POST /api/user/login-qr`)
- ✅ Room List (`GET /api/partner/rooms`)

---

## Summary

**Problem:** QR code not showing when clicking dropdown button

**Root Cause:** QR code not included in room list data

**Solution:** Created dedicated API to fetch/regenerate QR codes on demand

**Result:** 
- ✅ QR code works after assignment
- ✅ QR code works from dropdown
- ✅ QR code works after page refresh
- ✅ Performance optimized with caching
- ✅ User-friendly error handling

**The QR code now works in all scenarios!** 🎉

