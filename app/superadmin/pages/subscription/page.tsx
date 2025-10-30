"use client"

import { useState, useEffect } from "react"
import { RiArrowLeftLine, RiMoreLine, RiEditLine, RiEyeLine, RiHotelBedLine, RiTeamLine, RiUserLine } from "react-icons/ri"
import Link from "next/link"
import StatCard from "@/app/superadmin/components/stat-card"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import DropdownArrow from "@/app/superadmin/components/dropdown-arrow"
import SortArrows from "@/app/superadmin/components/sort-arrows"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import PlanIcon from "@/app/superadmin/components/plan-icon"
import UsersPlanIcon from "@/app/superadmin/components/users-plan-icon"
import RevenueIcon from "@/app/superadmin/components/revenue-icon"
import StaffIcon from "@/app/superadmin/components/staff-icon"
import { getAuthToken } from "@/lib/auth-utils"

interface Subscription {
  id: string
  partnerName: string
  startDate: string
  endDate: string
  avatar: string
  planApi?: 'starter pack' | 'gold pack'
  endDateISO?: string
}

interface SubscriptionHistory {
  id: string
  plan: string
  period: string
  amount: string
  method: string
  transactionId: string
  date: string
  status: "Paid" | "Pending"
}

interface Plan {
  id: string
  name: string
  type: 'starter' | 'gold'
  users: number
  revenue: string
}

const mockSubscriptions: Subscription[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  partnerName: "Partner Name",
  startDate: "15 juin 2025",
  endDate: "15 juin 2026",
  avatar: "P",
}))

const subscriptionHistoryData: SubscriptionHistory[] = Array.from({ length: 6 }, (_, i) => ({
  id: `${i + 1}`,
  plan: "Gold",
  period: "15 Jun 2025 → 15 Jun 2026",
  amount: "2,999 MAD",
  method: "Card (Visa ••3421)",
  transactionId: `#INV-2025-006${i + 1}`,
  date: i === 0 ? "" : "23 Mar 2024, 10:42",
  status: i === 0 ? "Pending" : "Paid"
}))

const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Starter pack",
    type: "starter",
    users: 200,
    revenue: "190.000 MAD"
  },
  {
    id: "2", 
    name: "Gold pack",
    type: "gold",
    users: 200,
    revenue: "1900.000 MAD"
  }
]

