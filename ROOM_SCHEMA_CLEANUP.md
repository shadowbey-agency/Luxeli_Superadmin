# Room Schema Cleanup - Remove Redundant Guest Fields

## Summary
Cleaned up the Room model by removing redundant guest-related fields since we now use the dedicated Guest model for storing guest information. This eliminates data duplication and follows proper database normalization.

## Changes Made

### 1. Updated Room Schema (models/Room.ts)

#### Removed Fields
- ❌ `resident: string | null` - Guest name (now in Guest model)
- ❌ `residentEmail: string | null` - Guest email (now in Guest model)
- ❌ `residentPhoneNo: string | null` - Guest phone (now in Guest model)
- ❌ `assignedUserId: string | null` - Guest ID (now in Guest model)
- ❌ `checkInDate: Date | null` - Check-in date (now in Guest model)
- ❌ `checkInTime: string | null` - Check-in time (now in Guest model)
- ❌ `checkOutDate: Date | null` - Check-out date (now in Guest model)
- ❌ `checkOutTime: string | null` - Check-out time (now in Guest model)

#### Kept Fields
- ✅ `partnerId: string` - Hotel/Partner reference
- ✅ `roomId: string` - Auto-generated room ID (#01, #02, etc.)
- ✅ `roomName: string` - Room name/number
- ✅ `roomStatus: "full" | "empty"` - Room availability status
- ✅ `createdAt: Date` - Timestamp
- ✅ `updatedAt: Date` - Timestamp

### 2. Updated RoomController (controllers/partner/RoomController.ts)

#### Modified Methods

**createRoom(partnerId, body)**
- Before: Accepted resident, residentEmail, residentPhoneNo, checkInDate, checkInTime, checkOutDate, checkOutTime
- After: Only accepts roomName and roomStatus
- Simplified from 40+ lines to 20 lines

**updateRoom(id, body)**
- Before: Could update all guest-related fields
- After: Only updates roomName and roomStatus
- Removed 8 unnecessary field updates

**updateRoomByName(originalRoomName, body)**
- Before: Could update all guest-related fields
- After: Only updates roomName and roomStatus
- Removed 8 unnecessary field updates

#### Removed Methods
- ❌ `assignRoom(id, body)` - Deprecated (use GuestController.assignRoom instead)
- ❌ `unassignRoom(id)` - Deprecated (use GuestController.checkoutGuest instead)

### 3. Updated GuestController (controllers/GuestController.ts)

#### Modified Methods

**assignRoom(partnerId, data)**
- Before: Updated 8 fields in Room model
- After: Only updates `roomStatus: 'full'`
- Guest info stays in Guest model only

**checkoutGuest(partnerId, roomId)**
- Before: Cleared 8 fields in Room model
- After: Only updates `roomStatus: 'empty'`
- Guest remains in database with `isActive: false`

### 4. Removed API Routes

Deleted deprecated room assignment endpoints:
- ❌ `POST /api/partner/rooms/[id]/assign` - Use `/api/partner/assign-room` instead
- ❌ `POST /api/partner/rooms/[id]/unassign` - Use `/api/partner/checkout-guest` instead

## Data Models After Cleanup

### Room Model (Simplified)
```typescript
{
  _id: string;
  partnerId: string;
  roomId: string;        // "#01", "#02", etc.
  roomName: string;
  roomStatus: "full" | "empty";
  createdAt: Date;
  updatedAt: Date;
}
```

### Guest Model (Complete Guest Info)
```typescript
{
  _id: string;
  partnerId: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  isActive: boolean;
  checkInDate: Date;
  checkOutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Behavior After Changes

### Room Management APIs
- `POST /api/partner/rooms` - Create room (roomName, roomStatus only)
- `GET /api/partner/rooms` - List all rooms
- `GET /api/partner/rooms/[id]` - Get room details
- `PATCH /api/partner/rooms/[id]` - Update room (roomName, roomStatus only)
- `DELETE /api/partner/rooms/[id]` - Delete room

### Guest Management APIs (Unchanged)
- `POST /api/partner/assign-room` - Assign guest to room + generate QR code
- `POST /api/partner/checkout-guest` - Checkout guest
- `POST /api/user/login-qr` - Guest login via QR code
- `GET /api/user/profile` - Get guest profile

### What Changed
1. Creating a room no longer requires guest information
2. Updating a room no longer allows modifying guest information
3. Guest assignment is handled exclusively through GuestController
4. Room model only tracks availability status

## Benefits

### 1. Data Normalization
- Guest information stored in one place (Guest model)
- No duplication between Room and Guest models
- Single source of truth for guest data

### 2. Simplified Room Management
- Room CRUD operations are simpler
- No need to update multiple fields for room status
- Clearer separation of concerns

### 3. Better Data Integrity
- Guest history is preserved in Guest model
- Room status updates are atomic
- No risk of inconsistent data between models

### 4. Easier Maintenance
- Less code to maintain
- Fewer fields to validate
- Clearer API contracts

## Migration Notes

### For Existing Data
⚠️ **Important**: Existing rooms in the database may have guest-related fields populated. These fields will be ignored but not automatically deleted.

To clean up existing data (optional):
```javascript
// MongoDB shell or migration script
db.rooms.updateMany(
  {},
  {
    $unset: {
      resident: "",
      residentEmail: "",
      residentPhoneNo: "",
      assignedUserId: "",
      checkInDate: "",
      checkInTime: "",
      checkOutDate: "",
      checkOutTime: ""
    }
  }
);
```

### For Frontend/UI
- Remove guest-related fields from room creation forms
- Remove guest-related fields from room edit forms
- Use Guest model data for displaying guest information
- Use `POST /api/partner/assign-room` for guest assignment
- Use `POST /api/partner/checkout-guest` for checkout

## Testing Checklist

- [ ] Create room without guest information
- [ ] Update room name and status only
- [ ] Assign guest to room via `/api/partner/assign-room`
- [ ] Verify room status changes to "full"
- [ ] Verify guest data is in Guest model only
- [ ] Checkout guest via `/api/partner/checkout-guest`
- [ ] Verify room status changes to "empty"
- [ ] Verify guest remains in database with `isActive: false`
- [ ] Old room assignment endpoints return 404

## Before vs After Comparison

### Before: Creating a Room
```typescript
POST /api/partner/rooms
{
  "roomName": "Room 101",
  "roomStatus": "full",
  "resident": "John Doe",
  "residentEmail": "john@example.com",
  "residentPhoneNo": "+1234567890",
  "checkInDate": "2025-11-14",
  "checkInTime": "14:00",
  "checkOutDate": "2025-11-16",
  "checkOutTime": "11:00"
}
```

### After: Creating a Room
```typescript
POST /api/partner/rooms
{
  "roomName": "Room 101",
  "roomStatus": "empty"  // or "full"
}

// Separate step: Assign guest
POST /api/partner/assign-room
{
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "roomId": "room_id_here",
  "roomName": "Room 101",
  "checkInDate": "2025-11-14",
  "checkOutDate": "2025-11-16"
}
```

## Summary

The Room model is now focused solely on room information and availability status. Guest information is managed through the dedicated Guest model, providing better data organization, integrity, and maintainability.

All guest assignment and checkout operations should use:
- `POST /api/partner/assign-room` - For assigning guests
- `POST /api/partner/checkout-guest` - For checking out guests

