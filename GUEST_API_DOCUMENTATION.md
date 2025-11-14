# Guest/User API Documentation

Complete backend implementation for guest authentication and housekeeping requests in the hotel management system.

## Table of Contents
1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Models](#models)
4. [API Endpoints](#api-endpoints)
5. [Usage Examples](#usage-examples)

---

## Overview

This system allows partners (hotels) to assign guests to rooms via QR codes. Guests can scan the QR code in their Flutter app to login and create housekeeping requests.

### Roles
- **Partner**: Hotel admin who assigns guests to rooms
- **Guest/User**: Hotel guest who can create housekeeping requests via mobile app

---

## Authentication Flow

### 1. Partner Assigns Guest to Room

Partner assigns a guest → Backend creates Guest record → Generates JWT token → Creates QR code → Partner displays QR to guest

### 2. Guest Scans QR and Logs In

Guest scans QR → Flutter extracts JWT token → Calls login API → Backend validates token → Returns guest profile

### 3. Guest Creates Requests

Guest uses JWT token for all requests → Backend validates token → Creates housekeeping request

---

## Models

### Guest Model
**File**: `models/Guest.ts`

```typescript
{
  _id: string;
  partnerId: string;        // Reference to hotel
  roomId: string;           // Reference to assigned room
  roomName: string;         // Room name (e.g., "Deluxe 101")
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  isActive: boolean;        // false when checked out
  checkInDate: Date;
  checkOutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Updated Room Model
**File**: `models/Room.ts`

Added field:
```typescript
assignedUserId: string | null;  // Reference to Guest._id
```

### Updated HousekeepingRequest Model
**File**: `models/housekeeping/HousekeepingRequest.ts`

Added field:
```typescript
userId?: string;  // Reference to Guest._id
```

---

## API Endpoints

### Partner APIs (Hotel Management)

#### 1. Assign Guest to Room
**POST** `/api/partner/assign-room`

**Auth**: Partner JWT (Bearer token)

**Request Body**:
```json
{
  "guestName": "John Doe",
  "guestEmail": "john@email.com",     // optional
  "guestPhone": "+1234567890",        // optional
  "roomId": "507f1f77bcf86cd799439011",
  "roomName": "Deluxe 101",
  "checkInDate": "2025-01-15",        // optional, defaults to now
  "checkOutDate": "2025-01-20"        // optional
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439012",
    "guestName": "John Doe",
    "guestEmail": "john@email.com",
    "roomId": "507f1f77bcf86cd799439011",
    "roomName": "Deluxe 101",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

**What Happens**:
1. Creates Guest record in database
2. Updates Room with guest assignment
3. Generates JWT token with guest info
4. Converts token to QR code (base64 PNG)
5. Returns everything to partner

**Partner Should**:
- Display QR code to guest (print or show on screen)
- Guest scans this QR with Flutter app

---

#### 2. Checkout Guest
**POST** `/api/partner/checkout-guest`

**Auth**: Partner JWT

**Request Body**:
```json
{
  "roomId": "507f1f77bcf86cd799439011"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Guest checked out successfully",
  "data": {
    "guestId": "507f1f77bcf86cd799439012",
    "guestName": "John Doe",
    "checkOutDate": "2025-01-20T10:30:00.000Z"
  }
}
```

**What Happens**:
1. Marks guest as inactive (`isActive: false`)
2. Clears room assignment
3. Guest's token becomes invalid for new requests

---

### Guest APIs (Flutter App)

#### 3. Login with QR Code
**POST** `/api/user/login-qr`

**Auth**: None (public endpoint)

**Request Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439012",
    "partnerId": "507f1f77bcf86cd799439010",
    "roomId": "507f1f77bcf86cd799439011",
    "roomName": "Deluxe 101",
    "guestName": "John Doe",
    "guestEmail": "john@email.com",
    "guestPhone": "+1234567890",
    "checkInDate": "2025-01-15T14:00:00.000Z",
    "checkOutDate": "2025-01-20T11:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Flutter Should**:
1. Scan QR code
2. Extract token from QR
3. Call this API with token
4. Store token locally (SecureStorage)
5. Use token for all future requests

---

#### 4. Get Guest Profile
**GET** `/api/user/profile`

**Auth**: Guest JWT (Bearer token)

**Response**:
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439012",
    "partnerId": "507f1f77bcf86cd799439010",
    "roomId": "507f1f77bcf86cd799439011",
    "roomName": "Deluxe 101",
    "guestName": "John Doe",
    "guestEmail": "john@email.com",
    "guestPhone": "+1234567890",
    "checkInDate": "2025-01-15T14:00:00.000Z",
    "checkOutDate": "2025-01-20T11:00:00.000Z"
  }
}
```

---

#### 5. Create Housekeeping Request
**POST** `/api/housekeeping-requests`

**Auth**: Guest JWT (Bearer token)

**Request Body (Custom Cleaning)**:
```json
{
  "type": "custom cleaning",
  "cleaningType": "full room",           // "full room" | "quick refresh" | "custom"
  "requestedFor": "2025-01-16 14:00",   // When cleaning is needed
  "priority": "urgent",                  // "urgent" | "medium" | "low"
  "notes": "Please focus on bathroom"    // optional
}
```

**Request Body (Item Needed)**:
```json
{
  "type": "item needed",
  "itemQuantity": 2,
  "deliveryDetail": {
    "deliveryMethod": "room service",
    "deliveryWindow": "12:00 PM - 12:30 PM"
  },
  "requestedFor": "Extra towels",       // What item is needed
  "priority": "medium",
  "notes": "Please bring large towels"  // optional
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Housekeeping request created successfully",
  "data": {
    "request": {
      "_id": "507f1f77bcf86cd799439013",
      "partnerId": "507f1f77bcf86cd799439010",
      "roomId": "507f1f77bcf86cd799439011",
      "roomName": "Deluxe 101",
      "userId": "507f1f77bcf86cd799439012",
      "guest": {
        "name": "John Doe",
        "email": "john@email.com"
      },
      "type": "item needed",
      "itemQuantity": 2,
      "deliveryDetail": {
        "deliveryMethod": "room service",
        "deliveryWindow": "12:00 PM - 12:30 PM"
      },
      "requestedFor": "Extra towels",
      "status": "new",
      "priority": "medium",
      "notes": "Please bring large towels",
      "createdAt": "2025-01-16T10:00:00.000Z",
      "updatedAt": "2025-01-16T10:00:00.000Z"
    }
  }
}
```

**What Happens**:
1. Validates guest token
2. Extracts `partnerId`, `roomId`, `userId` from token
3. Auto-fills guest name and email
4. Sets status to "new"
5. Creates request in database

---

#### 6. Get My Requests
**GET** `/api/housekeeping-requests/my`

**Auth**: Guest JWT (Bearer token)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status

**Example**:
```
GET /api/housekeeping-requests/my?page=1&limit=10&status=new
```

**Response**:
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "partnerId": "507f1f77bcf86cd799439010",
        "roomId": "507f1f77bcf86cd799439011",
        "roomName": "Deluxe 101",
        "userId": "507f1f77bcf86cd799439012",
        "guest": {
          "name": "John Doe",
          "email": "john@email.com"
        },
        "type": "item needed",
        "status": "new",
        "priority": "medium",
        "createdAt": "2025-01-16T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

#### 7. Get Single Request Details
**GET** `/api/housekeeping-requests/:id`

**Auth**: Guest JWT (Bearer token)

**Response**:
```json
{
  "success": true,
  "data": {
    "request": {
      "_id": "507f1f77bcf86cd799439013",
      "partnerId": "507f1f77bcf86cd799439010",
      "roomId": "507f1f77bcf86cd799439011",
      "roomName": "Deluxe 101",
      "userId": "507f1f77bcf86cd799439012",
      "guest": {
        "name": "John Doe",
        "email": "john@email.com"
      },
      "type": "item needed",
      "itemQuantity": 2,
      "deliveryDetail": {
        "deliveryMethod": "room service",
        "deliveryWindow": "12:00 PM - 12:30 PM"
      },
      "requestedFor": "Extra towels",
      "status": "accepted",
      "priority": "medium",
      "assignee": {
        "name": "Staff Member",
        "staffId": "507f1f77bcf86cd799439014",
        "profilePic": "https://..."
      },
      "notes": "Please bring large towels",
      "createdAt": "2025-01-16T10:00:00.000Z",
      "updatedAt": "2025-01-16T10:15:00.000Z"
    }
  }
}
```

---

#### 8. Cancel Request
**PATCH** `/api/housekeeping-requests/:id/cancel`

**Auth**: Guest JWT (Bearer token)

**Response**:
```json
{
  "success": true,
  "message": "Request canceled successfully",
  "data": {
    "request": {
      "_id": "507f1f77bcf86cd799439013",
      "status": "canceled",
      "updatedAt": "2025-01-16T10:30:00.000Z"
    }
  }
}
```

**Rules**:
- Guest can only cancel their own requests
- Cannot cancel completed requests
- Cannot cancel already canceled requests

---

### Partner Management APIs (Existing - Enhanced)

#### 9. Get All Requests (Partner View)
**GET** `/api/partner/housekeeping-requests`

**Auth**: Partner JWT

**Query Parameters**:
- `page`, `limit`, `status`, `type`, `priority`, `roomId`

Partner can see all requests for their hotel, including `userId` field.

---

#### 10. Assign Staff to Request
**PATCH** `/api/partner/housekeeping-requests/:id/assign`

**Auth**: Partner JWT

**Request Body**:
```json
{
  "staffId": "507f1f77bcf86cd799439014",
  "name": "Staff Member",
  "profilePic": "https://..."
}
```

Updates request status to "accepted" and assigns staff.

---

#### 11. Update Request Status
**PATCH** `/api/partner/housekeeping-requests/:id/status`

**Auth**: Partner JWT

**Request Body**:
```json
{
  "status": "completed"
}
```

Valid statuses: `new`, `accepted`, `completed`, `no-show`, `canceled`

---

## Usage Examples

### Flutter App Flow

#### 1. QR Login Flow

```dart
// After scanning QR code
Future<void> loginWithQR(String qrToken) async {
  final response = await http.post(
    Uri.parse('https://your-api.com/api/user/login-qr'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'token': qrToken}),
  );

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    
    // Store token securely
    await secureStorage.write(
      key: 'guest_token',
      value: data['data']['token'],
    );
    
    // Store user info
    final user = data['data'];
    print('Logged in as: ${user['guestName']}');
    print('Room: ${user['roomName']}');
    
    // Navigate to home
    Navigator.pushReplacementNamed(context, '/home');
  }
}
```

#### 2. Create Request

```dart
Future<void> createHousekeepingRequest() async {
  final token = await secureStorage.read(key: 'guest_token');
  
  final response = await http.post(
    Uri.parse('https://your-api.com/api/housekeeping-requests'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'type': 'item needed',
      'itemQuantity': 2,
      'deliveryDetail': {
        'deliveryMethod': 'room service',
        'deliveryWindow': '12:00 PM - 12:30 PM',
      },
      'requestedFor': 'Extra towels',
      'priority': 'medium',
      'notes': 'Please bring large towels',
    }),
  );

  if (response.statusCode == 201) {
    print('Request created successfully!');
  }
}
```

#### 3. Get My Requests

```dart
Future<List<Request>> fetchMyRequests() async {
  final token = await secureStorage.read(key: 'guest_token');
  
  final response = await http.get(
    Uri.parse('https://your-api.com/api/housekeeping-requests/my?page=1&limit=20'),
    headers: {
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    return (data['data']['requests'] as List)
        .map((r) => Request.fromJson(r))
        .toList();
  }
  
  return [];
}
```

---

## Security Features

1. **Token Expiration**: JWT tokens expire after 7 days (configurable)
2. **Guest Isolation**: Guests can only access their own requests
3. **Active Guest Check**: Inactive guests cannot create/access requests
4. **Room Verification**: Backend verifies room assignment matches token
5. **Partner Isolation**: Partners can only manage their own hotel's data

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Guest checked out or permission denied |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Contact support |

---

## Testing with Postman/cURL

### Partner Assigns Guest

```bash
curl -X POST https://your-api.com/api/partner/assign-room \
  -H "Authorization: Bearer PARTNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "guestName": "John Doe",
    "guestEmail": "john@email.com",
    "roomId": "507f1f77bcf86cd799439011",
    "roomName": "Deluxe 101"
  }'
