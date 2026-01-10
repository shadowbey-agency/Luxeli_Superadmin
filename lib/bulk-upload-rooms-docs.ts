/**
 * Bulk Upload Rooms API Documentation
 * 
 * Endpoint: POST /api/partner/rooms/bulk-upload
 * Authentication: Required (Bearer token)
 * 
 * Request:
 * - Content-Type: multipart/form-data
 * - Body: FormData with 'file' field containing Excel file
 * 
 * Excel File Requirements:
 * - Format: .xlsx or .xls
 * - Column Headers (case-insensitive):
 *   - roomName (required): Room name/identifier
 * 
 * Example Excel Structure:
 * ┌──────────────────┐
 * │   roomName       │
 * ├──────────────────┤
 * │   Room 101       │
 * │   Room 102       │
 * │   Room 201       │
 * │   Suite 301      │
 * │   Deluxe 401     │
 * └──────────────────┘
 * 
 * Response (Success):
 * {
 *   success: true,
 *   message: "125 rooms uploaded successfully",
 *   total: 125,
 *   createdRooms: [...]
 * }
 * 
 * Response (Error):
 * {
 *   success: false,
 *   error: "Error message describing what went wrong"
 * }
 * 
 * Validation Rules:
 * 1. Room name is required for each row
 * 2. Duplicate room names within the same upload will be rejected
 * 3. Room names that already exist for the partner will be rejected
 * 4. All uploaded rooms start with 'empty' status
 * 5. Maximum file size: 5MB
 * 
 * Status Codes:
 * - 201: Rooms created successfully
 * - 400: Invalid request (missing file, empty file, or validation errors)
 * - 409: Conflict (duplicate room names)
 * - 401: Unauthorized
 * - 500: Server error
 */

export {};
