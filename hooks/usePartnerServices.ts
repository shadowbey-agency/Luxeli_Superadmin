"use client"

import { useEffect, useState } from 'react'
import { getAuthToken } from '@/lib/auth-utils'

export interface PartnerServices {
  housekeeping: {
    assigned: boolean
    isActive: boolean
  }
  bookingInterns: {
    assigned: boolean
    isActive: boolean
  }
  customizedServices: {
    assigned: boolean
    isActive: boolean
  }
  activityAlerts: {
    assigned: boolean
    isActive: boolean
  }
  laundry: {
    assigned: boolean
    isActive: boolean
  }
  roomDelivery: {
    assigned: boolean
    isActive: boolean
  }
}

/**
 * Hook to fetch and access partner services
 */
export function usePartnerServices() {
  const [services, setServices] = useState<PartnerServices | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPartnerServices = async () => {
      try {
        setLoading(true)
        const token = getAuthToken()
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/partner/account', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch partner account')
        }

        const data = await response.json()
        if (data.success && data.partner?.services) {
          setServices(data.partner.services)
        } else {
          // Default to all false if no services found
          setServices({
            housekeeping: { assigned: false, isActive: false },
            bookingInterns: { assigned: false, isActive: false },
            customizedServices: { assigned: false, isActive: false },
            activityAlerts: { assigned: false, isActive: false },
            laundry: { assigned: false, isActive: false },
            roomDelivery: { assigned: false, isActive: false },
          })
        }
      } catch (err) {
        console.error('Error fetching partner services:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Default to all false on error
        setServices({
          housekeeping: { assigned: false, isActive: false },
          bookingInterns: { assigned: false, isActive: false },
          customizedServices: { assigned: false, isActive: false },
          activityAlerts: { assigned: false, isActive: false },
          laundry: { assigned: false, isActive: false },
          roomDelivery: { assigned: false, isActive: false },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerServices()

    // Listen for service update events
    const handleServiceUpdate = () => {
      fetchPartnerServices()
    }
    window.addEventListener('partnerServicesUpdated', handleServiceUpdate)

    return () => {
      window.removeEventListener('partnerServicesUpdated', handleServiceUpdate)
    }
  }, [])

  // Helper function to check if a service is enabled (both assigned and active)
  const hasService = (serviceName: keyof PartnerServices): boolean => {
    const service = services?.[serviceName]
    if (!service) return false
    // Service must be both assigned (by SuperAdmin) and active (by Partner)
    return service.assigned && service.isActive
  }

  // Helper function to check if partner has access to a route based on service
  const hasServiceAccess = (route: string): boolean => {
    if (!services) return false

    // Map routes to services
    const routeServiceMap: Record<string, keyof PartnerServices> = {
      '/partner/pages/housekeeping': 'housekeeping',
      '/partner/pages/booking': 'bookingInterns',
      '/partner/pages/customized-services': 'customizedServices',
      '/partner/pages/activity-alerts': 'activityAlerts',
      '/partner/pages/laundry': 'laundry',
      '/partner/pages/room-delivery': 'roomDelivery',
    }

    // Check exact match
    if (routeServiceMap[route]) {
      return hasService(routeServiceMap[route])
    }

    // Check if route starts with any service path
    for (const [serviceRoute, serviceKey] of Object.entries(routeServiceMap)) {
      if (route.startsWith(serviceRoute)) {
        return hasService(serviceKey)
      }
    }

    // Default to true for non-service routes (dashboard, settings, etc.)
    return true
  }

  return {
    services,
    loading,
    error,
    hasService,
    hasServiceAccess,
  }
}

