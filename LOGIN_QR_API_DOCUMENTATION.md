# Login QR API Documentation

## Overview

The `/api/user/login-qr` endpoint authenticates guests using JWT tokens scanned from QR codes. This is the primary entry point for guests to access the hotel services through the Flutter mobile app.

---

## Endpoint

```
POST /api/user/login-qr
```

**Authentication:** None required (public endpoint - token validation in request body)

---

## Request

### Headers

```
Content-Type: application/json
```

### Body

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE3ODZiNzE5OTRiMDJhOTZlY2FmYmUiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJ1c2VyVHlwZSI6Imd1ZXN0IiwicGFydG5lcklkIjoiNjkwNTFhZjkxNjkwNDZhOWIyYTBiMDVmIiwicm9vbUlkIjoiNjkxNzg2NDkxOTk0YjAyYTk2ZWNhZmI4Iiwicm9vbU5hbWUiOiJSb29tIDEwMSIsImlhdCI6MTc2MzE0OTQ5NiwiZXhwIjoxNzYzNzU0Mjk2fQ.D7JPweWdRcd3cisvMaCnRSMXI2eCP4vVMekiOKJxpT8"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | ✅ Yes | JWT token string scanned from guest QR code |

---

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "691786b71994b02a96ecafbe",
    "partnerId": "69051af9169046a9b2a0b05f",
    "roomId": "691786491994b02a96ecafb8",
    "roomName": "Room 101",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "checkInDate": "2025-11-14T10:00:00.000Z",
    "checkOutDate": "2025-11-16T10:00:00.000Z",
    "isActive": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always `true` for successful responses |
| message | string | Human-readable success message |
| data.userId | string | Guest's unique ID (MongoDB ObjectId) |
| data.partnerId | string | Hotel/Partner ID |
| data.roomId | string | Room ID guest is assigned to |
| data.roomName | string | Room name/number (e.g., "Room 101") |
| data.guestName | string | Guest's full name |
| data.guestEmail | string \| null | Guest's email address |
| data.guestPhone | string \| null | Guest's phone number |
| data.checkInDate | string | ISO 8601 check-in timestamp |
| data.checkOutDate | string \| null | ISO 8601 checkout timestamp (null if not set) |
| data.isActive | boolean | Whether guest is currently checked in |
| data.token | string | Same JWT token (store for future API calls) |

---

### Error Responses

#### 400 Bad Request - Missing Token

```json
{
  "success": false,
  "error": "Token is required and must be a string"
}
```

#### 400 Bad Request - Invalid Token Format

```json
{
  "success": false,
  "error": "Invalid token format. Token must be a valid JWT."
}
```

#### 401 Unauthorized - Invalid/Expired Token

```json
{
  "success": false,
  "error": "Invalid or expired QR code token. Please get a new QR code from the front desk."
}
```

#### 401 Unauthorized - Wrong Token Type

```json
{
  "success": false,
  "error": "Invalid token type. This QR code is not for guest access."
}
```

#### 401 Unauthorized - Invalid Token Structure

```json
{
  "success": false,
  "error": "Invalid token structure. Missing required guest information."
}
```

#### 403 Forbidden - Guest Checked Out

```json
{
  "success": false,
  "error": "You have been checked out. This QR code is no longer valid."
}
```

#### 403 Forbidden - Room Assignment Changed

```json
{
  "success": false,
  "error": "Your room assignment has changed. Please get a new QR code from the front desk."
}
```

#### 403 Forbidden - Invalid Hotel

```json
{
  "success": false,
  "error": "Invalid hotel assignment. Please contact front desk."
}
```

#### 404 Not Found - Guest Not Found

```json
{
  "success": false,
  "error": "Guest record not found. Please contact front desk."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Failed to login with QR code"
}
```

---

## Validation Flow

The API performs comprehensive validation in the following order:

### 1. Request Validation
- ✅ Token field exists in request body
- ✅ Token is a string type
- ✅ Token has valid JWT format (3 parts separated by dots)

### 2. Token Validation
- ✅ JWT signature is valid (signed by server)
- ✅ Token hasn't expired (within 7-day validity)
- ✅ Token contains valid payload

### 3. Token Type Verification
- ✅ `userType` field equals "guest"
- ✅ Not a partner or admin token

### 4. Token Structure Validation
- ✅ Contains `userId` field
- ✅ Contains `partnerId` field
- ✅ Contains `roomId` field

### 5. Database Validation
- ✅ Guest record exists in database
- ✅ Guest is still active (not checked out)
- ✅ Room assignment matches token
- ✅ Partner/hotel assignment matches token

