import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * POST /api/upload/cloudinary - Upload image to Cloudinary using signed uploads
 * DELETE /api/upload/cloudinary - Delete image from Cloudinary
 * 
 * Uses signed uploads (no preset required) for better security
 */

/**
 * Cloudinary upload response structure
 */
interface CloudinaryResponse {
  secure_url: string
  public_id: string
  url: string
  width: number
  height: number
  format: string
  resource_type: string
  bytes: number
  created_at: string
}

/**
 * Cloudinary error response structure
 */
interface CloudinaryErrorResponse {
  error: {
    message: string
    http_code?: number
  }
}

/**
 * POST - Upload image to Cloudinary using signed upload
 * 
 * This endpoint handles image uploads to Cloudinary using signed requests.
 * No upload preset is required - uses API key and secret for authentication.
 */
export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: { message: 'No file provided' } },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: { message: 'File must be an image' } },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: { message: `Image size must be less than ${maxSize / 1024 / 1024}MB` } },
        { status: 400 }
      )
    }

    // Get Cloudinary credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary credentials not configured')
      return NextResponse.json(
        { 
          error: { 
            message: 'Image upload service not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.' 
          } 
        },
        { status: 500 }
      )
    }

    // Get upload parameters
    const folder = (formData.get('folder') as string) || undefined
    const publicId = (formData.get('public_id') as string) || undefined
    const overwrite = formData.get('overwrite') === 'true'
    const tags = (formData.get('tags') as string)?.split(',').filter(Boolean) || undefined
    const transformation = (formData.get('transformation') as string) || undefined

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Prepare parameters for signature
    const timestamp = Math.round(new Date().getTime() / 1000)
    const params: Record<string, string> = {
      timestamp: timestamp.toString(),
    }

    if (folder) {
      params.folder = folder
    }

    if (publicId) {
      params.public_id = publicId
    }

    if (overwrite) {
      params.overwrite = 'true'
    }

    if (tags && tags.length > 0) {
      params.tags = tags.join(',')
    }

    if (transformation) {
      params.eager = transformation
    }

    // Generate signature
    // Signature is SHA1 hash of: sorted_params_string + api_secret
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')

    const signature = crypto
      .createHash('sha1')
      .update(sortedParams + apiSecret)
      .digest('hex')

    // Prepare upload form data
    const uploadFormData = new FormData()
    uploadFormData.append('file', dataURI)
    uploadFormData.append('api_key', apiKey)
    uploadFormData.append('timestamp', timestamp.toString())
    uploadFormData.append('signature', signature)

    if (folder) {
      uploadFormData.append('folder', folder)
    }

    if (publicId) {
      uploadFormData.append('public_id', publicId)
    }

    if (overwrite) {
      uploadFormData.append('overwrite', 'true')
    }

    if (tags && tags.length > 0) {
      uploadFormData.append('tags', tags.join(','))
    }

    if (transformation) {
      uploadFormData.append('eager', transformation)
    }

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadFormData,
    })

    const responseText = await cloudinaryResponse.text()

    if (!cloudinaryResponse.ok) {
      let errorMessage = 'Failed to upload image to Cloudinary'
      let errorDetails: any = null

      try {
        const errorJson = JSON.parse(responseText) as CloudinaryErrorResponse
        errorMessage = errorJson.error?.message || errorMessage
        errorDetails = errorJson
      } catch {
        errorMessage = responseText || errorMessage
      }

      console.error('Cloudinary upload error:', {
        status: cloudinaryResponse.status,
        message: errorMessage,
        details: errorDetails,
      })

      return NextResponse.json(
        { 
          error: { 
            message: errorMessage,
            http_code: cloudinaryResponse.status 
          } 
        },
        { status: cloudinaryResponse.status || 500 }
      )
    }

    // Parse successful response
    let result: CloudinaryResponse
    try {
      result = JSON.parse(responseText) as CloudinaryResponse
    } catch (parseError) {
      console.error('Failed to parse Cloudinary response:', parseError)
      return NextResponse.json(
        { error: { message: 'Invalid response from Cloudinary' } },
        { status: 500 }
      )
    }

    if (!result.secure_url) {
      console.error('Cloudinary response missing secure_url:', result)
      return NextResponse.json(
        { error: { message: 'Cloudinary response missing secure_url' } },
        { status: 500 }
      )
    }

    // Return structured response
    return NextResponse.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      created_at: result.created_at,
    })
  } catch (error: any) {
    console.error('Upload API Error:', error)
    return NextResponse.json(
      { 
        error: { 
          message: error.message || 'Failed to upload image',
          http_code: 500 
        } 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete image from Cloudinary
 * 
 * This endpoint deletes an image from Cloudinary using signed requests.
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { publicId } = body

    if (!publicId || typeof publicId !== 'string' || !publicId.trim()) {
      return NextResponse.json(
        { error: { message: 'Public ID is required' } },
        { status: 400 }
      )
    }

    // Get Cloudinary credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: { message: 'Cloudinary credentials not configured' } },
        { status: 500 }
      )
    }

    // Generate signature for delete
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signatureString = `public_id=${publicId.trim()}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto
      .createHash('sha1')
      .update(signatureString)
      .digest('hex')

    // Prepare delete form data
    const deleteFormData = new FormData()
    deleteFormData.append('public_id', publicId.trim())
    deleteFormData.append('timestamp', timestamp.toString())
    deleteFormData.append('api_key', apiKey)
    deleteFormData.append('signature', signature)

    // Delete from Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`
    
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: deleteFormData,
    })

    const responseText = await cloudinaryResponse.text()

    if (!cloudinaryResponse.ok) {
      let errorMessage = 'Failed to delete image from Cloudinary'
      
      try {
        const errorJson = JSON.parse(responseText) as CloudinaryErrorResponse
        errorMessage = errorJson.error?.message || errorMessage
      } catch {
        errorMessage = responseText || errorMessage
      }

      console.error('Cloudinary delete error:', {
        status: cloudinaryResponse.status,
        message: errorMessage,
      })

      return NextResponse.json(
        { 
          error: { 
            message: errorMessage,
            http_code: cloudinaryResponse.status 
          } 
        },
        { status: cloudinaryResponse.status || 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete API Error:', error)
    return NextResponse.json(
      { 
        error: { 
          message: error.message || 'Failed to delete image',
          http_code: 500 
        } 
      },
      { status: 500 }
    )
  }
}
