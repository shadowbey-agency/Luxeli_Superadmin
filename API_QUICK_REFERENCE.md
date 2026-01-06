# API Quick Reference - Complete Documentation

Complete reference for all API endpoints in the Luxeli Superadmin application.

---

## Table of Contents

- [Authentication](#authentication)
- [SuperAdmin APIs](#superadmin-apis)
- [Partner APIs](#partner-apis)
- [User/Guest APIs](#userguest-apis)
- [Upload APIs](#upload-apis)
- [Chat APIs](#chat-apis)
- [Common Patterns](#common-patterns)
- [Error Handling](#error-handling)

---

## Authentication

### POST `/api/auth/login`

Login with email/username and password.

**Auth Required:** None

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "admin@example.com",
      "role": "superadmin",
      "userType": "superadmin",
      "fullName": "John Doe"
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `400` - Missing fields

---

### POST `/api/auth/logout`

Logout (clears auth cookie).

**Auth Required:** None

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## SuperAdmin APIs

All SuperAdmin endpoints require `SuperAdmin JWT` token in `Authorization: Bearer <token>` header.

### Partners Management

#### GET `/api/superadmin/partners`

Get all partners with pagination, search, and filters.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `search` (string, optional): Search term (searches hotel name, email)
- `hotelCity` (string, optional): Filter by city
- `plan` (string, optional): Filter by plan (`starter pack`, `gold pack`)
- `isActive` (boolean, optional): Filter by active status

**Example Request:**
```bash
GET /api/superadmin/partners?page=1&limit=20&search=hotel&hotelCity=Casablanca&plan=gold pack
Authorization: Bearer <SUPERADMIN_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "hotelName": "Luxury Hotel",
      "email": "hotel@example.com",
      "hotelCity": "Casablanca",
      "plan": "gold pack",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

#### POST `/api/superadmin/partners`

Create new partner.

**Request Body:**
```json
{
  "hotelName": "Luxury Hotel",
  "hotelCity": "Casablanca",
  "hotelAddressEmail": "hotel@example.com",
  "phoneNumber": "+212612345678",
  "RC": "RC123456",
  "ICE": "ICE123456789",
  "identifiantFiscal": "IF123456",
  "taxeProfessionnelle": "TP123456",
  "hotelImage": "https://cloudinary.com/image.jpg",
  "username": "hotel_username",
  "password": "securePassword123",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "plan": "gold pack",
  "services": ["housekeeping", "laundry"]
}
```

**Required Fields:**
- `hotelName`, `hotelCity`, `hotelAddressEmail`, `phoneNumber`
- `RC`, `ICE`, `identifiantFiscal`, `taxeProfessionnelle`
- `username`, `password`, `startDate`, `endDate`, `plan`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "hotelName": "Luxury Hotel",
    "email": "hotel@example.com",
    "plan": "gold pack"
  }
}
```

---

#### GET `/api/superadmin/partners/[id]`

Get single partner details.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "hotelName": "Luxury Hotel",
    "email": "hotel@example.com",
    "hotelCity": "Casablanca",
    "plan": "gold pack",
    "isActive": true,
    "services": ["housekeeping", "laundry"],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

#### PATCH `/api/superadmin/partners/[id]`

Update partner.

**Request Body:**
```json
{
  "hotelName": "Updated Hotel Name",
  "hotelCity": "Rabat",
  "plan": "starter pack"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "hotelName": "Updated Hotel Name"
  }
}
```

---

#### DELETE `/api/superadmin/partners/[id]`

Delete partner.

**Response:**
```json
{
  "success": true,
  "message": "Partner deleted successfully"
}
```

---

#### GET `/api/superadmin/partners/stats`

Get partner statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "active": 85,
    "inactive": 15,
    "byPlan": {
      "starter pack": 60,
      "gold pack": 40
    },
    "byCity": {
      "Casablanca": 30,
      "Rabat": 25
    }
  }
}
```

---

### SuperAdmins Management

#### GET `/api/superadmin/superadmins`

Get all superadmins.

**Query Parameters:**
- `page` (number, optional)
- `limit` (number, optional)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "admin@example.com",
      "phone": "+212612345678",
      "role": "superadmin"
    }
  ],
  "pagination": { ... }
}
```

---

#### POST `/api/superadmin/superadmins`

Create new superadmin.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "admin@example.com",
  "password": "securePassword123",
  "phone": "+212612345678"
}
```

---

#### GET `/api/superadmin/superadmins/[id]`

Get single superadmin details.

---

#### PUT `/api/superadmin/superadmins/[id]`

Update superadmin.

---

#### DELETE `/api/superadmin/superadmins/[id]`

Delete superadmin.

---

#### POST `/api/superadmin/superadmins/[id]/change-password`

Change superadmin password.

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

---

### Members Management

#### GET `/api/superadmin/members`

Get all members.

**Query Parameters:**
- `page`, `limit`, `search`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "username": "jane_smith",
      "phone": "+212612345678",
      "permissions": ["dashboard", "partners", "tickets"],
      "role": "member"
    }
  ],
  "pagination": { ... }
}
```

---

#### POST `/api/superadmin/members`

Create new member.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "username": "jane_smith",
  "password": "securePassword123",
  "phone": "+212612345678",
  "permissions": ["dashboard", "partners", "tickets"]
}
```

**Available Permissions:**
- `dashboard`, `partners`, `members`, `tickets`, `settings`, `subscription`

---

#### GET `/api/superadmin/members/[id]`

Get single member details.

---

#### PATCH `/api/superadmin/members/[id]`

Update member.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "permissions": ["dashboard", "partners"]
}
```

---

#### GET `/api/superadmin/members/stats`

Get member statistics.

---

### Tickets Management

#### GET `/api/superadmin/tickets`

Get all tickets from all partners.

**Query Parameters:**
- `page`, `limit`, `search`, `status`, `priority`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "partnerId": "507f1f77bcf86cd799439012",
      "subject": "Support Request",
      "description": "Need help with...",
      "status": "open",
      "priority": "high",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### PUT `/api/superadmin/tickets/[id]`

Update ticket.

**Request Body:**
```json
{
  "status": "resolved",
  "priority": "low",
  "assignee": "507f1f77bcf86cd799439013"
}
```

---

#### DELETE `/api/superadmin/tickets/[id]`

Delete ticket.

---

#### GET `/api/superadmin/tickets/stats`

Get ticket statistics.

---

### Settings & Statistics

#### GET `/api/superadmin/save`

Get settings.

---

#### POST `/api/superadmin/save`

Save settings.

**Request Body:**
```json
{
  "settingKey": "settingValue"
}
```

---

#### GET `/api/superadmin/clients/stats`

Get client statistics.

---

## Partner APIs

All Partner endpoints require `Partner JWT` token in `Authorization: Bearer <token>` header.

### Account Management

#### GET `/api/partner/account`

Get partner account details.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "hotelName": "Luxury Hotel",
    "email": "hotel@example.com",
    "phone": "+212612345678",
    "hotelCity": "Casablanca",
    "plan": "gold pack"
  }
}
```

---

#### PATCH `/api/partner/account`

Update partner account.

**Request Body:**
```json
{
  "hotelName": "Updated Hotel Name",
  "phone": "+212612345679"
}
```

---

#### POST `/api/partner/account/change-password`

Change partner password.

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

---

### Rooms Management

#### GET `/api/partner/rooms`

Get all rooms.

**Query Parameters:**
- `page` (number, optional)
- `limit` (number, optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "roomName": "Room 101",
      "roomStatus": "empty",
      "resident": null,
      "residentEmail": null,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### POST `/api/partner/rooms`

Create new room.

**Request Body:**
```json
{
  "roomName": "Room 101",
  "roomStatus": "empty"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "roomName": "Room 101",
    "roomStatus": "empty",
    "partnerId": "507f1f77bcf86cd799439012"
  }
}
```

---

#### GET `/api/partner/rooms/[id]`

Get single room details.

---

#### PATCH `/api/partner/rooms/[id]`

Update room.

**Request Body:**
```json
{
  "roomName": "Updated Room Name",
  "roomStatus": "full"
}
```

---

#### DELETE `/api/partner/rooms/[id]`

Delete room.

---

#### GET `/api/partner/rooms/[id]/history`

Get room history.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "roomName": "Room 101",
      "resident": "John Doe",
      "checkInDate": "2025-01-01",
      "checkInTime": "14:00",
      "checkOutDate": "2025-01-05",
      "checkOutTime": "11:00"
    }
  ]
}
```

---

#### GET `/api/partner/rooms/[id]/qr-code`

Get QR code for room.

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "roomName": "Room 101",
    "roomId": "507f1f77bcf86cd799439011"
  }
}
```

**QR Code Data Format:**
The QR code contains JSON:
```json
{
  "roomName": "Room 101",
  "roomId": "507f1f77bcf86cd799439011"
}
```

---

#### PATCH `/api/partner/rooms/update-by-name`

Update room by name.

**Request Body:**
```json
{
  "roomName": "Room 101",
  "roomStatus": "full",
  "resident": "John Doe"
}
```

---

#### GET `/api/partner/rooms/daily-stats`

Get daily room statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "empty": 20,
    "full": 30,
    "date": "2025-01-01"
  }
}
```

