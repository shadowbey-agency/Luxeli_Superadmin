# Housekeeping Page & Image Upload with Cloudinary - Complete Guide

## Overview
This document explains how the housekeeping module works, focusing on the **Request Management** feature and how item images are saved using Cloudinary.

---

## 1. System Architecture

### Key Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - Requests Management Page                             │
│  - Add Item Modal (Image Upload & Item Creation)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            API Routes (Next.js)                         │
│  - /api/partner/requests-management (CRUD)              │
│  - /api/upload/cloudinary (Image Upload)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Controllers & Services                       │
│  - RequestsManagementController                         │
│  - Cloudinary Utility Library                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Database & External Services                 │
│  - MongoDB (RequestsManagement Model)                   │
│  - Cloudinary CDN (Image Storage)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Database Model

### RequestsManagement Collection

**File:** [models/housekeeping/RequestsManagement.ts](models/housekeeping/RequestsManagement.ts)

```typescript
interface IRequestsManagement extends Document {
  name: string;              // Item name (e.g., "Extra Pillows")
  category: string;          // Category (e.g., "Pillows", "Kitchen", "Cleaning")
  status: "published" | "unpublished";  // Publication status
  description: string;       // Item description
  image?: string;            // Cloudinary image URL (stored here)
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Points:**
- ✅ `image` field stores the **Cloudinary URL** (not base64 or local path)
- ✅ Multiple items can have the same name (duplicates allowed)
- ✅ Auto-generated timestamps for audit trail

---

## 3. Image Upload Flow

### Step-by-Step Process

#### **3.1 Frontend: User Selects Image**

**File:** [app/partner/components/add-item-modal.tsx](app/partner/components/add-item-modal.tsx) (Lines 201-240)

```jsx
<input
  id="image-upload"
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }
      
      // Validate file size (max 5MB for preview)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }
      
      // Convert to base64 for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)      // For UI preview
        setItemImage(result)          // Store as base64 in state
      }
      reader.readAsDataURL(file)
    }
  }}
  className="hidden"
/>
```

**What happens:**
1. User selects an image file
2. File is validated (type & size)
3. Converted to base64 for preview
4. Stored in state as `itemImage`

---

#### **3.2 Frontend: Send to API**

**File:** [app/partner/components/add-item-modal.tsx](app/partner/components/add-item-modal.tsx) (Lines 300-340)

```jsx
const requestBody = {
  name: itemName.trim(),
  category: category.trim(),
  status: isPublished ? 'published' : 'unpublished',
  description: itemDescription.trim(),
  ...(itemImage && { image: itemImage }),  // Include base64 image
}

const response = await fetch(
  isEditMode 
    ? `/api/partner/requests-management/${item._id}`
    : '/api/partner/requests-management',
  {
    method: isEditMode ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestBody),
  }
)
```

**What happens:**
1. Form data is validated
2. Request body includes base64 image as string
3. Sent to backend via JSON (not FormData)
4. Backend receives base64-encoded image

---

#### **3.3 Backend: Save Item to Database**

**File:** [controllers/partner/housekeeping/RequestsManagementController.ts](controllers/partner/housekeeping/RequestsManagementController.ts) (Lines 103-140)

```typescript
static async createRequest(data: {
  name?: string;
  category?: string;
  status?: "published" | "unpublished";
  description?: string;
  image?: string;  // Base64 image string from frontend
}) {
  // ... validation ...
  
  const item = new RequestsManagement({
    name: trimmedName,
    category: trimmedCategory,
    status: data.status || 'unpublished',
    description: trimmedDescription,
    image: data.image || undefined,  // Stored directly if provided
  });

  await item.save();
  
  return NextResponse.json({
    success: true,
    data: { request: item.toJSON() },
  }, { status: 201 });
}
```

**Current Behavior:**
⚠️ **Issue**: Currently stores **base64 image directly** in MongoDB
- This is inefficient for large images
- Increases database size
- Slow to retrieve and display

---

## 4. How Cloudinary Upload Should Work

### Cloudinary Utility Library

**File:** [lib/cloudinary.ts](lib/cloudinary.ts)

This file provides the complete Cloudinary integration:

```typescript
/**
 * Main upload function
 * Sends file to backend API route which handles Cloudinary upload
 */
