"use client"

import { useState, useEffect, useRef } from "react"
import { getAuthToken, getUserData } from "@/lib/auth-utils"
import { initChatSocket, getChatSocket } from "@/lib/chat-socket"

interface Message {
  _id: string
  message: string
  senderId: string
  senderType: 'superadmin' | 'partner'
  senderName: string
  messageType: 'text' | 'image' | 'file'
  createdAt: string
  isRead: boolean
}

interface ChatComponentProps {
  ticketId: string
  partnerId?: string
  partnerName?: string
  onClose?: () => void
}

export default function ChatComponent({ ticketId, partnerId, partnerName, onClose }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [socket, setSocket] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const requestHistoryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const roomCreatedRef = useRef<boolean>(false)

  const userData = getUserData()
  
  // senderName: superadmin/member → fullName || name || "Admin", partner → hotelName || "Partner"
  const senderName = userData?.role === 'superadmin' || userData?.role === 'member' 
    ? (userData as any).fullName || (userData as any).name || 'Admin'
    : (userData as any).hotelName || 'Partner'

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true)
        setError(null)
        roomCreatedRef.current = false

        const token = getAuthToken()
        if (!token) {
          setError('Not authenticated. Please login.')
          setIsLoading(false)
          return
        }

        // Initialize socket
        const chatSocket = initChatSocket()
        if (!chatSocket) {
          setError('Failed to connect to chat server')
          setIsLoading(false)
          return
        }

        setSocket(chatSocket)

        // Wait for socket to connect
        if (!chatSocket.connected) {
          await new Promise((resolve) => {
            chatSocket.once('connect', resolve)
            setTimeout(resolve, 5000)
          })
        }

        if (!chatSocket.connected) {
          setError('Could not connect to chat server')
          setIsLoading(false)
          return
        }

        const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:5000'
        
        // STEP 1: Create or get chat room FIRST (partnerId required for superadmin)
        if (!partnerId) {
          setError('Partner ID is required')
          setIsLoading(false)
          return
        }

        try {
          const roomResponse = await fetch(`${chatUrl}/api/chat/rooms`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ticketId,
              partnerId,
              partnerName: partnerName || 'Unknown Partner',
              subject: `Support Ticket ${ticketId.substring(0, 8)}`
            })
          })

          const roomData = await roomResponse.json()
          
          if (roomResponse.ok && roomData.success) {
            roomCreatedRef.current = true
          } else {
            // Room might already exist, allow messaging anyway
            roomCreatedRef.current = true
          }
        } catch (err) {
          // Room might already exist, allow messaging anyway
          roomCreatedRef.current = true
        }

        // STEP 2: Fetch existing messages
        try {
          const messagesResponse = await fetch(`${chatUrl}/api/chat/messages/${ticketId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (messagesResponse.ok) {
            const data = await messagesResponse.json()
            
            if (data.success && data.messages && Array.isArray(data.messages)) {
              const sortedMessages = data.messages.sort((a: Message, b: Message) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              )
              setMessages(sortedMessages)
            } else if (data.messages && Array.isArray(data.messages)) {
              const sortedMessages = data.messages.sort((a: Message, b: Message) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              )
              setMessages(sortedMessages)
            }
          }
        } catch (err) {
          // Continue with empty messages
        }

        // STEP 3: Join ticket room (AFTER creating it)
        chatSocket.emit('ticket:join', { ticketId })

        // Listen for join confirmation
        chatSocket.once('ticket:joined', (data: any) => {
          if (data.success && data.messages && Array.isArray(data.messages)) {
            const sortedMessages = data.messages.sort((a: Message, b: Message) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
            setMessages(sortedMessages)
          }
        })

        // Listen for message history
        const handleMessageHistory = (data: { ticketId: string; messages: Message[] }) => {
          if (data.ticketId === ticketId && data.messages && Array.isArray(data.messages)) {
            const sortedMessages = data.messages.sort((a: Message, b: Message) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
            setMessages(sortedMessages)
          }
        }
        chatSocket.on('ticket:messages', handleMessageHistory)

        // STEP 4: Setup event listeners
        const handleMessageReceive = (data: { ticketId: string; message: Message }) => {
          if (data.ticketId === ticketId) {
            setMessages(prev => {
              const exists = prev.some(m => m._id === data.message._id)
              if (exists) return prev
              return [...prev, data.message]
            })
            scrollToBottom()
          }
        }

        const handleTypingDisplay = (data: { ticketId: string; userId: string }) => {
          if (data.ticketId === ticketId) {
            const currentUserId = userData?._id || (userData as any)?.id
            if (data.userId !== currentUserId) {
              setIsTyping(true)
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
              }
              typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000)
            }
          }
        }

        const handleTypingHide = (data: { ticketId: string; userId: string }) => {
          if (data.ticketId === ticketId) {
            const currentUserId = userData?._id || (userData as any)?.id
            if (data.userId !== currentUserId) {
              setIsTyping(false)
            }
          }
        }

        const handleError = (error: { message: string }) => {
          if (error.message) {
            setError(error.message)
          }
        }

        chatSocket.on('message:receive', handleMessageReceive)
        chatSocket.on('typing:display', handleTypingDisplay)
        chatSocket.on('typing:hide', handleTypingHide)
        chatSocket.on('error', handleError)

        setIsLoading(false)

        // Cleanup
        return () => {
          if (chatSocket) {
            chatSocket.emit('ticket:leave', { ticketId })
            chatSocket.off('message:receive', handleMessageReceive)
            chatSocket.off('typing:display', handleTypingDisplay)
            chatSocket.off('typing:hide', handleTypingHide)
            chatSocket.off('error', handleError)
            chatSocket.off('ticket:messages', handleMessageHistory)
          }
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
          }
          if (requestHistoryTimeoutRef.current) {
            clearTimeout(requestHistoryTimeoutRef.current)
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
        setError('Failed to initialize chat')
        setIsLoading(false)
      }
    }

    initializeChat()
  }, [ticketId, partnerId, partnerName])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending || !socket || !socket.connected) {
      return
    }

    if (!roomCreatedRef.current) {
      alert('Chat room not ready. Please wait.')
      return
    }

    try {
      setIsSending(true)

      // senderId: Always use userData._id (contract requirement)
      const senderId = userData?._id || (userData as any)?.id
      
      if (!senderId) {
        alert('Cannot determine user ID. Please refresh and try again.')
        setIsSending(false)
        return
      }

      // senderType: Derived ONLY from userData.role (contract requirement)
      let senderType: 'partner' | 'superadmin' = 'superadmin'
      if (userData?.role === 'superadmin' || userData?.role === 'member') {
        senderType = 'superadmin'
      } else if (userData?.role === 'partner') {
        senderType = 'partner'
      }

      // Build message payload exactly as backend expects
      const messageData: {
        ticketId: string
        message: string
        messageType: 'text'
        senderId: string
        senderType: 'superadmin' | 'partner'
        senderName: string
        partnerId?: string
      } = {
        ticketId,
        message: newMessage.trim(),
        messageType: 'text',
        senderId,
        senderType,
        senderName
      }

      // partnerId: Only send when senderType === "superadmin" (contract requirement)
      if (senderType === 'superadmin' && partnerId) {
        messageData.partnerId = partnerId
      }

      socket.emit('message:send', messageData)
      setNewMessage("")

      if (socket.connected) {
        socket.emit('typing:stop', { ticketId })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = () => {
    if (!socket || !socket.connected) return
    
    socket.emit('typing:start', { ticketId })
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (socket.connected) {
        socket.emit('typing:stop', { ticketId })
      }
    }, 3000)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes} min ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold mb-2">Connection Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {socket && !socket.connected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          ⚠️ Reconnecting to chat server...
        </div>
      )}

      <div 
        className="flex-1 p-5 overflow-y-auto"
        style={{
          width: "100%",
          padding: "10px 20px",
          backgroundColor: "#FFF"
        }}
      >
        <div className="text-center mb-3">
          <span 
            className="text-gray-500 text-sm"
            style={{
              color: "rgba(0, 0, 0, 0.50)",
              fontSize: "14px",
              fontWeight: 400
            }}
          >
            Today
          </span>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              let currentUserId: string | null = null
              const token = getAuthToken()
              if (token) {
                try {
                  const tokenParts = token.split('.')
                  if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]))
                    currentUserId = payload.userId || payload.id || null
                  }
                } catch (e) {
                  currentUserId = userData?._id || (userData as any)?.id || null
                }
              } else {
                currentUserId = userData?._id || (userData as any)?.id || null
              }
              const isMyMessage = currentUserId && message.senderId === currentUserId
              
              return (
                <div
                  key={message._id}
                  className={`flex items-end gap-3 ${isMyMessage ? "flex-row-reverse" : ""}`}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                    style={{
                      backgroundColor: isMyMessage ? "#1F2A44" : "#56C6FF",
                      width: "40px",
                      height: "40px"
                    }}
                  >
                    {isMyMessage ? (
                      <span>{message.senderName?.substring(0, 2).toUpperCase() || 'AD'}</span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    )}
                  </div>

                  <div className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"} flex-1`}>
                    {message.messageType === "text" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "11.49px",
                          borderRadius: "18.384px",
                          background: isMyMessage ? "#DCF8C6" : "#E9EAEC",
                          color: "#121212",
                          fontSize: "13px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "27.576px",
                          padding: "16px",
                          marginLeft: isMyMessage ? "auto" : "0",
                          marginRight: isMyMessage ? "0" : "auto",
                          width: "fit-content",
                          maxWidth: "571.162px",
                          minHeight: "auto"
                        }}
                      >
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                    ) : (
                      <div
                        className="rounded-lg overflow-hidden"
                        style={{
                          borderRadius: "12px",
                          maxWidth: "300px",
                          marginLeft: isMyMessage ? "auto" : "0",
                          marginRight: isMyMessage ? "0" : "auto"
                        }}
                      >
                        <img
                          src={message.message}
                          alt="Shared image"
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    
                    <span 
                      className="text-xs mt-1"
                      style={{
                        color: "rgba(0, 0, 0, 0.50)",
                        fontSize: "12px",
                        fontWeight: 400,
                        alignSelf: isMyMessage ? "flex-end" : "flex-start"
                      }}
                    >
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              )
            })
          )}
          
          {isTyping && (
            <div className="flex items-end gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                style={{
                  backgroundColor: "#56C6FF",
                  width: "40px",
                  height: "40px"
                }}
              >
                <span>AD</span>
              </div>
              <div 
                className="flex gap-1 px-4 py-3 rounded-lg"
                style={{
                  background: "#E9EAEC",
                  borderRadius: "18.384px"
                }}
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div 
        className="border-t border-black/8"
        style={{
          display: "flex",
          width: "100%",
          padding: "20px 16px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: "16px",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          background: "#FFF"
        }}
      >
        <div className="flex items-center gap-3 w-full">
          <div 
            className="relative flex-1"
            style={{
              display: "flex",
              height: "36px",
              padding: "8.182px 13.091px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "8.182px",
              flex: "1 0 0",
              borderRadius: "8px",
              border: "0.818px solid rgba(0, 0, 0, 0.08)",
              background: "#FBFAFA"
            }}
          >
            <div 
              className="flex justify-between items-center w-full"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch"
              }}
            >
              <input
                type="text"
                placeholder="Write your message"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isSending || !socket?.connected}
                className="w-full bg-transparent border-none outline-none"
                style={{
                  color: "rgba(0, 0, 0, 0.60)",
                  fontSize: "11.455px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal"
                }}
              />
              
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="17" 
                  height="16" 
                  viewBox="0 0 17 16" 
                  fill="none"
                  className="w-4 h-4"
                >
                  <path 
                    d="M15.5755 6.66732V10.0007C15.5755 13.334 14.2422 14.6673 10.9089 14.6673H6.90885C3.57552 14.6673 2.24219 13.334 2.24219 10.0007V6.00065C2.24219 2.66732 3.57552 1.33398 6.90885 1.33398H10.2422M15.5755 6.66732H12.9089C10.9089 6.66732 10.2422 6.00065 10.2422 4.00065V1.33398M15.5755 6.66732L10.2422 1.33398M5.57552 8.66732H9.57552M5.57552 11.334H8.24219" 
                    stroke="#121212" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim() || !socket?.connected}
            className="text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              display: "flex",
              width: "36px",
              height: "36px",
              justifyContent: "center",
              alignItems: "center",
              gap: "9.045px",
              borderRadius: "8px",
              background: "var(--Foundation-Blue-Normal, #1F2A44)"
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
              className="w-4 h-4 flex-shrink-0"
            >
              <path 
                d="M3.87334 7.66732L2.60187 10.8381C2.06623 12.1738 1.79841 12.8417 2.12998 13.1533C2.46156 13.4649 3.11154 13.1562 4.41148 12.5387L12.1315 8.87169C13.2304 8.3497 13.7799 8.0887 13.7799 7.66732C13.7799 7.24593 13.2304 6.98494 12.1315 6.46295L4.41148 2.79595C3.11154 2.17848 2.46156 1.86974 2.12998 2.18135C1.79841 2.49295 2.06623 3.16083 2.60187 4.49658L3.87334 7.66732ZM3.87334 7.66732L7.04794 7.66732" 
                stroke="white" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}