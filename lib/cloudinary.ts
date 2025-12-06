/**
 * Cloudinary utility for image uploads and management
 * Supports both client-side and server-side usage
 * Uses signed uploads (no preset required)
 */

/**
 * Cloudinary upload response structure
 */
export interface CloudinaryUploadResponse {
  /** Secure HTTPS URL of the uploaded image */
  secure_url: string
  /** Public ID of the uploaded image */
  public_id: string
  /** Regular HTTP URL of the uploaded image */
  url: string
  /** Image width in pixels */
  width: number
  /** Image height in pixels */
  height: number
  /** Image format (jpg, png, etc.) */
  format: string
  /** Resource type (image, video, etc.) */
  resource_type: string
  /** File size in bytes */
  bytes: number
  /** Creation timestamp */
  created_at: string
}

/**
 * Cloudinary upload options
 */
export interface CloudinaryUploadOptions {
  /** Folder path in Cloudinary (e.g., 'partners', 'users/avatars') */
  folder?: string
  /** Public ID for the image (if not provided, Cloudinary generates one) */
  publicId?: string
  /** Image transformations to apply during upload */
  transformation?: CloudinaryTransformation
  /** Overwrite existing image with same public_id */
  overwrite?: boolean
  /** Tags for organizing images */
  tags?: string[]
}

/**
 * Cloudinary transformation options
 */
export interface CloudinaryTransformation {
  /** Width in pixels */
  width?: number
  /** Height in pixels */
  height?: number
  /** Crop mode (fill, scale, fit, etc.) */
  crop?: string
  /** Quality (1-100) */
  quality?: number | 'auto'
  /** Format conversion (jpg, png, webp, etc.) */
  format?: string
  /** Gravity for cropping (face, center, etc.) */
  gravity?: string
  /** Additional transformation parameters */
  [key: string]: string | number | undefined
}

/**
 * Cloudinary API error response
 */
interface CloudinaryErrorResponse {
  error: {
    message: string
    http_code?: number
  }
}

/**
 * Custom error class for Cloudinary operations
 */
export class CloudinaryError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'CloudinaryError'
    Object.setPrototypeOf(this, CloudinaryError.prototype)
  }
}

/**
 * Validates file type and size before upload
 * @param file - File object to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @throws {CloudinaryError} If file is invalid
 */
function validateImageFile(file: File, maxSizeMB: number = 10): void {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new CloudinaryError(
      `Invalid file type: ${file.type}. Only image files are allowed.`,
      400
    )
  }

  // Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    throw new CloudinaryError(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of ${maxSizeMB}MB`,
      400
    )
  }

  // Validate file is not empty
  if (file.size === 0) {
    throw new CloudinaryError('File is empty', 400)
  }
}

/**
 * Uploads an image to Cloudinary via the server API route
 * @param file - File object to upload
 * @param options - Upload options (folder, publicId, transformations, etc.)
 * @returns Promise resolving to Cloudinary upload response
 * @throws {CloudinaryError} If upload fails
 * 
 * @example
 * ```ts
 * const file = event.target.files[0]
 * const result = await uploadImageToCloudinary(file, {
 *   folder: 'partners',
 *   transformation: { width: 800, height: 600, crop: 'fill' }
 * })
 * console.log(result.secure_url)
 * ```
 */
export async function uploadImageToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  try {
    // Validate file
    validateImageFile(file)

    // Prepare form data
    const formData = new FormData()
    formData.append('file', file)

    if (options.folder) {
      formData.append('folder', options.folder)
    }

    if (options.publicId) {
      formData.append('public_id', options.publicId)
    }

    if (options.overwrite !== undefined) {
      formData.append('overwrite', String(options.overwrite))
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','))
    }

    if (options.transformation) {
      const transformationString = buildTransformationString(options.transformation)
      if (transformationString) {
        formData.append('transformation', transformationString)
      }
    }

    // Upload via API route
    const response = await fetch('/api/upload/cloudinary', {
      method: 'POST',
      body: formData,
    })

    // Handle network errors
    if (!response.ok) {
      let errorMessage = `Upload failed with status ${response.status}`
      let errorDetails: any = null

      try {
        const errorText = await response.text()
        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText) as CloudinaryErrorResponse
            errorMessage = errorJson.error?.message || errorMessage
            errorDetails = errorJson
          } catch {
            errorMessage = errorText || errorMessage
          }
        }
      } catch (e) {
        console.error('Failed to read error response:', e)
      }

      throw new CloudinaryError(errorMessage, response.status, errorDetails)
    }

    // Parse response
    const result = await response.json()

    if (!result.secure_url) {
      throw new CloudinaryError(
        'Invalid response from upload service: missing secure_url',
        500,
        result
      )
    }

    return result as CloudinaryUploadResponse
  } catch (error) {
    // Re-throw CloudinaryError as-is
    if (error instanceof CloudinaryError) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new CloudinaryError(
        'Network error: Unable to connect to upload service. Please check your internet connection.',
        0,
        error
      )
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new CloudinaryError(
      `Failed to upload image: ${errorMessage}`,
      undefined,
      error
    )
  }
}