---

#### GET `/api/partner/rooms/weekly-stats`

Get weekly room statistics.

---

### Guest Management

#### POST `/api/partner/assign-room`

Assign guest to room and generate QR code.

**Request Body:**
```json
{
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+212612345678",
  "roomId": "507f1f77bcf86cd799439011",
  "roomName": "Room 101",
  "checkInDate": "2025-01-01T00:00:00.000Z",
  "checkOutDate": "2025-01-05T00:00:00.000Z"
}
```

**Required Fields:**
- `guestName`, `roomId`, `roomName`

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439012",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "roomId": "507f1f77bcf86cd799439011",
    "roomName": "Room 101",
    "qrCode": "data:image/png;base64,..."
  }
}
```

---

#### POST `/api/partner/checkout-guest`

Checkout guest and deactivate access.

**Request Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Guest checked out successfully",
  "data": {
    "guestId": "507f1f77bcf86cd799439012",
    "guestName": "John Doe",
    "checkOutDate": "2025-01-05T00:00:00.000Z"
  }
}
```

---

### Staff Management

#### GET `/api/partner/staff`

Get all staff.

**Query Parameters:**
- `page`, `limit`, `search`, `role`, `status`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "staffName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+212612345678",
      "role": "housekeeping",
      "status": "active"
    }
  ],
  "pagination": { ... }
}
```

---

#### POST `/api/partner/staff`

Create new staff member.

**Request Body:**
```json
{
  "staffName": "Jane Smith",
  "email": "jane@example.com",
  "phoneNumber": "+212612345678",
  "role": "housekeeping",
  "username": "jane_smith",
  "password": "securePassword123"
}
```

**Required Fields:**
- `staffName`, `email`, `phoneNumber`, `role`, `username`, `password`

---

#### GET `/api/partner/staff/[id]`

Get single staff member details.

---

#### PUT `/api/partner/staff/[id]`

Update staff member.

---

#### DELETE `/api/partner/staff/[id]`

Delete staff member.

---

### Members Management (Partner)

#### GET `/api/partner/members`

Get all partner members.

---

#### POST `/api/partner/members`

Create new partner member.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+212612345678",
  "username": "john_doe",
  "password": "securePassword123",
  "permissions": ["rooms", "guests"]
}
```

