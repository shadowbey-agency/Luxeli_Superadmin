# Real-time Chat System Setup Guide

## Overview

This is a role-based real-time chat system using Socket.IO that enables communication between Partners and Admin team (SuperAdmin + Members).

## Architecture

- **Backend**: Node.js HTTP server with Socket.IO (separate from Next.js)
- **Database**: MongoDB (ChatRoom and Message models)
- **Authentication**: JWT tokens
- **Frontend**: React components with Socket.IO client

## Chat Rules

- ✅ Partners can chat ONLY with SuperAdmin and Admin Members
- ✅ Admin team (SuperAdmin + Members) can chat with any Partner
- ❌ No partner-to-partner chat
- ❌ No admin-to-admin chat
- ❌ Partner staff must be completely blocked from chat

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `socket.io` - Server-side Socket.IO
- `socket.io-client` - Client-side Socket.IO
- `tsx` - TypeScript execution
- `concurrently` - Run multiple processes

### 2. Environment Variables

Add to your `.env.local`:

```env
# Existing variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# New variables for chat
SOCKET_IO_PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the System

#### Development Mode

Run both Next.js and Socket.IO server:

```bash
npm run dev:all
```

Or run separately:

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Socket.IO server
npm run dev:server
```

#### Production Mode

```bash
# Build Next.js
npm run build

# Start Next.js
npm start

# Start Socket.IO server (separate process)
npm run start:server
```

## File Structure

```
├── server.ts                          # Socket.IO server (standalone)
├── models/chat/
│   ├── ChatRoom.ts                    # Chat room model
│   ├── Message.ts                     # Message model
│   └── index.ts
├── controllers/chat/
│   └── ChatController.ts              # Chat business logic
├── app/api/chat/
│   ├── room/route.ts                  # GET: Get/create partner chat room
│   ├── rooms/route.ts                 # GET: Get all chat rooms (admin)
│   └── messages/[chatRoomId]/route.ts # GET: Get messages for a room
├── hooks/
│   └── useSocket.ts                   # Socket.IO client hook
├── app/partner/components/
│   └── chat-widget.tsx                # Partner chat UI
└── app/superadmin/components/
    └── chat-admin.tsx                 # Admin chat UI
```

## API Endpoints

### REST API (Next.js)

#### Get/Create Partner Chat Room
```
GET /api/chat/room
Authorization: Bearer <token>
Response: { success: true, data: { _id, partnerId, adminIds, ... } }
```

#### Get All Chat Rooms (Admin)
```
GET /api/chat/rooms
Authorization: Bearer <token>
Response: { success: true, data: [{ _id, partnerId, partnerName, ... }] }
```

#### Get Messages
```
GET /api/chat/messages/[chatRoomId]?page=1&limit=50
Authorization: Bearer <token>
Response: { success: true, data: { messages: [...], pagination: {...} } }
```

### Socket.IO Events

#### Client → Server

**join-room**
```javascript
socket.emit('join-room', { chatRoomId: '...' })
```

**send-message**
```javascript
socket.emit('send-message', { chatRoomId: '...', content: '...' })
```

**leave-room**
```javascript
socket.emit('leave-room', { chatRoomId: '...' })
```

#### Server → Client

**joined-room**
```javascript
socket.on('joined-room', ({ chatRoomId }) => { ... })
```

**messages**
```javascript
socket.on('messages', ({ messages }) => { ... })
```

**new-message**
```javascript
socket.on('new-message', ({ message }) => { ... })
```

**error**
```javascript
socket.on('error', ({ message }) => { ... })
```

## Usage

### Partner View

1. Partner logs in
2. Chat widget automatically appears in the bottom-right corner
3. Click "Chat with Admin" button
4. Chat window opens and auto-joins their chat room
5. Start messaging with admin team

### Admin View

1. Admin (SuperAdmin or Member) logs in
2. Navigate to `/superadmin/pages/chat`
3. See list of all partners on the left
4. Click a partner to open chat
5. Start messaging

## Security

- ✅ JWT authentication required for Socket.IO connections
- ✅ Role-based access control enforced in backend
- ✅ Partner staff completely blocked from chat
- ✅ Partners can only access their own chat room
- ✅ Admins can access any partner's chat room
- ✅ All messages saved to MongoDB (source of truth)

## Database Schema

### ChatRoom
```typescript
{
  _id: string
  partnerId: string        // Unique - each partner has one room
  adminIds: string[]       // Array of SuperAdmin/Member IDs
  createdAt: Date
  updatedAt: Date
}
```

### Message
```typescript
{
  _id: string
  chatRoomId: string
  senderId: string
  senderRole: 'superadmin' | 'member' | 'partner'
  senderName: string
  content: string          // Max 5000 characters
  createdAt: Date
  updatedAt: Date
}
```

## Troubleshooting

### Socket.IO not connecting

1. Check `NEXT_PUBLIC_SOCKET_URL` matches the server port
2. Verify Socket.IO server is running (`npm run dev:server`)
3. Check browser console for connection errors
4. Verify JWT token is valid

### Messages not appearing

1. Verify user has correct role (not partnerstaff)
2. Check MongoDB connection
3. Verify chat room exists
4. Check Socket.IO server logs

### CORS errors

1. Verify `NEXT_PUBLIC_APP_URL` in server.ts matches your frontend URL
2. Check Socket.IO CORS configuration in server.ts

## Production Deployment

1. Set environment variables in your hosting platform
2. Deploy Socket.IO server as a separate service (port 3001)
3. Deploy Next.js app (port 3000)
4. Ensure both services can communicate
5. Update `NEXT_PUBLIC_SOCKET_URL` to production Socket.IO URL

## Notes

- Socket.IO server runs on port 3001 by default
- Next.js runs on port 3000 by default
- Database is the source of truth for all messages
- Socket.IO is only for real-time delivery
- No typing indicators or file uploads (as per requirements)