### 6. Success Response
- ✅ Return complete guest profile
- ✅ Return same token for storage

---

## Usage Examples

### Postman Example

```
POST http://localhost:3000/api/user/login-qr

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE3ODZiNzE5OTRiMDJhOTZlY2FmYmUiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJ1c2VyVHlwZSI6Imd1ZXN0IiwicGFydG5lcklkIjoiNjkwNTFhZjkxNjkwNDZhOWIyYTBiMDVmIiwicm9vbUlkIjoiNjkxNzg2NDkxOTk0YjAyYTk2ZWNhZmI4Iiwicm9vbU5hbWUiOiJSb29tIDEwMSIsImlhdCI6MTc2MzE0OTQ5NiwiZXhwIjoxNzYzNzU0Mjk2fQ.D7JPweWdRcd3cisvMaCnRSMXI2eCP4vVMekiOKJxpT8"
}
```

### Flutter/Dart Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final String baseUrl = 'https://your-api.com';
  final storage = FlutterSecureStorage();

  /// Login with QR code token
  Future<Map<String, dynamic>> loginWithQR(String token) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/user/login-qr'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'token': token,
        }),
      );

      final result = jsonDecode(response.body);

      if (response.statusCode == 200 && result['success']) {
        // Save guest data to secure storage
        await _saveGuestData(result['data']);
        return result;
      } else {
        throw Exception(result['error'] ?? 'Login failed');
      }
    } catch (e) {
      print('Login error: $e');
      rethrow;
    }
  }

  /// Save guest data to secure storage
  Future<void> _saveGuestData(Map<String, dynamic> data) async {
    await storage.write(key: 'guest_token', value: data['token']);
    await storage.write(key: 'user_id', value: data['userId']);
    await storage.write(key: 'partner_id', value: data['partnerId']);
    await storage.write(key: 'room_id', value: data['roomId']);
    await storage.write(key: 'room_name', value: data['roomName']);
    await storage.write(key: 'guest_name', value: data['guestName']);
    await storage.write(key: 'guest_email', value: data['guestEmail']);
    await storage.write(key: 'guest_phone', value: data['guestPhone']);
    await storage.write(key: 'check_in_date', value: data['checkInDate']);
    await storage.write(key: 'check_out_date', value: data['checkOutDate']);
  }

  /// Get stored guest token
  Future<String?> getGuestToken() async {
    return await storage.read(key: 'guest_token');
  }

  /// Complete QR scan and login flow
  Future<Map<String, dynamic>> scanAndLogin() async {
    // 1. Scan QR code
    String? scannedToken = await _scanQRCode();
    
    if (scannedToken == null || scannedToken.isEmpty) {
      throw Exception('No QR code scanned');
    }

    // 2. Login with scanned token
    return await loginWithQR(scannedToken);
  }

  /// Scan QR code (implement with your QR scanner package)
  Future<String?> _scanQRCode() async {
    // Use qr_code_scanner or mobile_scanner package
    // Return the scanned token string
    // Implementation depends on your QR scanner library
    throw UnimplementedError('Implement with your QR scanner');
  }
}
```

### cURL Example

```bash
curl -X POST https://your-api.com/api/user/login-qr \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTE3ODZiNzE5OTRiMDJhOTZlY2FmYmUiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJ1c2VyVHlwZSI6Imd1ZXN0IiwicGFydG5lcklkIjoiNjkwNTFhZjkxNjkwNDZhOWIyYTBiMDVmIiwicm9vbUlkIjoiNjkxNzg2NDkxOTk0YjAyYTk2ZWNhZmI4Iiwicm9vbU5hbWUiOiJSb29tIDEwMSIsImlhdCI6MTc2MzE0OTQ5NiwiZXhwIjoxNzYzNzU0Mjk2fQ.D7JPweWdRcd3cisvMaCnRSMXI2eCP4vVMekiOKJxpT8"
  }'
```

---

## Complete Guest Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Hotel assigns guest to room                         │
│    POST /api/partner/assign-room                        │
│    Returns: QR code with JWT token                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Guest scans QR code with Flutter app                │
│    Extracts token string from QR                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. App calls login-qr API                              │
│    POST /api/user/login-qr                             │
│    Body: { "token": "scanned_token" }                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. API validates token                                  │
│    ✓ JWT signature                                      │
│    ✓ Token expiration                                   │
│    ✓ User type = guest                                  │
│    ✓ Guest exists and active                           │
│    ✓ Room assignment valid                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Returns guest profile + token                       │
│    App stores token in secure storage                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Guest can now use other APIs                        │
│    POST /api/housekeeping-requests                     │
│    GET /api/housekeeping-requests/my                   │
│    All with: Authorization: Bearer <token>             │
└─────────────────────────────────────────────────────────┘
```

