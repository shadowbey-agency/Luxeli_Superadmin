# Partner Dashboard Integration Guide

Guide for integrating guest management and QR code features into the partner web dashboard.

---

## 🎯 New Features for Partner Dashboard

### 1. Room Assignment with QR Code Generation
### 2. Guest Management
### 3. Enhanced Request Tracking

---

## 📱 Feature 1: Assign Guest to Room

### UI Location
Add to: **Room Management Page** (`app/partner/pages/room/page.tsx`)

### New Button/Modal
When partner clicks on an empty room, add new option:
- **"Assign Guest"** button

### Modal Design

```
┌─────────────────────────────────────────┐
│   Assign Guest to Room Deluxe 101       │
├─────────────────────────────────────────┤
│                                         │
│  Guest Name: *                          │
│  ┌─────────────────────────────────┐   │
│  │ John Doe                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Guest Email: (optional)                │
│  ┌─────────────────────────────────┐   │
│  │ john@email.com                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Guest Phone: (optional)                │
│  ┌─────────────────────────────────┐   │
│  │ +1234567890                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Check-in Date: (optional, default now) │
│  ┌─────────────────────────────────┐   │
│  │ 2025-01-15                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Check-out Date: (optional)             │
│  ┌─────────────────────────────────┐   │
│  │ 2025-01-20                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Cancel]  [Assign & Generate QR]      │
└─────────────────────────────────────────┘
```

### Implementation

```typescript
// In room page component
const [showAssignGuestModal, setShowAssignGuestModal] = useState(false);
const [roomToAssign, setRoomToAssign] = useState<Room | null>(null);
const [qrCodeResult, setQrCodeResult] = useState<string | null>(null);

const handleAssignGuest = async (data: {
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkInDate?: string;
  checkOutDate?: string;
}) => {
  try {
    const token = getAuthToken();
    const response = await fetch('/api/partner/assign-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        roomId: roomToAssign._id,
        roomName: roomToAssign.roomName,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Show QR code to partner
      setQrCodeResult(result.data.qrCode); // base64 image
      
      // Refresh rooms list
      await fetchRooms();
      
      // Show success message
      alert('Guest assigned successfully! Display QR code to guest.');
    }
  } catch (error) {
    console.error('Failed to assign guest:', error);
  }
};
```

### QR Code Display Modal

After successful assignment, show QR code:

```
┌─────────────────────────────────────────┐
│   Guest QR Code - Deluxe 101            │
├─────────────────────────────────────────┤
│                                         │
│  Guest: John Doe                        │
│  Email: john@email.com                  │
│  Room: Deluxe 101                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │    [QR CODE IMAGE HERE]         │   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Show this QR code to the guest.        │
│  They can scan it with the mobile app.  │
│                                         │
│  [Download QR]  [Print]  [Close]       │
└─────────────────────────────────────────┘
```

Implementation:
```tsx
{qrCodeResult && (
  <div className="modal">
    <div className="modal-content">
      <h2>Guest QR Code</h2>
      <div>
        <p>Guest: {guestName}</p>
        <p>Room: {roomName}</p>
      </div>
      <img 
        src={qrCodeResult} 
        alt="Guest QR Code"
        style={{ width: 300, height: 300 }}
      />
      <p>Show this QR code to the guest.</p>
      <button onClick={() => downloadQR(qrCodeResult)}>
        Download QR
      </button>
      <button onClick={() => window.print()}>
        Print
      </button>
      <button onClick={() => setQrCodeResult(null)}>
        Close
      </button>
    </div>
  </div>
)}
```

---

## 📋 Feature 2: Guest Management Page

### New Page: Guest List
**Path**: `app/partner/pages/guests/page.tsx`

Add to sidebar navigation:
- Icon: User icon
- Label: "Guests"
- Path: `/partner/pages/guests`

### Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  Guests                                    [+ New Guest] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Filters:                                                │
│  [Active ▼] [Room ▼] [Search...]                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Guest Name  │ Room     │ Email        │ Status  │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ John Doe    │ DLX 101  │ john@...     │ Active  │   │
│  │ Jane Smith  │ DLX 102  │ jane@...     │ Active  │   │
│  │ Bob Johnson │ STD 201  │ bob@...      │ Checked │   │
│  │                                         Out      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  < Previous | Page 1 of 3 | Next >                      │
└─────────────────────────────────────────────────────────┘
```

### API Integration

```typescript
// Fetch active guests
const fetchGuests = async () => {
  const token = getAuthToken();
  const response = await fetch('/api/partner/guests', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  setGuests(data.data.guests);
};

// Note: You'll need to create this API route
// GET /api/partner/guests
// Returns list of guests for this partner
```

### Create Guest API (if needed)

**File**: `app/api/partner/guests/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware';
import connectDB from '@/lib/db';
import Guest from '@/models/Guest';

export const GET = withAuth(async (request: AuthenticatedRequest) => {
  const partnerId = getPartnerId(request);
  if (!partnerId) {
    return NextResponse.json({ error: 'Partner ID not found' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const isActive = searchParams.get('isActive');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  await connectDB();

  const filter: any = { partnerId };
  if (isActive !== null) {
    filter.isActive = isActive === 'true';
  }

  const guests = await Guest.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Guest.countDocuments(filter);

  return NextResponse.json({
    success: true,
    data: {
      guests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
});
```

---

## 🏠 Feature 3: Enhanced Room List

### Update Room Cards

Add guest information to room cards:

**Before**:
```
┌─────────────────┐
│ Deluxe 101      │
│ Status: Full    │
└─────────────────┘
```

**After**:
```
┌─────────────────────────┐
│ Deluxe 101              │
│ Status: Full            │
│ Guest: John Doe         │
│ Check-in: Jan 15        │
│ [View Requests]         │
│ [Checkout]              │
└─────────────────────────┘
```

### Fetch Room with Guest Info

Modify existing room fetch to include guest data:

```typescript
// In RoomController or create new endpoint
const room = await Room.findById(roomId).lean();
const guest = await Guest.findById(room.assignedUserId).lean();

return {
  ...room,
  guest: guest ? {
    id: guest._id,
    name: guest.guestName,
    email: guest.guestEmail,
    checkInDate: guest.checkInDate,
  } : null,
};
```

---

## 🔔 Feature 4: Request Management Updates

### Enhanced Request List

Add guest column to housekeeping requests:

```
┌──────────────────────────────────────────────────────────┐
│ Housekeeping Requests                                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Room    │ Guest      │ Type           │ Status  │ Action │
├──────────────────────────────────────────────────────────┤
│ DLX 101 │ John Doe   │ Item Needed    │ New     │ [...]  │
│ DLX 102 │ Jane Smith │ Custom Clean   │ Accept  │ [...]  │
│ STD 201 │ Bob J.     │ Item Needed    │ Compl.  │ [...]  │
└──────────────────────────────────────────────────────────┘
```

### Display Guest Info in Request Details

```tsx
<div className="request-detail">
  <h3>Request #{request._id}</h3>
  
  <div className="guest-info">
    <h4>Guest Information</h4>
    <p>Name: {request.guest.name}</p>
    <p>Email: {request.guest.email}</p>
    <p>Room: {request.roomName}</p>
  </div>
  
  <div className="request-info">
    <h4>Request Details</h4>
    <p>Type: {request.type}</p>
    <p>Status: {request.status}</p>
    <p>Priority: {request.priority}</p>
    {/* ... rest of details */}
  </div>
</div>
```

---

## 🎨 UI Components to Create

### 1. AssignGuestModal Component

```typescript
interface AssignGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  onSuccess: (qrCode: string, guestInfo: any) => void;
}

export function AssignGuestModal({
  isOpen,
  onClose,
  room,
  onSuccess,
}: AssignGuestModalProps) {
  // Form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      const response = await fetch('/api/partner/assign-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestPhone,
          roomId: room._id,
          roomName: room.roomName,
          checkInDate,
          checkOutDate,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to assign guest');
      }

      onSuccess(result.data.qrCode, result.data);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Assign Guest to {room.roomName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Guest Name *</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Guest Email</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Guest Phone</label>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Check-out Date</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Assigning...' : 'Assign & Generate QR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 2. QRCodeDisplayModal Component

```typescript
interface QRCodeDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string; // base64 image
  guestName: string;
  roomName: string;
}

export function QRCodeDisplayModal({
  isOpen,
  onClose,
  qrCode,
  guestName,
  roomName,
}: QRCodeDisplayModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${roomName}-${guestName}.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow?.document.write(`
      <html>
        <head>
          <title>Guest QR Code</title>
          <style>
            body { text-align: center; font-family: Arial; padding: 20px; }
            img { width: 300px; height: 300px; }
          </style>
        </head>
        <body>
          <h2>Guest QR Code</h2>
          <p>Guest: ${guestName}</p>
          <p>Room: ${roomName}</p>
          <img src="${qrCode}" alt="QR Code" />
          <p>Scan this code with the mobile app</p>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal qr-modal">
        <h2>Guest QR Code</h2>
        <div className="guest-info">
          <p><strong>Guest:</strong> {guestName}</p>
          <p><strong>Room:</strong> {roomName}</p>
        </div>
        <div className="qr-container">
          <img src={qrCode} alt="Guest QR Code" />
        </div>
        <p className="instructions">
          Show this QR code to the guest. They can scan it with the mobile app to login.
        </p>
        <div className="modal-actions">
          <button onClick={handleDownload}>Download QR</button>
          <button onClick={handlePrint}>Print</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
```

### 3. CheckoutGuestButton Component

```typescript
interface CheckoutGuestButtonProps {
  roomId: string;
  guestName: string;
  onSuccess: () => void;
}

export function CheckoutGuestButton({
  roomId,
  guestName,
  onSuccess,
}: CheckoutGuestButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!confirm(`Checkout ${guestName}?`)) return;

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch('/api/partner/checkout-guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Guest checked out successfully!');
        onSuccess();
      } else {
        alert('Failed to checkout guest: ' + result.error);
      }
    } catch (error) {
      alert('Error checking out guest');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className="btn-checkout"
    >
      {isLoading ? 'Checking out...' : 'Checkout Guest'}
    </button>
  );
}
```

---

## 📊 Dashboard Statistics

Add new stat cards to partner dashboard:

```tsx
<div className="stats-grid">
  <StatCard
    title="Active Guests"
    value={activeGuestsCount}
    icon={<UserIcon />}
  />
  <StatCard
    title="Pending Requests"
    value={pendingRequestsCount}
    icon={<ClockIcon />}
  />
  {/* existing stats */}
</div>
```

---

## 🎯 Summary

### Files to Create/Modify

**New Components:**
1. `app/partner/components/assign-guest-modal.tsx`
2. `app/partner/components/qr-code-display-modal.tsx`
3. `app/partner/components/checkout-guest-button.tsx`

**New Pages:**
4. `app/partner/pages/guests/page.tsx`

**Modify:**
5. `app/partner/pages/room/page.tsx` - Add assign guest functionality
6. `app/partner/components/sidebar.tsx` - Add "Guests" menu item
7. `app/partner/pages/dashboard/page.tsx` - Add guest statistics

**New API (optional):**
8. `app/api/partner/guests/route.ts` - List guests

### Integration Steps

1. ✅ Backend APIs already implemented
2. Create UI components (modals, buttons)
3. Add guest management page
4. Update room management page
5. Enhance request display with guest info
6. Add dashboard statistics
7. Test QR code generation and display
8. Test guest checkout flow

---

## 🔍 Testing Checklist

- [ ] Partner can assign guest to room
- [ ] QR code is generated and displays correctly
- [ ] QR code can be downloaded
- [ ] QR code can be printed
- [ ] Guest list page shows active guests
- [ ] Guest list page shows checked-out guests
- [ ] Partner can checkout guest
- [ ] Room status updates after checkout
- [ ] Requests show guest information
- [ ] Dashboard shows correct guest count

---

All backend APIs are ready! Just need to build the frontend components. 🚀

