# Partner Frontend – Structure & Conventions

This document describes how the **partner** frontend is built: pages, sidebar, state, API usage, and shared patterns. Each concept is defined once; reuse across the app follows the same rules.

---

## 1. App structure & routing

- **Framework:** Next.js (App Router).
- **Partner area:** Everything under `app/partner/`.
- **Layout:** `app/partner/layout.tsx` wraps all partner pages with:
  - **AuthProvider** – auth state (from `@/lib/auth-context`).
  - **SidebarProvider** – sidebar collapse state (from `sidebar-context.tsx`).
  - **Sidebar** (left) + **Header** (top) + **main** (content). Content has `marginLeft` for sidebar width and `marginTop` for header height.
- **Pages:** Each route is a folder with `page.tsx` (e.g. `app/partner/pages/dashboard/page.tsx` → `/partner/pages/dashboard`). Nested routes use nested folders (e.g. `pages/laundry/requests/page.tsx` → `/partner/pages/laundry/requests`).
- **Navigation:** Use Next.js **Link** with `href` or **useRouter** from `next/navigation` for `router.push(href)`.

---

## 2. Sidebar

**File:** `app/partner/components/sidebar.tsx`

- **Role:** Renders the left navigation: main menu + expandable service sections. Visibility depends on **permissions** and **partner services**.
- **State used:**
  - **isCollapsed / setIsCollapsed** – from **useSidebar()** (SidebarContext). Controls narrow (icon-only) vs full width. Layout uses this to set `marginLeft` and sidebar width.
  - **expandedServices** – `useState<string[]>([])`. Which service blocks (e.g. "Housekeeping", "Laundry") are expanded to show sub-items.
  - **currentFullPath** – `useState("")`, synced in **useEffect** with `window.location.pathname + window.location.search`. Used to highlight the current route and to auto-expand the service that contains it.
- **Data:**
  - **menuItems** – static array: Dashboard, Rooms, Support, Team, Subscription, Settings. Each has `label`, `href`, `icon` (component or PublicIcon + iconProps).
  - **allServicesItems** – static array of services (Housekeeping, Bookings interns, Customized services, Activity alerts, Laundry, Room delivery). Each has `label`, `serviceKey`, `href`, `icon`, **subItems** (e.g. Requests, Settings).
- **Visibility:**
  - **usePermissions()** – `hasPermission(href)` filters which main menu items and which **subItems** are shown. Partner staff use role-based access; partner members use permission objects.
  - **usePartnerServices()** – `hasService(serviceKey)` filters which services appear (only if the service is both assigned and active for the partner). Sub-items are then filtered again by `hasPermission(subItem.href)`.
- **Result:** Only items the user is allowed to see are rendered. Active link is highlighted; the service that contains the current page is auto-expanded.

---

## 3. State (useState) – what it’s for

Across partner pages, state is used in a consistent way. **Define state only for what the page or component owns.**

| Purpose | Typical state | Used in |
|--------|----------------|--------|
| **List data** | `requests` / `activities` / `restaurants` (array), set from API | Requests lists, activities, restaurants, etc. |
| **Loading** | `isLoading` (boolean) | Any page that fetches data |
| **Pagination** | `currentPage`, `itemsPerPage`, `totalPages`, `totalItems` | List pages with tables |
| **Filters / search** | `searchQuery`, `statusFilter`, `priorityFilter`, etc. | List pages (often trigger refetch when changed) |
| **Modals** | `isAddModalOpen`, `showViewRequest`, `showAssignStaffModal`, etc. | Any page with modals |
| **Selected item** | `selectedRequest`, `editingActivity`, `restaurantIdForAddItem` | View/Edit modal, “who is being edited” |
| **Form / action** | `requestToChangeStatus`, `newStatus`, `requestToAssign` | Change status, assign staff |
| **Sidebar** | `expandedServices`, `currentFullPath` (in sidebar); `isCollapsed` in context | Sidebar only |
| **UI only** | `showDropdown`, local open/close for dropdowns | Cards, rows, dropdowns |

- **Modals:** One boolean per modal (e.g. `showViewRequest`) and one state for the “target” (e.g. `selectedRequest`). Open = set boolean true + set selected item; close = set boolean false + clear selected.
- **No global client state store** – each page keeps its own state. Shared “global” things are: **Auth (token + user)** and **Sidebar collapse**.

---

## 4. API calls – useEffect, token, fetch