```

### Guest Login with QR

```bash
curl -X POST https://your-api.com/api/user/login-qr \
  -H "Content-Type: application/json" \
  -d '{
    "token": "GUEST_TOKEN_FROM_QR"
  }'
```

### Guest Creates Request

```bash
curl -X POST https://your-api.com/api/housekeeping-requests \
  -H "Authorization: Bearer GUEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "item needed",
    "itemQuantity": 2,
    "deliveryDetail": {
      "deliveryMethod": "room service",
      "deliveryWindow": "12:00 PM - 12:30 PM"
    },
    "requestedFor": "Extra towels",
    "priority": "medium"
  }'
```

---

## Database Indexes

For optimal performance, the following indexes are created:

**Guest Collection**:
- `partnerId + isActive`
- `roomId + isActive`
- `guestEmail`

**HousekeepingRequest Collection**:
- `partnerId`
- `userId`
- `status`
- `createdAt` (descending)

**Room Collection**:
- `partnerId`
- `partnerId + roomId` (unique)

---

## Next Steps

1. **Implement in Flutter**:
   - QR code scanner
   - Login screen
   - Request creation form
   - Request list view
   
2. **Partner Dashboard**:
   - Display QR codes for guests
   - Manage guest assignments
   - View and manage requests

3. **Notifications** (Future):
   - Push notifications when request status changes
   - Email notifications for partners

---

## Support

For issues or questions, contact the development team.

