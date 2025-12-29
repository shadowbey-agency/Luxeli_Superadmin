# API Quick Reference

Complete list of all API endpoints in the Luxeli Superadmin application.

---

## Table of Contents

- [Authentication](#authentication)
- [SuperAdmin APIs](#superadmin-apis)
- [Partner APIs](#partner-apis)
- [User/Guest APIs](#userguest-apis)
- [Upload APIs](#upload-apis)

---

## Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/login` | None | Login with email/username and password |
| POST | `/api/auth/logout` | None | Logout (clears auth cookie) |

---

## SuperAdmin APIs

All SuperAdmin endpoints require `SuperAdmin JWT` token in `Authorization: Bearer <token>` header.

### Partners Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/partners` | Get all partners (with pagination, search, filters) |
| POST | `/api/superadmin/partners` | Create new partner |
| GET | `/api/superadmin/partners/[id]` | Get single partner details |
| PATCH | `/api/superadmin/partners/[id]` | Update partner |
| DELETE | `/api/superadmin/partners/[id]` | Delete partner |
| GET | `/api/superadmin/partners/stats` | Get partner statistics |
| GET | `/api/superadmin/partners/services-stats` | Get partner services statistics |

### SuperAdmins Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/superadmins` | Get all superadmins (with pagination, search) |
| POST | `/api/superadmin/superadmins` | Create new superadmin |
| GET | `/api/superadmin/superadmins/[id]` | Get single superadmin details |
| PUT | `/api/superadmin/superadmins/[id]` | Update superadmin |
| DELETE | `/api/superadmin/superadmins/[id]` | Delete superadmin |
| POST | `/api/superadmin/superadmins/[id]/change-password` | Change superadmin password |
| GET | `/api/superadmin/superadmins/stats` | Get superadmin statistics |

### Members Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/members` | Get all members (with pagination, search) |
| POST | `/api/superadmin/members` | Create new member |
| GET | `/api/superadmin/members/[id]` | Get single member details |
| PATCH | `/api/superadmin/members/[id]` | Update member |
| GET | `/api/superadmin/members/stats` | Get member statistics |

### Tickets Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/tickets` | Get all tickets from all partners (with filters) |
| PUT | `/api/superadmin/tickets/[id]` | Update ticket |
| DELETE | `/api/superadmin/tickets/[id]` | Delete ticket |
| GET | `/api/superadmin/tickets/stats` | Get ticket statistics |

### Settings & Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/save` | Get settings |
| POST | `/api/superadmin/save` | Save settings |
| GET | `/api/superadmin/clients/stats` | Get client statistics |

---

## Partner APIs

All Partner endpoints require `Partner JWT` token in `Authorization: Bearer <token>` header.

### Account Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/account` | Get partner account details |
| PATCH | `/api/partner/account` | Update partner account |
| POST | `/api/partner/account/change-password` | Change partner password |

### Rooms Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/rooms` | Get all rooms (with pagination) |
| POST | `/api/partner/rooms` | Create new room |
| GET | `/api/partner/rooms/[id]` | Get single room details |
| PATCH | `/api/partner/rooms/[id]` | Update room |
| DELETE | `/api/partner/rooms/[id]` | Delete room |
| GET | `/api/partner/rooms/[id]/history` | Get room history |
| GET | `/api/partner/rooms/[id]/qr-code` | Get QR code for room |
| PATCH | `/api/partner/rooms/update-by-name` | Update room by name |
| GET | `/api/partner/rooms/daily-stats` | Get daily room statistics |
| GET | `/api/partner/rooms/weekly-stats` | Get weekly room statistics |

### Guest Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/partner/assign-room` | Assign guest to room and generate QR code |
| POST | `/api/partner/checkout-guest` | Checkout guest and deactivate access |

### Staff Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/staff` | Get all staff (with pagination, search, filters) |
| POST | `/api/partner/staff` | Create new staff member |
| GET | `/api/partner/staff/[id]` | Get single staff member details |
| PUT | `/api/partner/staff/[id]` | Update staff member |
| DELETE | `/api/partner/staff/[id]` | Delete staff member |

### Members Management (Partner)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/members` | Get all partner members |
| POST | `/api/partner/members` | Create new partner member |
| GET | `/api/partner/members/[id]` | Get single member details |
| PATCH | `/api/partner/members/[id]` | Update member |
| DELETE | `/api/partner/members/[id]` | Delete member |

### Tickets Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/tickets` | Get all tickets (with pagination, search, filters) |
| POST | `/api/partner/tickets` | Create new ticket |

### Housekeeping Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/housekeeping-requests` | Get all housekeeping requests (with filters) |
| POST | `/api/partner/housekeeping-requests` | Create new housekeeping request |
| GET | `/api/partner/housekeeping-requests/[id]` | Get single request details |
| PATCH | `/api/partner/housekeeping-requests/[id]` | Update request |
| DELETE | `/api/partner/housekeeping-requests/[id]` | Delete request |
| PATCH | `/api/partner/housekeeping-requests/[id]/status` | Update request status |
| POST | `/api/partner/housekeeping-requests/[id]/assign` | Assign staff to request |
| PATCH | `/api/partner/housekeeping-requests/[id]/cancel` | Cancel request |
| GET | `/api/partner/housekeeping-requests/my` | Get my housekeeping requests |

### Requests Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/requests-management` | Get all request items (with filters) |
| POST | `/api/partner/requests-management` | Create new request item |
| GET | `/api/partner/requests-management/[id]` | Get single request item details |
| PATCH | `/api/partner/requests-management/[id]` | Update request item |
| DELETE | `/api/partner/requests-management/[id]` | Delete request item |
| PATCH | `/api/partner/requests-management/[id]/status` | Update request item status |

### Activity Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/activity-requests` | Get all activity requests (with filters) |
| POST | `/api/partner/activity-requests` | Create new activity request |
| GET | `/api/partner/activity-requests/[id]` | Get single request details |
| PATCH | `/api/partner/activity-requests/[id]` | Update request |
| PATCH | `/api/partner/activity-requests/[id]/status` | Update request status |
| POST | `/api/partner/activity-requests/[id]/assign` | Assign staff to request |

### Activities Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/activities` | Get all activities |
| POST | `/api/partner/activities` | Create new activity |
| GET | `/api/partner/activities/[id]` | Get single activity details |
| PATCH | `/api/partner/activities/[id]` | Update activity |
| DELETE | `/api/partner/activities/[id]` | Delete activity |
| PATCH | `/api/partner/activities/[id]/status` | Update activity status |

### Booking Intern Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/booking-intern-requests` | Get all booking intern requests (with filters) |
| POST | `/api/partner/booking-intern-requests` | Create new booking intern request |
| GET | `/api/partner/booking-intern-requests/[id]` | Get single request details |
| PATCH | `/api/partner/booking-intern-requests/[id]` | Update request |
| PATCH | `/api/partner/booking-intern-requests/[id]/status` | Update request status |
| POST | `/api/partner/booking-intern-requests/[id]/assignee` | Assign staff to request |

### Booking Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/booking-settings` | Get all booking settings |
| POST | `/api/partner/booking-settings` | Create new booking setting |
| GET | `/api/partner/booking-settings/[id]` | Get single setting details |
| PATCH | `/api/partner/booking-settings/[id]` | Update setting |
| DELETE | `/api/partner/booking-settings/[id]` | Delete setting |
| PATCH | `/api/partner/booking-settings/[id]/status` | Update setting status |

### Customized Service Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/customized-service-requests` | Get all customized service requests (with filters) |
| POST | `/api/partner/customized-service-requests` | Create new customized service request |
| GET | `/api/partner/customized-service-requests/[id]` | Get single request details |
| PATCH | `/api/partner/customized-service-requests/[id]` | Update request |
| PATCH | `/api/partner/customized-service-requests/[id]/status` | Update request status |
| POST | `/api/partner/customized-service-requests/[id]/assignee` | Assign staff to request |

### Laundry Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/laundary-request` | Get all laundry requests (with filters) |
| POST | `/api/partner/laundary-request` | Create new laundry request |
| GET | `/api/partner/laundary-request/[id]` | Get single request details |
| PATCH | `/api/partner/laundary-request/[id]` | Update request |
| PATCH | `/api/partner/laundary-request/[id]/status` | Update request status |
| POST | `/api/partner/laundary-request/[id]/assign` | Assign staff to request |

### In-Room Delivery Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/in-room-delivery-request` | Get all in-room delivery requests (with filters) |
| POST | `/api/partner/in-room-delivery-request` | Create new in-room delivery request |
| GET | `/api/partner/in-room-delivery-request/[id]` | Get single request details |
| PATCH | `/api/partner/in-room-delivery-request/[id]` | Update request |
| PATCH | `/api/partner/in-room-delivery-request/[id]/status` | Update request status |
| POST | `/api/partner/in-room-delivery-request/[id]/assign` | Assign staff to request |

### Restaurants Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/restaurants` | Get all restaurants |
| POST | `/api/partner/restaurants` | Create new restaurant |
| GET | `/api/partner/restaurants/[id]` | Get single restaurant details |
| PATCH | `/api/partner/restaurants/[id]` | Update restaurant |
| DELETE | `/api/partner/restaurants/[id]` | Delete restaurant |
| PATCH | `/api/partner/restaurants/[id]/status` | Update restaurant status |
| POST | `/api/partner/restaurants/[id]/items` | Add item to restaurant |
| PATCH | `/api/partner/restaurants/[id]/items/[itemIndex]` | Update restaurant item |
| DELETE | `/api/partner/restaurants/[id]/items/[itemIndex]` | Delete restaurant item |
| PATCH | `/api/partner/restaurants/[id]/items/[itemIndex]/status` | Update restaurant item status |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partner/general-stats` | Get general statistics |
| GET | `/api/partner/requests/stats` | Get requests statistics |
| GET | `/api/partner/services/stats` | Get services statistics |

---

## User/Guest APIs

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/user/login-qr` | None | Login with QR code token |
| GET | `/api/user/profile` | Guest JWT | Get guest profile |

---

## Upload APIs

### Cloudinary Upload

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/upload/cloudinary` | None | Upload image to Cloudinary |
| DELETE | `/api/upload/cloudinary` | None | Delete image from Cloudinary |

---

## Common Query Parameters

### Pagination
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

### Filtering
- `search` (string): Search term
- `status` (string): Filter by status
- `priority` (string): Filter by priority
- `role` (string): Filter by role
- `hotelCity` (string): Filter by city
- `plan` (string): Filter by plan (starter pack, gold pack)
- `isActive` (boolean): Filter by active status

### Examples
```
GET /api/partner/rooms?page=1&limit=20
GET /api/superadmin/partners?search=hotel&hotelCity=Casablanca&plan=gold pack
GET /api/partner/tickets?status=open&priority=urgent
```

---

## Authentication

### Request Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Token Types

#### SuperAdmin JWT
- Role: `superadmin`
- User Type: `superadmin`
- Access: Full system access

#### Partner JWT
- Role: `partner`
- User Type: `partner`
- Access: Partner-specific resources

#### Guest JWT
- Role: `guest`
- User Type: `guest`
- Access: Guest-specific resources (assigned room, requests)

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": { // if applicable
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
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

---

## Environment Variables

Required in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

---

## Request Examples

### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Get Partners (with filters)
```javascript
GET /api/superadmin/partners?page=1&limit=20&search=hotel&hotelCity=Casablanca
Authorization: Bearer <SUPERADMIN_TOKEN>
```

### Create Room
```javascript
POST /api/partner/rooms
Authorization: Bearer <PARTNER_TOKEN>
Content-Type: application/json

{
  "roomName": "Deluxe 101",
  "roomStatus": "empty"
}
```

### Assign Guest to Room
```javascript
POST /api/partner/assign-room
Authorization: Bearer <PARTNER_TOKEN>
Content-Type: application/json

{
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "roomId": "room123",
  "roomName": "Deluxe 101"
}
```

### Upload Image
```javascript
POST /api/upload/cloudinary
Content-Type: application/json

{
  "image": "data:image/png;base64,..."
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectIds (strings)
- Date fields accept ISO date strings or Unix timestamps
- Boolean values are `true`/`false` (strings are not accepted)
- Empty strings are often treated as `null` or `undefined`

---

## Version

Last updated: 2025
API Version: 1.0
