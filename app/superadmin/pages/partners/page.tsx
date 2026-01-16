"use client"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import {
  RiHotelBedLine,
  RiTeamLine,
  RiUserLine,
  RiMoreLine,
  RiAddLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiLockPasswordLine,
} from "react-icons/ri"
import StatCard from "@/app/superadmin/components/stat-card"
import ToggleSwitch from "@/app/superadmin/components/toggle-switch"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import DropdownArrow from "@/app/superadmin/components/dropdown-arrow"
import CarIcon from "@/app/superadmin/components/car-icon"
import StaffIcon from "@/app/superadmin/components/staff-icon"
import ActivePartnerIcon from "@/app/superadmin/components/active-partner-icon"
import SortArrows from "@/app/superadmin/components/sort-arrows"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import { getAuthToken } from "@/lib/auth-utils"
import ExportToExcel from "@/app/exportin-excel/export-to-excel"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import PublicIcon from "@/app/partner/components/public-icon"
import { FiEye, FiEyeOff } from "react-icons/fi"
import AlertDialog from "@/app/partner/components/alert-dialog"
import { FaTrash } from "react-icons/fa"
import ResetPasswordModal from "@/app/superadmin/components/reset-password-modal"
import { uploadImageToCloudinary } from "@/lib/cloudinary"
import SuccessCard from "@/app/superadmin/components/success-card"
import ErrorCard from "@/app/superadmin/components/error-card"

interface Partner {
  id: string
  hotelName: string
  hotelAddressEmail: string
  username: string
  phone: string
  city: string
  services: {
    housekeeping: { assigned: boolean; isActive: boolean };
    bookingInterns: { assigned: boolean; isActive: boolean };
    customizedServices: { assigned: boolean; isActive: boolean };
    activityAlerts: { assigned: boolean; isActive: boolean };
    laundry: { assigned: boolean; isActive: boolean };
    roomDelivery: { assigned: boolean; isActive: boolean };
  }
  plan: string
  createdAt: string
  createdAtDate?: Date // Store original date for filtering
  status: string
  RC?: string
  ICE?: string
  identifiantFiscal?: string
  taxeProfessionnelle?: string
  startDate?: string | Date
  endDate?: string | Date
  hotelImage?: string
  hotelCity?: string
  phoneNumber?: string
  stats?: {
    totalRooms: number
    totalStaff: number
    activeClients: number
  }
}

interface SubscriptionHistory {
  id: string
  plan: string
  period: string
  amount: string
  method: string
  transactionId: string
  date: string
  status: 'paid' | 'pending'
}