---

#### GET `/api/partner/members/[id]`

Get single member details.

---

#### PATCH `/api/partner/members/[id]`

Update member.

---

#### DELETE `/api/partner/members/[id]`

Delete member.

---

### Tickets Management

#### GET `/api/partner/tickets`

Get all tickets.

**Query Parameters:**
- `page`, `limit`, `search`, `status`, `priority`
- `saved` (boolean): Get saved tickets from all partners

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "subject": "Support Request",
      "description": "Need help with...",
      "status": "open",
      "priority": "high",
      "partnerId": "507f1f77bcf86cd799439012",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### POST `/api/partner/tickets`

Create new ticket.

**Request Body:**
```json
{
  "title": "Support Request",
  "description": "Need help with room assignment",
  "priority": "high",
  "image": "https://cloudinary.com/image.jpg",
  "status": "open",
  "assignee": "507f1f77bcf86cd799439013"
}
```

**Required Fields:**
- `title`, `description`

**Valid Priorities:**
- `low`, `medium`, `urgent`

**Valid Statuses:**
- `open`, `new`, `reopened`, `pending`, `resolved`, `canceled`

---

### Housekeeping Requests

#### GET `/api/partner/housekeeping-requests`

Get all housekeeping requests.

**Query Parameters:**
- `page`, `limit`, `status`, `priority`, `roomId`

