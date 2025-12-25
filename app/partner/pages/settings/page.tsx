"use client"

import { useState, useEffect } from "react"
import { RiNotification3Line, RiEyeLine, RiEyeOffLine, RiArrowDownSLine, RiAddLine, RiDeleteBinLine, RiMoreLine } from "react-icons/ri"
import PublicIcon from "@/app/partner/components/public-icon"
import ToggleSwitch from "@/app/superadmin/components/toggle-switch"
import SimpleToggleSwitch from "@/app/partner/components/simple-toggle-switch"
import Image from "next/image"
import { getAuthToken } from "@/lib/auth-utils"

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

interface Service {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  available: boolean
  status: "Active" | "Disable"
}

interface Banner {
  id: string
  number: number
  image: string
  active: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "services" | "app-management">("account")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Account form state
  const [hotelName, setHotelName] = useState("")
  const [hotelCity, setHotelCity] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [hotelAddressEmail, setHotelAddressEmail] = useState("")
  const [RC, setRC] = useState("")
  const [ICE, setICE] = useState("")
  const [identifiantFiscal, setIdentifiantFiscal] = useState("")
  const [taxeProfessionnelle, setTaxeProfessionnelle] = useState("")
  const [hotelImage, setHotelImage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "partner-status",
      title: "Partner status change",
      description: "Notify me when a hotel is approved, suspended, or reactivated.",
      enabled: true,
    },
    {
      id: "payment-failed",
      title: "Payment failed",
      description: "Inform me when a charge fails; include retry link.",
      enabled: false,
    },
    {
      id: "subscription-expiring",
      title: "Subscription expiring",
      description: "Remind me 14 days before a hotel's plan renews.",
      enabled: true,
    },
    {
      id: "new-support",
      title: "New support ticket",
      description: "Alert me for tickets P1–P2 created by partners.",
      enabled: true,
    },
    {
      id: "plan-changed",
      title: "Plan changed",
      description: "Notify on upgrade/downgrade of a partner's plan.",
      enabled: true,
    },
    {
      id: "account-deletion",
      title: "Account deletion request",
      description: "Alert me if a hotel requests data deletion.",
      enabled: true,
    },
  ])

  // Service definitions with metadata
  const allServiceDefinitions: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    partnerServiceKey: keyof {
      housekeeping: { assigned: boolean; isActive: boolean };
      bookingInterns: { assigned: boolean; isActive: boolean };
      customizedServices: { assigned: boolean; isActive: boolean };
      activityAlerts: { assigned: boolean; isActive: boolean };
      laundry: { assigned: boolean; isActive: boolean };
      roomDelivery: { assigned: boolean; isActive: boolean };
    };
  }> = [
      {
        id: "housekeeping",
        title: "Housekeeping",
        description: "Guests request cleaning, turndown, towels, and amenities –auto-assigned to housekeeping with tracking.",
        icon: <PublicIcon src="/assets/icons/housekeeping.svg" alt="Housekeeping" width={32} height={32} />,
        partnerServiceKey: "housekeeping"
      },
      {
        id: "bookings-interns",
        title: "Bookings interns",
        description: "Take on-property bookings for spa, restaurant, or activities, with time slots and capacity.",
        icon: <PublicIcon src="/assets/icons/calendar.svg" alt="Bookings interns" width={32} height={32} />,
        partnerServiceKey: "bookingInterns"
      },
      {
        id: "customized-services",
        title: "Customized services",
        description: "Offer tailored services-airport pickup, birthday setup- define price, lead time, and visibility.",
        icon: <PublicIcon src="/assets/icons/customized service.svg" alt="Customized services" width={32} height={32} />,
        partnerServiceKey: "customizedServices"
      },
      {
        id: "activity-alerts",
        title: "Activity alerts",
        description: "Send targeted notifications about events, offers, or schedule changes to selected guests.",
        icon: <PublicIcon src="/assets/icons/activity alert.svg" alt="Activity alerts" width={32} height={32} />,
        partnerServiceKey: "activityAlerts"
      },
      {
        id: "laundry",
        title: "Laundry",
        description: "Schedule laundry pickup and delivery; per-item pricing with live status updates.",
        icon: <PublicIcon src="/assets/icons/laundary.svg" alt="Laundry" width={32} height={32} />,
        partnerServiceKey: "laundry"
      },
      {
        id: "in-room-delivery",
        title: "In-room delivery",
        description: "Guests order food and amenities to the room, with prep-to-delivered tracking.",
        icon: <PublicIcon src="/assets/icons/in-room delivery.svg" alt="In-room delivery" width={32} height={32} />,
        partnerServiceKey: "roomDelivery"
      }
    ]

  const [services, setServices] = useState<Service[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "1",
      number: 1,
      image: "https://img.freepik.com/premium-vector/creative-social-food-banner-template-design_1119344-107.jpg",
      active: true
    },
    {
      id: "2",
      number: 2,
      image: "https://img.freepik.com/premium-vector/creative-social-food-banner-template-design_1119344-107.jpg",
      active: true
    },
    {
      id: "3",
      number: 3,
      image: "https://img.freepik.com/premium-vector/creative-social-food-banner-template-design_1119344-107.jpg",
      active: true
    },
    {
      id: "4",
      number: 4,
      image: "https://img.freepik.com/premium-vector/creative-social-food-banner-template-design_1119344-107.jpg",
      active: true
    }
  ])

  const handleToggle = (id: string) => {
    setNotificationSettings(
      notificationSettings.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  const handleServiceToggle = async (id: string) => {
    // Find the service definition to get the partner service key
    const serviceDef = allServiceDefinitions.find(def => def.id === id)
    if (!serviceDef) return

    // Find current service state
    const currentService = services.find(s => s.id === id)
    if (!currentService) return

    // Calculate new status
    const newStatus = currentService.status === "Active" ? false : true

    // Optimistically update UI
    setServices(
      services.map((service) => ({
        ...service,
        status: service.id === id ? (newStatus ? "Active" : "Disable") : service.status
      }))
    )

    try {
      const token = getAuthToken()
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        // Revert optimistic update
        setServices(
          services.map((service) => ({
            ...service,
            status: service.id === id ? currentService.status : service.status
          }))
        )
        return
      }

      // Fetch current partner services to preserve other services
      const response = await fetch('/api/partner/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (!response.ok || !data.partner?.services) {
        throw new Error(data.error || 'Failed to fetch current services')
      }

      // Update only the isActive field for the specific service (preserve assigned)
      const currentService = data.partner.services[serviceDef.partnerServiceKey] || { assigned: false, isActive: false }
      const updatedServices = {
        ...data.partner.services,
        [serviceDef.partnerServiceKey]: {
          ...currentService,
          isActive: newStatus
        }
      }

      // Call API to update service
      const updateResponse = await fetch('/api/partner/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          services: updatedServices
        })
      })

      const updateData = await updateResponse.json()

      if (!updateResponse.ok || !updateData.success) {
        throw new Error(updateData.error || 'Failed to update service')
      }

      // Update local state with the actual response
      if (updateData.partner?.services) {
        const partnerServices = updateData.partner.services
        const updatedServiceList = allServiceDefinitions
          .map(serviceDef => {
            const service = partnerServices[serviceDef.partnerServiceKey] || { assigned: false, isActive: false }
            // Service is active only if both assigned (by SuperAdmin) and isActive (by Partner)
            const isActive = service.assigned && service.isActive
            return {
              id: serviceDef.id,
              title: serviceDef.title,
              description: serviceDef.description,
              icon: serviceDef.icon,
              available: service.assigned, // Only show as available if assigned by SuperAdmin
              status: isActive ? "Active" as const : "Disable" as const
            }
          })
          .filter(service => service.available)
        setServices(updatedServiceList)
      }

      // Trigger event to refresh partner services hook (for sidebar update)
      window.dispatchEvent(new Event('partnerServicesUpdated'))

    } catch (err: any) {
      console.error('Error updating service:', err)
      setError(err.message || 'Failed to update service')
      // Revert optimistic update on error
      setServices(
        services.map((service) => ({
          ...service,
          status: service.id === id ? currentService.status : service.status
        }))
      )
    }
  }

  const handleBannerToggle = (id: string) => {
    setBanners(
      banners.map((banner) => ({
        ...banner,
        active: banner.id === id ? !banner.active : banner.active
      }))
    )
  }

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter((banner) => banner.id !== id))
  }

  // Fetch partner account data
  const fetchPartnerAccount = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const token = getAuthToken()
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/partner/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok && data.partner) {
        const partner = data.partner
        setHotelName(partner.hotelName || "")
        setHotelCity(partner.hotelCity || "")
        setPhoneNumber(partner.phoneNumber || "")
        setHotelAddressEmail(partner.hotelAddressEmail || "")
        setRC(partner.RC || "")
        setICE(partner.ICE || "")
        setIdentifiantFiscal(partner.identifiantFiscal || "")
        setTaxeProfessionnelle(partner.taxeProfessionnelle || "")
        setHotelImage(partner.hotelImage || "")
        setImagePreview(partner.hotelImage || null)
      } else {
        setError(data.error || 'Failed to fetch account data')
      }
    } catch (err: any) {
      console.error('Error fetching partner account:', err)
      setError(err.message || 'Failed to fetch account data')
    } finally {
      setIsLoading(false)
    }
  }

  // Save account changes
  const handleSaveAccount = async () => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccessMessage(null)
      const token = getAuthToken()
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsSaving(false)
        return
      }

      const response = await fetch('/api/partner/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hotelName: hotelName.trim(),
          hotelCity: hotelCity.trim(),
          phoneNumber: phoneNumber.trim(),
          hotelAddressEmail: hotelAddressEmail.trim(),
          RC: RC.trim(),
          ICE: ICE.trim(),
          identifiantFiscal: identifiantFiscal.trim(),
          taxeProfessionnelle: taxeProfessionnelle.trim(),
          hotelImage: hotelImage || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccessMessage('Account updated successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
        // Refresh account data
        await fetchPartnerAccount()
      } else {
        setError(data.error || 'Failed to update account')
      }
    } catch (err: any) {
      console.error('Error updating account:', err)
      setError(err.message || 'Failed to update account')
    } finally {
      setIsSaving(false)
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      setIsChangingPassword(true)
      setError(null)
      setSuccessMessage(null)
      const token = getAuthToken()
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsChangingPassword(false)
        return
      }

      const response = await fetch('/api/partner/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccessMessage('Password changed successfully')
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(data.error || 'Failed to change password')
      }
    } catch (err: any) {
      console.error('Error changing password:', err)
      setError(err.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setHotelImage(result) // Store as base64 for now
      }
      reader.readAsDataURL(file)
    }
  }

  // Fetch partner services from API
  const fetchPartnerServices = async () => {
    try {
      setIsLoadingServices(true)
      setError(null)
      const token = getAuthToken()
      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsLoadingServices(false)
        return
      }

      const response = await fetch('/api/partner/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok && data.partner?.services) {
        const partnerServices = data.partner.services

        // Show only services that were assigned by superadmin
        // Partner can only enable/disable services that are assigned (available = assigned)
        const assignedServices = allServiceDefinitions
          .map(serviceDef => {
            const service = partnerServices[serviceDef.partnerServiceKey] || { assigned: false, isActive: false }
            // Service is active only if both assigned (by SuperAdmin) and isActive (by Partner)
            const isActive = service.assigned && service.isActive
            return {
              id: serviceDef.id,
              title: serviceDef.title,
              description: serviceDef.description,
              icon: serviceDef.icon,
              available: service.assigned, // Only available if assigned by SuperAdmin
              status: isActive ? "Active" as const : "Disable" as const
            }
          })
          // Filter to only show services assigned by SuperAdmin
          .filter(service => service.available)

        setServices(assignedServices)
      } else {
        setError(data.error || 'Failed to fetch services')
        setServices([])
      }
    } catch (err: any) {
      console.error('Error fetching partner services:', err)
      setError(err.message || 'Failed to fetch services')
      setServices([])
    } finally {
      setIsLoadingServices(false)
    }
  }

  // Fetch account data on mount
  useEffect(() => {
    if (activeTab === "account") {
      fetchPartnerAccount()
    } else if (activeTab === "services") {
      fetchPartnerServices()
    }
  }, [activeTab])

  return (
    <div className="p-6 min-h-screen  ">
      {/* Pack Gold Box */}
      <div className="mb-6 p-4 border border-gray-200 rounded-[10px]">
        <div className="flex items-center gap-3 mb-4">
          <div
            style={{
              display: "flex",
              width: "40px",
              height: "40px",
              padding: "8px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "7.059px",
              borderRadius: "70.588px",
              border: "0.353px solid #D1924F",
              background: "rgba(209, 146, 79, 0.20)",
              boxShadow: "0 2.471px 3.882px 0 rgba(0, 0, 0, 0.02)"
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="18"
              viewBox="0 0 10 12"
              fill="none"
              style={{
                width: "15px",
                height: "18px",
                flexShrink: 0
              }}
            >
              <path d="M1.0085 5.20266C0.825886 4.69725 0.734577 4.44454 0.773513 4.28261C0.816099 4.10549 0.942058 3.96741 1.10306 3.92134C1.25026 3.87923 1.47925 3.981 1.93723 4.18455C2.34231 4.36459 2.54485 4.45461 2.73515 4.4496C2.94468 4.44409 3.14624 4.36006 3.30658 4.21139C3.4522 4.07636 3.54988 3.86119 3.74523 3.43084L4.17575 2.48242C4.53538 1.69019 4.71519 1.29407 4.99994 1.29407C5.28469 1.29407 5.46451 1.69019 5.82413 2.48242L6.25466 3.43084C6.45001 3.86119 6.54768 4.07636 6.69331 4.21139C6.85365 4.36006 7.05521 4.44409 7.26473 4.4496C7.45503 4.45461 7.65758 4.36459 8.06266 4.18455C8.52064 3.981 8.74962 3.87923 8.89682 3.92134C9.05783 3.96741 9.18379 4.10549 9.22637 4.28261C9.26531 4.44454 9.174 4.69725 8.99138 5.20266L8.20643 7.37509C7.87064 8.30441 7.70275 8.76906 7.3514 9.03157C7.00005 9.29407 6.54602 9.29407 5.63795 9.29407H4.36194C3.45387 9.29407 2.99983 9.29407 2.64849 9.03157C2.29714 8.76906 2.12924 8.30441 1.79346 7.37509L1.0085 5.20266Z" stroke="#D1924F" strokeWidth="1.4" />
              <path d="M5 6.94116H5.00423" stroke="#D1924F" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.64648 10.7058H7.35237" stroke="#D1924F" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">Pack Gold</span>
              <div
                style={{
                  width: "92px",
                  height: "22px",
                  borderRadius: "5px",
                  gap: "10px",
                  padding: "2px 10px",
                  background: "#F6F9FF",
                  color: "#5C5C5C",
                  fontWeight: "500",
                  fontSize: "12px",
                  lineHeight: "18px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Current Plan
              </div>
            </div>
            <p className="text-sm text-gray-500">Date : Jan 15,10:30 AM - Jan 15,10:30 AM</p>
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <div
            className="h-2 rounded-full mb-2"
            style={{
              width: "100%",
              height: "8px",
              borderRadius: "10px",
              background: "#EEF0F3"
            }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "85%",
                background: "#4195BF",
                borderRadius: "10px"
              }}
            />
          </div>
          <p className="text-sm text-gray-600">125 Days left</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "account"
                ? "text-foreground border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]"
              }`}
            style={{ width: "190px" }}
          >
            <PublicIcon src="/assets/icons/account.svg" alt="Account" width={20} height={20} />
            Account
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "notifications"
                ? "text-foreground border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]"
              }`}
            style={{ width: "190px" }}
          >
            <RiNotification3Line className="w-5 h-5" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "services"
                ? "text-foreground border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]"
              }`}
            style={{ width: "190px" }}
          >
            <PublicIcon src="/assets/icons/services.svg" alt="Services" width={20} height={20} />
            Services
          </button>
          <button
            onClick={() => setActiveTab("app-management")}
            className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === "app-management"
                ? "text-foreground border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground border-b-2 border-[#EDEDED] -mb-[2px]"
              }`}
            style={{ width: "190px" }}
          >
            <PublicIcon src="/assets/icons/app management.svg" alt="App management" width={20} height={20} />
            App management
          </button>
        </div>
      </div>

      <div>
        {activeTab === "account" && (
          <div
            className=" bg-white rounded-lg border border-[rgba(0,0,0,0.08)]"
            style={{ flexShrink: 0 }}
          >
            <div className="flex w-full p-4 justify-between items-center rounded-t-lg border-b border-[rgba(33,33,33,0.08)] bg-[#FBFAFA]">
              <div>
                <h2 className="text-lg font-semibold text-[#212121] mb-1">Manage your account</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal information, contact details, and password to keep your account secure and up to
                  date.
                </p>
              </div>
              <button
                onClick={handleSaveAccount}
                disabled={isSaving || isLoading}
                className="px-6 py-2.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="p-6 bg-white rounded-b-lg space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {successMessage}
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col lg:flex-row items-start gap-5">
                    {/* Personal Information Section */}
                    <div className="flex-1 flex p-4 flex-col items-start gap-3.5 rounded-xl border border-dashed border-[rgba(0,0,0,0.12)]">
                      <div className="flex pb-3 items-center gap-3 self-stretch border-b border-[rgba(0,0,0,0.12)]">
                        <h3 className="text-base font-semibold text-[#212121]">Hotel Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {/* Row 1 - First 4 fields */}
                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">Hotel name</label>
                          <input
                            type="text"
                            value={hotelName}
                            onChange={(e) => setHotelName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">Hotel city</label>
                          <div className="relative">
                            <select
                              value={hotelCity}
                              onChange={(e) => setHotelCity(e.target.value)}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
                            >
                              <option value="">Select city</option>
                              <option value="agadir">Agadir</option>
                              <option value="casablanca">Casablanca</option>
                              <option value="marrakech">Marrakech</option>
                              <option value="rabat">Rabat</option>
                            </select>
                            <RiArrowDownSLine className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">Phone number</label>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">Hotel address email</label>
                          <input
                            type="email"
                            value={hotelAddressEmail}
                            onChange={(e) => setHotelAddressEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {/* Row 2 - Second 4 fields */}
                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">RC</label>
                          <input
                            type="text"
                            value={RC}
                            onChange={(e) => setRC(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">ICE</label>
                          <input
                            type="text"
                            value={ICE}
                            onChange={(e) => setICE(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">Identifiant Fiscal</label>
                          <input
                            type="text"
                            value={identifiantFiscal}
                            onChange={(e) => setIdentifiantFiscal(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#212121] mb-2">Taxe Professionnelle</label>
                          <input
                            type="text"
                            value={taxeProfessionnelle}
                            onChange={(e) => setTaxeProfessionnelle(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex max-w-[327px] h-[142px] p-[22px] items-center gap-5 rounded-[11px] border border-dashed border-[rgba(0,0,0,0.12)] bg-white">
                      {/* Hotel Picture Circle */}
                      <div className="flex w-[84px] h-[84px] justify-center items-center flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Hotel"
                            width={84}
                            height={84}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Hotel Picture Content */}
                      <div className="flex flex-col gap-2 flex-1">
                        <h4 className="text-sm font-semibold text-[#212121]">Hotel picture</h4>
                        <p className="text-xs text-muted-foreground">Update your Hotel picture.</p>
                        <label className="flex h-7 px-[11.5px] py-[1px] justify-center items-center rounded-[5px] border border-[#E5E7EB] bg-white text-sm font-medium text-[#212121] hover:bg-gray-50 transition-colors w-fit cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          Change Picture
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex p-4 flex-col items-start gap-3.5 rounded-xl border border-dashed border-[rgba(0,0,0,0.12)]">
                <div className="flex pb-3 items-center gap-3 self-stretch border-b border-[rgba(0,0,0,0.12)]">
                  <h3 className="text-base font-semibold text-[#212121]">Password</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Current password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">New password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Confirm password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="px-4 py-2 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>

              <div className="flex p-4 flex-col items-start gap-3.5 rounded-xl border border-dashed border-[rgba(0,0,0,0.12)]">
                <div className="flex pb-3 items-center gap-3 self-stretch border-b border-[rgba(0,0,0,0.12)]">
                  <h3 className="text-base font-semibold text-[#212121]">Language</h3>
                </div>

                <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language for the interface and system messages.
                  </p>

                  <div className="relative gap-2">
                    <select className="flex h-[37px] px-5 items-center gap-1.5 rounded-md border border-[#EFF0F6] bg-[#FBFAFA] text-sm text-[#212121] appearance-none pr-10 pl-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                      <option value="es">Spanish</option>
                    </select>

                    {/* Flag Icon */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="16"
                        viewBox="0 0 16 17"
                        fill="none"
                        className="flex-shrink-0"
                      >
                        <g clipPath="url(#clip0_1_18483)">
                          <path
                            d="M8 16.5601C12.4183 16.5601 16 12.9783 16 8.56006C16 4.14178 12.4183 0.560059 8 0.560059C3.58172 0.560059 0 4.14178 0 8.56006C0 12.9783 3.58172 16.5601 8 16.5601Z"
                            fill="#F0F0F0"
                          />
                          <path
                            d="M7.65234 8.56011H16.0002C16.0002 7.83805 15.9039 7.13855 15.7246 6.47314H7.65234V8.56011Z"
                            fill="#D80027"
                          />
                          <path
                            d="M7.65234 4.38616H14.826C14.3362 3.58704 13.7101 2.88069 12.98 2.29919H7.65234V4.38616Z"
                            fill="#D80027"
                          />
                          <path
                            d="M7.99941 16.56C9.88219 16.56 11.6127 15.9093 12.9793 14.8209H3.01953C4.38609 15.9093 6.11663 16.56 7.99941 16.56Z"
                            fill="#D80027"
                          />
                          <path
                            d="M1.17398 12.7339H14.8256C15.2188 12.0924 15.5237 11.3912 15.7242 10.647H0.275391C0.475922 11.3912 0.780828 12.0924 1.17398 12.7339Z"
                            fill="#D80027"
                          />
                          <path
                            d="M3.70575 1.80937H4.43478L3.75666 2.30203L4.01569 3.09918L3.33759 2.60653L2.6595 3.09918L2.88325 2.41053C2.28619 2.90787 1.76287 3.49056 1.33162 4.13981H1.56522L1.13356 4.4534C1.06631 4.56559 1.00181 4.67956 0.94 4.79521L1.14612 5.42962L0.761563 5.15021C0.665969 5.35275 0.578531 5.55984 0.499938 5.77125L0.727031 6.47025H1.56522L0.887094 6.9629L1.14612 7.76006L0.468031 7.2674L0.0618437 7.56253C0.0211875 7.88934 0 8.22221 0 8.56006H8C8 4.14181 8 3.62093 8 0.560059C6.41963 0.560059 4.94641 1.0185 3.70575 1.80937ZM4.01569 7.76006L3.33759 7.2674L2.6595 7.76006L2.91853 6.9629L2.24041 6.47025H3.07859L3.33759 5.67309L3.59659 6.47025H4.43478L3.75666 6.9629L4.01569 7.76006ZM3.75666 4.63246L4.01569 5.42962L3.33759 4.93696L2.6595 5.42962L2.91853 4.63246L2.24041 4.13981H3.07859L3.33759 3.34265L3.59659 4.13981H4.43478L3.75666 4.63246ZM6.88525 7.76006L6.20716 7.2674L5.52906 7.76006L5.78809 6.9629L5.10997 6.47025H5.94816L6.20716 5.67309L6.46616 6.47025H7.30434L6.62622 6.9629L6.88525 7.76006ZM6.62622 4.63246L6.88525 5.42962L6.20716 4.93696L5.52906 5.42962L5.78809 4.63246L5.10997 4.13981H5.94816L6.20716 3.34265L6.46616 4.13981H7.30434L6.62622 4.63246ZM6.62622 2.30203L6.88525 3.09918L6.20716 2.60653L5.52906 3.09918L5.78809 2.30203L5.10997 1.80937H5.94816L6.20716 1.01221L6.46616 1.80937H7.30434L6.62622 2.30203Z"
                            fill="#0052B4"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_18483">
                            <rect width="16" height="16" fill="white" transform="translate(0 0.560059)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>

                    {/* Chevron Icon */}
                    <RiArrowDownSLine className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div
            className=" bg-white rounded-lg border border-[rgba(0,0,0,0.08)]"
            style={{ flexShrink: 0 }}
          >
            <div className="flex w-full p-4 justify-between items-center rounded-t-lg border-b border-[rgba(33,33,33,0.08)] bg-[#FBFAFA]">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Notification settings</h2>
                <p className="text-sm text-muted-foreground">Choose what I receive as platform owner.</p>
              </div>
              <button className="px-6 py-2.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 rounded-lg text-sm font-medium transition-colors">
                Save Changes
              </button>
            </div>

            <div className="p-6 bg-white rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notificationSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">{setting.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{setting.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <SimpleToggleSwitch checked={setting.enabled} onChange={() => handleToggle(setting.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div
            className=" bg-white rounded-lg border border-[rgba(0,0,0,0.08)]"
            style={{ flexShrink: 0 }}
          >
            <div className="flex w-full p-4 justify-between items-center rounded-t-lg border-b border-[rgba(33,33,33,0.08)] bg-[#FBFAFA]">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Services</h2>
                <p className="text-sm text-muted-foreground">
                  Enable and configure the services available to your guests. Turn a service off to hide it from the guest app.
                </p>
              </div>
              <button className="px-6 py-2.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 rounded-lg text-sm font-medium transition-colors">
                Save Changes
              </button>
            </div>

            <div className="p-6 bg-white rounded-b-lg">
              {isLoadingServices ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-muted-foreground">No services available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white border border-[#E7E7E7] rounded-[10px] p-5 h-[168px] w-full"
                    >
                      {/* Upper Section */}
                      <div className="flex gap-[15px] mb-[20px] h-[76px]">
                        {/* Logo Circle */}
                        <div
                          className="flex items-center justify-center rounded-full border border-[#DDDFE3] bg-[#E9EAEC80] p-2 w-[76px] h-[76px] flex-shrink-0"
                        >
                          <div className="w-8 h-8">
                            {service.icon}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col gap-[2px] flex-1">
                          {/* Title with Status */}
                          <div className="flex items-center justify-between h-[28px]">
                            <h3 className="text-sm font-semibold text-foreground">{service.title}</h3>
                            <div
                              className={`px-[10px] py-[5px] rounded-[10px] border text-xs font-medium h-[28px] flex items-center gap-1 ${service.available
                                  ? "bg-[#F3FFEA] border-[#13B601] text-[#13B601]"
                                  : "bg-[#FF0D0D0D] border-[#FF0D0D] text-[#FF0D0D]"
                                }`}
                            >
                              {service.available ? (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  Available
                                </>
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  Unavailable
                                </>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-[#5C5C5C] text-sm leading-[22px] flex-1">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Border */}
                      <div className="w-full h-px bg-[#E6E6E6] mb-[20px]"></div>

                      {/* Footer */}
                      <div className="flex items-center justify-between h-[22px]">
                        <span className="text-[#0A0A0A] text-sm font-medium leading-[22px]">{service.status}</span>
                        <SimpleToggleSwitch
                          checked={service.status === "Active"}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "app-management" && (
          <div
            className=" bg-white rounded-lg border border-[rgba(0,0,0,0.08)]"
            style={{ flexShrink: 0 }}
          >
            <div className="flex w-full p-4 justify-between items-center rounded-t-lg border-b border-[rgba(33,33,33,0.08)] bg-[#FBFAFA]">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">App management</h2>
                <p className="text-sm text-muted-foreground">
                  Borem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <button className="px-6 py-2.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 rounded-lg text-sm font-medium transition-colors">
                Save Changes
              </button>
            </div>

            <div className="p-4 bg-white rounded-b-lg">
              {/* Banners Section */}
              <div className="mb-4">
                {/* Dashed Border Container */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-foreground">Banners</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      <RiAddLine className="w-4 h-4" />
                      Add new banner
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {banners.map((banner) => (
                      <div
                        key={banner.id}
                        className="bg-[#FBFAFA] border border-[#00000014] rounded-lg p-4 flex flex-col justify-between h-[358px] w-full"
                      >
                        {/* Top Row - Number and Toggle */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold text-foreground">{banner.number}</span>
                          <div className="flex items-center gap-2">

                            <ToggleSwitch
                              checked={banner.active}
                              onChange={() => handleBannerToggle(banner.id)}
                            />

                          </div>
                        </div>

                        {/* Image */}
                        <div className="flex-1 mb-2">
                          <div
                            className="w-full bg-gray-200 border border-[#00000014] flex items-center justify-center shadow-lg"
                            style={{
                              height: "270px",
                              borderRadius: "6px",
                              boxShadow: "0px 12px 24px 0px #12263F08"
                            }}
                          >
                            <Image
                              src={banner.image}
                              alt={`Banner ${banner.number}`}
                              width={492}
                              height={270}
                              className="w-full h-full object-cover"
                              style={{ borderRadius: "6px" }}
                            />
                          </div>
                        </div>

                        {/* Bottom Row - Actions */}
                        <div className="flex items-center justify-between h-[20px]">
                          <RiMoreLine className="w-5 h-5 text-gray-400" />
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <RiDeleteBinLine className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