const SubscriptionCard = ({ history }: { history: SubscriptionHistory }) => (
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
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{history.plan}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Period</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{history.period}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Amount</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{history.amount}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Method</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{history.method}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Transaction ID</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{history.transactionId}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "#121212" }}>Date</span>
        <span className="text-sm font-light" style={{ color: "#A2A09F" }}>{history.date}</span>
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
            <path d="M14.3623 5.21847C14.565 5.50268 14.6663 5.64479 14.6663 5.85514C14.6663 6.0655 14.565 6.20761 14.3623 6.49182C13.4516 7.76885 11.1258 10.5218 7.99968 10.5218C4.87353 10.5218 2.54774 7.76885 1.63704 6.49182C1.43435 6.20761 1.33301 6.0655 1.33301 5.85514C1.33301 5.64479 1.43435 5.50268 1.63703 5.21847C2.54774 3.94144 4.87353 1.18848 7.99968 1.18848C11.1258 1.18848 13.4516 3.94144 14.3623 5.21847Z" stroke="#141B34"/>
            <path d="M10 5.85547C10 4.7509 9.10457 3.85547 8 3.85547C6.89543 3.85547 6 4.7509 6 5.85547C6 6.96004 6.89543 7.85547 8 7.85547C9.10457 7.85547 10 6.96004 10 5.85547Z" stroke="#121212"/>
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
            <path d="M6.00016 7.52214L6.00016 0.855469M6.00016 7.52214C5.53334 7.52214 4.66118 6.1926 4.3335 5.85547M6.00016 7.52214C6.46698 7.52214 7.33914 6.1926 7.66683 5.85547" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11.3332 8.85547C11.3332 10.5101 10.9878 10.8555 9.33317 10.8555H2.6665C1.01184 10.8555 0.666504 10.5101 0.666504 8.85547" stroke="#141B34" strokeLinecap="round" strokeLinejoin="round"/>
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
          border: history.status === "Paid" ? "0.5px solid rgba(80, 190, 135, 0.25)" : "0.5px solid rgba(206, 148, 29, 0.25)",
          background: history.status === "Paid" ? "#EEF9F3" : "rgba(206, 148, 29, 0.05)",
          color: history.status === "Paid" ? "#50BE87" : "#CE941D",
          fontSize: "12px",
          fontWeight: "500"
        }}
      >
        {history.status}
      </div>
    </div>
    </div>
    
    {/* Bottom Section - Icons and Status */}
  </div>
)

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [plans] = useState<Plan[]>(mockPlans)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [plan, setPlan] = useState("Gold pack")
  const [endDate, setEndDate] = useState("")
  const [showHistorySlide, setShowHistorySlide] = useState(false)
  const [selectedHistorySubscription, setSelectedHistorySubscription] = useState<Subscription | null>(null)
  const [showUsersPlanView, setShowUsersPlanView] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isLoadingPlanPartners, setIsLoadingPlanPartners] = useState(false)
  const [planPartnersError, setPlanPartnersError] = useState<string | null>(null)

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSubscriptions = subscriptions.slice(startIndex, endIndex)

  const handleEditEndDate = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    // Initialize plan label from API value if available, else from selected plan context
    const planLabel = subscription.planApi
      ? (subscription.planApi === 'gold pack' ? 'Gold pack' : 'Starter pack')
      : (selectedPlan ? selectedPlan.name : 'Gold pack')
    setPlan(planLabel)
    // Initialize end date input with ISO if available
    if (subscription.endDateISO) {
      const d = new Date(subscription.endDateISO)
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      setEndDate(`${yyyy}-${mm}-${dd}`)
    } else {
      setEndDate("")
    }
    setShowEditModal(true)
  }

  const handleSave = async () => {
    if (!selectedSubscription) return
    try {
      const token = getAuthToken()
      if (!token) {
        alert('Please log in to update subscription')
        return
      }
      const planApi = plan.toLowerCase() as 'starter pack' | 'gold pack'
      const body: any = { plan: planApi }
      if (endDate) {
        body.endDate = endDate
      }
      const res = await fetch(`/api/superadmin/partners/${selectedSubscription.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok || (result && result.success === false)) {
        alert(`❌ ${result?.error || 'Failed to update partner'}`)
        return
      }
      // Update local table. If plan changed away from current selectedPlan, remove.
      const changedAway = selectedPlan && planApi !== selectedPlan.name.toLowerCase()
      if (changedAway) {
        setSubscriptions(prev => prev.filter(s => s.id !== selectedSubscription.id))
      } else {
        const newEndDateDisplay = endDate ? new Date(endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : selectedSubscription.endDate
        setSubscriptions(prev => prev.map(s => s.id === selectedSubscription.id ? { ...s, endDate: newEndDateDisplay, endDateISO: endDate ? new Date(endDate).toISOString() : s.endDateISO, planApi } : s))
      }
      alert('✅ Partner subscription updated')
    } catch (e) {
      console.error(e)
      alert('❌ Failed to update partner')
    } finally {
      setShowEditModal(false)
      setSelectedSubscription(null)
    }
  }

  const handleViewHistory = (subscription: Subscription) => {
    setSelectedHistorySubscription(subscription)
    setShowHistorySlide(true)
  }

  const handleUsersPlanClick = (plan: Plan) => {
    setSelectedPlan(plan)
    setShowUsersPlanView(true)
  }

  const handleBackToPlans = () => {
    setShowUsersPlanView(false)
    setSelectedPlan(null)
    setPlanPartnersError(null)
    setSubscriptions(mockSubscriptions)
  }

  // Fetch partners for selected plan
  useEffect(() => {
    const fetchPartnersByPlan = async () => {
      if (!showUsersPlanView || !selectedPlan) return
      try {
        setIsLoadingPlanPartners(true)
        setPlanPartnersError(null)
        const apiPlan = selectedPlan.name.toLowerCase()
        const token = getAuthToken()
        if (!token) {
          setPlanPartnersError('Please log in to view partners')
          setIsLoadingPlanPartners(false)
          return
        }
        const res = await fetch(`/api/superadmin/partners?plan=${encodeURIComponent(apiPlan)}&limit=${itemsPerPage}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to load partners')
        }
        const data = await res.json()
        const partners = (data.partners || []).map((p: any, i: number) => ({
          id: p._id || String(i + 1),
          partnerName: p.hotelName || 'Partner',
          startDate: p.startDate ? new Date(p.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
          endDate: p.endDate ? new Date(p.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
          avatar: (p.hotelName ? p.hotelName.charAt(0) : 'P').toUpperCase(),
          planApi: p.plan,
          endDateISO: p.endDate ? new Date(p.endDate).toISOString() : undefined
        }))
        setSubscriptions(partners)
      } catch (e: any) {
        setPlanPartnersError(e.message || 'Failed to load partners')
      } finally {
        setIsLoadingPlanPartners(false)
      }
    }
    fetchPartnersByPlan()
  }, [showUsersPlanView, selectedPlan, itemsPerPage])

  return (
    <div className="p-6 ">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
        <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
        
        {/* Breadcrumb Navigation */}
        {showUsersPlanView && selectedPlan && (
          <div className="flex items-center gap-2 mt-4">
            <button 
              onClick={handleBackToPlans}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-sm text-muted-foreground">Subscription</span>
            <span className="text-sm text-muted-foreground">&gt;</span>
            <span className="text-sm font-medium text-foreground">Users Plan</span>
          </div>
        )}
      </div>

      {/* Show Stats Grid and Plans Table only when not in Users Plan view */}
      {!showUsersPlanView && (
        <>
       {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              <StatCard
              icon={<RevenueIcon />}
              label="Total Plans Revenue"
              value="1900.000 MAD"
              change="+2%"
                changeType="positive"
              />
              <StatCard
              icon={<StaffIcon />}
              label="Total Users"
                value="42"
              change="+2% "
                changeType="positive"
            />
          </div>

          {/* Plans Table Section */}
      <div className="bg-card rounded-lg p-4 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-base font-semibold text-foreground">Plans</h3>
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
                <option value={50}>Display 50</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DropdownArrow />
              </div>
            </div>

            <input
              type="text"
              placeholder="Search..."
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
          </div>
        </div>

        {/* Plans Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="none" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Plan Name
                    </span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="down" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Users
                    </span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <SortArrows sortDirection="down" />
                    <span style={{ 
                      color: "#000", 
                      fontSize: "12px", 
                      fontWeight: "500", 
                      lineHeight: "19.5px" 
                    }}>
                      Revenue
                    </span>
                  </div>
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <PlanIcon type={plan.type} />
                      <span style={{
                        color: "#525866",
                        fontSize: "12px",
                        fontWeight: "400",
                        lineHeight: "19.5px"
                      }}>
                        {plan.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {plan.users}
                  </td>
                  <td className="px-4 py-4" style={{
                    color: "#525866",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "19.5px"
                  }}>
                    {plan.revenue}
                  </td>
                  <td className="px-4 py-4">
                    <button 
                      onClick={() => handleUsersPlanClick(plan)}
                      className="hover:opacity-80 transition-opacity"
                      title="Users Plan"
                    >
                      <UsersPlanIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Displaying {startIndex + 1}-{Math.min(endIndex, subscriptions.length)} results out of {subscriptions.length}
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
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
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
      </div>
        </>
      )}

      {/* Users Plan View */}
      {showUsersPlanView && selectedPlan && (
      <div className="bg-card rounded-lg p-4">
        {/* Header */}
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-base font-semibold text-foreground">{selectedPlan.name}</h3>
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
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
              <option value={50}>Display 50</option>
            </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DropdownArrow />
                </div>
              </div>

            <input
              type="text"
              placeholder="Search..."
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

            <input
              type="date"
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
          </div>
        </div>

          {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                  <th className="px-4 py-3 text-left">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <SortArrows sortDirection="none" />
                      <span style={{ 
                        color: "#000", 
                        fontSize: "12px", 
                        fontWeight: "500", 
                        lineHeight: "19.5px" 
                      }}>
                  Partner Name
                      </span>
                    </div>
                </th>
                  <th className="px-4 py-3 text-left">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <SortArrows sortDirection="none" />
                      <span style={{ 
                        color: "#000", 
                        fontSize: "12px", 
                        fontWeight: "500", 
                        lineHeight: "19.5px" 
                      }}>
                  Start date
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <SortArrows sortDirection="none" />
                      <span style={{ 
                        color: "#000", 
                        fontSize: "12px", 
                        fontWeight: "500", 
                        lineHeight: "19.5px" 
                      }}>
                        End date
                      </span>
                    </div>
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoadingPlanPartners ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Loading partners...
                    </div>
                  </td>
                </tr>
              ) : planPartnersError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-red-600">
                    {planPartnersError}
                  </td>
                </tr>
              ) : currentSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No partners found for this plan
                  </td>
                </tr>
              ) : currentSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {subscription.avatar}
                      </div>
                        <span style={{
                          color: "#525866",
                          fontSize: "12px",
                          fontWeight: "400",
                          lineHeight: "19.5px"
                        }}>
                          {subscription.partnerName}
                        </span>
                    </div>
                  </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {subscription.startDate}
                    </td>
                    <td className="px-4 py-4" style={{
                      color: "#525866",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "19.5px"
                    }}>
                      {subscription.endDate}
                    </td>
                  <td className="px-4 py-4">
                    <DropdownMenu
                      trigger={
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <RiMoreLine className="w-5 h-5 text-muted-foreground" />
                        </button>
                      }
                      items={[
                        {
                            label: "Edit end date",
                          icon: <RiEditLine className="w-4 h-4" />,
                          onClick: () => handleEditEndDate(subscription),
                        },
                        {
                          label: "Subscription History",
                          icon: <RiEyeLine className="w-4 h-4" />,
                          onClick: () => handleViewHistory(subscription),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Displaying {startIndex + 1}-{Math.min(endIndex, subscriptions.length)} results out of {subscriptions.length}
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
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentPage === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
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
        </div>
      )}

      {/* Edit End Date Modal */}
      {showEditModal && selectedSubscription && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white rounded-xl w-[50vw] mx-4 max-h-[90vh] overflow-y-auto">
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
              <h2 className="text-lg font-semibold text-black">Edit End Date</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex items-center justify-center"
                style={{ width: "24px", height: "24px", aspectRatio: "1/1" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#212121]">Plan</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{
                      padding: "7.52px 12px",
                      border: "1px solid #CED4DA",
                      borderRadius: "4px",
                      background: "#FFF"
                    }}
                  >
                    <option value="Gold pack">Gold pack</option>
                    <option value="Starter pack">Starter pack</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#212121]">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{
                      padding: "7.52px 12px",
                      border: "1px solid #CED4DA",
                      borderRadius: "4px",
                      background: "#FFF"
                    }}
                  />
                </div>
              </div>
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
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                style={{ 
                  padding: "8.52px 10px", 
                  borderRadius: "6px", 
                  background: "#FBFAFA",
                  border: "1px solid #CED4DA",
                  color: "#525866"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-primary/90 transition-colors"
                style={{ 
                  padding: "8.52px 20px", 
                  borderRadius: "6px", 
                  background: "#1F2A44" 
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription History Modal - Right Side Slide */}
      {showHistorySlide && selectedHistorySubscription && (
        <div className="fixed inset-0 z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="flex justify-end h-full">
            <div 
              className="bg-white w-[50vw] h-full overflow-y-auto"
              style={{
                boxShadow: "-4px 0 24px 0 rgba(0, 0, 0, 0.15)",
                animation: "slideInRight 0.3s ease-out"
              }}
            >
              {/* Main Header */}
              <div 
                className="flex justify-between items-center border-b sticky top-0 bg-white z-10"
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                  background: "#FFF"
                }}
              >
                <h2 className="text-lg font-semibold text-black">Subscription History</h2>
                <button 
                  onClick={() => setShowHistorySlide(false)}
                  className="flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  style={{ width: "32px", height: "32px" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Secondary Header */}
              <div 
                className="flex justify-between items-center border-b"
                style={{
                  padding: "16px 24px",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
                  background: "#FFF"
                }}
              >
                <h3 className="text-sm font-medium text-gray-600">Subscription History</h3>
                <button className="flex items-center justify-center hover:bg-gray-100 rounded transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h12M2 12h8" stroke="#525866" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Modal Content - 2 cards per row */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {subscriptionHistoryData.map((history) => (
                    <SubscriptionCard key={history.id} history={history} />
                  ))}
                </div>
              </div>

              {/* Footer with Pagination */}
              <div 
                className="flex justify-between items-center border-t sticky bottom-0 bg-white"
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid rgba(0, 0, 0, 0.04)",
                  background: "#FFF"
                }}
              >
                <p className="text-sm text-muted-foreground">
                  Displaying 6 results out of 6
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <LeftArrow />
                  </button>
                  <button className="px-3 py-1 bg-primary text-white rounded text-sm font-medium">1</button>
                  <button className="px-3 py-1 text-muted-foreground hover:bg-muted rounded text-sm font-medium">2</button>
                  <button className="px-3 py-1 text-muted-foreground hover:bg-muted rounded text-sm font-medium">3</button>
                  <button 
                    onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                    disabled={currentPage === 3}
                    className="p-2 border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RightArrow />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
