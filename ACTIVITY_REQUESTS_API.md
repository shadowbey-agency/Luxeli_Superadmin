# Activity Requests API Documentation

## API Base URL
All endpoints are prefixed with `/api/partner/activity-requests`

## Authentication
All endpoints require authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Get All Activity Requests
**GET** `/api/partner/activity-requests`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search in roomName, residentName, service, notes, assignee.name
- `status` (optional): Filter by status (new, accepted, completed, no-show, canceled)
- `roomName` (optional): Filter by room name
- `service` (optional): Filter by service name

**Example Request:**
```bash
GET /api/partner/activity-requests?page=1&limit=10&status=new&search=activity
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "65f1234567890abcdef12345",
        "roomName": "R1 E3 A3",
        "residentName": "John Doe",
        "service": "Activity Alert",
        "status": "new",
        "notes": "Please monitor the activity",
        "assignee": {
          "name": "Staff Member",
          "staffId": "65f1234567890abcdef12346",
          "profilePic": null
        },
        "createdAt": "2025-01-15T10:30:00.000Z",
        "updatedAt": "2025-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

### 2. Get Single Activity Request by ID
**GET** `/api/partner/activity-requests/[id]`

**Example Request:**
```bash
GET /api/partner/activity-requests/65f1234567890abcdef12345
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "_id": "65f1234567890abcdef12345",
      "roomName": "R1 E3 A3",
      "residentName": "John Doe",
      "service": "Activity Alert",
      "status": "new",
      "notes": "Please monitor the activity",
      "assignee": null,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 3. Create Activity Request
**POST** `/api/partner/activity-requests`

**Request Body:**
```json
{
  "roomName": "R1 E3 A3",
  "residentName": "John Doe",
  "service": "Activity Alert",
  "status": "new",
  "notes": "Optional notes",
  "assignee": {
    "name": "Staff Member",
    "staffId": "65f1234567890abcdef12346",
    "profilePic": "optional-url"
  }
}
```

**Required Fields:**
- `roomName`: string
- `residentName`: string
- `service`: string

**Optional Fields:**
- `status`: "new" | "accepted" | "completed" | "no-show" | "canceled" (default: "new")
- `notes`: string
- `assignee`: object with name, staffId, profilePic

**Example Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "_id": "65f1234567890abcdef12345",
      "roomName": "R1 E3 A3",
      "residentName": "John Doe",
      "service": "Activity Alert",
      "status": "new",
      "notes": "Optional notes",
      "assignee": null,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 4. Update Activity Request
**PATCH** `/api/partner/activity-requests/[id]`

**Request Body:**
```json
{
  "roomName": "R2 E4 A5",
  "residentName": "Jane Doe",
  "service": "Security Alert",
  "status": "accepted",
  "notes": "Updated notes",
  "assignee": {
    "name": "Staff Member",
    "staffId": "65f1234567890abcdef12346",
    "profilePic": null
  }
}
```

**All fields are optional** - only include fields you want to update.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "_id": "65f1234567890abcdef12345",
      "roomName": "R2 E4 A5",
      "residentName": "Jane Doe",
      "service": "Security Alert",
      "status": "accepted",
      "notes": "Updated notes",
      "assignee": {
        "name": "Staff Member",
        "staffId": "65f1234567890abcdef12346",
        "profilePic": null
      },
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T11:00:00.000Z"
    }
  }
}
```

---

### 5. Delete Activity Request
**DELETE** `/api/partner/activity-requests/[id]`

**Example Request:**
```bash
DELETE /api/partner/activity-requests/65f1234567890abcdef12345
```

**Example Response:**
```json
{
  "success": true,
  "message": "Activity request deleted successfully"
}
```

---

### 6. Update Activity Request Status
**PATCH** `/api/partner/activity-requests/[id]/status`

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Valid Status Values:**
- `new`
- `accepted`
- `completed`
- `no-show`
- `canceled`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "_id": "65f1234567890abcdef12345",
      "roomName": "R1 E3 A3",
      "residentName": "John Doe",
      "service": "Activity Alert",
      "status": "accepted",
      "notes": "Please monitor the activity",
      "assignee": null,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T11:00:00.000Z"
    }
  }
}
```

---

### 7. Assign Staff to Activity Request
**POST** `/api/partner/activity-requests/[id]/assign`

**Request Body:**
```json
{
  "assignee": {
    "name": "Staff Member Name",
    "staffId": "65f1234567890abcdef12346",
    "profilePic": "optional-url"
  }
}
```

**Note:** Assigning staff automatically updates the status to "accepted"

**Example Response:**
```json
{
  "success": true,
  "data": {
    "request": {
      "_id": "65f1234567890abcdef12345",
      "roomName": "R1 E3 A3",
      "residentName": "John Doe",
      "service": "Activity Alert",
      "status": "accepted",
      "notes": "Please monitor the activity",
      "assignee": {
        "name": "Staff Member Name",
        "staffId": "65f1234567890abcdef12346",
        "profilePic": null
      },
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T11:00:00.000Z"
    }
  }
}
```

---

## Status Values

| Status | Description |
|--------|-------------|
| `new` | Newly created request (default) |
| `accepted` | Request has been accepted (usually when staff is assigned) |
| `completed` | Request has been completed |
| `no-show` | Staff did not show up |
| `canceled` | Request has been canceled |

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (request ID not found)
- `500` - Internal Server Error

---

## Integration Notes

### Frontend Integration
The activity requests page has been fully integrated at:
- **Page**: `/app/partner/pages/activity-alerts/requests/page.tsx`
- **Modal**: `/app/partner/components/view-activity-alert-modal.tsx`
- **Assign Staff Modal**: `/app/partner/components/assign-staff-modal.tsx`

### Features Implemented:
1. ✅ List all requests with pagination
2. ✅ Search and filter functionality
3. ✅ View request details
4. ✅ Update request status
5. ✅ Assign staff to requests
6. ✅ Delete requests
7. ✅ Real-time data fetching from API
8. ✅ Loading states
9. ✅ Error handling

---

## Example Usage in Frontend

```typescript
// Fetch requests
const response = await fetch('/api/partner/activity-requests?page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Create request
const createResponse = await fetch('/api/partner/activity-requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    roomName: 'R1 E3 A3',
    residentName: 'John Doe',
    service: 'Activity Alert'
  })
})

// Update status
const statusResponse = await fetch('/api/partner/activity-requests/[id]/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'accepted'
  })
})

// Assign staff
const assignResponse = await fetch('/api/partner/activity-requests/[id]/assign', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    assignee: {
      name: 'Staff Name',
      staffId: 'staff-id-here',
      profilePic: null
    }
  })
})
```