---

#### POST `/api/partner/housekeeping-requests`

Create new housekeeping request.

**Request Body:**
```json
{
  "roomId": "507f1f77bcf86cd799439011",
  "roomName": "Room 101",
  "requestType": "cleaning",
  "priority": "high",
  "description": "Deep cleaning needed",
  "status": "pending"
}
```

---

#### GET `/api/partner/housekeeping-requests/[id]`

Get single request details.

---

#### PATCH `/api/partner/housekeeping-requests/[id]`

Update request.

---

#### DELETE `/api/partner/housekeeping-requests/[id]`

Delete request.

---

#### PATCH `/api/partner/housekeeping-requests/[id]/status`

Update request status.

**Request Body:**
```json
{
  "status": "in-progress"
}
```

---

#### POST `/api/partner/housekeeping-requests/[id]/assign`

Assign staff to request.

**Request Body:**
```json
{
  "staffId": "507f1f77bcf86cd799439013"
}
```

---

#### PATCH `/api/partner/housekeeping-requests/[id]/cancel`

Cancel request.

---

#### GET `/api/partner/housekeeping-requests/my`

Get my housekeeping requests (for staff).

---

### Requests Management

#### GET `/api/partner/requests-management`

Get all request items.

**Query Parameters:**
- `page`, `limit`, `status`, `type`

---

#### POST `/api/partner/requests-management`

Create new request item.

---

#### GET `/api/partner/requests-management/[id]`

Get single request item details.

---

#### PATCH `/api/partner/requests-management/[id]`

Update request item.

---

#### DELETE `/api/partner/requests-management/[id]`

Delete request item.

---

#### PATCH `/api/partner/requests-management/[id]/status`

Update request item status.

---

### Activity Requests

#### GET `/api/partner/activity-requests`

Get all activity requests.

---

#### POST `/api/partner/activity-requests`

Create new activity request.

---

#### GET `/api/partner/activity-requests/[id]`

Get single request details.

---

#### PATCH `/api/partner/activity-requests/[id]`

Update request.

---

#### PATCH `/api/partner/activity-requests/[id]/status`

Update request status.

---

#### POST `/api/partner/activity-requests/[id]/assign`

Assign staff to request.

---

### Activities Management

#### GET `/api/partner/activities`

Get all activities.

---

#### POST `/api/partner/activities`

Create new activity.

---

#### GET `/api/partner/activities/[id]`

Get single activity details.

---

#### PATCH `/api/partner/activities/[id]`

Update activity.

---

#### DELETE `/api/partner/activities/[id]`

Delete activity.

---

#### PATCH `/api/partner/activities/[id]/status`

Update activity status.

---

### Booking Intern Requests

#### GET `/api/partner/booking-intern-requests`

Get all booking intern requests.

---

#### POST `/api/partner/booking-intern-requests`

Create new booking intern request.

---

#### GET `/api/partner/booking-intern-requests/[id]`

Get single request details.

---

#### PATCH `/api/partner/booking-intern-requests/[id]`

Update request.

---

#### PATCH `/api/partner/booking-intern-requests/[id]/status`

Update request status.

---

