# Luxeli Superadmin - Complete Documentation

A comprehensive hotel management system with real-time chat support, built with Next.js, MongoDB, and Socket.IO.

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Chat Architecture](#chat-architecture)
7. [Integration Architecture](#integration-architecture)
8. [Database Models](#database-models)
9. [Authentication & Authorization](#authentication--authorization)
10. [API Overview](#api-overview)
11. [Socket.IO Real-Time Communication](#socketio-real-time-communication)
12. [Getting Started](#getting-started)
13. [Environment Variables](#environment-variables)
14. [Deployment](#deployment)

---

## Overview

Luxeli Superadmin is a full-stack hotel management platform that enables:

- **SuperAdmin Dashboard**: System-wide management of partners, members, tickets, and settings
- **Partner Dashboard**: Hotel-specific management of rooms, guests, staff, services, and requests
- **Real-Time Chat**: Support ticket system with Socket.IO for instant messaging between partners and superadmins
- **Guest Management**: QR code-based guest authentication and room assignment
- **Service Requests**: Housekeeping, laundry, in-room delivery, activities, and more

---

## Technology Stack

### Frontend
- **Next.js 15.5.7** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Recharts 2.12.7** - Chart library for data visualization
- **React Icons 5.4.0** - Icon library
- **Socket.IO Client 4.7.0** - Real-time communication

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database
- **Mongoose 8.19.2** - MongoDB object modeling
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **Express.js** - Chat server framework
- **Socket.IO 4.7.0** - Real-time bidirectional communication

### External Services
- **Cloudinary** - Image upload and storage
- **QRCode** - QR code generation for guest authentication

---

## Project Structure

```
Luxeli_Superadmin/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── superadmin/         # SuperAdmin APIs
│   │   ├── partner/            # Partner APIs
│   │   ├── user/               # Guest/User APIs
│   │   └── upload/             # File upload APIs
│   ├── superadmin/             # SuperAdmin frontend
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   └── layout.tsx          # Layout wrapper
│   ├── partner/               # Partner frontend
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   └── layout.tsx          # Layout wrapper
│   └── login/                  # Login page
├── controllers/               # Business logic controllers
│   ├── AuthController.ts
│   ├── SuperAdminController.ts
│   ├── PartnerController.ts
│   ├── GuestController.ts
│   └── partner/                # Partner-specific controllers
├── models/                    # Mongoose schemas
│   ├── SuperAdmin.ts
│   ├── Partner.ts
│   ├── Member.ts
│   ├── Room.ts
│   ├── Guest.ts
│   ├── Ticket.ts
│   └── ...
├── lib/                       # Utility libraries
│   ├── auth.ts                # JWT utilities
│   ├── auth-context.tsx       # React auth context
│   ├── auth-utils.ts          # Auth helper functions
│   ├── middleware.ts          # API middleware
│   ├── db.ts                  # Database connection
│   ├── chat-socket.js         # Socket.IO client
│   └── ...
├── middleware.ts              # Next.js middleware
└── server.ts                  # Custom server (if needed)

lexuliChat/                    # Separate chat server
├── server.js                  # Express + Socket.IO server
├── socket/
│   └── chatHandler.js        # Socket.IO event handlers
├── models/
│   ├── ChatRoom.js
│   ├── ChatMessage.js
│   └── Ticket.js
├── routes/
│   └── chat.js               # REST API routes
├── controllers/
│   └── chatController.js     # Chat business logic
└── utils/
    └── chatRoomUtils.js      # Chat room utilities
```

---

## Backend Architecture

### API Architecture

The backend follows a **layered architecture** pattern:

```
Client Request
    ↓
Next.js Middleware (middleware.ts)
    ↓
API Route Handler (app/api/**/route.ts)
    ↓
Auth Middleware (lib/middleware.ts)
    ↓
Controller (controllers/*.ts)
    ↓
Model (models/*.ts)
    ↓
MongoDB Database
```

### Key Components

#### 1. **API Routes** (`app/api/`)

All API endpoints are organized by feature:

- **`/api/auth/*`** - Authentication (login, logout)
- **`/api/superadmin/*`** - SuperAdmin operations
- **`/api/partner/*`** - Partner operations
- **`/api/user/*`** - Guest/User operations
- **`/api/upload/*`** - File upload operations

#### 2. **Controllers** (`controllers/`)

Business logic layer that handles:
- Data validation
- Database operations
- Business rules
- Error handling

**Example Controller Structure:**
```typescript
export class PartnerController {
  static async getPartners(partnerId: string, filters: any) {
    // Validation
    // Database query
    // Data transformation
    // Return response
  }
}
```

#### 3. **Models** (`models/`)

Mongoose schemas defining data structure:

```typescript
const partnerSchema = new Schema({
  hotelName: { type: String, required: true },
  email: { type: String, required: true },
  // ... other fields
}, { timestamps: true });
```

#### 4. **Middleware** (`lib/middleware.ts`)

Authentication and authorization middleware:

- **`withAuth`** - General authentication
- **`withSuperAdminAuth`** - SuperAdmin/Member only
- **`withGuestAuth`** - Guest only
- **`getPartnerId`** - Extract partner ID from token

#### 5. **Database Connection** (`lib/db.ts`)

MongoDB connection using Mongoose:

```typescript
import mongoose from 'mongoose';

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI!);
}
```

### Request Flow Example

**Creating a Room:**

1. **Frontend** → `POST /api/partner/rooms`
2. **Middleware** → Validates JWT token
3. **API Route** → Extracts partner ID, calls controller
4. **Controller** → Validates data, creates room in database
5. **Model** → Saves to MongoDB
6. **Response** → Returns success/error to frontend

---

## Frontend Architecture

### Component Architecture

The frontend uses a **component-based architecture** with:

- **Layout Components** - Sidebar, Header, Main content wrapper
- **Page Components** - Full page views (dashboard, partners, etc.)
- **Reusable Components** - Buttons, cards, modals, tables
- **Feature Components** - Specific functionality (chat, forms, etc.)

### State Management

#### 1. **React Context API** (`lib/auth-context.tsx`)

Global authentication state:

```typescript
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Usage:**
```typescript
const { user, token, isAuthenticated } = useAuth();
```

#### 2. **Local State** (React Hooks)

Component-specific state using `useState` and `useEffect`:

```typescript
const [rooms, setRooms] = useState([]);
const [loading, setLoading] = useState(false);
```

#### 3. **No Redux**

The application uses **Context API** instead of Redux for simplicity.

### Routing

Next.js App Router handles routing:

- **`/login`** - Login page
- **`/superadmin/*`** - SuperAdmin pages
- **`/partner/*`** - Partner pages

**Protected Routes:**
- Middleware (`middleware.ts`) checks authentication
- Redirects unauthenticated users to login
- Validates permissions for members

### Data Fetching

**Pattern:**
```typescript
const fetchRooms = async () => {
  setLoading(true);
  try {
    const token = getAuthToken();
    const response = await fetch('/api/partner/rooms', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setRooms(data.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### UI Components

Built with **Radix UI** and **Tailwind CSS**:

- **Accessible** - ARIA-compliant components
- **Responsive** - Mobile-first design
- **Consistent** - Design system with reusable components

---

## Chat Architecture

The chat system is a **separate Express.js server** (`lexuliChat/`) that handles real-time communication between partners and superadmins.

### Architecture Overview

```
Frontend (Next.js)
    ↓ Socket.IO Client
Chat Server (Express + Socket.IO)
    ↓ MongoDB
ChatRoom & ChatMessage Collections
```

### Components

#### 1. **Chat Server** (`lexuliChat/server.js`)

Express server with Socket.IO:

```javascript
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

chatHandler(io); // Initialize Socket.IO handlers
```

**Port:** `5000` (configurable via `PORT` env variable)

#### 2. **Socket.IO Handler** (`lexuliChat/socket/chatHandler.js`)

Real-time event handling:

**Authentication Middleware:**
- Validates JWT token on connection
- Extracts `userId`, `userRole`, `userName` from token
- Maps `member` role to `superadmin` for chat purposes

**Events:**
- **`connection`** - User connects
- **`message:send`** - Send message
- **`message:history`** - Get message history
- **`room:join`** - Join chat room
- **`room:leave`** - Leave chat room
- **`auth:refresh`** - Refresh authentication token

#### 3. **Chat Models**

**ChatRoom Schema:**
```javascript
{
  ticketId: ObjectId,      // Unique ticket reference
  partnerId: ObjectId,     // Partner user ID
  superadminId: ObjectId,  // SuperAdmin user ID
  status: 'open' | 'closed',
  lastMessageAt: Date,
  unreadCount: {
    partner: Number,
    superadmin: Number
  }
}
```

**ChatMessage Schema:**
```javascript
{
  roomId: ObjectId,
  ticketId: ObjectId,
  senderId: ObjectId,
  senderType: 'superadmin' | 'partner',
  receiverId: ObjectId,
  receiverType: 'superadmin' | 'partner',
  message: String,
  messageType: 'text' | 'image' | 'file',
  isRead: Boolean,
  readAt: Date
}
```

#### 4. **Chat Room Utilities** (`lexuliChat/utils/chatRoomUtils.js`)

**Key Functions:**
- **`getOrCreateChatRoom(ticketId)`** - Creates room if doesn't exist
- **`getSuperadminId()`** - Fetches superadmin ID from database
- **`getTicketModel()`** - Lazy loads Ticket model

**Security:**
- `partnerId` always comes from Ticket database (never from frontend)
- `superadminId` fetched from database
- Room validation ensures both participants exist

#### 5. **Frontend Socket Client** (`lib/chat-socket.js`)

Socket.IO client initialization:

```javascript
import { io } from 'socket.io-client';
import { getAuthToken } from './auth-utils';

export function initChatSocket() {
  const token = getAuthToken();
  const socket = io(chatUrl, {
    auth: { token },
    reconnection: true,
    transports: ['websocket', 'polling']
  });
  
  return socket;
}
```

### Chat Flow

#### 1. **Connection Flow**

```
User Opens Chat Page
    ↓
Frontend: initChatSocket()
    ↓
Socket.IO Client connects to chat server
    ↓
Server: Authentication middleware validates JWT
    ↓
Server: Emits 'connected' event
    ↓
Client: Socket ready for messaging
```

#### 2. **Message Sending Flow**

```
User Types Message
    ↓
Frontend: socket.emit('message:send', { ticketId, message })
    ↓
Server: Validates ticketId, gets/creates room
    ↓
Server: Determines senderType from room participants
    ↓
Server: Creates ChatMessage in database
    ↓
Server: Updates room.lastMessageAt
    ↓
Server: Emits 'message:received' to both participants
    ↓
Frontend: Updates UI with new message
```

#### 3. **Room Creation Flow**

```
First Message Sent
    ↓
Server: getOrCreateChatRoom(ticketId)
    ↓
Check if room exists
    ↓
If not exists:
  - Fetch Ticket from database
  - Get partnerId from Ticket
  - Get superadminId from SuperAdmin collection
  - Create ChatRoom
    ↓
Return room to message handler
```

### Security Features

1. **JWT Authentication** - All connections require valid JWT
2. **Role-Based Access** - Only `superadmin` and `partner` can chat
3. **Room Access Control** - Users can only access their own rooms
4. **Backend Validation** - All sender data comes from JWT, never frontend
5. **Participant Matching** - `senderType` determined by matching `userId` with room participants

---

## Integration Architecture

### How Components Integrate

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ SuperAdmin   │  │   Partner    │  │    Guest     │  │
│  │   Pages      │  │    Pages     │  │    Pages     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                   │          │
│  ┌──────▼─────────────────▼───────────────────▼──────┐  │
│  │         React Context API (Auth State)            │  │
│  └──────┬─────────────────┬───────────────────┬───────┘  │
│         │                 │                   │          │
│  ┌──────▼─────────────────▼───────────────────▼──────┐  │
│  │         API Routes (Next.js API Routes)            │  │
│  └──────┬─────────────────┬───────────────────┬───────┘  │
└─────────┼─────────────────┼───────────────────┼─────────┘
          │                 │                   │
          │                 │                   │
┌─────────▼─────────────────▼───────────────────▼─────────┐
│              Backend Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   MongoDB    │  │  Chat Server │  │  Cloudinary   │   │
│  │  (Database)  │  │ (Socket.IO)  │  │  (Images)     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Integration Points

#### 1. **Authentication Integration**

- **Frontend** → Stores JWT in localStorage
- **API Routes** → Validates JWT via middleware
- **Chat Server** → Validates JWT on Socket.IO connection
- **Shared Secret** → Same `JWT_SECRET` for all services

#### 2. **Database Integration**

- **Main App** → MongoDB connection via Mongoose
- **Chat Server** → Same MongoDB database, different collections
- **Shared Models** → Ticket model used by both

#### 3. **Real-Time Integration**

- **Frontend** → Socket.IO client connects to chat server
- **Chat Server** → Handles all real-time events
- **API Routes** → REST endpoints for chat history, room management

#### 4. **File Upload Integration**

- **Frontend** → Uploads to Cloudinary via API
- **API Route** → `/api/upload/cloudinary`
- **Cloudinary** → Returns public URL
- **Database** → Stores URL in records

---

## Database Models

### Core Models

#### 1. **SuperAdmin** (`models/SuperAdmin.ts`)
```typescript
{
  fullName: string;
  email: string;
  password: string (hashed);
  phone?: string;
  role: 'superadmin';
}
```

#### 2. **Partner** (`models/Partner.ts`)
```typescript
{
  hotelName: string;
  email: string;
  password: string (hashed);
  phone?: string;
  hotelCity?: string;
  plan: 'starter pack' | 'gold pack';
  // ... other fields
}
```

#### 3. **Member** (`models/Member.ts`)
```typescript
{
  name: string;
  email: string;
  username: string;
  password: string (hashed);
  phone?: string;
  permissions: string[];
  role: 'member';
}
```

#### 4. **Room** (`models/Room.ts`)
```typescript
{
  roomName: string;
  partnerId: ObjectId;
  roomStatus: 'empty' | 'full';
  resident?: string;
  residentEmail?: string;
  // ... other fields
}
```

#### 5. **Guest** (`models/Guest.ts`)
```typescript
{
  partnerId: ObjectId;
  roomId: ObjectId;
  roomName: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  isActive: boolean;
  checkInDate: Date;
  checkOutDate?: Date;
}
```

#### 6. **Ticket** (`models/Ticket.ts`)
```typescript
{
  partnerId: ObjectId;
  subject: string;
  description: string;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // ... other fields
}
```

#### 7. **ChatRoom** (`lexuliChat/models/ChatRoom.js`)
```javascript
{
  ticketId: ObjectId (unique);
  partnerId: ObjectId;
  superadminId: ObjectId;
  status: 'open' | 'closed';
  lastMessageAt: Date;
  unreadCount: {
    partner: Number,
    superadmin: Number
  }
}
```

#### 8. **ChatMessage** (`lexuliChat/models/ChatMessage.js`)
```javascript
{
  roomId: ObjectId;
  ticketId: ObjectId;
  senderId: ObjectId;
  senderType: 'superadmin' | 'partner';
  receiverId: ObjectId;
  receiverType: 'superadmin' | 'partner';
  message: String;
  messageType: 'text' | 'image' | 'file';
  isRead: Boolean;
  readAt: Date;
}
```

---

## Authentication & Authorization

### Authentication Flow

1. **Login** → User submits credentials
2. **Server** → Validates credentials, generates JWT
3. **Client** → Stores JWT in localStorage
4. **Requests** → JWT sent in `Authorization: Bearer <token>` header
5. **Middleware** → Validates JWT on each request

### JWT Token Structure

```typescript
interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  userType: 'superadmin' | 'member' | 'partner' | 'guest' | ...;
  permissions?: string[];
  // Role-specific fields
  partnerId?: string;
  roomId?: string;
  hotelName?: string;
  // ...
}
```

### User Roles

1. **SuperAdmin** - Full system access
2. **Member** - Limited access based on permissions
3. **Partner** - Hotel-specific access
4. **PartnerMember** - Partner team member
5. **PartnerStaff** - Hotel staff
6. **Guest** - Room-specific access

### Authorization Middleware

**SuperAdmin Routes:**
```typescript
export const GET = withSuperAdminAuth(async (req) => {
  // Only superadmin/member can access
});
```

**Partner Routes:**
```typescript
export const GET = withAuth(async (req) => {
  const partnerId = getPartnerId(req);
  // Partner-specific operations
});
```

**Guest Routes:**
```typescript
export const GET = withGuestAuth(async (req) => {
  // Only guests can access
});
```

---

## API Overview

See [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) for complete API documentation.

### API Structure

- **Base URL**: `/api`
- **Authentication**: JWT Bearer token
- **Response Format**: JSON
- **Error Handling**: Standardized error responses

### Main API Categories

1. **Authentication** - `/api/auth/*`
2. **SuperAdmin** - `/api/superadmin/*`
3. **Partner** - `/api/partner/*`
4. **User/Guest** - `/api/user/*`
5. **Upload** - `/api/upload/*`

---

## Socket.IO Real-Time Communication

### Connection

```javascript
import { initChatSocket } from '@/lib/chat-socket';

const socket = initChatSocket();
```

### Events

#### Client → Server

- **`message:send`** - Send message
  ```javascript
  socket.emit('message:send', {
    ticketId: '...',
    message: 'Hello',
    messageType: 'text'
  });
  ```

- **`message:history`** - Get message history
  ```javascript
  socket.emit('message:history', { ticketId: '...' });
  ```

- **`room:join`** - Join room
  ```javascript
  socket.emit('room:join', { ticketId: '...' });
  ```

- **`auth:refresh`** - Refresh token
  ```javascript
  socket.emit('auth:refresh', { token: '...' });
  ```

#### Server → Client

- **`connected`** - Connection successful
- **`message:received`** - New message received
- **`message:history`** - Message history response
- **`error`** - Error occurred
- **`auth:refreshed`** - Token refreshed

### Example Usage

```typescript
const socket = initChatSocket();

socket.on('connect', () => {
  console.log('Connected to chat server');
});

socket.on('message:received', (data) => {
  setMessages(prev => [...prev, data.message]);
});

const sendMessage = () => {
  socket.emit('message:send', {
    ticketId: currentTicket.id,
    message: inputValue,
    messageType: 'text'
  });
};
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd Luxeli_Superadmin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create `.env.local`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/luxeli
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CHAT_URL=http://localhost:5000
   ```

4. **Set Up Chat Server**
   ```bash
   cd lexuliChat
   npm install
   ```

5. **Start Chat Server**
   ```bash
   cd lexuliChat
   node server.js
   # Or: npm start
   ```

6. **Start Main Application**
   ```bash
   npm run dev
   # Or: npm run dev:next
   ```

7. **Access Application**
   - Main App: http://localhost:3000
   - Chat Server: http://localhost:5000

---

## Environment Variables

### Required Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/luxeli

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Chat Server
NEXT_PUBLIC_CHAT_URL=http://localhost:5000
PORT=5000  # For chat server
CORS_ORIGIN=http://localhost:3000  # For chat server
```

---

## Deployment

### Production Checklist

1. **Environment Variables**
   - Set all required variables in production environment
   - Use secure JWT secret
   - Configure production MongoDB URI

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

4. **Chat Server**
   - Deploy chat server separately
   - Update `NEXT_PUBLIC_CHAT_URL` to production URL
   - Configure CORS for production domain

5. **Database**
   - Use MongoDB Atlas or production MongoDB
   - Set up backups
   - Configure indexes

6. **Security**
   - Enable HTTPS
   - Use secure JWT secrets
   - Configure CORS properly
   - Set up rate limiting

---

## Additional Resources

- **API Documentation**: See [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)
- **Chat Documentation**: See chat architecture section above
- **Database Schema**: See database models section above

---

## Support

For issues or questions, please refer to the API documentation or contact the development team.

---

**Last Updated**: 2025
**Version**: 1.0.0

