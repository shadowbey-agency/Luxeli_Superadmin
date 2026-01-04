// lib/chat-socket.js
// Compatible with Luxeli's existing auth-utils
import { io } from 'socket.io-client';
import { getAuthToken, getUserData } from './auth-utils';

let socket = null;
let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export function initChatSocket() {
  // If already connected, return existing socket
  if (socket && socket.connected) {
    console.log('✅ Reusing existing connected socket');
    return socket;
  }

  // If currently connecting, wait
  if (isConnecting) {
    console.log('⏳ Socket connection in progress...');
    return socket;
  }

  // Get authentication token (works with Luxeli's auth_token storage)
  const token = getAuthToken();
  if (!token) {
    console.error('❌ No auth token found for chat socket');
    console.log('💡 Please make sure you are logged in');
    console.log('💡 Looking for: localStorage.getItem("auth_token")');
    return null;
  }

  // Validate token format (JWT should have 3 parts)
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    console.error('❌ Invalid token format. Expected JWT with 3 parts, got:', tokenParts.length);
    return null;
  }

  const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:5000'

  
  console.log('🔌 Initializing chat socket connection...');
  console.log('📍 Chat URL:', chatUrl);
  console.log('🔑 Token found, length:', token.length);

  // Get user info for logging
  const userData = getUserData();
  if (userData) {
    console.log('👤 User role:', userData.role);
    console.log('👤 User ID:', userData._id);
  }

  // Decode token to verify role matches userData
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('🔍 Token payload:', {
        userId: payload.userId || payload.id,
        role: payload.role,
        userType: payload.userType,
        userDataRole: userData?.role
      });
      
      // Warn if token role doesn't match userData role
      if (userData && payload.role !== userData.role) {
        console.error('⚠️ WARNING: Token role mismatch!', {
          tokenRole: payload.role,
          userDataRole: userData.role,
          tokenUserId: payload.userId || payload.id,
          userDataId: userData._id
        });
        console.error('⚠️ This may cause messages to be saved with wrong senderType!');
        console.error('⚠️ Please logout and login again to get a fresh token.');
      }
    }
  } catch (e) {
    console.warn('⚠️ Could not decode token for validation:', e);
  }

  isConnecting = true;

  try {
    socket = io(chatUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      autoConnect: true,
    });

    // Connection successful
    socket.on('connect', () => {
      console.log('✅ Chat socket connected successfully!');
      console.log('🆔 Socket ID:', socket.id);
      console.log('🔗 Connected:', socket.connected);
      isConnecting = false;
      reconnectAttempts = 0;
    });

    // Welcome message from server
    socket.on('connected', (data) => {
      console.log('👋 Server welcome message:', data);
    });

    // Connection error
    socket.on('connect_error', (error) => {
      isConnecting = false;
      reconnectAttempts++;
      
      console.error('❌ Chat socket connection error:', error.message);
      console.error('🔍 Full error:', error);
      console.log(`🔄 Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

      if (error.message.includes('token') || error.message.includes('Authentication')) {
        console.error('🚫 Authentication failed - Check:');
        console.error('   1. You are logged in to Luxeli');
        console.error('   2. JWT_SECRET matches in both .env files:');
        console.error('      - Luxeli: .env.local');
        console.error('      - Chat Backend: .env');
        console.error('   3. Token is not expired (try logging in again)');
        console.error('   4. Chat backend is running on:', chatUrl);
      } else if (error.message.includes('timeout')) {
        console.error('⏱️ Connection timeout - Check:');
        console.error('   1. Chat backend is running:', chatUrl);
        console.error('   2. Firewall/network settings');
      }
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('❌ Max reconnection attempts reached');
        console.error('💡 Try refreshing the page or contact support');
      }
    });

    // Disconnection
    socket.on('disconnect', (reason) => {
      console.log('🔌 Chat socket disconnected:', reason);
      isConnecting = false;
      
      if (reason === 'io server disconnect') {
        console.log('🔄 Server disconnected, attempting to reconnect...');
        socket.connect();
      } else if (reason === 'io client disconnect') {
        console.log('👋 Client disconnected intentionally');
      }
    });

    // Error from server
    socket.on('error', (error) => {
      if (error && typeof error === 'object' && Object.keys(error).length > 0) {
        console.error('❌ Socket error from server:', error);
        if (error.message) {
          console.error('   Message:', error.message);
        }
      } else if (error) {
        console.error('❌ Socket error from server (no details):', error);
      }
    });

    // Reconnection events
    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}...`);
    });

    socket.io.on('reconnect', (attempt) => {
      console.log(`✅ Reconnected after ${attempt} attempts`);
      reconnectAttempts = 0;
    });

    socket.io.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after all attempts');
      console.error('💡 Please refresh the page');
    });

  } catch (error) {
    console.error('❌ Error initializing chat socket:', error);
    isConnecting = false;
    return null;
  }

  return socket;
}