export async function uploadImageToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResponse>

/**
 * Delete image from Cloudinary
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean>

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null

/**
 * Generate Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  transformation?: CloudinaryTransformation,
  cloudName?: string
): string
```

---

### Cloudinary Upload API Endpoint

**File:** [app/api/upload/cloudinary/route.ts](app/api/upload/cloudinary/route.ts)

**POST /api/upload/cloudinary** - Upload image to Cloudinary

```typescript
export async function POST(request: NextRequest) {
  // 1. Extract file and parameters from FormData
  const formData = await request.formData()
  const file = formData.get('file') as File
  const folder = formData.get('folder') as string
  const publicId = formData.get('public_id') as string
  
  // 2. Validate file
  if (!file.type.startsWith('image/')) {
    throw error 'File must be an image'
  }
  if (file.size > 10 * 1024 * 1024) {
    throw error 'File too large (max 10MB)'
  }
  
  // 3. Generate signed upload signature
  const timestamp = Math.round(Date.now() / 1000)
  const signature = generateSignature(params, timestamp, apiSecret)
  
  // 4. Upload to Cloudinary
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: uploadFormData  // Contains: file, timestamp, signature, api_key
  })
  
  // 5. Return Cloudinary response
  return {
    secure_url: string,      // HTTPS URL to access image
    public_id: string,       // Unique ID in Cloudinary
    width: number,
    height: number,
    bytes: number,
    created_at: string
  }
}
```

**DELETE /api/upload/cloudinary** - Delete image from Cloudinary

```typescript
export async function DELETE(request: NextRequest) {
  const { publicId } = await request.json()
  
  // 1. Generate deletion signature
  const signature = generateDeleteSignature(publicId, timestamp, apiSecret)
  
  // 2. Send delete request to Cloudinary
  const response = await fetch(cloudinaryDeleteUrl, {
    method: 'POST',
    body: FormData with publicId and signature
  })
  
  // 3. Return success status
  return { success: true }
}
```

---

## 5. Current Implementation Issues & Recommended Fix

### ⚠️ Current Problem

```
Frontend (base64 image)
    ↓
Backend API
    ↓
MongoDB (stores base64 - ❌ INEFFICIENT)
```

**Issues:**
- Base64 images are 33% larger than binary
- Database grows too large
- Slow to retrieve and display
- Difficult to cache or optimize images

---

### ✅ Recommended Solution

```
Frontend (base64 image)
    ↓
Backend API
    ↓
Upload to Cloudinary (returns URL)
    ↓
MongoDB (stores only Cloudinary URL - ✅ EFFICIENT)
```

**Implementation Steps:**

#### Step 1: Modify Frontend to Send File Instead of Base64

**File:** [app/partner/components/add-item-modal.tsx](app/partner/components/add-item-modal.tsx)

```typescript
// Change from storing base64 to storing File object
const [selectedFile, setSelectedFile] = useState<File | null>(null)

// In file input handler:
onChange={(e) => {
  const file = e.target.files?.[0]
  if (file) {
    // Validate
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file")
      return
    }
    if (file.size > 10 * 1024 * 1024) {  // 10MB
      setError("Image size must be less than 10MB")
      return
    }
    
    // Store file object
    setSelectedFile(file)
    
    // Show preview using File API
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }
}}

// In save handler:
if (selectedFile) {
  // Upload to Cloudinary first
  const cloudinaryFormData = new FormData()
  cloudinaryFormData.append('file', selectedFile)
  cloudinaryFormData.append('folder', 'requests-management')
  
  const uploadResponse = await fetch('/api/upload/cloudinary', {
    method: 'POST',
    body: cloudinaryFormData
  })
  
  const uploadData = await uploadResponse.json()
  const imageUrl = uploadData.secure_url  // Get Cloudinary URL
  
  // Then save item with Cloudinary URL
  const requestBody = {
    name: itemName.trim(),
    category: category.trim(),
    status: isPublished ? 'published' : 'unpublished',
    description: itemDescription.trim(),
    image: imageUrl  // ✅ Send Cloudinary URL instead of base64
  }
  
  // Send to backend
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(requestBody)
  })
}
```

#### Step 2: Backend Already Handles Cloudinary URLs

The `RequestsManagementController` already accepts image URLs:

```typescript
static async createRequest(data: {
  name?: string;
  category?: string;
  status?: "published" | "unpublished";
  description?: string;
  image?: string;  // Now receives Cloudinary URL ✅
}) {
  // ... validation ...
  
  const item = new RequestsManagement({
    name: trimmedName,
    category: trimmedCategory,
    status: data.status || 'unpublished',
    description: trimmedDescription,
    image: data.image || undefined,  // Stores Cloudinary URL
  });

  await item.save();
  // ... return response
}
```

#### Step 3: Display Images (Already Works)

**File:** [app/partner/pages/housekeeping/requests-management/page.tsx](app/partner/pages/housekeeping/requests-management/page.tsx)

```jsx
{item.image && (
  <Image 
    src={item.image}  // Can be Cloudinary URL
    alt={item.name}
    width={200}
    height={200}
    priority={false}
  />
)}
```

---

## 6. Environment Configuration

### Required Cloudinary Environment Variables

Create `.env.local` in project root:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Public (accessible from frontend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Get Cloudinary Credentials:

1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret (keep secret - don't expose in frontend)

---

## 7. Housekeeping Request Types

### Two Main Request Types

**File:** [models/housekeeping/HousekeepingRequest.ts](models/housekeeping/HousekeepingRequest.ts)

```typescript
type: "custom cleaning" | "item needed"

// Custom Cleaning
- cleaningType: "full room" | "quick refresh" | "custom"

// Item Needed
- itemQuantity: number
- deliveryDetail: {
    deliveryMethod: string,      // e.g., "Delivery to room"
    deliveryWindow: string       // e.g., "12:00 PM - 12:30 PM"
  }
```

### RequestsManagement vs HousekeepingRequest

| Aspect | RequestsManagement | HousekeepingRequest |
|--------|-------------------|-------------------|
| **Purpose** | Library of available items | Individual guest requests |
| **Created By** | Admin/Partner staff | Guests or staff |
| **Status** | published/unpublished | new/accepted/completed/canceled |
| **Image** | Item image (Cloudinary URL) | No images |
| **Reusable** | Yes - referenced multiple times | No - one per request |
| **Table** | requests_managements | housekeepingrequests |

---

## 8. API Endpoints

### Requests Management Endpoints

```
GET  /api/partner/requests-management
     - Get all items with pagination/filtering
     - Query: page, limit, search, status, category

POST /api/partner/requests-management
     - Create new item
     - Body: { name, category, status, description, image }

GET  /api/partner/requests-management/[id]
     - Get single item

PATCH /api/partner/requests-management/[id]
     - Update item
     - Body: { name?, category?, status?, description?, image? }

DELETE /api/partner/requests-management/[id]
     - Delete item
```

### Upload Endpoints

```
POST /api/upload/cloudinary
     - Upload image to Cloudinary
     - FormData: { file, folder?, public_id?, overwrite? }
     - Returns: { secure_url, public_id, width, height, bytes, created_at }

DELETE /api/upload/cloudinary
     - Delete image from Cloudinary
     - Body: { publicId }
     - Returns: { success }
```

---

## 9. Security Considerations

### ✅ Current Security Measures

1. **Authentication:** All endpoints require JWT token
2. **Authorization:** Partner can only manage own items
3. **File Validation:** Image type and size validation
4. **Signed Uploads:** Cloudinary uses signed requests (not presets)
5. **API Secret:** Kept server-side only

### 🔒 Additional Recommendations

```typescript
// 1. Add image URL validation
function isValidCloudinaryUrl(url: string): boolean {
  return url.startsWith('https://res.cloudinary.com/')
}

// 2. Add rate limiting for uploads
// 3. Monitor Cloudinary quota usage
// 4. Regular cleanup of unused images
```

---

## 10. File Structure Summary

```
📁 housekeeping/
├── 📄 HousekeepingRequest.ts      # Guest requests model
├── 📄 RequestsManagement.ts       # Catalog items model
└── 📄 index.ts                     # Exports

📁 controllers/
├── 📄 UserHousekeepingController.ts           # Guest request logic
└── 📁 partner/
    └── 📁 housekeeping/
        ├── 📄 HousekeepingRequestController.ts # Partner request logic
        └── 📄 RequestsManagementController.ts  # Catalog CRUD logic

📁 app/api/partner/
├── 📁 housekeeping-requests/
│   └── 📄 route.ts                 # GET/POST requests
└── 📁 requests-management/
    └── 📄 route.ts                 # GET/POST items

📁 app/api/upload/
└── 📁 cloudinary/
    └── 📄 route.ts                 # Upload/Delete to Cloudinary

📁 lib/
├── 📄 cloudinary.ts                # Cloudinary utility functions
└── 📄 middleware.ts                # Auth middleware

📁 app/partner/
├── 📁 pages/housekeeping/
│   ├── 📄 requests-management/page.tsx     # Catalog page
│   ├── 📄 requests/page.tsx                # View requests
│   └── 📄 house-cleaning/page.tsx          # Cleaning tasks
└── 📁 components/
    ├── 📄 add-item-modal.tsx               # Add/Edit item form
    └── 📄 add-housekeeping-request-modal.tsx
```

---

## 11. Data Flow Diagram

### Creating a New Item with Image

```
┌─────────────────┐
│  User selects   │
│   image file    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate &     │
│  show preview   │
│  (base64)       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  User fills form:               │
│  - Item name                    │
│  - Category                     │
│  - Description                  │
│  - Publication status           │
└────────┬────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  Click "Save" button                   │
│  1. Validate all fields               │
│  2. Upload image to Cloudinary         │
│     (or keep as-is if already URL)     │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  POST /api/partner/requests-management │
│  Body: {                               │
│    name, category, status,             │
│    description,                        │
│    image: "cloudinary_url"             │
│  }                                     │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  Backend (RequestsManagementController) │
│  1. Validate inputs                     │
│  2. Create document                     │
│  3. Save to MongoDB                     │
│     {                                   │
│       _id, name, category, status,      │
│       description,                      │
│       image: "cloudinary_url",          │
│       createdAt, updatedAt              │
│     }                                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────┐
│  Return success response                │
│  Frontend closes modal                  │
│  List refreshes                         │
│  Image displays from Cloudinary CDN     │
└────────────────────────────────────────┘
```

---

## 12. Testing Checklist

- [ ] User can upload image (JPG, PNG, WebP)
- [ ] Image size validation works (< 10MB)
- [ ] Image preview shows before save
- [ ] Item saves with Cloudinary URL
- [ ] Image displays correctly in list
- [ ] Image persists after page refresh
- [ ] Can edit item and change image
- [ ] Old image deleted when replaced
- [ ] Can delete item (and image from Cloudinary)
- [ ] Works across all browsers
- [ ] Mobile upload works
- [ ] Error messages display on upload failure

---

## 13. Summary

**Key Points:**
1. ✅ **RequestsManagement** = Catalog of available items
2. ✅ **HousekeepingRequest** = Individual guest requests
3. ✅ **Images stored** = Cloudinary URLs (not base64)
4. ✅ **Upload flow** = Client → Cloudinary → URL → MongoDB
5. ✅ **Security** = JWT auth + signed uploads
6. ✅ **Performance** = CDN delivery + image optimization

**Next Steps:**
1. Update frontend to upload via Cloudinary API
2. Store only URLs in database (not base64)
3. Add image optimization (resize, compression)
4. Implement image deletion on item deletion
5. Add image caching headers for performance
