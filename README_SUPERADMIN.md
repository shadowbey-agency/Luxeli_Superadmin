# SuperAdmin Documentation

## Overview

This document describes the SuperAdmin section of the Luxeli Superadmin application. The SuperAdmin is the main administrative interface that manages partners, members, subscriptions, support tickets, and system settings.

## Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Recharts** - Chart library for data visualization
- **React Icons** - Icon library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - Database (via Mongoose)
- **Mongoose 8.19.2** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

### State Management
- **React Context API** - Used for authentication state management
- **React Hooks (useState, useEffect)** - Local component state

## State Management

### Context API for Authentication

The application uses **React Context API** (not Redux) for managing authentication state globally.

**Location**: `lib/auth-context.tsx`

**How it works:**
1. `AuthProvider` wraps the entire superadmin layout
2. Provides authentication state to all child components
3. Components access auth state using `useAuth()` hook

**Key Features:**
- Stores user data (superadmin, member, or partner)
- Manages authentication token
- Handles login/logout
- Provides loading state

**Usage Example:**
```typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, token, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  return <div>Welcome {user?.fullName}</div>
}
```

## Authentication Flow

### 1. Login Process
- User enters email and password on `/login` page
- API call to `/api/auth/login`
- Server validates credentials and returns JWT token
- Token and user data stored in localStorage/sessionStorage
- User redirected to superadmin dashboard

### 2. Protected Routes
- All superadmin pages are protected
- Layout component (`app/superadmin/layout.tsx`) wraps with `AuthProvider`
- Middleware checks for valid token on API requests
- If no token or invalid token, user redirected to login

### 3. Token Management
- Tokens stored in browser storage (localStorage or sessionStorage)
- Token sent in `Authorization: Bearer <token>` header for API calls
- Token verified on every API request using `withSuperAdminAuth` middleware

## API Structure

### Base URL
All superadmin APIs are under `/api/superadmin/`

### Main API Endpoints

#### Partners Management
- **GET** `/api/superadmin/partners` - Get all partners (with pagination, search, filters)
- **POST** `/api/superadmin/partners` - Create new partner
- **GET** `/api/superadmin/partners/[id]` - Get single partner
- **PATCH** `/api/superadmin/partners/[id]` - Update partner
- **GET** `/api/superadmin/partners/stats` - Get partner statistics

#### Members Management
- **GET** `/api/superadmin/members` - Get all members
- **POST** `/api/superadmin/members` - Create new member
- **GET** `/api/superadmin/members/[id]` - Get single member
- **PATCH** `/api/superadmin/members/[id]` - Update member
- **GET** `/api/superadmin/members/stats` - Get member statistics

#### SuperAdmins Management
- **GET** `/api/superadmin/superadmins` - Get all superadmins
- **POST** `/api/superadmin/superadmins` - Create new superadmin
- **GET** `/api/superadmin/superadmins/[id]` - Get single superadmin
- **PATCH** `/api/superadmin/superadmins/[id]` - Update superadmin
- **PATCH** `/api/superadmin/superadmins/[id]/change-password` - Change password
- **GET** `/api/superadmin/superadmins/stats` - Get superadmin statistics

#### Settings
- **POST** `/api/superadmin/save` - Save settings

### API Request Format

All API requests require authentication:
```typescript
const token = getAuthToken()
const response = await fetch('/api/superadmin/partners', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### API Response Format

Success response:
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... } // if applicable
}
```

Error response:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Main Features & Pages

### 1. Dashboard (`/superadmin/dashboard`)
**Purpose**: Overview of system statistics and analytics

**Features:**
- Partner statistics (total, active)
- Member statistics
- Revenue charts
- Subscription analytics
- Real-time data visualization

**Key Components:**
- `StatCard` - Display statistics
- `RevenueChart` - Revenue visualization
- `SubscribersChart` - Subscriber trends

### 2. Partners (`/superadmin/partners`)
**Purpose**: Manage hotel partners

**Features:**
- View all partners in table format
- Create new partner
- Edit partner details
- Delete partner
- Search and filter partners
- Pagination
- Partner statistics

**Key Operations:**
- Create: Hotel name, city, email, phone, RC, ICE, fiscal info, plan selection
- Edit: Update partner information
- Delete: Remove partner from system

### 3. Team (`/superadmin/team`)
**Purpose**: Manage team members (superadmins and members)

**Features:**
- View all team members
- Create new superadmin or member
- Edit member details
- Delete members
- Assign permissions to members
- Search and filter
- Pagination

**Key Operations:**
- Create Member: Name, email, phone, username, password, permissions
- Create SuperAdmin: Full name, email, phone, password
- Edit Permissions: Assign specific permissions to members

### 4. Subscription (`/superadmin/subscription`)
**Purpose**: Manage subscription plans and billing