#### POST `/api/partner/booking-intern-requests/[id]/assignee`

Assign staff to request.

---

### Booking Settings

#### GET `/api/partner/booking-settings`

Get all booking settings.

---

#### POST `/api/partner/booking-settings`

Create new booking setting.

---

#### GET `/api/partner/booking-settings/[id]`

Get single setting details.

---

#### PATCH `/api/partner/booking-settings/[id]`

Update setting.

---

#### DELETE `/api/partner/booking-settings/[id]`

Delete setting.

---

#### PATCH `/api/partner/booking-settings/[id]/status`

Update setting status.

---

### Customized Service Requests

#### GET `/api/partner/customized-service-requests`

Get all customized service requests.

---

#### POST `/api/partner/customized-service-requests`

Create new customized service request.

---

#### GET `/api/partner/customized-service-requests/[id]`

Get single request details.

---

#### PATCH `/api/partner/customized-service-requests/[id]`

Update request.

---

#### PATCH `/api/partner/customized-service-requests/[id]/status`

Update request status.

---

#### POST `/api/partner/customized-service-requests/[id]/assignee`

Assign staff to request.

---

### Laundry Requests

#### GET `/api/partner/laundary-request`

Get all laundry requests.

---

#### POST `/api/partner/laundary-request`

Create new laundry request.

---

#### GET `/api/partner/laundary-request/[id]`

Get single request details.

---

#### PATCH `/api/partner/laundary-request/[id]`

Update request.

---

#### PATCH `/api/partner/laundary-request/[id]/status`

Update request status.

---

#### POST `/api/partner/laundary-request/[id]/assign`

Assign staff to request.

---

### In-Room Delivery Requests

#### GET `/api/partner/in-room-delivery-request`

Get all in-room delivery requests.

---

#### POST `/api/partner/in-room-delivery-request`

Create new in-room delivery request.

---

#### GET `/api/partner/in-room-delivery-request/[id]`

Get single request details.

---

#### PATCH `/api/partner/in-room-delivery-request/[id]`

Update request.

---

#### PATCH `/api/partner/in-room-delivery-request/[id]/status`

Update request status.

---

#### POST `/api/partner/in-room-delivery-request/[id]/assign`

Assign staff to request.

---

### Restaurants Management

#### GET `/api/partner/restaurants`

Get all restaurants.

---

#### POST `/api/partner/restaurants`

Create new restaurant.

---

#### GET `/api/partner/restaurants/[id]`

Get single restaurant details.

---

#### PATCH `/api/partner/restaurants/[id]`

Update restaurant.

---

#### DELETE `/api/partner/restaurants/[id]`

Delete restaurant.

---

#### PATCH `/api/partner/restaurants/[id]/status`

Update restaurant status.

---

#### POST `/api/partner/restaurants/[id]/items`

Add item to restaurant.

**Request Body:**
```json
{
  "name": "Pizza",
  "description": "Delicious pizza",
  "price": 150,
  "category": "main"
}
```

---

#### PATCH `/api/partner/restaurants/[id]/items/[itemIndex]`

Update restaurant item.

---

#### DELETE `/api/partner/restaurants/[id]/items/[itemIndex]`

Delete restaurant item.

---

#### PATCH `/api/partner/restaurants/[id]/items/[itemIndex]/status`

Update restaurant item status.

---

### Statistics

#### GET `/api/partner/general-stats`

Get general statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRooms": 50,
    "emptyRooms": 20,
    "fullRooms": 30,
    "totalGuests": 30,
    "activeRequests": 15
  }
}
```

---

#### GET `/api/partner/requests/stats`

Get requests statistics.

---

#### GET `/api/partner/services/stats`

Get services statistics.

---

## User/Guest APIs

### Authentication

#### POST `/api/user/login-qr`

Login with QR code token.

**Auth Required:** None

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "partnerId": "507f1f77bcf86cd799439012",
    "roomId": "507f1f77bcf86cd799439013",
    "roomName": "Room 101",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### GET `/api/user/profile`

Get guest profile.

**Auth Required:** Guest JWT

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "partnerId": "507f1f77bcf86cd799439012",
    "roomId": "507f1f77bcf86cd799439013",
    "roomName": "Room 101",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+212612345678",
    "checkInDate": "2025-01-01T00:00:00.000Z",
    "checkOutDate": "2025-01-05T00:00:00.000Z"
  }
}
```

