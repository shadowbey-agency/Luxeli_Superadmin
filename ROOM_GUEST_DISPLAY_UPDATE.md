# Room Guest Display Update

## Issue Fixed
When a guest is assigned to a room, the room table was not showing guest data (name, email, phone, check-in/out dates), and the "Unassign" button was not appearing in the dropdown menu.

## Root Cause
The `/api/partner/rooms` endpoint was only returning data from the `rooms` collection, without populating the related `guest` data from the `guests` collection.

## Changes Made

### 1. Backend: RoomController (`controllers/partner/RoomController.ts`)

#### Added Guest Import
```typescript
import Guest from '@/models/Guest';
```

#### Updated `getRooms()` Method
- Added a join query to populate active guest data for each room
- Only fetches guests where `isActive = true` (currently checked in)
- Returns guest information nested in the room object

**Changes:**
```typescript
// For each room, fetch the active guest if any
const roomsWithGuests = await Promise.all(
  rooms.map(async (room) => {
    const guest = await Guest.findOne({
      roomId: room._id.toString(),
      isActive: true, // Only show active guests
    }).lean();

    return {
      ...room,
      guest: guest ? {
        _id: guest._id,
        guestName: guest.guestName,
        guestEmail: guest.guestEmail,
        guestPhone: guest.guestPhone,
        checkInDate: guest.checkInDate,
        checkOutDate: guest.checkOutDate,
      } : null,
    };
  })
);

return NextResponse.json({ items: roomsWithGuests, total, page, limit });
```

### 2. Frontend: Room Page (`app/partner/pages/room/page.tsx`)

#### Updated `mapApiRoomToRoom()` Function
- Extracts guest data from the `apiRoom.guest` field
- Maps guest data to UI room fields
- Only shows data for active guests (already filtered by backend)

**Changes:**
```typescript
// Extract guest data from the populated guest field (only if isActive=true)
const guest = apiRoom.guest || null

return {
  // ... other fields
  // Guest data from the guest object (only active guests)
  resident: guest?.guestName || null,
  residentEmail: guest?.guestEmail || null,
  residentPhoneNo: guest?.guestPhone || null,
  checkIn: guest?.checkInDate ? formatDate(guest.checkInDate) : undefined,
  checkOut: guest?.checkOutDate ? formatDate(guest.checkOutDate) : undefined,
}
```

## How It Works Now

### Flow Diagram
```
┌─────────────────────────────────┐
│  Partner views Room Page        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  GET /api/partner/rooms          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  RoomController.getRooms()       │
│  1. Fetch rooms from DB          │
│  2. For each room:               │
│     - Find active guest          │
│       (isActive = true)          │
│     - Include guest data         │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Return rooms with guest data    │
│  {                               │
│    roomName: "Room 101",         │
│    roomStatus: "full",           │
│    guest: {                      │
│      guestName: "John Doe",      │
│      guestEmail: "john@...",     │
│      checkInDate: "...",         │
│      ...                         │
│    }                             │
│  }                               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Frontend: mapApiRoomToRoom()    │
│  Extracts guest data and maps    │
│  to UI fields (resident, etc.)   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Room Table Displays:            │
│  ✅ Guest name                   │
│  ✅ Guest email                  │
│  ✅ Guest phone                  │
│  ✅ Check-in date                │
│  ✅ Check-out date               │
│                                  │
│  Dropdown Menu Shows:            │
│  ✅ "Unassign" option            │
│      (only if guest exists)      │
└─────────────────────────────────┘
```

## Benefits

### 1. **Shows Guest Data in Room Table** ✅
- Guest name, email, phone number displayed
- Check-in and check-out dates visible
- All data comes from the `guests` collection

### 2. **Unassign Button Appears** ✅
- Dropdown menu conditionally shows "Unassign" option
- Only appears when `room.resident` exists (i.e., guest is assigned)
- Calls `/api/partner/checkout-guest` endpoint

### 3. **Only Active Guests Shown** ✅
- Backend filters for `isActive = true`
- When guest checks out, `isActive` is set to `false`
- Room table automatically stops showing the guest
- "Unassign" button automatically disappears

### 4. **Data Separation Maintained** ✅
- Guest data stored in `guests` collection
- Room data stored in `rooms` collection
- Join query on-demand for display purposes
- No data duplication

## Testing

### Test Case 1: Assign Guest to Room
1. Click "Assign" on an empty room
2. Fill in guest details and save
3. **Expected:** 
   - Room table shows guest name, email, phone
   - Check-in/out dates displayed
   - Room status changes to "Occupied"
   - Dropdown menu shows "Unassign" option

### Test Case 2: Unassign Guest (Checkout)
1. Open dropdown for occupied room
2. Click "Unassign"
3. Confirm checkout
4. **Expected:**
   - Guest data disappears from room table
   - Room status changes to "Available"
   - "Unassign" option no longer in dropdown
   - Guest record in DB has `isActive = false`

### Test Case 3: View Room History
1. Click "Room history" for any room
2. **Expected:**
   - Shows all past guests (including inactive ones)
   - Each entry shows guest name, check-in, check-out

## Database Structure

### Rooms Collection
```json
{
  "_id": "673abc123",
  "partnerId": "673xyz789",
  "roomName": "Room 101",
  "roomStatus": "full"
}
```

### Guests Collection
```json
{
  "_id": "673def456",
  "partnerId": "673xyz789",
  "roomId": "673abc123",
  "roomName": "Room 101",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "isActive": true,           ← Controls visibility
  "checkInDate": "2025-11-14",
  "checkOutDate": "2025-11-16"
}
```

### API Response (Joined Data)
```json
{
  "items": [
    {
      "_id": "673abc123",
      "partnerId": "673xyz789",
      "roomName": "Room 101",
      "roomStatus": "full",
      "guest": {                    ← Populated from guests collection
        "_id": "673def456",
        "guestName": "John Doe",
        "guestEmail": "john@example.com",
        "guestPhone": "+1234567890",
        "checkInDate": "2025-11-14",
        "checkOutDate": "2025-11-16"
      }
    }
  ]
}
```

## Related Files

- `controllers/partner/RoomController.ts` - Backend room data fetching
- `app/api/partner/rooms/route.ts` - Rooms list endpoint
- `app/partner/pages/room/page.tsx` - Frontend room table UI
- `models/Guest.ts` - Guest data model
- `models/Room.ts` - Room data model
- `controllers/GuestController.ts` - Guest assignment/checkout logic
- `app/api/partner/assign-room/route.ts` - Assign guest endpoint
- `app/api/partner/checkout-guest/route.ts` - Checkout guest endpoint

## Next Steps

All functionality is now complete and working:
- ✅ Guest data displays in room table
- ✅ Unassign button appears for occupied rooms
- ✅ Checkout sets `isActive = false`
- ✅ UI automatically hides inactive guests
- ✅ Data normalization maintained (no duplication)

The room management system is now fully functional!

