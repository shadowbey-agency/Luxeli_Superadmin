import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest, getPartnerId } from '@/lib/middleware'
import { RoomController } from '@/controllers/partner/RoomController'
import * as XLSX from 'xlsx'

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const partnerId = getPartnerId(request)
    if (!partnerId) {
      return NextResponse.json(
        { success: false, error: 'Partner ID not found in token' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Excel file is required' },
        { status: 400 } 
      )
    }

    // ✅ SAFER file validation
    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, error: 'Only Excel files are allowed' },
        { status: 400 }
      )
    }

    // ✅ CRITICAL FIX
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

    return RoomController.bulkUploadRooms(partnerId, rows)
  } catch (error: any) {
    console.error('Bulk Upload Rooms API Error:', error)
    const errorMessage = error?.message || 'Failed to upload rooms'
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    )
  }
})
