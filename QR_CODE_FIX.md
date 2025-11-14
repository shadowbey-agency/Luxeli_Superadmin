# QR Code Fix - Display JWT Token QR Instead of JSON Data

## Problem

The frontend was generating **two different QR codes**:

1. **Backend API QR** (`/api/partner/assign-room`) - Contains JWT token ✅ Correct
2. **Frontend Modal QR** (Room page) - Contains JSON data ❌ Wrong

When scanning the QR code from the frontend modal, users saw JSON data (room name, resident, email, etc.) instead of the JWT token needed for authentication.

## Root Cause

The frontend modal was regenerating a new QR code using `QRCodeCanvas` with JSON data:

```typescript
// OLD CODE (WRONG)
<QRCodeCanvas
  value={JSON.stringify({
    roomName: roomForQR?.roomName || "",
    resident: roomForQR?.resident || "",
    residentEmail: roomForQR?.residentEmail || "",
    // ... more JSON data
  })}
/>
```

This QR code contained JSON, not the JWT token, making it unusable for guest authentication.

## Solution

Updated the frontend to:
1. Store the QR code image from the API response
2. Display the API-generated QR code (which contains the JWT token)
3. Remove the frontend QR generation with JSON data

---

## Changes Made

### 1. Updated Room Interface

**File:** `app/partner/pages/room/page.tsx`

Added `qrCodeImage` field to store the base64 QR code from API:

```typescript
interface Room {
  // ... existing fields
  qrCodeImage?: string // base64 QR code image from API (contains JWT token)
}
```

### 2. Updated Assignment Handler

**File:** `app/partner/pages/room/page.tsx` - `handleSaveAssignment()`

Modified to:
- Capture QR code from API response
- Automatically show QR modal after successful assignment
- Store QR code with room data

```typescript
const result = await response.json()

// Store the QR code from API response
const qrCodeImage = result.data?.qrCode || null

// Refresh rooms list
await fetchRooms()

// Close assign modal
closeAssignModal()

// If QR code was generated, show it in the QR modal
if (qrCodeImage && roomToAssign) {
  setRoomForQR({
    ...roomToAssign,
    resident: assignResident,
    residentEmail: assignResidentEmail,
    residentPhoneNo: assignResidentPhoneNo,
    checkIn: assignCheckInDate,
    checkOut: assignCheckOutDate,
    qrCodeImage: qrCodeImage  // ✅ Store QR from API
  })
  setShowQRModal(true)
}
```

### 3. Updated QR Modal Display

**File:** `app/partner/pages/room/page.tsx` - QR Code Modal

Replaced `QRCodeCanvas` with `<img>` tag displaying the API QR code:

```typescript
// NEW CODE (CORRECT)
{roomForQR?.qrCodeImage ? (
  // Display the QR code from API response (base64 image with JWT token)
  <img
    id="room-qr"
    src={roomForQR.qrCodeImage}
    alt="Guest QR Code"
    style={{
      width: '220px',
      height: '220px',
      objectFit: 'contain'
    }}
  />
) : (
  // Fallback: Show message if no QR code available
  <div>
    <p>No QR code available. Please assign a guest first.</p>
  </div>
)}
```

### 4. Updated Download Handler

**File:** `app/partner/pages/room/page.tsx` - `handleDownloadQR()`

Modified to download the base64 image directly:

```typescript
const handleDownloadQR = () => {
  if (!roomForQR) return;
  
  // Download QR code image from API (contains JWT token)
  if (roomForQR.qrCodeImage) {
    const downloadLink = document.createElement("a");
    downloadLink.href = roomForQR.qrCodeImage; // base64 image
    downloadLink.download = `${roomForQR.roomName || roomForQR.roomNumber || "room"}_QR.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else {
    alert('No QR code available to download. Please assign a guest first.');
  }
};
```

---

## How It Works Now

### Complete Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Partner Assigns Guest                                │
│    POST /api/partner/assign-room                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Backend Generates QR Code                            │
│    - Creates Guest document                             │
│    - Generates JWT token                                │
│    - Creates QR code PNG (base64) from token            │
│    - Returns: { qrCode: "data:image/png;base64..." }   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend Receives QR Code                            │
│    - Stores qrCodeImage in room state                   │
│    - Automatically opens QR modal                       │
│    - Displays API-generated QR code                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Partner Downloads/Shows QR Code                      │
│    - QR code contains JWT token                         │
│    - Guest can scan with Flutter app                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Guest Scans QR Code                                  │
│    - Flutter app extracts token from QR                 │
│    - Token format: "eyJhbGciOiJIUzI1NiIsInR5cCI..."    │
│    - Calls: POST /api/user/login-qr                     │
│    - Receives: Full guest data + token for future use  │
└─────────────────────────────────────────────────────────┘
```