// Helper to create mock partners with dates in different periods for testing
const createMockPartners = (): Partner[] => {
  const now = new Date()
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - now.getDay())

  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(thisWeekStart.getDate() - 7)

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Create partners in different periods for realistic testing
  const formatDate = (date: Date) => date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return [
    {
      id: "1",
      hotelName: "Hotel Name",
      hotelAddressEmail: "Hotel@email.com",
      username: "hotel_user1",
      phone: "+212 532-002529",
      city: "Casablanca",
      services: {
        housekeeping: { assigned: true, isActive: false },
        bookingInterns: { assigned: true, isActive: false },
        customizedServices: { assigned: true, isActive: false },
        activityAlerts: { assigned: false, isActive: false },
        laundry: { assigned: false, isActive: false },
        roomDelivery: { assigned: false, isActive: false },
      },
      plan: "Plan name",
      createdAt: formatDate(new Date(thisWeekStart.getTime() + 2 * 24 * 60 * 60 * 1000)), // 2 days into this week
      createdAtDate: new Date(thisWeekStart.getTime() + 2 * 24 * 60 * 60 * 1000),
      status: "active",
      RC: "12345",
      ICE: "67890",
      identifiantFiscal: "112233",
      taxeProfessionnelle: "445566",
    },
    {
      id: "2",
      hotelName: "Hotel Name",
      hotelAddressEmail: "Hotel@email.com",
      username: "hotel_user2",
      phone: "+212 532-002529",
      city: "Casablanca",
      services: {
        housekeeping: { assigned: true, isActive: false },
        bookingInterns: { assigned: true, isActive: false },
        customizedServices: { assigned: false, isActive: false },
        activityAlerts: { assigned: false, isActive: false },
        laundry: { assigned: false, isActive: false },
        roomDelivery: { assigned: false, isActive: false },
      },
      plan: "Plan name",
      createdAt: formatDate(new Date(lastWeekStart.getTime() + 3 * 24 * 60 * 60 * 1000)), // Last week
      createdAtDate: new Date(lastWeekStart.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: "disable",
    },
    {
      id: "3",
      hotelName: "Hotel Name",
      hotelAddressEmail: "Hotel@email.com",
      username: "hotel_user3",
      phone: "+212 532-002529",
      city: "Casablanca",
      services: {
        housekeeping: { assigned: true, isActive: false },
        bookingInterns: { assigned: false, isActive: false },
        customizedServices: { assigned: false, isActive: false },
        activityAlerts: { assigned: false, isActive: false },
        laundry: { assigned: false, isActive: false },
        roomDelivery: { assigned: false, isActive: false },
      },
      plan: "Plan name",
      createdAt: formatDate(new Date(thisMonthStart.getTime() + 5 * 24 * 60 * 60 * 1000)), // This month
      createdAtDate: new Date(thisMonthStart.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: "active",
    },
  ]
}

const mockPartners: Partner[] = createMockPartners()

const subscriptionHistoryData: SubscriptionHistory[] = [
  {
    id: "1",
    plan: "Gold",
    period: "15 Jun 2025 → 15 Jun 2026",
    amount: "2,999 MAD",
    method: "Card (Visa ••3421)",
    transactionId: "#INV-2025-0061",
    date: "23 Mar 2024, 10:42",
    status: "paid"
  },
  {
    id: "2",
    plan: "Gold",
    period: "15 Jun 2024 → 15 Jun 2025",
    amount: "2,999 MAD",
    method: "Card (Visa ••3421)",
    transactionId: "#INV-2024-0061",
    date: "23 Mar 2023, 10:42",
    status: "pending"
  },
  {
    id: "3",
    plan: "Gold",
    period: "15 Jun 2023 → 15 Jun 2024",
    amount: "2,999 MAD",
    method: "Card (Visa ••3421)",
    transactionId: "#INV-2023-0061",
    date: "23 Mar 2022, 10:42",
    status: "paid"
  },
  {
    id: "4",
    plan: "Gold",
    period: "15 Jun 2022 → 15 Jun 2023",
    amount: "2,999 MAD",
    method: "Card (Visa ••3421)",
    transactionId: "#INV-2022-0061",
    date: "23 Mar 2021, 10:42",
    status: "pending"
  }
]

// Reusable Subscription Card Component
const SubscriptionCard = ({ subscription }: { subscription: SubscriptionHistory }) => (
  <div
    className="rounded-2xl border bg-white flex flex-col"
    style={{
      width: "100%",
      boxShadow: "5px 10px 40px 0 rgba(217, 222, 234, 0.14)",
      borderRadius: "12px"
    }}
  >
    {/* Main Content Section */}
    <div className="flex-1 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Plan</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{subscription.plan}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Period</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{subscription.period}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Amount</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{subscription.amount}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Method</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{subscription.method}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Transaction ID</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{subscription.transactionId}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Date</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{subscription.date}</span>
      </div>
      <div
        className="flex justify-between items-center "
      >
        {/* Left Side - Icons */}
        <div className="flex items-center gap-2">
          {/* Eye icon */}
          <button
            className="flex items-center justify-center hover:bg-gray-50 transition-colors rounded"
            style={{
              width: "30px",
              height: "30px",
              padding: "4px 7.333px",
              borderRadius: "5px",
              border: "0.789px solid #F6F3F2",
              background: "#FBFAFA"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M14.3623 5.21847C14.565 5.50268 14.6663 5.64479 14.6663 5.85514C14.6663 6.0655 14.565 6.20761 14.3623 6.49182C13.4516 7.76885 11.1258 10.5218 7.99968 10.5218C4.87353 10.5218 2.54774 7.76885 1.63704 6.49182C1.43435 6.20761 1.33301 6.0655 1.33301 5.85514C1.33301 5.64479 1.43435 5.50268 1.63703 5.21847C2.54774 3.94144 4.87353 1.18848 7.99968 1.18848C11.1258 1.18848 13.4516 3.94144 14.3623 5.21847Z" stroke="#141B34" />
              <path d="M10 5.85547C10 4.7509 9.10457 3.85547 8 3.85547C6.89543 3.85547 6 4.7509 6 5.85547C6 6.96004 6.89543 7.85547 8 7.85547C9.10457 7.85547 10 6.96004 10 5.85547Z" stroke="#121212" />
            </svg>
          </button>

          {/* Download icon */}
          <button
            className="flex items-center justify-center hover:bg-gray-50 transition-colors rounded"
            style={{
              width: "30px",
              height: "30px",
              padding: "4px 7.333px",
              borderRadius: "5px",
              border: "0.789px solid #F6F3F2",
              background: "#FBFAFA"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6.00016 7.52214L6.00016 0.855469M6.00016 7.52214C5.53334 7.52214 4.66118 6.1926 4.3335 5.85547M6.00016 7.52214C6.46698 7.52214 7.33914 6.1926 7.66683 5.85547" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.3332 8.85547C11.3332 10.5101 10.9878 10.8555 9.33317 10.8555H2.6665C1.01184 10.8555 0.666504 10.5101 0.666504 8.85547" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Right Side - Status Badge */}
        <div
          className="flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium"
          style={{
            height: "22px",
            padding: "4px 12px",
            borderRadius: "4px",
            border: subscription.status === "paid" ? "0.5px solid rgba(80, 190, 135, 0.25)" : "0.5px solid rgba(206, 148, 29, 0.25)",
            background: subscription.status === "paid" ? "#EEF9F3" : "rgba(206, 148, 29, 0.05)",
            color: subscription.status === "paid" ? "#50BE87" : "#CE941D",
            fontSize: "12px",
            fontWeight: "500"
          }}
        >
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </div>
      </div>
    </div>

    {/* Bottom Section - Icons and Status */}
  </div>
)

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false)
  const [isEditingPartner, setIsEditingPartner] = useState(false)
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showSuccessCard, setShowSuccessCard] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorCard, setShowErrorCard] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [lastCreatedHotelName, setLastCreatedHotelName] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  // Services popover now uses DropdownMenu (portal) like 3-dot menu
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPartners, setIsLoadingPartners] = useState(true)
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelCity: '',
    hotelAddressEmail: '',
    phoneNumber: '',
    RC: '',
    ICE: '',
    identifiantFiscal: '',
    taxeProfessionnelle: '',
    hotelImage: null as File | string | null,
    username: '',
    password: '',
    startDate: '',
    endDate: '',
    plan: 'starter pack' as 'starter pack' | 'gold pack',
    services: {
      housekeeping: { assigned: false, isActive: false },
      bookingInterns: { assigned: false, isActive: false },
      customizedServices: { assigned: false, isActive: false },
      activityAlerts: { assigned: false, isActive: false },
      laundry: { assigned: false, isActive: false },
      roomDelivery: { assigned: false, isActive: false },
    }
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const startDateRef = useRef<HTMLInputElement | null>(null)
  const endDateRef = useRef<HTMLInputElement | null>(null)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)
  const [citySearchTerm, setCitySearchTerm] = useState("")
  const cityDropdownRef = useRef<HTMLDivElement | null>(null)
  const servicesDropdownRef = useRef<HTMLDivElement | null>(null)

  // List of all Moroccan cities
  const allCities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fes",
    "Tangier",
    "Agadir",
    "Meknes",
    "Oujda",
    "Kenitra",
    "Tetouan",
    "Safi",
    "El Jadida",
    "Beni Mellal",
    "Nador",
    "Taza",
    "Settat",
    "Khouribga",
    "Larache",
    "Khemisset",
    "Guelmim",
    "Ait Melloul",
    "Al Hoceima",
    "Azemmour",
    "Azilal",
    "Ben Guerir",
    "Berkane",
    "Boujdour",
    "Boulemane",
    "Chefchaouen",
    "Dakhla",
    "Demnate",
    "Errachidia",
    "Essaouira",
    "Figuig",
    "Fnideq",
    "Guercif",
    "Ifrane",
    "Imzouren",
    "Jerada",
    "Kalaat Sraghna",
    "Kasbat Tadla",
    "Laayoune",
    "Martil",
    "Midelt",
    "Missour",
    "Moulay Bousselham",
    "Ouarzazate",
    "Ouazzane",
    "Oued Zem",
    "Rissani",
    "Sefrou",
    "Sidi Bennour",
    "Sidi Ifni",
    "Sidi Kacem",
    "Sidi Slimane",
    "Skhirat",
    "Souk El Arbaa",
    "Taourirt",
    "Taroudant",
    "Tiflet",
    "Tinghir",
    "Tiznit",
    "Youssoufia",
    "Zagora",
    "Smara",
    "Assa",
    "Tan-Tan"
  ]

  // Filter cities based on search term
  const filteredCities = allCities.filter(city =>
    city.toLowerCase().includes(citySearchTerm.toLowerCase())
  )
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showViewDetail, setShowViewDetail] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [partnerDetailsLoading, setPartnerDetailsLoading] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [partnerIdForReset, setPartnerIdForReset] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'partner-info' | 'subscription' | 'room-api'>('partner-info')
  // Bulk upload rooms state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploadingRooms, setIsUploadingRooms] = useState(false)
  const [showPasswordDetails, setShowPasswordDetails] = useState(false)
  const [partnerStats, setPartnerStats] = useState<{
    totalPartners: number;
    activePartners: number;
    totalStaff?: number;
    totalPartnersChange?: number;
    activePartnersChange?: number;
    totalStaffChange?: number;
    subtitle?: string;
  } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<'semaine' | 'mois' | 'date-range'>('semaine')
  const [dateRangeStart, setDateRangeStart] = useState("")
  const [dateRangeEnd, setDateRangeEnd] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant: "success" | "error" | "warning" | "info"
  }>({
    isOpen: false,
    title: "",
    message: "",
    variant: "info"
  })

  const showAlert = (title: string, message: string, variant: "success" | "error" | "warning" | "info" = "info") => {
    // Use success card for success messages, error card for errors, alert dialog for others
    if (variant === "success") {
      setSuccessMessage(message)
      setShowSuccessCard(true)
    } else if (variant === "error") {
      setErrorMessage(message)
      setShowErrorCard(true)
    } else {
      setAlertDialog({ isOpen: true, title, message, variant })
    }
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setShowErrorCard(true)
  }
  const calendarIconRef = useRef<HTMLDivElement | null>(null)
  const datePickerRef = useRef<HTMLDivElement | null>(null)
  const [datePickerPosition, setDatePickerPosition] = useState<{ top: number; left: number } | null>(null)

  // Fetch partners from API
  const fetchPartners = async () => {
    try {
      setIsLoadingPartners(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setIsLoadingPartners(false)
        return
      }

      console.log('Fetching partners from API...')
      const response = await fetch('/api/superadmin/partners', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Partners API response status:', response.status)
      console.log('Partners API response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('Partners API result:', result)

        if (result.partners && Array.isArray(result.partners)) {
          // Transform API data to match Partner interface
          const transformedPartners: Partner[] = result.partners.map((partner: any) => {
            const createdAtDate = new Date(partner.createdAt)
            
            // Format startDate and endDate for display (convert Date to YYYY-MM-DD format for input fields)
            const formatDateForInput = (date: Date | string | undefined) => {
              if (!date) return ''
              try {
                const d = date instanceof Date ? date : new Date(date)
                if (isNaN(d.getTime())) return ''
                // Return in YYYY-MM-DD format for date input
                const year = d.getFullYear()
                const month = String(d.getMonth() + 1).padStart(2, '0')
                const day = String(d.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
              } catch {
                return ''
              }
            }
            
            return {
              id: partner._id,
              hotelName: partner.hotelName,
              hotelAddressEmail: partner.hotelAddressEmail,
              username: partner.username,
              phone: partner.phoneNumber,
              city: partner.hotelCity,
              services: partner.services || {
                housekeeping: { assigned: false, isActive: false },
                bookingInterns: { assigned: false, isActive: false },
                customizedServices: { assigned: false, isActive: false },
                activityAlerts: { assigned: false, isActive: false },
                laundry: { assigned: false, isActive: false },
                roomDelivery: { assigned: false, isActive: false },
              },
              plan: partner.plan || 'starter pack',
              createdAt: createdAtDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }),
              createdAtDate: createdAtDate, // Store original date for filtering
              status: partner.status || 'active',
              RC: partner.RC || '',
              ICE: partner.ICE || '',
              identifiantFiscal: partner.identifiantFiscal || '',
              taxeProfessionnelle: partner.taxeProfessionnelle || '',
              startDate: formatDateForInput(partner.startDate),
              endDate: formatDateForInput(partner.endDate),
              hotelImage: partner.hotelImage,
              hotelCity: partner.hotelCity,
              phoneNumber: partner.phoneNumber
            }
          })

          console.log('Transformed partners:', transformedPartners)
          console.log('Total partners:', transformedPartners.length, 'Active partners:', transformedPartners.filter(p => p.status === 'active').length)
          setPartners(transformedPartners)
        } else {
          console.error('Partners API returned no partners data:', result)
          // Fallback to mock data if API fails
          setPartners(mockPartners)
        }
      } else {
        const errorResult = await response.json()
        console.error('Partners API error response:', errorResult)
        // Fallback to mock data if API fails
        setPartners(mockPartners)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      // Fallback to mock data if API fails
      setPartners(mockPartners)
    } finally {
      setIsLoadingPartners(false)
    }
  }

  // Load partners on component mount
  React.useEffect(() => {
    fetchPartners()
  }, [])

  // Fetch partner stats
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true)
        const token = getAuthToken()
        if (!token) {
          setStatsLoading(false)
          return
        }
        const res = await fetch('/api/superadmin/partners/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) {
          setStatsLoading(false)
          return
        }
        const data = await res.json().catch(() => ({}))
        const stats = data.stats || data // controller returns {stats: {...}}
        console.log('Partner stats from API:', stats)
        if (stats && (stats.totalPartners !== undefined || stats.activePartners !== undefined)) {
          setPartnerStats({
            totalPartners: stats.totalPartners ?? 0,
            activePartners: stats.activePartners ?? 0,
          })
        } else {
          // If API doesn't return stats, calculate from partners array
          console.log('API stats not available, will use local calculation')
        }
      } catch (e) {
        console.error('Error fetching partner stats:', e)
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [])

  // Helper functions to calculate date ranges
  const getWeekRange = () => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay()) // Start of current week (Sunday)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    const lastWeekStart = new Date(weekStart)
    lastWeekStart.setDate(weekStart.getDate() - 7)

    const lastWeekEnd = new Date(weekStart)
    lastWeekEnd.setDate(weekStart.getDate() - 1)
    lastWeekEnd.setHours(23, 59, 59, 999)

    return { current: { start: weekStart, end: weekEnd }, previous: { start: lastWeekStart, end: lastWeekEnd } }
  }

  const getMonthRange = () => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    monthEnd.setHours(23, 59, 59, 999)

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    lastMonthStart.setHours(0, 0, 0, 0)

    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    lastMonthEnd.setHours(23, 59, 59, 999)

    return { current: { start: monthStart, end: monthEnd }, previous: { start: lastMonthStart, end: lastMonthEnd } }
  }

  // Filter partners by date range
  const filterPartnersByDateRange = (partners: Partner[], startDate: Date, endDate: Date) => {
    return partners.filter(p => {
      // Use createdAtDate if available (from API), otherwise try to parse createdAt string
      const createdAt = p.createdAtDate || (() => {
        // Try to parse formatted date strings like "15 juin 2025"
        const dateMatch = p.createdAt.match(/(\d+)\s+(\w+)\s+(\d+)/)
        if (dateMatch) {
          const [, day, monthName, year] = dateMatch
          const monthMap: { [key: string]: number } = {
            'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
            'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
          }
          const month = monthMap[monthName.toLowerCase()]
          if (month !== undefined) {
            return new Date(parseInt(year), month, parseInt(day))
          }
        }
        // Fallback to new Date parsing
        return new Date(p.createdAt)
      })()
      return createdAt >= startDate && createdAt <= endDate
    })
  }

  // Calculate period-based stats (for percentage changes only)
  const calculatePeriodStats = React.useMemo(() => {
    // Don't return null during loading if we have partners
    if (statsLoading && partners.length === 0) return null

    let currentRange: { start: Date; end: Date }
    let previousRange: { start: Date; end: Date }

    if (selectedPeriod === 'semaine') {
      const weekRange = getWeekRange()
      currentRange = weekRange.current
      previousRange = weekRange.previous
    } else if (selectedPeriod === 'mois') {
      const monthRange = getMonthRange()
      currentRange = monthRange.current
      previousRange = monthRange.previous
    } else {
      // For date range, use selected dates or default to all time
      if (dateRangeStart && dateRangeEnd) {
        const start = new Date(dateRangeStart)
        start.setHours(0, 0, 0, 0)
        const end = new Date(dateRangeEnd)
        end.setHours(23, 59, 59, 999)

        // Calculate previous period (same duration before start date)
        const duration = end.getTime() - start.getTime()
        const prevEnd = new Date(start.getTime() - 1)
        const prevStart = new Date(prevEnd.getTime() - duration)

        currentRange = { start, end }
        previousRange = { start: prevStart, end: prevEnd }
      } else {
        // Default to all time if no date range selected
        const total = partners.length
        const active = partners.filter(p => p.status === 'active').length
        return {
          totalPartners: total,
          activePartners: active,
          totalStaff: 42, // Default staff
          totalPartnersChange: 0,
          activePartnersChange: 0,
          totalStaffChange: 0,
          subtitle: 'vs selected period'
        }
      }
    }

    // Filter partners for current and previous periods
    const currentPeriodPartners = filterPartnersByDateRange(partners, currentRange.start, currentRange.end)
    const previousPeriodPartners = filterPartnersByDateRange(partners, previousRange.start, previousRange.end)

    // Calculate current period stats
    const currentTotal = currentPeriodPartners.length
    const currentActive = currentPeriodPartners.filter(p => p.status === 'active').length

    // Calculate previous period stats
    const previousTotal = previousPeriodPartners.length
    const previousActive = previousPeriodPartners.filter(p => p.status === 'active').length

    // Calculate percentage changes
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const totalPartnersChange = calculatePercentageChange(currentTotal, previousTotal)
    const activePartnersChange = calculatePercentageChange(currentActive, previousActive)

    // Mock staff data - varies by period
    // For week: simulate staff growth
    // For month: simulate staff growth
    const baseStaff = 40
    const currentStaff = selectedPeriod === 'semaine'
      ? Math.round(baseStaff + (currentTotal * 0.5)) // More partners = more staff
      : Math.round(baseStaff + (currentTotal * 0.3))

    const previousStaff = selectedPeriod === 'semaine'
      ? Math.round(baseStaff + (previousTotal * 0.5))
      : Math.round(baseStaff + (previousTotal * 0.3))

    const totalStaffChange = calculatePercentageChange(currentStaff, previousStaff)

    const subtitle = selectedPeriod === 'semaine'
      ? 'vs last week'
      : selectedPeriod === 'mois'
        ? 'vs last month'
        : 'vs selected period'

    return {
      totalPartners: currentTotal,
      activePartners: currentActive,
      totalStaff: currentStaff,
      totalPartnersChange,
      activePartnersChange,
      totalStaffChange,
      subtitle
    }
  }, [partners, selectedPeriod, dateRangeStart, dateRangeEnd, statsLoading])

  // Calculate stats from local partners array as fallback (keep for backward compatibility)
  const localStats = React.useMemo(() => {
    // Always calculate TOTAL from ALL partners (not filtered by period)
    const total = partners.length
    const active = partners.filter(p => p.status === 'active').length

    console.log('Calculating localStats:', { total, active, partnersCount: partners.length })

    // Use calculatePeriodStats for percentage changes, but keep total counts from all partners
    if (calculatePeriodStats) {
      return {
        ...calculatePeriodStats,
        // Override with total counts from ALL partners (not period-filtered)
        totalPartners: total,
        activePartners: active,
      }
    }

    // Use partnerStats from API if available (has API stats)
    if (partnerStats && (partnerStats.totalPartners !== undefined || partnerStats.activePartners !== undefined)) {
      return {
        totalPartners: partnerStats.totalPartners ?? total,
        activePartners: partnerStats.activePartners ?? active,
        totalStaff: partnerStats.totalStaff ?? 42,
        totalPartnersChange: partnerStats.totalPartnersChange ?? 0,
        activePartnersChange: partnerStats.activePartnersChange ?? 0,
        totalStaffChange: partnerStats.totalStaffChange ?? 0,
        subtitle: partnerStats.subtitle || 'vs last week'
      }
    }

    // Fallback: always calculate from local partners array (ensures values are shown)
    return {
      totalPartners: total,
      activePartners: active,
      totalStaff: 42,
      totalPartnersChange: 0,
      activePartnersChange: 0,
      totalStaffChange: 0,
      subtitle: 'vs last week'
    }
  }, [calculatePeriodStats, partners, partnerStats, statsLoading])

  // Handle click outside to close city dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false)
        setCitySearchTerm("")
      }
    }

    if (showCityDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCityDropdown])

  // Handle click outside to close services dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setShowServicesDropdown(false)
      }
    }

    if (showServicesDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showServicesDropdown])

  // Helper function to get enabled services as array of strings
  const getEnabledServices = (services: {
    housekeeping?: { assigned: boolean; isActive: boolean };
    bookingInterns?: { assigned: boolean; isActive: boolean };
    customizedServices?: { assigned: boolean; isActive: boolean };
    activityAlerts?: { assigned: boolean; isActive: boolean };
    laundry?: { assigned: boolean; isActive: boolean };
    roomDelivery?: { assigned: boolean; isActive: boolean };
  }): string[] => {
    const enabled: string[] = []
    // Check assigned field (set by SuperAdmin)
    if (services.housekeeping?.assigned) enabled.push('Housekeeping')
    if (services.bookingInterns?.assigned) enabled.push('Booking Interns')
    if (services.customizedServices?.assigned) enabled.push('Customized Services')
    if (services.activityAlerts?.assigned) enabled.push('Activity Alerts')
    if (services.laundry?.assigned) enabled.push('Laundry')
    if (services.roomDelivery?.assigned) enabled.push('Room Delivery')
    return enabled
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string | File | string[] | { [key: string]: boolean }) => {
    console.log(`Updating field ${field} with value:`, value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error for this field when user starts typing/selecting
    setFormErrors(prev => {
      if (!prev[field]) return prev
      const { [field]: _removed, ...rest } = prev
      return rest
    })
  }

  // Handle service toggle
  const handleServiceToggle = (serviceKey: keyof typeof formData.services) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceKey]: {
          ...prev.services[serviceKey],
          assigned: !prev.services[serviceKey].assigned
        }
      }
    }))
  }

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('Image size must be less than 10MB')
      return
    }

    setIsUploadingImage(true)
    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: 'partners'
      })

      // Update form data with Cloudinary secure URL
      // The secure_url is the HTTPS URL that should be stored in MongoDB
      const imageUrl = uploadResult.secure_url
      setFormData(prev => ({
        ...prev,
        hotelImage: imageUrl
      }))

      console.log('Image uploaded to Cloudinary:', {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height
      })
    } catch (error: any) {
      console.error('Image upload error:', error)
      showError(error.message || 'Failed to upload image. Please try again.')
      setImagePreview(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Remove image
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      hotelImage: null
    }))
    setImagePreview(null)
  }


  const handleEditPartner = (partner: any) => {
    setIsEditingPartner(true)
    setEditingPartnerId(partner.id)
    
    // Format dates for date input fields (YYYY-MM-DD format)
    const formatDateForInput = (date: Date | string | undefined) => {
      if (!date) return ''
      try {
        // If already in YYYY-MM-DD format, return as is
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date
        }
        const d = date instanceof Date ? date : new Date(date)
        if (isNaN(d.getTime())) return ''
        // Return in YYYY-MM-DD format for date input
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      } catch {
        return ''
      }
    }
    
    setFormData({
      hotelName: partner.hotelName || '',
      hotelCity: partner.hotelCity || partner.city || '',
      hotelAddressEmail: partner.hotelAddressEmail || '',
      phoneNumber: partner.phoneNumber || partner.phone || '',
      RC: partner.RC || '',
      ICE: partner.ICE || '',
      identifiantFiscal: partner.identifiantFiscal || '',
      taxeProfessionnelle: partner.taxeProfessionnelle || '',
      hotelImage: partner.hotelImage || null,
      username: partner.username || '',
      password: '*****', // Static password display, not editable
      startDate: formatDateForInput(partner.startDate) || '',
      endDate: formatDateForInput(partner.endDate) || '',
      plan: (partner.plan || 'starter pack') as 'starter pack' | 'gold pack',
      services: partner.services || {
        housekeeping: { assigned: false, isActive: false },
        bookingInterns: { assigned: false, isActive: false },
        customizedServices: { assigned: false, isActive: false },
        activityAlerts: { assigned: false, isActive: false },
        laundry: { assigned: false, isActive: false },
        roomDelivery: { assigned: false, isActive: false },
      },
    })
    // Set image preview if editing and image exists
    if (partner.hotelImage && typeof partner.hotelImage === 'string') {
      setImagePreview(partner.hotelImage)
    } else {
      setImagePreview(null)
    }
    setCurrentStep(1)
    setShowAddPartnerModal(true)
  }

  // Save partner function
  const savePartner = async () => {
    console.log('Form data before sending:', formData)
    console.log('Email being sent:', formData.hotelAddressEmail)
    console.log('Username being sent:', formData.username)

    // Validate required fields
    const requiredFields = isEditingPartner
      ? ['hotelName', 'hotelCity', 'hotelAddressEmail', 'phoneNumber', 'plan']
      : [
        'hotelName', 'hotelCity', 'hotelAddressEmail', 'phoneNumber',
        'RC', 'ICE', 'identifiantFiscal', 'taxeProfessionnelle',
        'username', 'password', 'startDate', 'endDate', 'plan'
      ]

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      showError(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    setIsLoading(true)
    try {
      // Get authentication token using the proper utility
      const token = getAuthToken()
      console.log('Token found:', token ? 'Yes' : 'No')
      console.log('localStorage token:', localStorage.getItem('superadmin_token'))
      console.log('sessionStorage token:', sessionStorage.getItem('superadmin_token'))

      // Fallback: try to get token directly if utility function fails
      const fallbackToken = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token')
      const finalToken = token || fallbackToken

      if (!finalToken) {
        showError('Please log in to create a partner')
        setIsLoading(false)
        return
      }

      const endpoint = isEditingPartner && editingPartnerId
        ? `/api/superadmin/partners/${editingPartnerId}`
        : '/api/superadmin/partners'
      const method = isEditingPartner ? 'PATCH' : 'POST'
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalToken}`
        },
        body: JSON.stringify({
          ...Object.fromEntries(
            Object.entries(formData).filter(([key]) => {
              // Exclude password when editing (it's just "*****" placeholder)
              if (isEditingPartner && key === 'password') {
                return false
              }
              return true
            })
          ),
          // Ensure hotelImage is a valid URL string or null
          hotelImage: typeof formData.hotelImage === 'string' && formData.hotelImage.trim()
            ? formData.hotelImage.trim()
            : null
        })
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (result.success) {
        // Add the new partner to the list
        const newPartner: Partner = {
          id: result.data._id,
          hotelName: result.data.hotelName,
          hotelAddressEmail: result.data.hotelAddressEmail,
          username: result.data.username,
          phone: result.data.phoneNumber,
          city: result.data.hotelCity,
          services: result.data.services || {
            housekeeping: { assigned: false, isActive: false },
            bookingInterns: { assigned: false, isActive: false },
            customizedServices: { assigned: false, isActive: false },
            activityAlerts: { assigned: false, isActive: false },
            laundry: { assigned: false, isActive: false },
            roomDelivery: { assigned: false, isActive: false },
          },
          plan: result.data.plan,
          createdAt: new Date(result.data.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          status: result.data.status
        }

        // Refresh the partners list
        await fetchPartners()
        setLastCreatedHotelName(result.data.hotelName || '')
        setShowAddPartnerModal(false)
        setCurrentStep(1)
        setShowSuccessCard(true)
        setIsEditingPartner(false)
        setEditingPartnerId(null)

        // Reset form data
        setFormData({
          hotelName: '',
          hotelCity: '',
          hotelAddressEmail: '',
          phoneNumber: '',
          RC: '',
          ICE: '',
          identifiantFiscal: '',
          taxeProfessionnelle: '',
          hotelImage: null,
          username: '',
          password: '',
          startDate: '',
          endDate: '',
          plan: 'starter pack',
          services: {
            housekeeping: { assigned: false, isActive: false },
            bookingInterns: { assigned: false, isActive: false },
            customizedServices: { assigned: false, isActive: false },
            activityAlerts: { assigned: false, isActive: false },
            laundry: { assigned: false, isActive: false },
            roomDelivery: { assigned: false, isActive: false },
          }
        })
        setImagePreview(null)

        // Auto hide success card after 5 seconds
        setTimeout(() => {
          setShowSuccessCard(false)
        }, 5000)
      } else {
        console.error('API Error:', result.error)

        // Handle specific error types
        if (result.error && result.error.includes('already registered')) {
          showError(`Email Error: ${result.error}`)
        } else if (result.error && result.error.includes('already taken')) {
          showError(`Username Error: ${result.error}`)
        } else if (result.error && result.error.includes('required fields')) {
          showError(`Validation Error: ${result.error}`)
        } else {
          showError(result.error || 'Failed to save partner')
        }
      }
    } catch (error) {
      console.error('Error saving partner:', error)
      showError('Failed to save partner. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please log in to update partner status', 'warning')
        return
      }

      const partner = partners.find(p => p.id === id)
      if (!partner) return

      const newStatus = partner.status === 'active' ? 'disable' : 'active'

      const response = await fetch(`/api/superadmin/partners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPartners(partners.map((p) =>
            p.id === id ? { ...p, status: newStatus } : p
          ))
          console.log(`Partner status updated to: ${newStatus}`)
          showAlert('Success', `Partner status updated to ${newStatus}`, 'success')
        } else {
          console.error('API Error:', result.error)
          showError(result.error || 'Failed to update partner status')
        }
      } else {
        const errorResult = await response.json().catch(() => ({}))
        const errorMsg = errorResult.error || 'Failed to update partner status'
        console.error('API Error:', errorMsg)
        showError(errorMsg)
      }
    } catch (error) {
      console.error('Error updating partner status:', error)
      showError('Failed to update partner status. Please try again.')
    }
  }

  const handleDeletePartner = (partner: Partner) => {
    setPartnerToDelete(partner)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!partnerToDelete) return

    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please login again.', 'warning')
        return
      }

      const response = await fetch(`/api/superadmin/partners/${partnerToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json().catch(() => ({} as any))
        if ((result as any).error) {
          showAlert('Error', `${(result as any).error}`, 'error')
        } else {
          setSelectedPartners(prev => prev.filter(id => id !== partnerToDelete.id))

          if (selectedPartner?.id === partnerToDelete.id) {
            setShowViewDetail(false)
            setSelectedPartner(null)
          }

          await fetchPartners()

          showAlert('Success', 'Partner deleted successfully', 'success')
        }
      } else {
        const errorData = await response.json().catch(() => ({} as any))
        showAlert('Error', `${errorData.error || 'Failed to delete partner'}`, 'error')
      }
    } catch (error) {
      console.error('Error deleting partner:', error)
      showAlert('Error', 'Failed to delete partner. Please try again.', 'error')
    } finally {
      setShowDeleteModal(false)
      setPartnerToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setPartnerToDelete(null)
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedPartners.length === 0) return
    setShowBulkDeleteModal(true)
  }

  const confirmBulkDelete = async () => {
    if (selectedPartners.length === 0) return

    setIsDeleting(true)
    try {
      const token = getAuthToken()
      if (!token) {
        showAlert('Authentication Required', 'Please login again.', 'warning')
        setIsDeleting(false)
        return
      }

      // Delete all selected partners
      const deletePromises = selectedPartners.map(async (partnerId) => {
        try {
          const response = await fetch(`/api/superadmin/partners/${partnerId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          return { id: partnerId, success: response.ok }
        } catch (error) {
          console.error(`Error deleting partner ${partnerId}:`, error)
          return { id: partnerId, success: false }
        }
      })

      const results = await Promise.all(deletePromises)
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      if (successful > 0) {
        // Remove deleted partners from selection
        const deletedIds = results.filter(r => r.success).map(r => r.id)
        setSelectedPartners(prev => prev.filter(id => !deletedIds.includes(id)))

        // Close view detail if deleted partner was being viewed
        if (selectedPartner && deletedIds.includes(selectedPartner.id)) {
          setShowViewDetail(false)
          setSelectedPartner(null)
        }

        // Refresh partners list
        await fetchPartners()

        if (failed > 0) {
          showAlert('Partial Success', `${successful} partner(s) deleted successfully, ${failed} failed.`, 'warning')
        } else {
          showAlert('Success', `${successful} partner(s) deleted successfully`, 'success')
        }
      } else {
        showAlert('Error', 'Failed to delete partners. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error deleting partners:', error)
      showAlert('Error', 'Failed to delete partners. Please try again.', 'error')
    } finally {
      setIsDeleting(false)
      setShowBulkDeleteModal(false)
    }
  }

  const cancelBulkDelete = () => {
    setShowBulkDeleteModal(false)
  }

  const handleResetPassword = (partner: Partner) => {
    setPartnerIdForReset(partner.id)
    setShowResetPasswordModal(true)
  }

  const handleViewDetails = async (partner: Partner) => {
    setSelectedPartner(partner)
    setShowViewDetail(true)
    setActiveTab('partner-info')
    setPartnerDetailsLoading(true)
    
    try {
      const token = getAuthToken()
      if (!token) {
        console.error('No auth token found')
        setPartnerDetailsLoading(false)
        return
      }

      const response = await fetch(`/api/superadmin/partners/${partner.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.partner) {
          // Update selected partner with full details including stats
          setSelectedPartner({
            ...partner,
            ...result.partner,
            id: partner.id // Ensure ID is preserved
          })
        }
      } else {
        console.error('Failed to fetch partner details')
      }
    } catch (error) {
      console.error('Error fetching partner details:', error)
    } finally {
      setPartnerDetailsLoading(false)
    }
  }

  const closeViewDetail = () => {
    setShowViewDetail(false)
    setSelectedPartner(null)
    setActiveTab('partner-info')
    setSelectedFile(null)
  }

  const handleBulkUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          file.type !== 'application/vnd.ms-excel') {
        alert('Please upload a valid Excel file (.xlsx or .xls)')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleBulkUploadRooms = async () => {
    if (!selectedFile || !selectedPartner) {
      alert('Please select a file and ensure a partner is selected')
      return
    }

    try {
      setIsUploadingRooms(true)
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to upload rooms')
        return
      }

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/partner/rooms/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert(`Success! ${result.total} rooms uploaded successfully`)
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById('room-file-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        alert(`Error: ${result.error || 'Failed to upload rooms'}`)
      }
    } catch (error: any) {
      console.error('Error uploading rooms:', error)
      alert(`Error: ${error?.message || 'Failed to upload rooms. Please try again.'}`)
    } finally {
      setIsUploadingRooms(false)
    }
  }

  const normalized = (v: string) => v.toLowerCase()
  const filteredPartners = partners.filter((p) => {
    if (!searchTerm) return true
    const q = normalized(searchTerm)
    return (
      normalized(p.hotelName).includes(q) ||
      normalized(p.hotelAddressEmail).includes(q) ||
      normalized(p.username).includes(q) ||
      normalized(p.phone).includes(q) ||
      normalized(p.city).includes(q) ||
      normalized(p.plan).includes(q)
    )
  })

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPartners = filteredPartners.slice(startIndex, endIndex)

  // Handle individual checkbox selection
  const handlePartnerSelect = (partnerId: string) => {
    setSelectedPartners(prev => {
      if (prev.includes(partnerId)) {
        const newSelected = prev.filter(id => id !== partnerId)
        setIsAllSelected(false)
        return newSelected
      } else {
        const newSelected = [...prev, partnerId]
        // Check if all filtered partners are now selected
        if (newSelected.length === filteredPartners.length && filteredPartners.length > 0) {
          setIsAllSelected(true)
        }
        return newSelected
      }
    })
  }

  // Handle select all checkbox
  const handleSelectAll = () => {
    const allCurrentSelected = currentPartners.length > 0 && currentPartners.every(p => selectedPartners.includes(p.id))

    if (isAllSelected || allCurrentSelected) {
      // Deselect all current page partners
      const currentPartnerIds = currentPartners.map(p => p.id)
      setSelectedPartners(prev => prev.filter(id => !currentPartnerIds.includes(id)))
      setIsAllSelected(false)
    } else {
      // Select all current page partners
      const currentPartnerIds = currentPartners.map(p => p.id)
      setSelectedPartners(prev => {
        const newSelected = [...new Set([...prev, ...currentPartnerIds])]
        // If all filtered partners are now selected, set isAllSelected to true
        if (newSelected.length === filteredPartners.length && filteredPartners.length > 0) {
          setIsAllSelected(true)
        }
        return newSelected
      })
    }
  }

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedPartners([])
    setIsAllSelected(false)
  }

  // Select all filtered partners
  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredPartners.map(p => p.id)
    setSelectedPartners(allFilteredIds)
    if (allFilteredIds.length > 0) {
      setIsAllSelected(true)
    }
  }

  // Check if all items are selected (all filtered partners)
  const allFilteredSelected = selectedPartners.length > 0 && selectedPartners.length === filteredPartners.length

  // Format partners data for Excel export
  const exportData = currentPartners.map((partner) => ({
    "Hotel Name": partner.hotelName,
    "Email": partner.hotelAddressEmail,
    "Phone number": partner.phone,
    "City": partner.city,
    "Services": getEnabledServices(partner.services).join(", "),
    "Plan": partner.plan,
    "Created At": partner.createdAt,
    "Account": partner.status === 'active' ? 'Active' : 'Inactive'
  }))

  // Position date picker relative to calendar icon
  useEffect(() => {
    function updateDatePickerPosition() {
      if (!calendarIconRef.current || !showDatePicker) return
      const rect = calendarIconRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const pickerWidth = 300 // approximate width of the date picker

      // Position below the icon, aligned to the right edge of the icon
      let left = rect.left
      // If picker would overflow right edge, align to left edge instead
      if (left + pickerWidth > viewportWidth) {
        left = viewportWidth - pickerWidth - 16 // 16px margin from edge
      }

      setDatePickerPosition({
        top: rect.bottom + 8,
        left: left
      })
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node) &&
        calendarIconRef.current &&
        !calendarIconRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false)
      }
    }

    if (showDatePicker) {
      updateDatePickerPosition()
      window.addEventListener("scroll", updateDatePickerPosition, true)
      window.addEventListener("resize", updateDatePickerPosition)
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      window.removeEventListener("scroll", updateDatePickerPosition, true)
      window.removeEventListener("resize", updateDatePickerPosition)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDatePicker])

  const overviewContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between " >
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Overview of Partner Performance</h2>
          <p className="text-sm text-muted-foreground">Key indicators to monitor hotel partners and their activity.</p>
        </div>
        <div className="flex items-center " style={{ border: "0.925px solid #CED4DA" }}>
          <button
            onClick={() => setSelectedPeriod('semaine')}
            className={`px-4 py-2 rounded-[1px] text-sm font-medium transition-colors ${selectedPeriod === 'semaine'
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-[#FFF] text-[rgba(33,33,33,0.60)] hover:bg-muted/80'
              }`}
            style={{ borderRight: "0.925px solid #CED4DA" }}
          >
            Semaine
          </button>
          <button
            onClick={() => setSelectedPeriod('mois')}
            className={`px-4 py-2 rounded-[1px] text-sm font-medium transition-colors ${selectedPeriod === 'mois'
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-[#FFF] text-[rgba(33,33,33,0.60)] hover:bg-muted/80'
              }`}
            style={{ borderRight: "0.925px solid #CED4DA" }}
          >
            Mois
          </button>
          <button
            onClick={() => setSelectedPeriod('date-range')}
            className={`px-4 py-2 rounded-[1px] text-sm font-medium transition-colors flex items-center gap-2 ${selectedPeriod === 'date-range'
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-[#FFF] text-[rgba(33,33,33,0.60)] hover:bg-muted/80'
              }`}
          >
            Plage de dates
            <div ref={calendarIconRef}>
              <Image
                src="/assets/icons/calendar.svg"
                alt="Calendar"
                width={16}
                height={16}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPeriod('date-range')
                  setShowDatePicker(!showDatePicker)
                }}
                className="cursor-pointer"
                style={{
                  filter: selectedPeriod === 'date-range' ? 'brightness(0) invert(1)' : 'none'
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Date Range Picker Popover */}
      {showDatePicker && datePickerPosition && createPortal(
        <div
          ref={datePickerRef}
          className="z-50"
          style={{
            position: "fixed",
            top: datePickerPosition.top,
            left: datePickerPosition.left
          }}
        >
          <div
            className="bg-white border border-border p-4"
            style={{
              borderRadius: "10px",
              boxShadow: "0px 0px 32px 4px #161A1D1A",
              minWidth: "300px"
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date de début</label>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date de fin</label>
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  min={dateRangeStart}
                  className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setDateRangeStart("")
                    setDateRangeEnd("")
                    setShowDatePicker(false)
                  }}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Effacer
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<CarIcon />}
          label="Total Partners"
          value={localStats?.totalPartners ?? partners.length}
          isLoading={statsLoading && partners.length === 0}
          change={localStats?.totalPartnersChange !== undefined
            ? `${localStats.totalPartnersChange >= 0 ? '+' : ''}${localStats.totalPartnersChange}%`
            : '+0%'}
          changeType={localStats?.totalPartnersChange !== undefined
            ? localStats.totalPartnersChange > 0 ? 'positive' : localStats.totalPartnersChange < 0 ? 'negative' : 'neutral'
            : 'neutral'}
          subtitle={localStats?.subtitle || 'vs last week'}
        />
        <StatCard
          icon={<StaffIcon />}
          label="Total Staff"
          value={localStats?.totalStaff ?? 42}
          change={localStats?.totalStaffChange !== undefined
            ? `${localStats.totalStaffChange >= 0 ? '+' : ''}${localStats.totalStaffChange}%`
            : '+0%'}
          changeType={localStats?.totalStaffChange !== undefined
            ? localStats.totalStaffChange > 0 ? 'positive' : localStats.totalStaffChange < 0 ? 'negative' : 'neutral'
            : 'neutral'}
          subtitle={localStats?.subtitle || 'vs last week'}
        />
        <StatCard
          icon={<ActivePartnerIcon />}
          label="Active Partners"
          value={localStats?.activePartners ?? partners.filter(p => p.status === 'active').length}
          isLoading={statsLoading && partners.length === 0}
          change={localStats?.activePartnersChange !== undefined
            ? `${localStats.activePartnersChange >= 0 ? '+' : ''}${localStats.activePartnersChange}%`
            : '+0%'}
          changeType={localStats?.activePartnersChange !== undefined
            ? localStats.activePartnersChange > 0 ? 'positive' : localStats.activePartnersChange < 0 ? 'negative' : 'neutral'
            : 'neutral'}
          subtitle={localStats?.subtitle || 'vs last week'}
        />
      </div>

      {/* Partners List */}


      <div className="bg-card rounded-[4px]  p-4 ">
        {/* Table Header */}
        {selectedPartners.length === 0 && (
          <div className="flex items-center justify-between  pb-4  ">
            <h3 className="text-base font-semibold text-foreground">Partners list</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none"
                  style={{
                    padding: "7.52px 12px",
                    paddingRight: "32px",
                    borderRadius: "4px",
                    border: "1px solid #CED4DA",
                    background: "#FFF",
                    color: "rgba(33, 33, 33, 0.60)",
                    fontSize: "13px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}
                >
                  <option value={8}>Display 8</option>
                  <option value={10}>Display 10</option>
                  <option value={20}>Display 20</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DropdownArrow />
                </div>
              </div>

              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => { setCurrentPage(1); setSearchTerm(e.target.value) }}
                style={{
                  padding: "7.52px 12px",
                  borderRadius: "4px",
                  border: "1px solid #CED4DA",
                  background: "#FFF",
                  color: "rgba(33, 33, 33, 0.60)",
                  fontSize: "13px",
                  fontWeight: "400",
                  lineHeight: "19.5px"
                }}
                className="focus:outline-none focus:ring-2 focus:ring-primary/30"
              />

              <button className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors" style={{ borderRadius: "6px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-4 h-4"
                >
                  <path
                    d="M4 8H12M2 4H14M6 12H10"
                    stroke="black"
                    strokeWidth="1.11333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium text-[#212121]">Filtre</span>
              </button>

              <ExportToExcel
                data={exportData}
                fileName={`partners-export-${new Date().toISOString().split('T')[0]}.xlsx`}
                sheetName="Partners"
              />

              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 text-sm font-medium transition-colors"
                style={{ borderRadius: "6px" }}
                onClick={() => setShowAddPartnerModal(true)}
              >
                <RiAddLine className="w-5 h-5" />
                Add new Partner
              </button>
            </div>
          </div>
        )}

        {/* Selection Indicator Bar */}
        {selectedPartners.length > 0 && (
          <div className="flex items-center justify-between py-3 px-4 ">
            <h3 className="text-base font-semibold text-foreground">Partners list</h3>
            <div className="flex items-center gap-2">
              {selectedPartners.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearSelection}
                    className="flex items-center justify-center w-5 h-5 rounded-lg bg-black hover:bg-gray-900 transition cursor-pointer"
                    title="Clear selection"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <span className="text-sm font-small" style={{ color: "gray" }}>
                    {selectedPartners.length} item{selectedPartners.length > 1 ? 's' : ''} selected
                  </span>
                </div>
              )}
              <button
                onClick={handleSelectAllFiltered}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1F2A44] hover:text-[#1F2A44]/80 transition-colors cursor-pointer underline"
              >
                Select all items
              </button>
              <button
                onClick={() => {
                  const exportData = filteredPartners.filter((partner) => selectedPartners.includes(partner.id)).map((partner) => ({
                    "Hotel Name": partner.hotelName,
                    "Email": partner.hotelAddressEmail,
                    "Phone number": partner.phone,
                    "City": partner.city,
                    "Services": getEnabledServices(partner.services).join(", "),
                    "Plan": partner.plan,
                    "Created At": partner.createdAt,
                    "Account": partner.status === 'active' ? 'Active' : 'Inactive'
                  }))

                  if (!exportData || exportData.length === 0) {
                    showError("No data to export!")
                    return
                  }

                  const worksheet = XLSX.utils.json_to_sheet(exportData)
                  const workbook = XLSX.utils.book_new()
                  XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedPartners")

                  const excelBuffer = XLSX.write(workbook, {
                    bookType: "xlsx",
                    type: "array",
                  })

                  const blob = new Blob([excelBuffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  })

                  saveAs(blob, `selected-partners-export-${new Date().toISOString().split('T')[0]}.xlsx`)
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1F2A44] hover:text-[#1F2A44]/80 transition-colors cursor-pointer underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  className="w-[14px] h-4"
                >
                  <path
                    d="M11.3333 10.6666C11.6705 10.9943 13 11.8665 13 12.3333M11.3333 14C11.6705 13.6723 13 12.8001 13 12.3333M13 12.3333L7.66667 12.3333"
                    stroke="#1F2A44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.33398 14.6666H6.15217C3.97803 14.6666 2.89096 14.6666 2.13603 14.1347C1.91973 13.9823 1.7277 13.8016 1.56578 13.598C1.00065 12.8875 1.00065 11.8644 1.00065 9.81814V8.12117C1.00065 6.14572 1.00065 5.158 1.31328 4.36913C1.81586 3.10091 2.87874 2.10055 4.22622 1.62753C5.0644 1.33329 6.11386 1.33329 8.21277 1.33329C9.41215 1.33329 10.0118 1.33329 10.4908 1.50143C11.2608 1.77172 11.8682 2.34336 12.1553 3.06805C12.334 3.51884 12.334 4.08325 12.334 5.21208V8.66663"
                    stroke="#1F2A44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.0013 8C1.0013 6.7727 1.99622 5.77778 3.22352 5.77778C3.66738 5.77778 4.19066 5.85555 4.62221 5.73992C5.00565 5.63718 5.30514 5.33768 5.40789 4.95424C5.52352 4.52269 5.44575 3.99941 5.44575 3.55556C5.44575 2.32826 6.44067 1.33333 7.66797 1.33333"
                    stroke="#1F2A44"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1F2A44] hover:text-[#1F2A44]/80 transition-colors cursor-pointer underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto  rounded-[4px]  ">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-4 py-4">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={isAllSelected || (currentPartners.length > 0 && currentPartners.every(p => selectedPartners.includes(p.id)) && currentPartners.length > 0)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Hotel Name
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Email
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Phone number
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    City
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Services
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Plan
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Create at
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span style={{ color: "#000", fontSize: "12px", fontWeight: "500", lineHeight: "19.5px" }}>
                    Account
                  </span>
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoadingPartners ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Loading partners...
                    </div>
                  </td>
                </tr>
              ) : currentPartners.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16">
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      alignSelf: "stretch",
                      width: "172px",
                      height: "130px"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="162" height="125" viewBox="0 0 162 125" fill="none">
                        <path d="M154.721 53.3989V33.4383H143.617V20.4724H136.1V33.4383H124.996V53.3989H118.846V8.53018H106.375V4.26509H89.8034V0H73.4031V4.26509H57.857V8.53018H44.3609V53.2283H37.1858V33.2677H26.0814V20.3018H18.5646V33.2677H7.46028V53.2283H0.285156V124.029H16.6854V98.9501H27.9606V124.029H72.0364V94.8556H91.1701V124.029H117.821V124.199H134.221V99.1207H145.496V124.199H161.896V53.3989H154.721ZM6.17901 61.9291H12.6708V67.0472H6.17901V61.9291ZM6.26443 76.2598H12.7562V81.3779H6.26443V76.2598ZM12.8416 95.7087H6.34985V90.5905H12.8416V95.7087ZM29.8398 49.4751H14.8062V46.4042H29.8398V49.4751ZM29.8398 45.0394H14.8062V41.9685H29.8398V45.0394ZM29.8398 40.6037H14.8062V37.5328H29.8398V40.6037ZM31.9753 61.9291H38.4671V67.0472H31.9753V61.9291ZM32.0607 76.2598H38.5525V81.3779H32.0607V76.2598ZM38.6379 95.7087H32.1461V90.5905H38.6379V95.7087ZM65.203 87.1785H53.2444V81.8898H65.203V87.1785ZM65.203 71.9947H53.2444V66.706H65.203V71.9947ZM65.203 56.811H53.2444V51.5223H65.203V56.811ZM65.203 41.6273H53.2444V36.3386H65.203V41.6273ZM65.203 26.4436H53.2444V21.1549H65.203V26.4436ZM87.5825 87.1785H75.624V81.8898H87.5825V87.1785ZM87.5825 71.9947H75.624V66.706H87.5825V71.9947ZM87.5825 56.811H75.624V51.5223H87.5825V56.811ZM87.5825 41.6273H75.624V36.3386H87.5825V41.6273ZM87.5825 26.4436H75.624V21.1549H87.5825V26.4436ZM109.962 87.1785H98.0035V81.8898H109.962V87.1785ZM109.962 71.9947H98.0035V66.706H109.962V71.9947ZM109.962 56.811H98.0035V51.5223H109.962V56.811ZM109.962 41.6273H98.0035V36.3386H109.962V41.6273ZM109.962 26.4436H98.0035V21.1549H109.962V26.4436ZM123.714 62.0997H130.206V67.2178H123.714V62.0997ZM123.8 76.4304H130.292V81.5486H123.8V76.4304ZM130.377 95.8793H123.885V90.7611H130.377V95.8793ZM147.375 49.6457H132.342V46.5748H147.375V49.6457ZM147.375 45.21H132.342V42.1391H147.375V45.21ZM147.375 40.7743H132.342V37.7034H147.375V40.7743ZM149.511 62.0997H156.002V67.2178H149.511V62.0997ZM149.596 76.4304H156.088V81.5486H149.596V76.4304ZM156.173 95.8793H149.682V90.7611H156.173V95.8793Z" fill="#F2F2F2" />
                      </svg>
                      <p style={{
                        alignSelf: "stretch",
                        color: "rgba(33, 33, 33, 0.60)",
                        textAlign: "center",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: "300",
                        lineHeight: "normal"
                      }}>
                        No data available
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedPartners.includes(partner.id)}
                        onChange={() => handlePartnerSelect(partner.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          H
                        </div>
                        <span style={{
                          color: "#525866",
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "19.5px"
                        }}>
                          {partner.hotelName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {partner.hotelAddressEmail}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {partner.phone}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {partner.city}
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu
                        trigger={
                          <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                            <span>{getEnabledServices(partner.services).length}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        }
                        items={
                          (getEnabledServices(partner.services).length === 0
                            ? [{ label: 'No services', onClick: () => { } }]
                            : getEnabledServices(partner.services).map((s) => ({ label: s, onClick: () => { } }))
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {partner.plan}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {partner.createdAt}
                    </td>
                    <td className="px-4 py-4">
                      <ToggleSwitch checked={partner.status === 'active'} onChange={() => handleToggleActive(partner.id)} />
                    </td>
                    <td className="px-4 py-4">
                      <DropdownMenu
                        trigger={
                          <button className="p-1 hover:bg-muted rounded-xl transition-colors">
                            <RiMoreLine className="w-5 h-5 text-muted-foreground" />
                          </button>
                        }
                        items={[
                          { label: "View Details", icon: <RiEyeLine className="w-4 h-4" />, onClick: () => handleViewDetails(partner) },
                          {
                            label: "Edit Partner", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>, onClick: () => handleEditPartner(partner)
                          },
                          { label: "Reset Password", icon: <RiLockPasswordLine className="w-4 h-4" />, onClick: () => handleResetPassword(partner) },
                          { label: "Supprimer", icon: <RiDeleteBinLine className="w-4 h-4 text-error" />, onClick: () => handleDeletePartner(partner), variant: "danger" },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {partners.length > 0 && (
          <div className="flex items-center justify-between  py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Displaying {filteredPartners.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredPartners.length)} results out of {filteredPartners.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LeftArrow />
              </button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    {page}
                  </button>
                )
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RightArrow />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )

  return (
    <>
     {/* Success Card */}
      {showSuccessCard && (
        <div className="fixed bottom-6 z-50" style={{ right: 0, left: 'auto' }}>
          <div
            className="flex items-center gap-3"
            style={{
              display: "flex",
              padding: "10px 15px 10px 10px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              borderRadius: "10px 0 0 10px",
              borderTop: "1px solid #13B601",
              borderBottom: "1px solid #13B601",
              borderLeft: "1px solid #13B601",
              background: "#F3FFEA"
            }}
          >
            {/* Success Message Row */}
            <div
              className="flex items-center gap-3"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              {/* Tick Icon */}
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Image
                  src="/assets/icons/tick check.svg"
                  alt="Success"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-sm font-medium text-gray-800">Partner added successfully.</span>
            </div>

            {/* Hotel Name Row */}
            <div
              className="flex items-center gap-3"
              style={{
                display: "flex",
                padding: "10px 13px",
                alignItems: "center",
                gap: "10px",
                alignSelf: "stretch",
                borderRadius: "10px",
                background: "#0B0F18"
              }}
            >
              {/* House Icon */}
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g filter="url(#filter0_d_house)">
                    <rect x="5" y="2" width="14" height="14" rx="7" fill="white" />
                  </g>
                  <path
                    d="M8 10H16M8 13H16M12 5L6 9V17H18V9L12 5Z"
                    stroke="#0B0F18"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <defs>
                    <filter id="filter0_d_house" x="0.470589" y="0.352942" width="23.0588" height="23.0588" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="2.88235" />
                      <feGaussianBlur stdDeviation="2.26471" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_house" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_house" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>
              <span className="text-sm font-medium text-white">
                {lastCreatedHotelName || 'Hotel Name'}
              </span>
            </div>
          </div>
        </div>
      )}
    <div className="p-4">
      {/* Content */}
      {overviewContent}

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-[10px] w-full max-w-md mx-4">
            {/* First Section - Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#212121]">
                Delete Partners
              </h2>
              <button
                onClick={cancelBulkDelete}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Second Section - Content */}
            <div className="p-4">
              <p className="text-sm text-[#212121] mb-4">
                Are you sure you want to delete {selectedPartners.length} partner{selectedPartners.length > 1 ? 's' : ''}? This action cannot be undone.
              </p>
              <div className="max-h-48 overflow-y-auto mb-4">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {filteredPartners
                    .filter(p => selectedPartners.includes(p.id))
                    .slice(0, 10)
                    .map(partner => (
                      <li key={partner.id}>{partner.hotelName}</li>
                    ))}
                  {selectedPartners.length > 10 && (
                    <li className="text-gray-400">...and {selectedPartners.length - 10} more</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Third Section - Actions */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={cancelBulkDelete}
                disabled={isDeleting}
                className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors disabled:opacity-50"
                style={{
                  padding: "8.52px 10px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "white",
                  color: "#212121"
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                disabled={isDeleting}
                className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors disabled:opacity-50"
                style={{
                  padding: "8.52px 10px",
                  backgroundColor: "#DC2626",
                  color: "white"
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Partner Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-80 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-[10px] w-full max-w-md mx-4">
            {/* First Section - Header */}
            <div
              className="flex justify-between items-center px-4 py-5 rounded-t-[10px] border-b border-black/4"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                background: "#FFF"
              }}
            >
              <h2
                className="text-black font-bold text-xl leading-normal"
                style={{
                  fontSize: "20px",
                  fontWeight: 700
                }}
              >
                Delete Partner
              </h2>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Second Section - Content */}
            <div
              className="px-4 py-5 border-b border-black/6"
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                background: "#FFF"
              }}
            >
              <p
                className="text-gray-600 text-lg leading-normal"
                style={{
                  color: "#525866",
                  fontSize: "18px",
                  fontWeight: 400
                }}
              >
                Are you sure you want to delete this partner (hotel) permanently?
              </p>
            </div>

            {/* Third Section - Footer */}
            <div
              className="flex justify-end items-center gap-18 px-4 py-5 rounded-b-[10px] border-t border-black/4"
              style={{
                borderTop: "1px solid rgba(0, 0, 0, 0.04)",
                background: "#FFF",
                gap: "10px"
              }}

            >

              <div className="flex gap-[16px] flex-end">


                <button
                  onClick={cancelDelete}
                  className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
                  style={{
                    padding: "8.52px 10px",
                    borderRadius: "6px",
                    background: "#FBFAFA",
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "19.5px"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex flex-col justify-center items-center px-2.5 py-2 rounded-md text-center font-medium text-sm leading-5 transition-colors"
                  style={{
                    padding: "8.52px 10px",
                    borderRadius: "6px",
                    background: "#EB1D1D",
                    color: "#FFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "19.5px"
                  }}
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* View Detail Slide-out Panel */}
      {showViewDetail && selectedPartner && (
        <div className="fixed inset-0 z-50">
          {/* Background overlay */}
          <div
            className="fixed inset-0"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            onClick={closeViewDetail}
          />

          {/* Slide-out panel */}
          <div className="fixed right-0 top-0 h-full w-1/2 bg-white flex flex-col w-[50vw]">
            {/* Header */}
            <div
              className="flex justify-between items-center px-5 py-5 border-b border-black/8"
              style={{
                width: "100%",
                padding: "20px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
              }}
            >
              <h2 className="text-lg font-semibold text-black">
                {activeTab === 'partner-info' ? 'Partner Detail' :
                  activeTab === 'subscription' ? 'Subscription Detail' :
                    'Room API Detail'}
              </h2>
              <button
                onClick={closeViewDetail}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-black/10">
              <button
                onClick={() => setActiveTab('partner-info')}
                className={`px-12 py-5 flex-1 text-center border-b-2 transition-colors ${activeTab === 'partner-info'
                  ? 'border-[#56C6FF] text-[#56C6FF]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                style={{
                  padding: "20px 50px",
                  borderBottom: activeTab === 'partner-info' ? "2px solid #56C6FF" : "2px solid transparent"
                }}
              >
                Partner info
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`px-12 py-5 flex-1 text-center border-b-2 transition-colors ${activeTab === 'subscription'
                  ? 'border-[#56C6FF] text-[#56C6FF]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                style={{
                  padding: "20px 50px",
                  borderBottom: activeTab === 'subscription' ? "2px solid #56C6FF" : "2px solid transparent"
                }}
              >
                Subscription
              </button>
              <button
                onClick={() => setActiveTab('room-api')}
                className={`px-12 py-5 flex-1 text-center border-b-2 transition-colors ${activeTab === 'room-api'
                  ? 'border-[#56C6FF] text-[#56C6FF]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                style={{
                  padding: "20px 50px",
                  borderBottom: activeTab === 'room-api' ? "2px solid #56C6FF" : "2px solid transparent"
                }}
              >
                Room API data
              </button>
            </div>

            {/* Content Area */}
            <div
              className="flex-1 p-5 overflow-y-auto"
              style={{
                width: "100%",
                padding: "20px"
              }}
            >
              {activeTab === 'partner-info' && (
                <div className="flex flex-col gap-5">
                  {/* Hotel Info Row */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        H
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black">{selectedPartner.hotelName}</h3>
                        <p className="text-sm text-gray-500">Partner</p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                      style={{
                        height: "37px",
                        padding: "0 16px",
                        borderRadius: "8px",
                        border: "1px solid #F6F3F2",
                        background: "#FBFAFA"
                      }}
                    >
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        Plan: {selectedPartner?.plan === 'gold pack' ? 'Gold' : selectedPartner?.plan === 'starter pack' ? 'Starter' : selectedPartner?.plan || 'Not set'}
                      </span>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="flex gap-6">
                    <div
                      className="flex flex-col gap-2.5 p-4 rounded-xl border-dashed border flex-1"
                      style={{
                        padding: "19px 16px",
                        borderRadius: "12px",
                        border: "1px dashed rgba(0, 0, 0, 0.12)"
                      }}
                    >
                      <p className="text-sm text-gray-600">Total Rooms</p>
                      <p className="text-2xl font-bold text-black">
                        {partnerDetailsLoading ? '...' : (selectedPartner?.stats?.totalRooms ?? 0)}
                      </p>
                    </div>
                    <div
                      className="flex flex-col gap-2.5 p-4 rounded-xl border-dashed border flex-1"
                      style={{
                        padding: "19px 16px",
                        borderRadius: "12px",
                        border: "1px dashed rgba(0, 0, 0, 0.12)"
                      }}
                    >
                      <p className="text-sm text-gray-600">Total Staff</p>
                      <p className="text-2xl font-bold text-black">
                        {partnerDetailsLoading ? '...' : (selectedPartner?.stats?.totalStaff ?? 0)}
                      </p>
                    </div>
                    <div
                      className="flex flex-col gap-2.5 p-4 rounded-xl border-dashed border flex-1"
                      style={{
                        padding: "19px 16px",
                        borderRadius: "12px",
                        border: "1px dashed rgba(0, 0, 0, 0.12)"
                      }}
                    >
                      <p className="text-sm text-gray-600">Active Clients</p>
                      <p className="text-2xl font-bold text-black">
                        {partnerDetailsLoading ? '...' : (selectedPartner?.stats?.activeClients ?? 0)}
                      </p>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-2">
                    <h4
                      className="text-gray-500  font-medium"
                      style={{
                        color: "rgba(0, 0, 0, 0.50)",
                        fontSize: "15px",
                        fontWeight: 500,
                        lineHeight: "21px"
                      }}
                    >
                      Info
                    </h4>
                    <div
                      className="flex flex-col gap-2 p-4 rounded-lg border"
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(33, 33, 33, 0.08)",
                        background: "#FBFAFA"
                      }}
                    >
                      {/* Info rows */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-sm text-gray-700">Hotel name</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.hotelName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">RC</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.RC || '-'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">ICE</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.ICE || '-'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">Identifiant Fiscal</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.identifiantFiscal || '-'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">Nº Taxe Professionnelle</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.taxeProfessionnelle || '-'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-700">Hotel city</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.city}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">Hotel address email</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.hotelAddressEmail}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm text-gray-700">Phone number</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.phone}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="text-sm text-gray-700">Services</span>
                        </div>
                        <span className="text-sm text-black">{getEnabledServices(selectedPartner.services).join(", ") || 'No services'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">Create at</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Section */}
                  <div className="space-y-2">
                    <h4
                      className="text-gray-500  font-medium"
                      style={{
                        color: "rgba(0, 0, 0, 0.50)",
                        fontSize: "15px",
                        fontWeight: 500,
                        lineHeight: "21px"
                      }}
                    >
                      Account
                    </h4>
                    <div
                      className="flex flex-col gap-2 p-4 rounded-lg border"
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(33, 33, 33, 0.08)",
                        background: "#FBFAFA"
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm text-gray-700">Username</span>
                        </div>
                        <span className="text-sm text-black">{selectedPartner.username}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-sm text-gray-700">Password</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black">
                            {showPasswordDetails ? 'Password cannot be displayed. Use Reset password.' : '***********'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPasswordDetails((v) => !v)}
                            className="p-1"
                            aria-label={showPasswordDetails ? 'Hide password' : 'Show password'}
                          >
                            {showPasswordDetails ? (
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.088.41-2.164 1.157-3.142m3.087-2.62A9.967 9.967 0 0112 5c5 0 9 4 9 7 0 1.093-.413 2.173-1.165 3.154M4 4l16 16" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="flex flex-col justify-center items-start gap-6 self-stretch">
                  {/* Subscription Header */}
                  <div className="flex items-center gap-4">
                    <div
                      className="flex w-12 h-12 justify-center items-center rounded-full border"
                      style={{
                        width: "46px",
                        height: "46px",
                        padding: "9.583px",
                        borderRadius: "157.843px",
                        border: "1px solid rgba(209, 146, 79, 0.25)",
                        background: "rgba(209, 146, 79, 0.05)",
                        boxShadow: "0 5.525px 8.681px 0 rgba(0, 0, 0, 0.02)"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <path d="M1.34546 6.87018C1.08675 6.15418 0.957399 5.79618 1.01256 5.56677C1.07289 5.31585 1.25133 5.12024 1.47942 5.05498C1.68795 4.99532 2.01235 5.1395 2.66115 5.42786C3.23502 5.68291 3.52196 5.81044 3.79155 5.80335C4.08838 5.79553 4.37392 5.6765 4.60107 5.46588C4.80737 5.27459 4.94574 4.96976 5.22249 4.3601L5.8324 3.01651C6.34187 1.89417 6.5966 1.33301 7 1.33301C7.4034 1.33301 7.65813 1.89417 8.1676 3.01651L8.77751 4.3601C9.05426 4.96976 9.19263 5.27459 9.39893 5.46588C9.62608 5.6765 9.91162 5.79553 10.2085 5.80335C10.478 5.81044 10.765 5.68291 11.3388 5.42786C11.9876 5.1395 12.312 4.99532 12.5206 5.05498C12.7487 5.12024 12.9271 5.31585 12.9874 5.56677C13.0426 5.79618 12.9132 6.15418 12.6545 6.87017L11.5425 9.94779C11.0668 11.2643 10.829 11.9226 10.3312 12.2945C9.83349 12.6663 9.19027 12.6663 7.90384 12.6663H6.09616C4.80973 12.6663 4.16651 12.6663 3.66877 12.2945C3.17102 11.9226 2.93318 11.2643 2.45748 9.94779L1.34546 6.87018Z" stroke="#D1924F" />
                        <path d="M7 9.33301H7.00599" stroke="#D1924F" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.6665 14.667H10.3332" stroke="#D1924F" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black">
                        {selectedPartner?.plan === 'gold pack' ? 'Gold' : selectedPartner?.plan === 'starter pack' ? 'Starter' : selectedPartner?.plan || 'Not set'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedPartner?.plan === 'gold pack' 
                          ? 'Full access to premium hotel management features and priority support.'
                          : selectedPartner?.plan === 'starter pack'
                          ? 'Access to essential hotel management features and standard support.'
                          : 'No subscription plan set.'}
                      </p>
                    </div>
                  </div>

                  {/* Subscription Period */}
                  <div
                    className="flex flex-col p-4 justify-center items-start gap-6 self-stretch rounded-lg border"
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(33, 33, 33, 0.08)",
                      background: "#FBFAFA"
                    }}
                  >
                    {/* Start Date Row */}
                    <div className="flex items-center gap-64 self-stretch">
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path d="M7.25 9.65723H11M5 9.65723H5.00674M8.75 12.6572H5M11 12.6572H10.9933" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12.5 1.40723V2.90723M3.5 1.40723V2.90723" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M0.875 9.08966C0.875 5.82168 0.875 4.18769 1.81409 3.17246C2.75318 2.15723 4.26462 2.15723 7.2875 2.15723H8.7125C11.7354 2.15723 13.2468 2.15723 14.1859 3.17246C15.125 4.18769 15.125 5.82168 15.125 9.08966V9.47479C15.125 12.7428 15.125 14.3768 14.1859 15.392C13.2468 16.4072 11.7354 16.4072 8.7125 16.4072H7.2875C4.26462 16.4072 2.75318 16.4072 1.81409 15.392C0.875 14.3768 0.875 12.7428 0.875 9.47479V9.08966Z" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1.25 5.90723H14.75" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm text-black">Start date</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedPartner?.startDate 
                          ? (() => {
                              try {
                                // Handle YYYY-MM-DD format (from date input)
                                if (typeof selectedPartner.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(selectedPartner.startDate)) {
                                  const [year, month, day] = selectedPartner.startDate.split('-')
                                  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                                  if (!isNaN(date.getTime())) {
                                    return date.toLocaleDateString('fr-FR', { 
                                      day: 'numeric', 
                                      month: 'long', 
                                      year: 'numeric' 
                                    })
                                  }
                                }
                                // Handle Date objects or ISO strings
                                const date = new Date(selectedPartner.startDate)
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })
                                }
                                // If it's already a formatted string, return as is
                                return String(selectedPartner.startDate)
                              } catch {
                                return 'Not set'
                              }
                            })()
                          : 'Not set'}
                      </span>
                    </div>

                    {/* End Date Row */}
                    <div className="flex items-center gap-64 self-stretch">
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path d="M7.25 9.65723H11M5 9.65723H5.00674M8.75 12.6572H5M11 12.6572H10.9933" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12.5 1.40723V2.90723M3.5 1.40723V2.90723" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M0.875 9.08966C0.875 5.82168 0.875 4.18769 1.81409 3.17246C2.75318 2.15723 4.26462 2.15723 7.2875 2.15723H8.7125C11.7354 2.15723 13.2468 2.15723 14.1859 3.17246C15.125 4.18769 15.125 5.82168 15.125 9.08966V9.47479C15.125 12.7428 15.125 14.3768 14.1859 15.392C13.2468 16.4072 11.7354 16.4072 8.7125 16.4072H7.2875C4.26462 16.4072 2.75318 16.4072 1.81409 15.392C0.875 14.3768 0.875 12.7428 0.875 9.47479V9.08966Z" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1.25 5.90723H14.75" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm text-black">End date</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {selectedPartner?.endDate 
                          ? (() => {
                              try {
                                // Handle YYYY-MM-DD format (from date input)
                                if (typeof selectedPartner.endDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(selectedPartner.endDate)) {
                                  const [year, month, day] = selectedPartner.endDate.split('-')
                                  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                                  if (!isNaN(date.getTime())) {
                                    return date.toLocaleDateString('fr-FR', { 
                                      day: 'numeric', 
                                      month: 'long', 
                                      year: 'numeric' 
                                    })
                                  }
                                }
                                // Handle Date objects or ISO strings
                                const date = new Date(selectedPartner.endDate)
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })
                                }
                                // If it's already a formatted string, return as is
                                return String(selectedPartner.endDate)
                              } catch {
                                return 'Not set'
                              }
                            })()
                          : 'Not set'}
                      </span>
                    </div>
                  </div>

                  {/* Subscription History */}
                  <div className="flex flex-col items-start gap-2.5 self-stretch">
                    {/* Header */}
                    <div className="flex items-center justify-between self-stretch">
                      <h4 className="text-lg font-semibold text-black">Subscription History</h4>
                      <button
                        className="flex w-8 h-8 justify-center items-center gap-1.5 rounded-md border"
                        style={{
                          width: "33.04px",
                          padding: "8.52px 20px",
                          borderRadius: "6px",
                          border: "1px solid #CED4DA",
                          background: "#FBFAFA"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                          <path d="M4.47998 8.33496H12.48M2.47998 4.33496H14.48M6.47998 12.335H10.48" stroke="black" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Subscription Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {subscriptionHistoryData.map((subscription) => (
                        <SubscriptionCard key={subscription.id} subscription={subscription} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'room-api' && (
                <div className="flex flex-col items-end gap-5 self-stretch">
                  {/* Upload Room Section */}
                  <div
                    className="flex flex-col items-center gap-5 p-6 self-stretch rounded-xl border"
                    style={{
                      padding: "25px",
                      borderRadius: "12px",
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                      background: "#FFF"
                    }}
                  >
                    {/* Upload Room Heading */}
                    <div
                      className="flex items-center text-center"
                      style={{
                        width: "550px",

                      }}
                    >
                      <h3 className="text-lg font-semibold text-black">Upload rooms</h3>
                    </div>

                    {/* Choose File Section */}
                    <div
                      className="flex flex-col justify-center items-center gap-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        height: "150px",
                        padding: "25px 13px",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        alignSelf: "stretch",
                        borderRadius: "6.75px",
                        border: "1px solid rgba(0, 0, 0, 0.06)",
                        background: "#FBFAFA"
                      }}
                      onClick={() => document.getElementById('room-file-input')?.click()}
                    >
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id="room-file-input"
                        className="hidden"
                        accept=".xlsx,.xls"
                        onChange={(e) => handleBulkUploadFile(e)}
                      />

                      {/* Upload Icon */}
                      <div
                        className="flex justify-center items-center flex-shrink-0"
                        style={{
                          width: "24px",
                          height: "24px",
                          padding: "2px"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                          <circle cx="11.5" cy="11" r="10" stroke="#141B34" strokeWidth="1.5" />
                          <path d="M14.5 7.75C14.9142 7.75 15.25 7.41421 15.25 7C15.25 6.58579 14.9142 6.25 14.5 6.25V7V7.75ZM8.5 6.25C8.08579 6.25 7.75 6.58579 7.75 7C7.75 7.41421 8.08579 7.75 8.5 7.75L8.5 7L8.5 6.25ZM8.94325 11.3691C8.66572 11.6766 8.68999 12.1508 8.99747 12.4284C9.30496 12.7059 9.77921 12.6816 10.0567 12.3741L9.5 11.8716L8.94325 11.3691ZM10.4393 10.8309L9.88259 10.3284L10.4393 10.8309ZM12.5607 10.8309L12.0039 11.3334H12.0039L12.5607 10.8309ZM12.9433 12.3741C13.2208 12.6816 13.695 12.7059 14.0025 12.4284C14.31 12.1508 14.3343 11.6766 14.0567 11.3691L13.5 11.8716L12.9433 12.3741ZM10.75 16C10.75 16.4142 11.0858 16.75 11.5 16.75C11.9142 16.75 12.25 16.4142 12.25 16H11.5H10.75ZM14.5 7V6.25L8.5 6.25L8.5 7L8.5 7.75L14.5 7.75V7ZM9.5 11.8716L10.0567 12.3741L10.9961 11.3334L10.4393 10.8309L9.88259 10.3284L8.94325 11.3691L9.5 11.8716ZM12.5607 10.8309L12.0039 11.3334L12.9433 12.3741L13.5 11.8716L14.0567 11.3691L13.1174 10.3284L12.5607 10.8309ZM10.4393 10.8309L10.9961 11.3334C11.2607 11.0403 11.409 10.8785 11.5248 10.7805C11.6273 10.6939 11.5993 10.75 11.5 10.75V10V9.25C11.09 9.25 10.7817 9.44458 10.5565 9.63495C10.3447 9.81396 10.118 10.0676 9.88259 10.3284L10.4393 10.8309ZM12.5607 10.8309L13.1174 10.3284C12.882 10.0676 12.6553 9.81397 12.4435 9.63495C12.2183 9.44458 11.91 9.25 11.5 9.25V10V10.75C11.4007 10.75 11.3727 10.6939 11.4752 10.7805C11.591 10.8785 11.7393 11.0403 12.0039 11.3334L12.5607 10.8309ZM11.5 10H10.75L10.75 16H11.5H12.25L12.25 10H11.5Z" fill="#141B34" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-black">Drag and drop your files here or
                        <label
                          htmlFor="room-file-input"
                          className="text-blue-600 cursor-pointer hover:underline ml-1"
                        >
                          choose file
                        </label>
                      </span>
                      <span className="text-xs text-gray-500">Excel file (.xlsx, .xls) with roomName column</span>
                    </div>
                  </div>

                  {/* Save/Upload Button */}
                  <button
                    onClick={handleBulkUploadRooms}
                    disabled={!selectedFile || isUploadingRooms}
                    className="flex justify-center items-center gap-1.5 rounded-md text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      padding: "8.52px 20px",
                      borderRadius: "6px",
                      background: "#1F2A44"
                    }}
                  >
                    {isUploadingRooms ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      'Upload Rooms'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex justify-end items-center gap-4 p-4 border-t border-black/8"
              style={{
                width: "100%",
                padding: "20px 16px",
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                background: "#FFF"
              }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (selectedPartner) {
                      handleEditPartner(selectedPartner)
                      closeViewDetail()
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  title="Edit Partner"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (selectedPartner) {
                      handleDeletePartner(selectedPartner)
                      closeViewDetail()
                    }
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Delete Partner"
                >
                  <RiDeleteBinLine className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Partner Modal */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-xl w-[47vw] mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div
              className="flex justify-between items-center border-b"
              style={{
                padding: "20px 16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                borderRadius: "10px 10px 0 0",
                background: "#FFF"
              }}
            >
              <div>
                <h2 className="text-lg font-semibold text-black">{isEditingPartner ? 'Edit Partner' : 'Add new Partner'}</h2>
                <p className="text-sm text-gray-600 mt-1">Make changes to your profile here. Click save when you're done.</p>
              </div>
              <button
                onClick={() => setShowAddPartnerModal(false)}
                className="flex items-center justify-center"
                style={{
                  width: "24px",
                  height: "24px",
                  aspectRatio: "1/1"
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Step Navigation */}
            <div
              className="flex justify-between items-center py-6 px-6"
              style={{
                alignItems: "center",
                alignSelf: "stretch"
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {/* Step 1 */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: currentStep === 1 ? "35px" : "33px",
                    height: currentStep === 1 ? "35px" : "33px",
                    background: currentStep === 1 ? "#1F2A44" : currentStep > 1 ? "#17B26A" : "#E5E7EB",
                    borderRadius: "999px"
                  }}
                >
                  {currentStep > 1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                      <path d="M0.5 6.46934L2.1 4.86934L6.1 8.86934L14.9 0.0693359L16.5 1.66934L6.1 12.0693L0.5 6.46934Z" fill="white" />
                    </svg>
                  ) : (
                    <span
                      className="text-white font-semibold"
                      style={{ fontSize: "14px" }}
                    >
                      1
                    </span>
                  )}
                </div>
                <span
                  className="font-semibold"
                  style={{
                    color: currentStep === 1 ? "#0A0A0A" : "#717182",
                    fontSize: "14px",
                    fontWeight: currentStep === 1 ? "600" : "500",
                    lineHeight: "22px"
                  }}
                >
                  Partner info
                </span>
              </div>

              <div
                className="flex items-center gap-2"
                style={{
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {/* Step 2 */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: currentStep === 2 ? "35px" : "33px",
                    height: currentStep === 2 ? "35px" : "33px",
                    background: currentStep === 2 ? "#1F2A44" : currentStep > 2 ? "#17B26A" : "#E5E7EB",
                    borderRadius: "999px"
                  }}
                >
                  {currentStep > 2 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                      <path d="M0.5 6.46934L2.1 4.86934L6.1 8.86934L14.9 0.0693359L16.5 1.66934L6.1 12.0693L0.5 6.46934Z" fill="white" />
                    </svg>
                  ) : (
                    <span
                      className="text-white font-semibold"
                      style={{ fontSize: "14px" }}
                    >
                      2
                    </span>
                  )}
                </div>
                <span
                  className="font-semibold"
                  style={{
                    color: currentStep === 2 ? "#0A0A0A" : "#717182",
                    fontSize: "14px",
                    fontWeight: currentStep === 2 ? "600" : "500",
                    lineHeight: "22px"
                  }}
                >
                  Account
                </span>
              </div>

              <div
                className="flex items-center gap-2"
                style={{
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {/* Step 3 */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: currentStep === 3 ? "35px" : "33px",
                    height: currentStep === 3 ? "35px" : "33px",
                    background: currentStep === 3 ? "#1F2A44" : currentStep > 3 ? "#17B26A" : "#E5E7EB",
                    borderRadius: "999px"
                  }}
                >
                  {currentStep > 3 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
                      <path d="M0.5 6.46934L2.1 4.86934L6.1 8.86934L14.9 0.0693359L16.5 1.66934L6.1 12.0693L0.5 6.46934Z" fill="white" />
                    </svg>
                  ) : (
                    <span
                      className="text-white font-semibold"
                      style={{ fontSize: "14px" }}
                    >
                      3
                    </span>
                  )}
                </div>
                <span
                  className="font-semibold"
                  style={{
                    color: currentStep === 3 ? "#0A0A0A" : "#717182",
                    fontSize: "14px",
                    fontWeight: currentStep === 3 ? "600" : "500",
                    lineHeight: "22px"
                  }}
                >
                  Subscription
                </span>
              </div>

              <div
                className="flex items-center gap-2"
                style={{
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {/* Step 4 */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: currentStep === 4 ? "35px" : "33px",
                    height: currentStep === 4 ? "35px" : "33px",
                    background: currentStep === 4 ? "#1F2A44" : "#E5E7EB",
                    borderRadius: "999px"
                  }}
                >
                  <span
                    className="text-white font-semibold"
                    style={{ fontSize: "14px" }}
                  >
                    4
                  </span>
                </div>
                <span
                  className="font-semibold"
                  style={{
                    color: currentStep === 4 ? "#0A0A0A" : "#717182",
                    fontSize: "14px",
                    fontWeight: currentStep === 4 ? "600" : "500",
                    lineHeight: "22px"
                  }}
                >
                  Rooms api data
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="px-6 pb-6">
              {currentStep === 1 && (
                <div
                  className="flex flex-col gap-5"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "20px",
                    alignSelf: "stretch"
                  }}
                >
                  {/* Name and City Row */}
                  <div
                    className="flex gap-4 w-full"
                    style={{
                      alignItems: "flex-start",
                      gap: "16px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Hotel name
                      </label>
                      <input
                        type="text"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.hotelName ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.hotelName}
                        onChange={(e) => handleInputChange('hotelName', e.target.value)}
                      />
                      {formErrors.hotelName && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.hotelName}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Hotel city
                      </label>
                      <div className="relative" ref={cityDropdownRef}>
                        <div
                          onClick={() => setShowCityDropdown(!showCityDropdown)}
                          className="w-full px-3 py-2 border rounded pr-10 cursor-pointer flex items-center"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: formErrors.hotelCity ? "1px solid #EF4444" : "1px solid #CED4DA",
                            background: "#FFF",
                            minHeight: "36px"
                          }}
                        >
                          {formData.hotelCity ? (
                            <span className="text-sm" style={{ color: "#212121" }}>
                              {formData.hotelCity}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">Select city</span>
                          )}
                        </div>
                        <svg
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform"
                          style={{
                            color: "#D9D9D9",
                            transform: showCityDropdown ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)'
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {showCityDropdown && (
                          <div
                            className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg"
                            style={{
                              borderRadius: "4px",
                              border: "1px solid #CED4DA",
                              background: "#FFF",
                              maxHeight: "200px",
                              overflowY: "auto",
                              top: "100%",
                              marginTop: "4px"
                            }}
                          >
                            {/* Search Input */}
                            <div className="p-2 border-b" style={{ borderBottom: "1px solid #E6E6E6" }}>
                              <input
                                type="text"
                                placeholder="Search city..."
                                className="w-full px-2 py-1.5 border rounded text-sm"
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  border: "1px solid #CED4DA",
                                  background: "#FFF"
                                }}
                                value={citySearchTerm}
                                onChange={(e) => {
                                  e.stopPropagation()
                                  setCitySearchTerm(e.target.value)
                                }}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </div>
                            {/* Cities List */}
                            <div className="flex flex-col gap-1 p-1" style={{ maxHeight: "150px", overflowY: "auto" }}>
                              {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                  <div
                                    key={city}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleInputChange('hotelCity', city)
                                      setShowCityDropdown(false)
                                      setCitySearchTerm("")
                                    }}
                                    className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                                    style={{
                                      padding: "6px 10px",
                                      borderRadius: "4px"
                                    }}
                                  >
                                    <span className="text-sm" style={{ color: "#212121" }}>
                                      {city}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                  No cities found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {formErrors.hotelCity && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.hotelCity}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hotel Address Email and Phone Number Row */}
                  <div
                    className="flex gap-4 w-full"
                    style={{
                      alignItems: "flex-start",
                      gap: "16px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Hotel address email
                      </label>
                      <input
                        type="email"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.hotelAddressEmail ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.hotelAddressEmail}
                        onChange={(e) => handleInputChange('hotelAddressEmail', e.target.value)}
                      />
                      {formErrors.hotelAddressEmail && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.hotelAddressEmail}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Phone number
                      </label>
                      <input
                        type="tel"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.phoneNumber ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* RC and ICE Row */}
                  <div
                    className="flex gap-4 w-full"
                    style={{
                      alignItems: "flex-start",
                      gap: "16px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        RC
                      </label>
                      <input
                        type="text"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.RC ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.RC}
                        onChange={(e) => handleInputChange('RC', e.target.value)}
                      />
                      {formErrors.RC && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.RC}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        ICE
                      </label>
                      <input
                        type="text"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.ICE ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.ICE}
                        onChange={(e) => handleInputChange('ICE', e.target.value)}
                      />
                      {formErrors.ICE && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.ICE}</p>
                      )}
                    </div>
                  </div>

                  {/* Identifiant Fiscal and Taxe Professionnelle Row */}
                  <div
                    className="flex gap-4 w-full"
                    style={{
                      alignItems: "flex-start",
                      gap: "16px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Identifiant Fiscal
                      </label>
                      <input
                        type="text"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.identifiantFiscal ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.identifiantFiscal}
                        onChange={(e) => handleInputChange('identifiantFiscal', e.target.value)}
                      />
                      {formErrors.identifiantFiscal && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.identifiantFiscal}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Taxe Professionnelle
                      </label>
                      <input
                        type="text"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.taxeProfessionnelle ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.taxeProfessionnelle}
                        onChange={(e) => handleInputChange('taxeProfessionnelle', e.target.value)}
                      />
                      {formErrors.taxeProfessionnelle && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.taxeProfessionnelle}</p>
                      )}
                    </div>
                  </div>

                  {/* Hotel Image Section */}
                  <div
                    className="w-full"
                    style={{
                      padding: "25px",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "20px",
                      alignSelf: "stretch",
                      borderRadius: "12px",
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                      background: "#FFF"
                    }}
                  >
                    <h3
                      className="text-sm font-medium mb-5"
                      style={{
                        color: "#0A0A0A",
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "22px"
                      }}
                    >
                      Hotel image
                    </h3>

                    {imagePreview ? (
                      <div className="relative w-full">
                        <div className="relative" style={{ width: "100%", maxHeight: "300px", overflow: "hidden", borderRadius: "6.75px" }}>
                          <Image
                            src={imagePreview}
                            alt="Hotel preview"
                            width={500}
                            height={300}
                            className="w-full h-auto object-contain"
                            style={{ borderRadius: "6.75px" }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {isUploadingImage && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded" style={{ borderRadius: "6.75px" }}>
                            <div className="text-white text-sm">Uploading...</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <label
                        className="flex flex-col items-center justify-center cursor-pointer"
                        style={{
                          height: "150px",
                          padding: "25px 13px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "12px",
                          alignSelf: "stretch",
                          borderRadius: "6.75px",
                          border: "1px solid rgba(0, 0, 0, 0.06)",
                          background: "#FBFAFA"
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                          id="hotel-image-input"
                        />
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            flexShrink: "0"
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
                            <path d="M12 2.56872C11.5299 2.56641 11.0307 2.56641 10.5 2.56641C6.02166 2.56641 3.78249 2.56641 2.39124 3.95765C1 5.34889 1 7.58806 1 12.0664C1 16.5447 1 18.7839 2.39124 20.1752C3.78249 21.5664 6.02166 21.5664 10.5 21.5664C14.9783 21.5664 17.2175 21.5664 18.6088 20.1752C19.9472 18.8367 19.998 16.7134 19.9999 12.5664" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M1 13.7018C1.61902 13.6119 2.24484 13.5675 2.87171 13.5691C5.52365 13.513 8.11064 14.3394 10.1711 15.9006C12.082 17.3485 13.4247 19.3413 14 21.5664" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M20 16.4626C18.8246 15.8673 17.6088 15.5652 16.3862 15.5665C14.5345 15.5592 12.7015 16.2398 11 17.5664" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M16 4.06641C16.4915 3.56071 17.7998 1.56641 18.5 1.56641M21 4.06641C20.5085 3.56071 19.2002 1.56641 18.5 1.56641M18.5 1.56641V9.56641" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 text-center">
                          {isUploadingImage ? (
                            "Uploading..."
                          ) : (
                            <>
                              Drag and drop your image here or <span className="text-blue-600 hover:underline">choose file</span>
                            </>
                          )}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div
                  className="flex flex-col gap-5"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "20px",
                    alignSelf: "stretch"
                  }}
                >
                  <div
                    className="flex gap-4 w-full"
                    style={{
                      alignItems: "flex-start",
                      gap: "16px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="Write Here..."
                        className="w-full px-3 py-2 border rounded"
                        style={{
                          padding: "7.52px 12px",
                          borderRadius: "4px",
                          border: formErrors.username ? "1px solid #EF4444" : "1px solid #CED4DA",
                          background: "#FFF"
                        }}
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                      {formErrors.username && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.username}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter password"
                          className="w-full px-3 py-2 border rounded pr-10"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: formErrors.password ? "1px solid #EF4444" : "1px solid #CED4DA",
                            background: isEditingPartner ? "#F5F5F5" : "#FFF",
                            cursor: isEditingPartner ? "not-allowed" : "text"
                          }}
                          value={isEditingPartner ? "*****" : formData.password}
                          onChange={(e) => {
                            if (!isEditingPartner) {
                              handleInputChange('password', e.target.value)
                            }
                          }}
                          disabled={isEditingPartner}
                          readOnly={isEditingPartner}
                        />
                        {!isEditingPartner && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {formErrors.password && (
                              <PublicIcon src="/assets/icons/status error.svg" alt="Error" width={16} height={16} />
                            )}
                            <button
                              type="button"
                              onClick={() => setShowPasswordDetails(!showPasswordDetails)}
                              className="text-[#6B7280] hover:text-[#1F2A44] transition-colors"
                            >
                              {showPasswordDetails ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                          </div>
                        )}
                        {formErrors.password && (
                          <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div
                  className="flex flex-col gap-5"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "20px",
                    alignSelf: "stretch"
                  }}
                >
                  <div
                    className="flex gap-4 w-full"
                    style={{
                      alignItems: "flex-start",
                      gap: "16px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Start date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          placeholder="mm/dd/yyyy"
                          className="w-full px-3 py-2 border rounded pr-10 calendar-input"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: formErrors.startDate ? "1px solid #EF4444" : "1px solid #CED4DA",
                            background: "#FFF"
                          }}
                          ref={startDateRef}
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                        />
                        <svg onClick={() => startDateRef.current?.showPicker()} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {formErrors.startDate && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.startDate}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        End date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          placeholder="mm/dd/yyyy"
                          className="w-full px-3 py-2 border rounded pr-10 calendar-input"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: formErrors.endDate ? "1px solid #EF4444" : "1px solid #CED4DA",
                            background: "#FFF"
                          }}
                          ref={endDateRef}
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                        />
                        <svg onClick={() => endDateRef.current?.showPicker()} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {formErrors.endDate && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.endDate}</p>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex gap-4 w-full"
                    style={{
                      alignItems: "flex-start",
                      gap: "16px",
                      alignSelf: "stretch"
                    }}
                  >
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Plan
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-3 py-2 border rounded pr-10 appearance-none"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: formErrors.plan ? "1px solid #EF4444" : "1px solid #CED4DA",
                            background: "#FFF"
                          }}
                          value={formData.plan}
                          onChange={(e) => handleInputChange('plan', e.target.value as 'starter pack' | 'gold pack')}
                        >
                          <option value="starter pack">Starter pack</option>
                          <option value="gold pack">Gold pack</option>
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                          style={{ color: "#D9D9D9" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {formErrors.plan && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.plan}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label
                        className="text-sm font-medium"
                        style={{
                          color: "#212121",
                          fontSize: "13px",
                          fontWeight: "500",
                          lineHeight: "19.5px"
                        }}
                      >
                        Services
                      </label>
                      <div className="relative" ref={servicesDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowServicesDropdown((open) => !open)}
                          className="w-full flex justify-between items-center px-3 py-2 border rounded"
                          style={{
                            padding: "7.52px 12px",
                            borderRadius: "4px",
                            border: formErrors.services ? "1px solid #EF4444" : "1px solid #CED4DA",
                            background: "#FFF",
                          }}
                        >
                          <span className="text-sm" style={{ color: "#212121" }}>
                            {getEnabledServices(formData.services).length > 0
                              ? getEnabledServices(formData.services).join(", ")
                              : "Select services"}
                          </span>
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showServicesDropdown && (
                          <div
                            className="absolute z-20 mt-1 w-full rounded border bg-white shadow-md"
                            style={{ borderColor: formErrors.services ? "#EF4444" : "#E5E7EB" }}
                          >
                            <div className="flex flex-col gap-2 p-3 max-h-56 overflow-y-auto">
                              {[
                                { key: 'housekeeping', label: 'Housekeeping' },
                                { key: 'bookingInterns', label: 'Booking Interns' },
                                { key: 'customizedServices', label: 'Customized Services' },
                                { key: 'activityAlerts', label: 'Activity Alerts' },
                                { key: 'laundry', label: 'Laundry' },
                                { key: 'roomDelivery', label: 'Room Delivery' },
                              ].map(({ key, label }) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={(formData.services as any)[key]?.assigned}
                                    onChange={() => handleServiceToggle(key as keyof typeof formData.services)}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    style={{ accentColor: "#1F2A44" }}
                                  />
                                  <span className="text-sm" style={{ color: "#212121" }}>
                                    {label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {formErrors.services && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.services}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex flex-col items-end gap-5 self-stretch">
                  {/* Upload Room Section */}
                  <div
                    className="flex flex-col items-center gap-5 p-6 self-stretch rounded-xl border w-full text-center"
                    style={{
                      padding: "25px",
                      borderRadius: "12px",
                      border: "1px dashed rgba(0, 0, 0, 0.12)",
                      background: "#FFF"
                    }}
                  >
                    {/* Upload Room Heading */}
                    <div
                      className="flex items-center gap-2 w-full text-center justify-center"
                    >
                      <h3 className="text-lg font-semibold text-black text-center">Upload rooms</h3>
                    </div>

                    {/* Room API Loading Bar Section */}
                    <div
                      className="flex items-center gap-5 self-stretch rounded-lg border"
                      style={{
                        height: "42px",
                        padding: "12px 13px",
                        borderRadius: "6.75px",
                        border: "1px solid #E6E6E6",
                        background: "#FFF",
                        boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.05)"
                      }}
                    >
                      {/* File Icon */}
                      <div
                        className="flex-shrink-0"
                        style={{
                          width: "20px",
                          height: "20px",
                          aspectRatio: "1/1"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5.12276 0H11.8146L17.4792 5.90996V17.3982C17.4792 18.8353 16.3145 20 14.8774 20H5.12276C3.68571 20 2.521 18.8353 2.521 17.3982V2.60177C2.521 1.16474 3.68571 0 5.12276 0Z" fill="#0263D1" />
                          <path opacity="0.302" fillRule="evenodd" clipRule="evenodd" d="M11.8062 0V5.86141H17.4789L11.8062 0Z" fill="white" />
                          <path d="M4.93652 14.2705V10.9596H6.10935C6.34391 10.9596 6.56232 10.9947 6.76453 11.0594C6.96674 11.1268 7.15007 11.2239 7.31455 11.3533C7.47901 11.4827 7.60844 11.6553 7.7028 11.8709C7.79716 12.0866 7.8457 12.3347 7.8457 12.6151C7.8457 12.8955 7.79716 13.1435 7.7028 13.3592C7.60844 13.5749 7.47901 13.7474 7.31455 13.8768C7.15009 14.0062 6.96674 14.1033 6.76453 14.1707C6.56232 14.2354 6.34393 14.2705 6.10935 14.2705H4.93652ZM5.76424 13.5506H6.00959C6.1417 13.5506 6.26572 13.5345 6.37625 13.5048C6.48949 13.4724 6.59193 13.4212 6.68899 13.3538C6.78606 13.2864 6.86154 13.1893 6.91546 13.0626C6.97209 12.9386 6.99903 12.7876 6.99903 12.6151C6.99903 12.4425 6.97207 12.2915 6.91546 12.1648C6.86154 12.0408 6.78606 11.9437 6.68899 11.8763C6.59193 11.8062 6.48949 11.7577 6.37625 11.7253C6.26572 11.6957 6.1417 11.6795 6.00959 11.6795H5.76424V13.5506ZM9.85431 14.3082C9.35553 14.3082 8.94302 14.1465 8.61679 13.8256C8.29055 13.5048 8.12877 13.1004 8.12877 12.6151C8.12877 12.1298 8.29055 11.7254 8.61679 11.4045C8.94302 11.0837 9.35553 10.9219 9.85431 10.9219C10.345 10.9219 10.7521 11.0837 11.0784 11.4045C11.4019 11.7254 11.5637 12.1298 11.5637 12.6151C11.5637 13.1004 11.4019 13.5048 11.0784 13.8256C10.7521 14.1465 10.345 14.3082 9.85431 14.3082ZM9.21801 13.3134C9.38247 13.4967 9.59276 13.5884 9.8489 13.5884C10.105 13.5884 10.3126 13.4967 10.4771 13.3134C10.6416 13.1273 10.7225 12.8955 10.7225 12.6151C10.7225 12.3347 10.6416 12.1028 10.4771 11.9168C10.3127 11.7334 10.105 11.6417 9.8489 11.6417C9.59276 11.6417 9.38247 11.7334 9.21801 11.9168C9.05355 12.1028 8.96996 12.3347 8.96996 12.6151C8.96996 12.8955 9.05355 13.1273 9.21801 13.3134ZM13.5318 14.3082C13.0492 14.3082 12.6475 14.1573 12.3294 13.8607C12.0085 13.5614 11.8495 13.1462 11.8495 12.6151C11.8495 12.0866 12.0112 11.6714 12.3348 11.3721C12.661 11.0729 13.0573 10.9219 13.5319 10.9219C13.9605 10.9219 14.311 11.027 14.5888 11.24C14.8638 11.4503 15.0228 11.7307 15.0633 12.0812L14.2275 12.2511C14.1924 12.0677 14.1088 11.9195 13.9794 11.8089C13.85 11.6983 13.699 11.6417 13.5265 11.6417C13.2892 11.6417 13.0924 11.7253 12.9333 11.8952C12.7742 12.0677 12.6933 12.305 12.6933 12.615C12.6933 12.9251 12.7742 13.1624 12.9306 13.3322C13.0897 13.5048 13.2865 13.5884 13.5264 13.5884C13.699 13.5884 13.8473 13.5398 13.9686 13.4428C14.0899 13.3457 14.1654 13.2163 14.1978 13.0545L15.0525 13.2487C14.9743 13.583 14.8017 13.8418 14.5321 14.0278C14.2652 14.2139 13.9309 14.3082 13.5318 14.3082Z" fill="white" />
                        </svg>
                      </div>

                      {/* Room API Data Text */}
                      <span className="text-sm font-medium text-black">Rooms api data</span>

                      {/* Loading Bar */}
                      <div
                        className="flex flex-col items-start gap-2.5 flex-1"
                        style={{
                          height: "8px",
                          borderRadius: "10px",
                          background: "#F5F6F6"
                        }}
                      >
                        {/* Progress Bar */}
                        {/* <div
                          className="h-2 rounded-lg"
                          style={{
                            width: "230px",
                            height: "8px",
                            borderRadius: "10px",
                            background: "#56C6FF"
                          }}
                        /> */}
                      </div>

                      {/* X Button */}
                      <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Choose File Section */}
                    <div
                      className="flex flex-col justify-center items-center gap-3 rounded-lg border w-full"
                      style={{
                        height: "150px",
                        padding: "25px 13px",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        alignSelf: "stretch",
                        borderRadius: "6.75px",
                        border: "1px solid rgba(0, 0, 0, 0.06)",
                        background: "#FBFAFA"
                      }}
                    >
                      <div
                        className="flex justify-center items-center flex-shrink-0"
                        style={{
                          width: "24px",
                          height: "24px",
                          padding: "2px"
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                          <circle cx="11.5" cy="11" r="10" stroke="#141B34" strokeWidth="1.5" />
                          <path d="M14.5 7.75C14.9142 7.75 15.25 7.41421 15.25 7C15.25 6.58579 14.9142 6.25 14.5 6.25V7V7.75ZM8.5 6.25C8.08579 6.25 7.75 6.58579 7.75 7C7.75 7.41421 8.08579 7.75 8.5 7.75L8.5 7L8.5 6.25ZM8.94325 11.3691C8.66572 11.6766 8.68999 12.1508 8.99747 12.4284C9.30496 12.7059 9.77921 12.6816 10.0567 12.3741L9.5 11.8716L8.94325 11.3691ZM10.4393 10.8309L9.88259 10.3284L10.4393 10.8309ZM12.5607 10.8309L12.0039 11.3334H12.0039L12.5607 10.8309ZM12.9433 12.3741C13.2208 12.6816 13.695 12.7059 14.0025 12.4284C14.31 12.1508 14.3343 11.6766 14.0567 11.3691L13.5 11.8716L12.9433 12.3741ZM10.75 16C10.75 16.4142 11.0858 16.75 11.5 16.75C11.9142 16.75 12.25 16.4142 12.25 16H11.5H10.75ZM14.5 7V6.25L8.5 6.25L8.5 7L8.5 7.75L14.5 7.75V7ZM9.5 11.8716L10.0567 12.3741L10.9961 11.3334L10.4393 10.8309L9.88259 10.3284L8.94325 11.3691L9.5 11.8716ZM12.5607 10.8309L12.0039 11.3334L12.9433 12.3741L13.5 11.8716L14.0567 11.3691L13.1174 10.3284L12.5607 10.8309ZM10.4393 10.8309L10.9961 11.3334C11.2607 11.0403 11.409 10.8785 11.5248 10.7805C11.6273 10.6939 11.5993 10.75 11.5 10.75V10V9.25C11.09 9.25 10.7817 9.44458 10.5565 9.63495C10.3447 9.81396 10.118 10.0676 9.88259 10.3284L10.4393 10.8309ZM12.5607 10.8309L13.1174 10.3284C12.882 10.0676 12.6553 9.81397 12.4435 9.63495C12.2183 9.44458 11.91 9.25 11.5 9.25V10V10.75C11.4007 10.75 11.3727 10.6939 11.4752 10.7805C11.591 10.8785 11.7393 11.0403 12.0039 11.3334L12.5607 10.8309ZM11.5 10H10.75L10.75 16H11.5H12.25L12.25 10H11.5Z" fill="#141B34" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-black">Drag and drop your files here or <span className="text-blue-600 cursor-pointer hover:underline">choose file</span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="flex justify-end items-center border-t"
              style={{
                padding: "20px 16px",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "10px",
                alignSelf: "stretch",
                borderRadius: "0 0 10px 10px",
                borderTop: "1px solid rgba(0, 0, 0, 0.04)",
                background: "#FFF"
              }}
            >
              <button
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setShowAddPartnerModal(false)}
                className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition-colors"
                style={{
                  padding: "8.52px 10px",
                  borderRadius: "6px",
                  background: "#FBFAFA"
                }}
              >
                {currentStep > 1 ? 'Prev' : 'Cancel'}
              </button>

              <button
                onClick={() => {
                  if (currentStep === 1) {
                    const {
                      hotelName,
                      hotelCity,
                      hotelAddressEmail,
                      phoneNumber,
                      RC,
                      ICE,
                      identifiantFiscal,
                      taxeProfessionnelle,
                    } = formData

                    const newErrors: Record<string, string> = {}

                    if (!hotelName?.trim()) newErrors.hotelName = 'Please fill this field'
                    if (!hotelCity?.trim()) newErrors.hotelCity = 'Please fill this field'
                    if (!hotelAddressEmail?.trim()) newErrors.hotelAddressEmail = 'Please fill this field'
                    if (!phoneNumber?.trim()) newErrors.phoneNumber = 'Please fill this field'
                    if (!RC?.trim()) newErrors.RC = 'Please fill this field'
                    if (!ICE?.trim()) newErrors.ICE = 'Please fill this field'
                    if (!identifiantFiscal?.trim()) newErrors.identifiantFiscal = 'Please fill this field'
                    if (!taxeProfessionnelle?.trim()) newErrors.taxeProfessionnelle = 'Please fill this field'

                    if (Object.keys(newErrors).length > 0) {
                      setFormErrors(prev => ({ ...prev, ...newErrors }))
                      return
                    }
                  } else if (currentStep === 2) {
                    const { username, password } = formData
                    const newErrors: Record<string, string> = {}

                    if (!username?.trim()) newErrors.username = 'Please fill this field'
                    if (!password?.trim()) newErrors.password = 'Please fill this field'

                    if (Object.keys(newErrors).length > 0) {
                      setFormErrors(prev => ({ ...prev, ...newErrors }))
                      return
                    }
                  } else if (currentStep === 3) {
                    const { startDate, endDate, plan, services } = formData
                    const newErrors: Record<string, string> = {}

                    if (!startDate?.trim()) newErrors.startDate = 'Please fill this field'
                    if (!endDate?.trim()) newErrors.endDate = 'Please fill this field'
                    if (!plan?.trim()) newErrors.plan = 'Please fill this field'
                    const enabledServices = services ? Object.values(services).filter(Boolean) : []
                    if (enabledServices.length === 0) newErrors.services = 'Please select at least one service'

                    if (Object.keys(newErrors).length > 0) {
                      setFormErrors(prev => ({ ...prev, ...newErrors }))
                      return
                    }
                  }

                  if (currentStep < 4) {
                    setCurrentStep(currentStep + 1)
                  } else {
                    // Save partner
                    savePartner()
                  }
                }}
                disabled={isLoading}
                className="px-4 py-2 rounded text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  padding: "8.52px 20px",
                  borderRadius: "6px",
                  background: "#1F2A44"
                }}
              >
                {isLoading ? 'Saving...' : (currentStep === 4 ? 'Save' : 'Next')}
              </button>
            </div>
          </div>
        </div>
      )}

     

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />

      {/* Success Card - For other success messages (password reset, etc.) */}
      {showSuccessCard && !lastCreatedHotelName && (
        <SuccessCard
          isOpen={showSuccessCard}
          message={successMessage}
          onClose={() => {
            setShowSuccessCard(false)
            setSuccessMessage("")
          }}
        />
      )}

      {/* Error Card - For all error messages */}
      <ErrorCard
        isOpen={showErrorCard}
        message={errorMessage}
        onClose={() => {
          setShowErrorCard(false)
          setErrorMessage("")
        }}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        onClose={() => {
          setShowResetPasswordModal(false)
          setPartnerIdForReset(null)
        }}
        memberId={partnerIdForReset || undefined}
        activeTab="partner"
        onSuccess={() => {
          setShowResetPasswordModal(false)
          setPartnerIdForReset(null)
          showAlert('Success', 'Password updated successfully', 'success')
        }}
      />
    </div>
    </>
  )
}
