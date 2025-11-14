# API Quick Reference

## Guest/User APIs Summary

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/user/login-qr` | None | Login with QR code token |
| GET | `/api/user/profile` | Guest JWT | Get guest profile |

### Housekeeping Requests (Guest)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/housekeeping-requests` | Guest JWT | Create new request |
| GET | `/api/housekeeping-requests/my` | Guest JWT | Get my requests (paginated) |
| GET | `/api/housekeeping-requests/:id` | Guest JWT | Get single request details |
| PATCH | `/api/housekeeping-requests/:id/cancel` | Guest JWT | Cancel my request |

### Partner APIs (Guest Management)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/partner/assign-room` | Partner JWT | Assign guest to room, generate QR |
| POST | `/api/partner/checkout-guest` | Partner JWT | Checkout guest, deactivate access |

---

## Request/Response Examples

### 1. Assign Guest → Get QR Code
```javascript
POST /api/partner/assign-room
Headers: { Authorization: "Bearer PARTNER_TOKEN" }
Body: {
  "guestName": "John Doe",
  "guestEmail": "john@email.com",
  "roomId": "abc123",
  "roomName": "Deluxe 101"
}

Response: {
  "success": true,
  "data": {
    "userId": "user123",
    "token": "jwt_token_here",
    "qrCode": "data:image/png;base64,..." // Display this to guest
  }
}
```

### 2. Guest Scans QR → Login
```javascript
POST /api/user/login-qr
Body: { "token": "jwt_from_qr_code" }

Response: {
  "success": true,
  "data": {
    "userId": "user123",
    "partnerId": "hotel123",
    "roomId": "abc123",
    "roomName": "Deluxe 101",
    "guestName": "John Doe",
    "token": "same_token" // Store this in Flutter app
  }
}
```

### 3. Create Request (Custom Cleaning)
```javascript
POST /api/housekeeping-requests
Headers: { Authorization: "Bearer GUEST_TOKEN" }
Body: {
  "type": "custom cleaning",
  "cleaningType": "full room",
  "requestedFor": "2025-01-16 14:00",
  "priority": "urgent",
  "notes": "Please focus on bathroom"
}

Response: {
  "success": true,
  "message": "Housekeeping request created successfully",
  "data": { "request": {...} }
}
```

### 4. Create Request (Item Needed)
```javascript
POST /api/housekeeping-requests
Headers: { Authorization: "Bearer GUEST_TOKEN" }
Body: {
  "type": "item needed",
  "itemQuantity": 2,
  "deliveryDetail": {
    "deliveryMethod": "room service",
    "deliveryWindow": "12:00 PM - 12:30 PM"
  },
  "requestedFor": "Extra towels",
  "priority": "medium"
}
```

### 5. Get My Requests
```javascript
GET /api/housekeeping-requests/my?page=1&limit=20&status=new
Headers: { Authorization: "Bearer GUEST_TOKEN" }

Response: {
  "success": true,
  "data": {
    "requests": [...],
    "pagination": { "page": 1, "limit": 20, "total": 5, "pages": 1 }
  }
}
```

---

## Token Structure

### Guest JWT Payload
```json
{
  "userId": "507f1f77bcf86cd799439012",
  "email": "john@email.com",
  "role": "guest",
  "userType": "guest",
  "partnerId": "507f1f77bcf86cd799439010",
  "roomId": "507f1f77bcf86cd799439011",
  "roomName": "Deluxe 101",
  "iat": 1642348800,
  "exp": 1642953600
}
```

---

## Validation Rules

### Custom Cleaning Request
- `type`: Must be "custom cleaning"
- `cleaningType`: Required, one of ["full room", "quick refresh", "custom"]
- `requestedFor`: Required (string)
- `priority`: Optional ["urgent", "medium", "low"], default: "medium"
- `notes`: Optional (string)

### Item Needed Request
- `type`: Must be "item needed"
- `itemQuantity`: Required, must be > 0 (number)
- `deliveryDetail`: Required, must have `deliveryMethod` and `deliveryWindow`
- `requestedFor`: Required (string, describes the item)
- `priority`: Optional ["urgent", "medium", "low"], default: "medium"
- `notes`: Optional (string)

---

## Status Flow

```
Guest Creates Request
        ↓
    [status: new]
        ↓
Partner Assigns Staff
        ↓
  [status: accepted]
        ↓
   Staff Completes
        ↓
  [status: completed]
```

Alternative flows:
- Guest cancels → `status: canceled`
- Guest doesn't show → `status: no-show`

---

## Error Handling