---

## Upload APIs

### Cloudinary Upload

#### POST `/api/upload/cloudinary`

Upload image to Cloudinary.

**Auth Required:** None (or optional based on implementation)

**Request Body:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/cloud-name/image/upload/v1234567890/image.jpg",
    "publicId": "image"
  }
}
```

---

#### DELETE `/api/upload/cloudinary`

Delete image from Cloudinary.

**Request Body:**
```json
{
  "publicId": "image"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Chat APIs

The chat system uses **Socket.IO** for real-time communication. See [README.md](./README.md) for detailed chat architecture.

### Socket.IO Events

#### Client → Server

**`message:send`**
```javascript
socket.emit('message:send', {
  ticketId: '507f1f77bcf86cd799439011',
  message: 'Hello, I need help',
  messageType: 'text' // 'text' | 'image' | 'file'
});
```

**`message:history`**
```javascript
socket.emit('message:history', {
  ticketId: '507f1f77bcf86cd799439011'
});
```

**`room:join`**
```javascript
socket.emit('room:join', {
  ticketId: '507f1f77bcf86cd799439011'
});
```

**`auth:refresh`**
```javascript
socket.emit('auth:refresh', {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
});
```

#### Server → Client

**`connected`**
```javascript
socket.on('connected', (data) => {
  console.log('Connected:', data);
});
```

**`message:received`**
```javascript
socket.on('message:received', (data) => {
  console.log('New message:', data.message);
});
```

**`message:history`**
```javascript
socket.on('message:history', (data) => {
  console.log('Message history:', data.messages);
});
```

**`error`**
```javascript
socket.on('error', (data) => {
  console.error('Error:', data.message);
});
```

---

## Common Patterns

### Authentication Headers

All authenticated requests require:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Pagination

Most list endpoints support pagination:
```
GET /api/endpoint?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Filtering

Common filter parameters:
- `search` - Search term
- `status` - Filter by status
- `priority` - Filter by priority
- `role` - Filter by role
- `hotelCity` - Filter by city
- `plan` - Filter by plan
- `isActive` - Filter by active status

### Sorting

Some endpoints support sorting (implementation-specific).

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Messages

- `"Access token required"` - Missing Authorization header
- `"Invalid or expired token"` - Token validation failed
- `"Partner ID not found in token"` - Partner token missing partnerId
- `"Superadmin or Member access required"` - Insufficient permissions
- `"Missing required fields: field1, field2"` - Validation error

---

## Request Examples

### JavaScript/TypeScript

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});
const data = await response.json();

// Get Partners
const token = localStorage.getItem('auth_token');
const response = await fetch('/api/superadmin/partners?page=1&limit=20', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// Create Room
const response = await fetch('/api/partner/rooms', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    roomName: 'Room 101',
    roomStatus: 'empty'
  })
});
const data = await response.json();
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get Partners
curl -X GET "http://localhost:3000/api/superadmin/partners?page=1&limit=20" \
  -H "Authorization: Bearer <TOKEN>"

# Create Room
curl -X POST http://localhost:3000/api/partner/rooms \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"roomName":"Room 101","roomStatus":"empty"}'
```

---

## Notes

- All timestamps are in **ISO 8601** format
- All IDs are **MongoDB ObjectIds** (strings)
- Date fields accept **ISO date strings** or **Unix timestamps**
- Boolean values are `true`/`false` (strings are not accepted)
- Empty strings are often treated as `null` or `undefined`
- JWT tokens expire based on `JWT_EXPIRES_IN` environment variable (default: 7 days)

---

## Version

**Last Updated:** 2025  
**API Version:** 1.0.0

For architecture details, see [README.md](./README.md).