**Features:**
- View subscription plans (Starter Pack, Gold Pack)
- Manage subscription details
- View subscription history
- Plan analytics

### 5. Support (`/superadmin/support`)
**Purpose**: Manage support tickets

**Features:**
- View all tickets
- Create new ticket
- Assign tickets to staff
- Change ticket status
- Filter by status, priority
- Search tickets
- Pagination

**Ticket Statuses:**
- New
- In Progress
- Resolved
- Closed

**Priorities:**
- Low
- Medium
- High
- Urgent

### 6. Settings (`/superadmin/settings`)
**Purpose**: Manage account settings

**Features:**
- Update profile information
- Change password
- Upload profile image
- Notification preferences
- Language settings

## Key Points

### 1. Authentication
- Uses JWT tokens for authentication
- Tokens stored in browser storage
- All API routes protected with `withSuperAdminAuth` middleware
- Context API provides auth state globally

### 2. Data Flow
```
Component → API Call → Middleware (Auth Check) → Controller → Database → Response → Component
```

### 3. State Management
- **Global State**: Context API for authentication
- **Local State**: React hooks (useState) for component-specific data
- **No Redux**: Application uses Context API instead

### 4. Component Structure
- **Layout**: Sidebar + Header + Main content
- **Reusable Components**: StatCard, DropdownMenu, DataTable, etc.
- **Page Components**: Each page in `app/superadmin/pages/`

### 5. Styling
- Tailwind CSS for all styling
- Consistent design system
- Responsive design
- Custom components styled with Tailwind utilities

### 6. Database Models
- **SuperAdmin**: Superadmin user data
- **Partner**: Hotel partner information
- **Member**: Team member with permissions
- **Ticket**: Support tickets

## How to Use

### Starting the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   - Create `.env.local` file
   - Add MongoDB connection string
   - Add JWT secret key

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access SuperAdmin**
   - Navigate to `http://localhost:3000/login`
   - Login with superadmin credentials
   - Access dashboard at `http://localhost:3000/superadmin/dashboard`

### Common Operations

#### Creating a Partner
1. Go to Partners page
2. Click "Add Partner" button
3. Fill in required fields (hotel name, city, email, etc.)
4. Select subscription plan
5. Click "Save"

#### Managing Team Members
1. Go to Team page
2. Select "Members" or "SuperAdmins" tab
3. Click "Add Member" or "Add SuperAdmin"
4. Fill in details and assign permissions (for members)
5. Click "Save"

#### Managing Support Tickets
1. Go to Support page
2. View all tickets in table
3. Click on ticket to view details
4. Assign to staff or change status
5. Filter by status/priority as needed

### API Usage Example

```typescript
// Fetch partners
const fetchPartners = async () => {
  const token = getAuthToken()
  const response = await fetch('/api/superadmin/partners?page=1&limit=10', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
  return data
}

// Create partner
const createPartner = async (partnerData) => {
  const token = getAuthToken()
  const response = await fetch('/api/superadmin/partners', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(partnerData)
  })
  const data = await response.json()
  return data
}
```

## File Structure

```
app/superadmin/
├── components/          # Reusable UI components
│   ├── sidebar.tsx      # Navigation sidebar
│   ├── header.tsx       # Top header bar
│   ├── stat-card.tsx   # Statistics card
│   └── ...
├── pages/               # Page components
│   ├── dashboard/       # Dashboard page
│   ├── partners/        # Partners management
│   ├── team/            # Team management
│   ├── subscription/    # Subscription management
│   ├── support/          # Support tickets
│   └── settings/        # Settings page
└── layout.tsx           # Main layout wrapper

app/api/superadmin/      # API endpoints
├── partners/            # Partner APIs
├── members/             # Member APIs
├── superadmins/         # SuperAdmin APIs
└── save/                # Settings API

lib/
├── auth-context.tsx     # Authentication context
├── auth-utils.ts        # Auth utility functions
├── middleware.ts        # API middleware
└── db.ts                # Database connection

controllers/
└── SuperAdminController.ts  # Business logic

models/
└── SuperAdmin.ts        # Database model
```

## Important Notes

1. **Authentication Required**: All superadmin pages require valid authentication
2. **Token Expiration**: Tokens may expire; users need to re-login
3. **Permissions**: Members have specific permissions; superadmins have full access
4. **Data Validation**: All API endpoints validate input data
5. **Error Handling**: Errors are handled gracefully with user-friendly messages

## Summary

The SuperAdmin section is built with:
- **Next.js** for the framework
- **Context API** for state management (not Redux)
- **JWT** for authentication
- **MongoDB** for data storage
- **Tailwind CSS** for styling

The main flow is: Login → Dashboard → Manage (Partners/Team/Support) → Settings. All operations go through authenticated API endpoints that interact with the database.