```javascript
// Typical error response
{
  "success": false,
  "error": "Error message here"
}

// HTTP Status Codes
200 - Success
201 - Created
400 - Bad Request (validation error)
401 - Unauthorized (missing/invalid token)
403 - Forbidden (guest checked out or no permission)
404 - Not Found
500 - Server Error
```

---

## Files Created/Modified

### New Models
- `models/Guest.ts` - Guest user model

### Modified Models
- `models/Room.ts` - Added `assignedUserId` field
- `models/housekeeping/HousekeepingRequest.ts` - Added `userId` field

### New Controllers
- `controllers/GuestController.ts` - Guest management (assign, login, checkout)
- `controllers/UserHousekeepingController.ts` - Guest request operations

### Modified Core Files
- `lib/auth.ts` - Added guest token generation
- `lib/middleware.ts` - Added `withGuestAuth` middleware

### New API Routes
**Partner Routes:**
- `app/api/partner/assign-room/route.ts`
- `app/api/partner/checkout-guest/route.ts`

**Guest Routes:**
- `app/api/user/login-qr/route.ts`
- `app/api/user/profile/route.ts`
- `app/api/housekeeping-requests/route.ts`
- `app/api/housekeeping-requests/my/route.ts`
- `app/api/housekeeping-requests/[id]/route.ts`
- `app/api/housekeeping-requests/[id]/cancel/route.ts`

---

## Testing Checklist

### Partner Flow
- [ ] Partner can assign guest to room
- [ ] QR code is generated and returned
- [ ] Room status updates to "full"
- [ ] Guest record is created
- [ ] Partner can checkout guest
- [ ] Room status updates to "empty" on checkout

### Guest Flow
- [ ] Guest can login with QR token
- [ ] Token validation works correctly
- [ ] Guest profile is returned on login
- [ ] Guest can create custom cleaning request
- [ ] Guest can create item needed request
- [ ] Validation errors are caught
- [ ] Guest can view their own requests
- [ ] Pagination works on request list
- [ ] Guest can view single request details
- [ ] Guest can cancel their request
- [ ] Guest cannot cancel completed request

### Security
- [ ] Guest cannot access other guests' requests
- [ ] Checked-out guest cannot create requests
- [ ] Invalid tokens are rejected
- [ ] Partner token cannot access guest APIs
- [ ] Guest token cannot access partner APIs

---

## Environment Variables

Required in `.env`:
```
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://...
```

---

## Next.js API Route Structure

```
app/api/
├── partner/
│   ├── assign-room/
│   │   └── route.ts (POST)
│   ├── checkout-guest/
│   │   └── route.ts (POST)
│   └── housekeeping-requests/
│       └── ... (existing partner management)
├── user/
│   ├── login-qr/
│   │   └── route.ts (POST)
│   └── profile/
│       └── route.ts (GET)
└── housekeeping-requests/
    ├── route.ts (POST - guest create)
    ├── my/
    │   └── route.ts (GET - guest view own)
    └── [id]/
        ├── route.ts (GET - guest view single)
        └── cancel/
            └── route.ts (PATCH - guest cancel)
```

---

## Database Collections

### guests
```javascript
{
  _id: ObjectId,
  partnerId: String,
  roomId: String,
  roomName: String,
  guestName: String,
  guestEmail: String?,
  guestPhone: String?,
  isActive: Boolean,
  checkInDate: Date,
  checkOutDate: Date?,
  createdAt: Date,
  updatedAt: Date
}
```

### rooms (updated)
```javascript
{
  _id: ObjectId,
  partnerId: String,
  roomId: String,
  roomName: String,
  roomStatus: "full" | "empty",
  resident: String?,
  residentEmail: String?,
  residentPhoneNo: String?,
  assignedUserId: String?, // NEW
  checkInDate: Date?,
  checkOutDate: Date?,
  createdAt: Date,
  updatedAt: Date
}
```

### housekeepingrequests (updated)
```javascript
{
  _id: ObjectId,
  partnerId: String,
  roomId: String,
  roomName: String,
  userId: String?, // NEW
  guest: {
    name: String,
    email: String?
  },
  type: "custom cleaning" | "item needed",
  cleaningType: "full room" | "quick refresh" | "custom"?,
  itemQuantity: Number?,
  deliveryDetail: {
    deliveryMethod: String,
    deliveryWindow: String
  }?,
  requestedFor: String,
  status: "new" | "accepted" | "completed" | "no-show" | "canceled",
  priority: "urgent" | "medium" | "low",
  assignee: {
    name: String,
    staffId: String,
    profilePic: String?
  }?,
  notes: String?,
  createdAt: Date,
  updatedAt: Date
}
```