---

## What's In the QR Code Now

### ✅ Correct QR Code (From API)

**Contains:** JWT Token String
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE3ODZiNzE5OTRiMDJhOTZlY2FmYmUiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJ1c2VyVHlwZSI6Imd1ZXN0IiwicGFydG5lcklkIjoiNjkwNTFhZjkxNjkwNDZhOWIyYTBiMDVmIiwicm9vbUlkIjoiNjkxNzg2NDkxOTk0YjAyYTk2ZWNhZmI4Iiwicm9vbU5hbWUiOiJSb29tIDEwMSIsImlhdCI6MTc2MzE0OTQ5NiwiZXhwIjoxNzYzNzU0Mjk2fQ.D7JPweWdRcd3cisvMaCnRSMXI2eCP4vVMekiOKJxpT8
```

**When Decoded:**
```json
{
  "userId": "691786b71994b02a96ecafbe",
  "email": "john@example.com",
  "role": "guest",
  "userType": "guest",
  "partnerId": "69051af9169046a9b2a0b05f",
  "roomId": "691786491994b02a96ecafb8",
  "roomName": "Room 101",
  "iat": 1763149496,
  "exp": 1763754296
}
```

**Can Be Used For:** Guest authentication and all guest APIs

---

### ❌ Old QR Code (Removed)

**Contained:** JSON String
```json
{
  "roomName": "Room 101",
  "resident": "John Doe",
  "residentEmail": "john@example.com",
  "residentPhoneNo": "+1234567890",
  "checkIn": "14 Nov 2025",
  "checkOut": "16 Nov 2025"
}
```

**Could NOT Be Used For:** Authentication (no token, just display data)

---

## User Experience Changes

### Before Fix

1. Partner assigns guest
2. Alert: "Guest assigned successfully! QR code generated."
3. Partner clicks "Room QR code" button
4. Modal shows QR with JSON data ❌
5. Guest scans → Sees JSON, cannot login

### After Fix

1. Partner assigns guest
2. **QR modal automatically opens** ✅
3. Modal shows QR with JWT token ✅
4. Partner can download/print QR
5. Guest scans → Gets token → Can login ✅

---

## Benefits

### 1. **Correct Authentication Flow** ✅
- QR code now contains JWT token
- Guest can successfully login with QR
- Token works for all guest APIs

### 2. **Better UX** ✅
- QR modal opens automatically after assignment
- No need to click "Room QR code" button
- Immediate feedback with QR code display

### 3. **Consistent Data** ✅
- One source of truth (API-generated QR)
- No duplicate QR generation
- Same QR code used everywhere

### 4. **Simplified Code** ✅
- Removed `QRCodeCanvas` dependency for this modal
- No frontend QR generation logic
- Direct display of API response

---

## Testing

### Test Case 1: Assign Guest & View QR

**Steps:**
1. Go to Rooms page
2. Click "Assign room" on an empty room
3. Fill in guest details
4. Click "Save"

**Expected:**
- ✅ QR modal opens automatically
- ✅ QR code is displayed
- ✅ QR code can be downloaded
- ✅ Scanning QR shows JWT token (long string)

### Test Case 2: Scan QR with JWT Decoder

**Steps:**
1. Download QR code
2. Scan with generic QR scanner
3. Copy token string
4. Go to jwt.io and paste token

**Expected:**
- ✅ Token decodes successfully
- ✅ Shows userId, partnerId, roomId
- ✅ Shows userType: "guest"
- ✅ Shows expiration date

### Test Case 3: Login with QR (Postman)

**Steps:**
1. Scan QR code → Get token
2. Call: `POST /api/user/login-qr`
3. Body: `{ "token": "scanned_token" }`

**Expected:**
- ✅ Status: 200
- ✅ Returns guest data with IDs
- ✅ Token can be used for housekeeping APIs

### Test Case 4: Room Without Guest

**Steps:**
1. Click "Room QR code" on empty room
2. View modal

**Expected:**
- ✅ Shows message: "No QR code available. Please assign a guest first."
- ✅ Download button shows alert

---

## Related Files

- `app/partner/pages/room/page.tsx` - Frontend room management page
- `controllers/GuestController.ts` - Backend guest assignment logic
- `app/api/partner/assign-room/route.ts` - Assignment API endpoint
- `app/api/user/login-qr/route.ts` - Guest login API endpoint

---

## Summary

The QR code system now works correctly:

1. ✅ Backend generates QR with JWT token
2. ✅ Frontend displays the API QR (not regenerating)
3. ✅ Guest scans QR → Gets token
4. ✅ Token works for authentication
5. ✅ All guest APIs accept the token

**No more confusion between JSON data QR and JWT token QR!**