export function getChatSocket() {
  if (!socket || !socket.connected) {
    console.log('⚠️ Socket not connected, initializing new connection...');
    return initChatSocket();
  }
  return socket;
}

export function disconnectChatSocket() {
  if (socket) {
    console.log('👋 Disconnecting chat socket');
    socket.disconnect();
    socket = null;
    isConnecting = false;
  }
}

export function isSocketConnected() {
  return socket && socket.connected;
}

export function getUserRole() {
  const userData = getUserData();
  if (!userData) {
    console.warn('⚠️ No user data found');
    return null;
  }
  
  // Luxeli user roles:
  // - 'superadmin': Full admin access
  // - 'member': Admin team member with permissions
  // - 'partner': Hotel partner
  
  // For chat backend, we map:
  // - superadmin + member -> 'superadmin' (can see all tickets)
  // - partner -> 'partner' (can only see own tickets)
  
  if (userData.role === 'superadmin' || userData.role === 'member') {
    return 'superadmin';
  }
  if (userData.role === 'partner') {
    return 'partner';
  }
  
  console.warn('⚠️ Unknown user role:', userData.role);
  return null;
}

export function getSocketStatus() {
  if (!socket) {
    return { 
      connected: false, 
      status: 'Not initialized',
      id: null,
      transport: null
    };
  }
  return {
    connected: socket.connected,
    status: socket.connected ? 'Connected' : 'Disconnected',
    id: socket.id,
    transport: socket.io?.engine?.transport?.name || null
  };
}

export function debugSocket() {
  console.log('🔍 ========== Socket Debug Info ==========');
  console.log('Socket exists:', !!socket);
  console.log('Socket connected:', socket?.connected);
  console.log('Socket ID:', socket?.id);
  console.log('Is connecting:', isConnecting);
  console.log('Reconnect attempts:', reconnectAttempts);
  
  const token = getAuthToken();
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 20) + '...');
    
    // Try to decode token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
    } catch (e) {
      console.error('Cannot decode token:', e);
    }
  }
  
  const userData = getUserData();
  console.log('User data:', userData);
  console.log('User role (for chat):', getUserRole());
  
  console.log('Chat URL:', 'http://localhost:5000');
  console.log('========================================');
}

// Test connection function
export async function testChatConnection() {
  console.log('🧪 Testing chat backend connection...');
  
  const chatUrl = 'http://localhost:5000';
  
  try {
    const response = await fetch(`${chatUrl}/health`);
    const data = await response.json();
    console.log('✅ Chat backend is running:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Chat backend connection failed:', error);
    console.error('💡 Make sure chat backend is running on:', chatUrl);
    return { success: false, error: error.message };
  }
}

// Test authenticated endpoint
export async function testChatAuth() {
  console.log('🧪 Testing chat backend authentication...');
  
  const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:5000';
  const token = getAuthToken();
  
  if (!token) {
    console.error('❌ No token found');
    return { success: false, error: 'No token' };
  }
  
  try {
    const response = await fetch(`${chatUrl}/api/chat/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Authentication successful:', data);
      return { success: true, data };
    } else {
      console.error('❌ Authentication failed:', data);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return { success: false, error: error.message };
  }
}