- **Auth token:** From **getAuthToken()** in `@/lib/auth-utils`. Returns `localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')`. Used in **every** partner API request.
- **Pattern:**  
  - In **useEffect**, call an async function that:  
    - Gets token with **getAuthToken()**; if none, return (or set error).  
    - **fetch**(`/api/partner/...`, { headers: { 'Authorization': `Bearer ${token}` }, ... }).  
    - On success: set list state (and optionally pagination).  
    - In finally: set **isLoading** false.  
  - **useEffect** dependency array usually includes: `currentPage`, `itemsPerPage`, and all filters that should trigger a refetch (e.g. `searchQuery`, `statusFilter`). So changing page or filters refetches.
- **When refetch runs:**  
  - On mount.  
  - When dependencies (page, filters) change.  
  - After a mutation (create/update/delete/assign/change status): the handler calls the same **fetchRequests** (or equivalent) after success so the list updates.
- **No shared data layer** – each page has its own `fetchRequests` / `fetchActivities` etc. Reusable part is the **pattern** (useEffect + getAuthToken + fetch + setState), not a single “API hook” for all lists.

---

## 5. Reusable building blocks (used in many places)

- **PublicIcon** (`app/partner/components/public-icon.tsx`)  
  - Renders a Next.js **Image** for a given `src` (e.g. `/assets/icons/...`). Used in sidebar, cards, buttons. Same component everywhere; no duplicate definition.

- **getAuthToken()** / **getUserData()** (`lib/auth-utils.ts`)  
  - **getAuthToken()** – used for every API request.  
  - **getUserData()** – used when you need user info (e.g. name, role, permissions). Define “how to read token/user” only here.

- **usePermissions()** (`hooks/usePermissions.ts`)  
  - Returns `hasPermission(route)`, `hasAnyPermission(routes)`, `loading`, etc. Used by **Sidebar** and anywhere we hide/show by permission. Defined once; used everywhere permission is needed.

- **usePartnerServices()** (`hooks/usePartnerServices.ts`)  
  - Fetches partner account and returns `hasService(serviceKey)`, `services`, `loading`. Used by **Sidebar** to show only enabled services. Can be used on dashboard/settings to show only relevant sections.

- **SidebarProvider / useSidebar()** (`app/partner/components/sidebar-context.tsx`)  
  - Holds **isCollapsed** and **setIsCollapsed**. Layout and Sidebar use it so collapse state is shared without prop drilling.

- **DropdownMenu** (from superadmin components)  
  - Used on list rows/cards for actions (View request, Change status, Assign, Delete, etc.). Same component across housekeeping, laundry, booking, activity, room delivery, etc. One definition; many usages.

- **Modals (add/edit/view)**  
  - **Props pattern:** `isOpen`, `onClose`, `onSuccess?`, and entity (e.g. `activity`, `restaurant`, `request`) when editing/viewing.  
  - **Open:** Parent sets `setIsModalOpen(true)` and sets the selected entity (e.g. `setSelectedRequest(row)`).  
  - **Close:** Parent sets `setIsModalOpen(false)` and clears selection.  
  - **onSuccess:** Parent refetches list and closes modal.  
  - Same pattern for AddRestaurantModal, AddActivityModal, ViewLaundryModal, ViewHousekeepingModal, etc.; no need to redefine the pattern per modal.

- **mapApiRequestToUI** (or similar)  
  - Many request list pages define a **mapper** that turns API shape (e.g. `_id`, `createdAt`, `status`) into the UI shape (e.g. `requestId`, `created`, `status` with formatted date and style). Used to build the rows passed to the table and to the view modal. Each page has one mapper; the **idea** (API → UI shape + formatting) is the same everywhere.

---

## 6. Summary table

| What | Where / how |
|------|-------------|
| **Pages** | `app/partner/pages/**/page.tsx`; one folder per route. |
| **Layout** | `layout.tsx`: AuthProvider → SidebarProvider → Sidebar + Header + main. |
| **Sidebar** | `sidebar.tsx`: menuItems + allServicesItems; filtered by usePermissions + usePartnerServices; collapse from useSidebar. |
| **State** | useState per page: list, loading, pagination, filters, modal open/closed, selected item. |
| **API** | useEffect + getAuthToken + fetch; refetch when deps (page, filters) change or after mutations. |
| **Auth** | getAuthToken(), getUserData() from `lib/auth-utils`. |
| **Permissions** | usePermissions() → hasPermission(route). |
| **Services** | usePartnerServices() → hasService(serviceKey). |
| **Icons** | PublicIcon for `/assets/icons/...`; same component everywhere. |
| **Modals** | isOpen, onClose, onSuccess, optional entity; open/close + selection in parent state. |
| **Actions on rows** | DropdownMenu with View / Change status / Assign / Delete, etc. |

If something is used in multiple places (e.g. PublicIcon, getAuthToken, modal pattern, sidebar visibility), it is defined or standardized once; the rest of the app reuses the same approach.
