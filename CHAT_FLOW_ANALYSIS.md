# Complete Chat & Socket.IO Flow Analysis

## 🔍 Current Configuration

### Port Numbers
- **Next.js Frontend**: Port `3000` (default)
- **Socket.IO Server**: Port `3001` (default, configurable via `SOCKET_IO_PORT`)
- **MongoDB**: External connection (via `MONGODB_URI`)

### Environment Variables Required
```env
# Socket.IO Server
SOCKET_IO_PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## 📊 Complete Flow Analysis

### 1. SERVER-SIDE FLOW (server.ts)

#### A. Server Initialization
```
1. Create HTTP server (createServer)
2. Initialize Socket.IO with CORS
   - Origin: NEXT_PUBLIC_APP_URL (default: http://localhost:3000)
   - Methods: ['GET', 'POST']
   - Credentials: true
3. Connect to MongoDB
4. Start listening on port: SOCKET_IO_PORT (default: 3001)
```

#### B. Authentication Middleware
```
Client connects → io.use() middleware:
  1. Extract token from socket.handshake.auth.token
  2. Verify JWT token using verifyToken()
  3. Check if userType === 'partnerstaff' → BLOCK
  4. Attach user payload to socket.data.user
  5. Allow connection or reject with error
```

#### C. Connection Events
```
Client connects → io.on('connection'):
  1. Log user connection
  2. Listen for events:
     - 'join-room' → Validate access → Join room → Send messages
     - 'send-message' → Validate → Save to DB → Emit to room
     - 'leave-room' → Leave room
     - 'disconnect' → Log disconnection
```

#### D. Room Management
```
join-room event:
  1. Validate room access (ChatController.validateRoomAccess)
  2. Join socket to room (socket.join(chatRoomId))
  3. If admin → Add to room's adminIds
  4. Emit 'joined-room' to client
  5. Fetch and send recent messages (last 50)
```

#### E. Message Flow
```
send-message event:
  1. Validate message content (not empty, max 5000 chars)
  2. Validate room access
  3. Get sender name from database
  4. Save message to MongoDB (ChatController.saveMessage)
  5. Update chat room's updatedAt
  6. Emit 'new-message' to all users in room (io.to(chatRoomId).emit)
```

---

### 2. CLIENT-SIDE FLOW (hooks/useSocket.ts)

#### A. Socket Initialization
```
Component mounts → useEffect:
  1. Get JWT token from localStorage
  2. Check if SOCKET_URL is configured
  3. Initialize Socket.IO client:
     - URL: NEXT_PUBLIC_SOCKET_URL (default: http://localhost:3001)
     - Auth: { token: JWT }
     - Transports: ['websocket', 'polling']
     - Reconnection: enabled (5 attempts)
     - Timeout: 20000ms
```

#### B. Connection Events
```
Socket events:
  - 'connect' → Set isConnected = true, clear error
  - 'disconnect' → Set isConnected = false
  - 'connect_error' → Set error message
  - 'reconnect_attempt' → Log attempt
  - 'reconnect_failed' → Set error message
```

#### C. Chat Events
```
Socket events:
  - 'joined-room' → Log success
  - 'messages' → Set messages state (initial load)
  - 'new-message' → Append to messages state
  - 'error' → Set error message
```

#### D. Actions
```
joinRoom(chatRoomId):
  - Emit 'join-room' event with chatRoomId

sendMessage(chatRoomId, content):
  - Emit 'send-message' event with chatRoomId and content

leaveRoom(chatRoomId):
  - Emit 'leave-room' event with chatRoomId
```

---

### 3. COMPONENT FLOW

#### A. Partner Chat Widget (chat-widget.tsx)
```
1. Component mounts
2. useSocket() hook initializes connection
3. User clicks "Chat with Admin" button
4. Fetch chat room: GET /api/chat/room
5. Get chatRoomId from response
6. Call joinRoom(chatRoomId)
7. Socket emits 'join-room'
8. Server sends 'messages' event
9. Display messages
10. User sends message → sendMessage() → Socket emits 'send-message'
11. Server saves to DB and emits 'new-message' to all in room
12. Component receives 'new-message' → Updates UI
```

#### B. Admin Chat Panel (ticket-chat-panel.tsx)
```
1. Admin clicks "View messages" on ticket
2. Panel opens
3. useSocket() hook initializes connection (if not already)
4. Fetch chat room: GET /api/chat/room/[partnerId]
5. Get chatRoomId from response
6. Call joinRoom(chatRoomId)
7. Socket emits 'join-room'
8. Server sends 'messages' event
9. Display messages
10. Admin sends message → sendMessage() → Socket emits 'send-message'
11. Server saves to DB and emits 'new-message' to all in room
12. Component receives 'new-message' → Updates UI
```

---

## 🔧 Issue Analysis: Timeout Error

### Root Causes

1. **Server Not Running**
   - Socket.IO server must be running on port 3001
   - Check: `npm run dev:server`

2. **Port Mismatch**
   - Client connects to: `NEXT_PUBLIC_SOCKET_URL` (default: http://localhost:3001)
   - Server listens on: `SOCKET_IO_PORT` (default: 3001)
   - Must match!

3. **Environment Variables Not Set**
   - `NEXT_PUBLIC_SOCKET_URL` must be set in `.env.local`
   - Next.js requires `NEXT_PUBLIC_` prefix for client-side variables
   - Must restart Next.js after adding env vars

4. **CORS Issues**
   - Server CORS origin must match Next.js URL
   - Check: `NEXT_PUBLIC_APP_URL` in server.ts

5. **MongoDB Connection**
   - Server won't start if MongoDB connection fails
   - Check: `MONGODB_URI` is valid

---

## ✅ Fix Checklist

- [ ] Socket.IO server is running (`npm run dev:server`)
- [ ] Environment variables are set in `.env.local`
- [ ] Next.js restarted after adding env vars
- [ ] Port 3001 is not blocked by firewall
- [ ] MongoDB connection is working
- [ ] CORS origin matches Next.js URL
- [ ] JWT token is valid and not expired

---

## 🚀 Quick Fix Steps

1. **Create/Update `.env.local`**:
   ```env
   SOCKET_IO_PORT=3001
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   JWT_EXPIRES_IN=7d
   ```

2. **Start Socket.IO Server**:
   ```bash
   npm run dev:server
   ```
   Should see:
   ```
   ✅ MongoDB connected for Socket.IO server
   🚀 Socket.IO server running on port 3001
   📡 CORS enabled for: http://localhost:3000
   ```

3. **Start Next.js** (in separate terminal):
   ```bash
   npm run dev
   ```

4. **Or run both together**:
   ```bash
   npm run dev:all
   ```

5. **Verify Connection**:
   - Open browser DevTools → Console
   - Should see: `🔌 Connecting to Socket.IO server at: http://localhost:3001`
   - Then: `✅ Socket connected`

---

## 🔍 Debugging Steps

1. **Check Server Status**:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","service":"chat-server"}`

2. **Check Port Availability**:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :3001
   ```

3. **Check Browser Console**:
   - Look for connection errors
   - Check Network tab → WS filter → Should see WebSocket connection

4. **Check Server Logs**:
   - Should see: `✅ User connected: [userId] ([role])`
   - If not, check authentication

---

## 📝 Connection Sequence Diagram

```
Client                    Server
  |                         |
  |--[Connect]------------->|
  |  (with JWT token)       |
  |                         |--[Verify Token]--> MongoDB
  |                         |<--[User Data]----|
  |                         |
  |<--[Connected]-----------|
  |                         |
  |--[join-room]----------->|
  |  {chatRoomId}           |
  |                         |--[Validate Access]--> MongoDB
  |                         |<--[Room Data]------|
  |                         |
  |<--[joined-room]---------|
  |<--[messages]------------|
  |  {message history}      |
  |                         |
  |--[send-message]-------->|
  |  {chatRoomId, content}  |
  |                         |--[Save Message]---> MongoDB
  |                         |<--[Saved]----------|
  |                         |
  |<--[new-message]---------|
  |  (to all in room)       |
```

---

## ⚠️ Common Issues & Solutions

### Issue: "timeout. Make sure the Socket.IO server is running on http://localhost:3001"

**Solution**:
1. Ensure server is running: `npm run dev:server`
2. Check environment variable: `NEXT_PUBLIC_SOCKET_URL=http://localhost:3001`
3. Restart Next.js after setting env vars
4. Check firewall/antivirus blocking port 3001

### Issue: CORS Error

**Solution**:
1. Ensure `NEXT_PUBLIC_APP_URL` matches your Next.js URL
2. Update server.ts CORS origin if needed
3. Restart Socket.IO server

### Issue: Authentication Failed

**Solution**:
1. Check JWT token is valid
2. Ensure user is logged in
3. Check token hasn't expired
4. Verify `JWT_SECRET` matches between client and server

---

## 🎯 Next Steps

1. Verify all environment variables are set
2. Start Socket.IO server
3. Start Next.js
4. Test connection in browser
5. Check console logs for errors
6. Verify MongoDB connection

