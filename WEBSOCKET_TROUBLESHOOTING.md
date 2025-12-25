# WebSocket Connection Troubleshooting

## Common Issues and Solutions

### 1. "Websocket error" in Console

This error typically means the Socket.IO server is not running or not accessible.

#### Solution Steps:

**Step 1: Check if Socket.IO server is running**

Open a terminal and run:
```bash
npm run dev:server
```

You should see:
```
✅ MongoDB connected for Socket.IO server
🚀 Socket.IO server running on port 3001
📡 CORS enabled for: http://localhost:3000
```

**Step 2: Verify Environment Variables**

Create or update `.env.local` file in the project root:

```env
# Socket.IO Configuration
SOCKET_IO_PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Existing variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

**Step 3: Restart Both Servers**

After adding environment variables:

1. Stop all running processes (Ctrl+C)
2. Restart Next.js:
   ```bash
   npm run dev
   ```
3. In a separate terminal, start Socket.IO server:
   ```bash
   npm run dev:server
   ```

Or use the combined command:
```bash
npm run dev:all
```

**Step 4: Check Browser Console**

Open browser DevTools (F12) and check:
- Network tab: Look for WebSocket connections
- Console tab: Check for connection errors
- You should see: `✅ Socket connected` when successful

### 2. "Connection refused" Error

**Cause**: Socket.IO server is not running on the expected port.

**Solution**:
- Make sure `server.ts` is running
- Verify port 3001 is not already in use
- Check firewall settings

### 3. CORS Errors

**Cause**: Socket.IO server CORS configuration doesn't match your frontend URL.

**Solution**:
- Update `NEXT_PUBLIC_APP_URL` in `.env.local` to match your Next.js URL
- Restart Socket.IO server after changing environment variables

### 4. "No authentication token found"

**Cause**: User is not logged in or token is missing.

**Solution**:
- Make sure user is logged in
- Check that JWT token is stored correctly
- Verify token hasn't expired

### 5. Connection Works But Messages Don't Send

**Cause**: Chat room not found or user doesn't have access.

**Solution**:
- Verify user role (Partner, SuperAdmin, or Member)
- Check that chat room exists for the partner
- Ensure user has proper permissions

## Quick Diagnostic Checklist

- [ ] Socket.IO server is running (`npm run dev:server`)
- [ ] Next.js is running (`npm run dev`)
- [ ] Environment variables are set in `.env.local`
- [ ] Port 3001 is not blocked by firewall
- [ ] User is logged in with valid JWT token
- [ ] Browser console shows connection success message
- [ ] No CORS errors in browser console

## Testing the Connection

1. **Check Server Status**:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","service":"chat-server"}`

2. **Check Browser Connection**:
   - Open browser DevTools
   - Go to Network tab
   - Filter by "WS" (WebSocket)
   - You should see a connection to `ws://localhost:3001/socket.io/`

3. **Check Console Logs**:
   - Look for: `✅ Socket connected`
   - If you see errors, check the error message for details

## Production Deployment

For production, update environment variables:

```env
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
NEXT_PUBLIC_APP_URL=https://your-app.com
SOCKET_IO_PORT=3001
```

Make sure:
- Socket.IO server is deployed and accessible
- CORS is configured for your production domain
- SSL/HTTPS is properly configured

## Still Having Issues?

1. Check server logs for detailed error messages
2. Verify MongoDB connection is working
3. Ensure all dependencies are installed: `npm install`
4. Try clearing browser cache and cookies
5. Check if port 3001 is available: `netstat -an | findstr 3001` (Windows) or `lsof -i :3001` (Mac/Linux)