---

## Security Features

### 1. **JWT Signature Verification**
- Token must be signed by server's secret key
- Prevents token forgery

### 2. **Token Expiration**
- Tokens expire after 7 days
- Prevents indefinite token reuse

### 3. **User Type Validation**
- Only guest tokens accepted
- Prevents partner/admin tokens from accessing guest endpoints

### 4. **Active Status Check**
- Verifies guest hasn't been checked out
- Prevents access after checkout

### 5. **Room Assignment Verification**
- Checks room assignment matches token
- Prevents access if room changed

### 6. **Partner Verification**
- Checks hotel assignment matches token
- Prevents cross-hotel access

---

## Testing

### Test Case 1: Valid Token Login

**Request:**
```json
{
  "token": "valid_jwt_token_here"
}
```

**Expected:**
- Status: 200
- Returns complete guest profile
- `success: true`

---

### Test Case 2: Missing Token

**Request:**
```json
{}
```

**Expected:**
- Status: 400
- Error: "Token is required and must be a string"

---

### Test Case 3: Invalid JWT Format

**Request:**
```json
{
  "token": "not.a.valid.jwt.format"
}
```

**Expected:**
- Status: 400
- Error: "Invalid token format. Token must be a valid JWT."

---

### Test Case 4: Expired Token

**Request:**
```json
{
  "token": "expired_jwt_token"
}
```

**Expected:**
- Status: 401
- Error: "Invalid or expired QR code token..."

---

### Test Case 5: Partner Token (Wrong Type)

**Request:**
```json
{
  "token": "partner_jwt_token"
}
```

**Expected:**
- Status: 401
- Error: "Invalid token type. This QR code is not for guest access."

---

### Test Case 6: Checked Out Guest

**Request:**
```json
{
  "token": "token_for_checked_out_guest"
}
```

**Expected:**
- Status: 403
- Error: "You have been checked out. This QR code is no longer valid."

---

## Related APIs

- `POST /api/partner/assign-room` - Generate QR code for guest
- `POST /api/partner/checkout-guest` - Check out guest (deactivates token)
- `GET /api/user/profile` - Get current guest profile (requires guest token)
- `POST /api/housekeeping-requests` - Create housekeeping request (requires guest token)

---

## Code Structure

### Files

- **API Route:** `app/api/user/login-qr/route.ts`
- **Controller:** `controllers/GuestController.ts` (method: `loginWithQR`)
- **Auth Library:** `lib/auth.ts` (function: `verifyToken`)
- **Middleware:** `lib/middleware.ts` (function: `withGuestAuth`)
- **Guest Model:** `models/Guest.ts`

### Validation Layers

1. **Route Layer** (`route.ts`)
   - Request body validation
   - Token format validation
   - Error handling

2. **Controller Layer** (`GuestController.ts`)
   - JWT verification
   - Business logic validation
   - Database queries
   - Response formatting

3. **Auth Layer** (`lib/auth.ts`)
   - JWT signature verification
   - Expiration check
   - Payload extraction

---

## Best Practices

### For Frontend Developers

1. **Always store token securely**
   - Use Flutter Secure Storage
   - Never log tokens in production

2. **Handle all error cases**
   - Show user-friendly error messages
   - Provide guidance (e.g., "Contact front desk")

3. **Validate before calling API**
   - Check token is not empty
   - Check token format locally

4. **Cache guest data**
   - Store userId, roomId, etc. locally
   - Reduce API calls

### For Backend Developers

1. **Keep validation strict**
   - Don't skip any validation steps
   - Return specific error messages

2. **Log security events**
   - Failed login attempts
   - Token validation failures

3. **Monitor token usage**
   - Track login patterns
   - Detect anomalies

---

## Changelog

### v1.1 (Current)
- ✅ Enhanced validation with 8 security checks
- ✅ Improved error messages with user guidance
- ✅ Added partner verification
- ✅ Added token structure validation
- ✅ Better documentation and comments
- ✅ Comprehensive error handling

### v1.0 (Initial)
- ✅ Basic QR login functionality
- ✅ JWT token verification
- ✅ Guest authentication

---

## Support

For issues or questions:
- Check error message for guidance
- Verify token hasn't expired (7 days)
- Ensure guest hasn't been checked out
- Contact front desk for new QR code if needed