/**
 * Builds Cloudinary transformation string from options
 * @param transformation - Transformation options
 * @returns Transformation string for Cloudinary API
 */
function buildTransformationString(transformation: CloudinaryTransformation): string {
  const parts: string[] = []

  if (transformation.width) parts.push(`w_${transformation.width}`)
  if (transformation.height) parts.push(`h_${transformation.height}`)
  if (transformation.crop) parts.push(`c_${transformation.crop}`)
  if (transformation.quality) parts.push(`q_${transformation.quality}`)
  if (transformation.format) parts.push(`f_${transformation.format}`)
  if (transformation.gravity) parts.push(`g_${transformation.gravity}`)

  // Add any additional transformation parameters
  Object.keys(transformation).forEach(key => {
    if (!['width', 'height', 'crop', 'quality', 'format', 'gravity'].includes(key)) {
      const value = transformation[key]
      if (value !== undefined) {
        parts.push(`${key}_${value}`)
      }
    }
  })

  return parts.join(',')
}

/**
 * Deletes an image from Cloudinary
 * @param publicId - Cloudinary public ID of the image to delete
 * @returns Promise resolving to true if deletion was successful
 * @throws {CloudinaryError} If deletion fails
 * 
 * @example
 * ```ts
 * await deleteImageFromCloudinary('partners/hotel-image')
 * ```
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    if (!publicId || !publicId.trim()) {
      throw new CloudinaryError('Public ID is required for deletion', 400)
    }

    const response = await fetch('/api/upload/cloudinary', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId: publicId.trim() }),
    })

    if (!response.ok) {
      let errorMessage = `Delete failed with status ${response.status}`
      
      try {
        const errorText = await response.text()
        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText) as CloudinaryErrorResponse
            errorMessage = errorJson.error?.message || errorMessage
          } catch {
            errorMessage = errorText || errorMessage
          }
        }
      } catch (e) {
        console.error('Failed to read error response:', e)
      }

      throw new CloudinaryError(errorMessage, response.status)
    }

    const result = await response.json()
    return result.success === true
  } catch (error) {
    if (error instanceof CloudinaryError) {
      throw error
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new CloudinaryError(
      `Failed to delete image: ${errorMessage}`,
      undefined,
      error
    )
  }
}

/**
 * Extracts public ID from a Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID or null if URL is invalid
 * 
 * @example
 * ```ts
 * const publicId = extractPublicIdFromUrl('https://res.cloudinary.com/demo/image/upload/v1234567890/partners/hotel.jpg')
 * // Returns: 'partners/hotel'
 * ```
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    if (!url || typeof url !== 'string') {
      return null
    }

    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
    // or: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(?:[^\/]+\/)?([^\.]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/**
 * Generates a Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param transformation - Transformation options
 * @param cloudName - Cloudinary cloud name (optional, uses env var if not provided)
 * @returns Transformed Cloudinary URL
 * 
 * @example
 * ```ts
 * const url = getCloudinaryUrl('partners/hotel', {
 *   width: 800,
 *   height: 600,
 *   crop: 'fill',
 *   quality: 'auto',
 *   format: 'webp'
 * })
 * ```
 */
export function getCloudinaryUrl(
  publicId: string,
  transformation?: CloudinaryTransformation,
  cloudName?: string
): string {
  const cloud = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloud) {
    console.warn('Cloudinary cloud name not configured')
    return ''
  }

  if (!publicId) {
    console.warn('Public ID is required')
    return ''
  }

  let url = `https://res.cloudinary.com/${cloud}/image/upload`

  if (transformation) {
    const transformationString = buildTransformationString(transformation)
    if (transformationString) {
      url += `/${transformationString}`
    }
  }

  url += `/${publicId}`

  return url
}

/**
 * Generates a secure (HTTPS) Cloudinary URL with transformations
 * @param publicId - Cloudinary public ID
 * @param transformation - Transformation options
 * @param cloudName - Cloudinary cloud name (optional, uses env var if not provided)
 * @returns Secure transformed Cloudinary URL
 */
export function getCloudinarySecureUrl(
  publicId: string,
  transformation?: CloudinaryTransformation,
  cloudName?: string
): string {
  const url = getCloudinaryUrl(publicId, transformation, cloudName)
  return url.replace('http://', 'https://')
}
