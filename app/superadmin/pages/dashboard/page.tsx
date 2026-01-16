"use client"

import StatCard from "@/app/superadmin/components/stat-card"
import Tabs from "@/app/superadmin/components/tabs"
import RevenueChart from "@/app/superadmin/components/revenue-chart"
import SubscribersChart from "@/app/superadmin/components/subscribers-chart"
import RevenueIcon from "@/app/superadmin/components/revenue-icon"
import StaffIcon from "@/app/superadmin/components/staff-icon"
import PlanIcon from "@/app/superadmin/components/plan-icon"
import InvoiceIcon from "@/app/superadmin/components/invoice-icon"
import SubscriptionIcon from "@/app/superadmin/components/subscription-icon"
import DropdownMenu from "@/app/superadmin/components/dropdown-menu"
import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/auth-utils"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("subscriptions")
  const [partnerStats, setPartnerStats] = useState<{ totalPartners: number; activePartners: number } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [newSubscriptionsCount, setNewSubscriptionsCount] = useState<number>(0)
  const [newSubscriptionsLoading, setNewSubscriptionsLoading] = useState(true)
  const [totalUsersChange, setTotalUsersChange] = useState<{ change: string; changeType: "positive" | "negative" | "neutral" } | null>(null)
  const [newSubscriptionsChange, setNewSubscriptionsChange] = useState<{ change: string; changeType: "positive" | "negative" | "neutral" } | null>(null)
  const [servicesStats, setServicesStats] = useState<{ 
    totalStaff: number; 
    totalRooms: number; 
    totalClients: number;
    changes?: {
      totalStaff: { change: string; changeType: "positive" | "negative" | "neutral" };
      totalRooms: { change: string; changeType: "positive" | "negative" | "neutral" };
      totalClients: { change: string; changeType: "positive" | "negative" | "neutral" };
    }
  } | null>(null)
  const [servicesStatsLoading, setServicesStatsLoading] = useState(true)
  const [partnerStatsChange, setPartnerStatsChange] = useState<{ change: string; changeType: "positive" | "negative" | "neutral" } | null>(null)
  const [ticketStats, setTicketStats] = useState<{ 
    totalTickets: number; 
    newTickets: number; 
    openTickets: number; 
    reopenedTickets: number; 
    pendingTickets: number; 
    resolvedTickets: number; 
    canceledTickets: number;
    lowPriorityTickets?: number;
    mediumPriorityTickets?: number;
    urgentPriorityTickets?: number;
    changes?: {
      totalTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
      newTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
      openTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
      reopenedTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
      pendingTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
      resolvedTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
      canceledTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
    }
  } | null>(null)
  const [ticketStatsLoading, setTicketStatsLoading] = useState(true)
  const [clientStats, setClientStats] = useState<{
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    percentageChange: string;
    isIncrease: boolean;
  } | null>(null)
  const [clientStatsLoading, setClientStatsLoading] = useState(true)
  const [ticketStatsChanges, setTicketStatsChanges] = useState<{
    totalTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
    newTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
    openTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
    reopenedTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
    pendingTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
    resolvedTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
    canceledTickets: { change: string; changeType: "positive" | "negative" | "neutral" };
  } | null>(null)
  
  const [revenueFilter, setRevenueFilter] = useState<string>("All Time")
  const [servicesFilter, setServicesFilter] = useState<string>("All Time")
  const [supportFilter, setSupportFilter] = useState<string>("All Time")

  // Order Time Data Array
  const orderTimeData = [
    {
      name: "Morning",
      percentage: 65,
      color: "#56C6FF",
      position: { x: 0, y: 70 }, // Bottom center
      strokeDasharray: "285.6 439.6",
      strokeDashoffset: "0"
    },
    {
      name: "Afternoon", 
      percentage: 23,
      color: "#1F2A44",
      position: { x: -50, y: -50 }, // Top left
      strokeDasharray: "101.1 439.6",
      strokeDashoffset: "-285.6"
    },
    {
      name: "Evening",
      percentage: 20,
      color: "#2C4DED", 
      position: { x: 50, y: -50 }, // Top right
      strokeDasharray: "87.9 439.6",
      strokeDashoffset: "-386.7"
    }
  ]

  // Scroll detection to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["subscriptions", "partners", "support"]
      const scrollPosition = window.scrollY + 200 // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current: number, previous: number): { change: string; changeType: "positive" | "negative" | "neutral" } => {
    if (previous === 0) {
      return current > 0 
        ? { change: "+100%", changeType: "positive" }
        : { change: "0%", changeType: "neutral" }
    }
    const percentChange = ((current - previous) / previous) * 100
    const rounded = Math.round(percentChange * 10) / 10 // Round to 1 decimal place
    const sign = rounded >= 0 ? "+" : ""
    return {
      change: `${sign}${rounded}%`,
      changeType: rounded > 0 ? "positive" : rounded < 0 ? "negative" : "neutral"
    }
  }

  // Load partner stats for dashboard cards
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true)
        const token = getAuthToken()
        if (!token) {
          setStatsLoading(false)
          return
        }

        // Fetch all partners to calculate monthly changes
        const partnersRes = await fetch(`/api/superadmin/partners?limit=1000`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        let totals: { totalPartners: number; activePartners: number } | null = null
        let totalUsersChangeCalc: { change: string; changeType: "positive" | "negative" | "neutral" } | null = null

        if (partnersRes.ok) {
          const partnersData = await partnersRes.json().catch(() => ({}))
          const partners = partnersData.partners || []

          // Calculate total partners
          totals = { totalPartners: partners.length, activePartners: 0 }
          
          // Count active partners
          partners.forEach((p: any) => {
            if (p.status === 'active') {
              totals!.activePartners++
            }
          })

          // Calculate Total Partners change (vs yesterday)
          // Compare: Total partners at end of yesterday vs Total partners today
          if (Array.isArray(partners)) {
            const now = new Date()
            
            // Today start - current total
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            todayStart.setHours(0, 0, 0, 0)
            
            // End of yesterday - previous total
            const yesterdayEnd = new Date(todayStart)
            yesterdayEnd.setMilliseconds(yesterdayEnd.getMilliseconds() - 1)

            // Count partners created up to now (current total)
            const currentTotal = partners.length

            // Count partners created up to end of yesterday (yesterday total)
            const yesterdayTotal = partners.filter((p: any) => {
              if (!p.createdAt) return false
              try {
                const createdAt = new Date(p.createdAt)
                return createdAt <= yesterdayEnd
              } catch {
                return false
              }
            }).length

            totalUsersChangeCalc = calculatePercentageChange(currentTotal, yesterdayTotal)
          }
        }

        // Fallback: use stats endpoint if partners list fetch failed
        if (!totals) {
          const res = await fetch('/api/superadmin/partners/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json().catch(() => ({}))
            const s = (data && (data.stats || data)) || {}
            if (typeof s.totalPartners === 'number' && typeof s.activePartners === 'number') {
              totals = { totalPartners: s.totalPartners, activePartners: s.activePartners }
            }
          }

          // Fallback: derive totals from partners list pagination
          if (!totals) {
            const commonHeaders = { 'Authorization': `Bearer ${token}` }
            const listRes = await fetch(`/api/superadmin/partners?limit=1`, { headers: commonHeaders })
            const activeRes = await fetch(`/api/superadmin/partners?limit=1&isActive=true`, { headers: commonHeaders })
            let total = 0
            let active = 0
            if (listRes.ok) {
              const listData = await listRes.json().catch(() => ({}))
              total = listData?.pagination?.total ?? 0
            }
            if (activeRes.ok) {
              const activeData = await activeRes.json().catch(() => ({}))
              active = activeData?.pagination?.total ?? 0
            }
            totals = { totalPartners: total, activePartners: active }
          }
        }

        setPartnerStats(totals)
        if (totalUsersChangeCalc) {
          setTotalUsersChange(totalUsersChangeCalc)
          setPartnerStatsChange(totalUsersChangeCalc)
        }
      } catch (e) {
        console.error('Error loading stats:', e)
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [])

  // Load new subscriptions count for current month
  useEffect(() => {
    const loadNewSubscriptions = async () => {
      try {
        setNewSubscriptionsLoading(true)
        const token = getAuthToken()
        if (!token) {
          setNewSubscriptionsLoading(false)
          return
        }

        // Get current month range
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        currentMonthStart.setHours(0, 0, 0, 0)
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        currentMonthEnd.setHours(23, 59, 59, 999)

        // Get last month range
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        lastMonthStart.setHours(0, 0, 0, 0)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
        lastMonthEnd.setHours(23, 59, 59, 999)

        // Fetch all partners
        const partnersRes = await fetch(`/api/superadmin/partners?limit=1000`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (partnersRes.ok) {
          const partnersData = await partnersRes.json().catch(() => ({}))
          const partners = partnersData.partners || []

          if (Array.isArray(partners)) {
            // Count partners created in current month (who got plans this month)
            const currentMonthPartners = partners.filter((p: any) => {
              if (!p.createdAt) return false
              try {
                const createdAt = new Date(p.createdAt)
                return createdAt >= currentMonthStart && createdAt <= currentMonthEnd
              } catch {
                return false
              }
            }).length

            // Count partners created in last month
            const lastMonthPartners = partners.filter((p: any) => {
              if (!p.createdAt) return false
              try {
                const createdAt = new Date(p.createdAt)
                return createdAt >= lastMonthStart && createdAt <= lastMonthEnd
              } catch {
                return false
              }
            }).length

            setNewSubscriptionsCount(currentMonthPartners)
            
            // Calculate percentage change for new subscriptions
            const change = calculatePercentageChange(currentMonthPartners, lastMonthPartners)
            setNewSubscriptionsChange(change)
          } else {
            setNewSubscriptionsCount(0)
            setNewSubscriptionsChange({ change: "0%", changeType: "neutral" })
          }
        } else {
          setNewSubscriptionsCount(0)
          setNewSubscriptionsChange({ change: "0%", changeType: "neutral" })
        }
      } catch (e) {
        console.error('Error fetching new subscriptions:', e)
        setNewSubscriptionsCount(0)
        setNewSubscriptionsChange({ change: "0%", changeType: "neutral" })
      } finally {
        setNewSubscriptionsLoading(false)
      }
    }
    loadNewSubscriptions()
  }, [])

  // Load partner services stats (staff, rooms, clients)
  useEffect(() => {
    const loadServicesStats = async () => {
      try {
        setServicesStatsLoading(true)
        const token = getAuthToken()
        if (!token) {
          setServicesStatsLoading(false)
          return
        }

        const res = await fetch('/api/superadmin/partners/services-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          if (data.success && data.stats) {
            setServicesStats({
              totalStaff: data.stats.totalStaff || 0,
              totalRooms: data.stats.totalRooms || 0,
              totalClients: data.stats.totalClients || 0,
              changes: data.stats.changes || undefined
            })
          }
        }
      } catch (e) {
        console.error('Error loading services stats:', e)
      } finally {
        setServicesStatsLoading(false)
      }
    }
    loadServicesStats()
  }, [])

  // Load ticket stats for dashboard cards
  useEffect(() => {
    const loadTicketStats = async () => {
      try {
        setTicketStatsLoading(true)
        const token = getAuthToken()
        if (!token) {
          setTicketStatsLoading(false)
          return
        }

        const res = await fetch('/api/superadmin/tickets/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          if (data.success && data.stats) {
            setTicketStats({
              totalTickets: data.stats.totalTickets || 0,
              newTickets: data.stats.newTickets || 0,
              openTickets: data.stats.openTickets || 0,
              reopenedTickets: data.stats.reopenedTickets || 0,
              pendingTickets: data.stats.pendingTickets || 0,
              resolvedTickets: data.stats.resolvedTickets || 0,
              canceledTickets: data.stats.canceledTickets || 0,
              lowPriorityTickets: data.stats.lowPriorityTickets || 0,
              mediumPriorityTickets: data.stats.mediumPriorityTickets || 0,
              urgentPriorityTickets: data.stats.urgentPriorityTickets || 0,
              changes: data.stats.changes || undefined
            })
          }
        }
      } catch (e) {
        console.error('Error loading ticket stats:', e)
      } finally {
        setTicketStatsLoading(false)
      }
    }
    loadTicketStats()
  }, [])

  // Load client stats for Total Requests graph
  useEffect(() => {
    const loadClientStats = async () => {
      try {
        setClientStatsLoading(true)
        const token = getAuthToken()
        if (!token) {
          setClientStatsLoading(false)
          return
        }

        const res = await fetch('/api/superadmin/clients/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          if (data.success && data.stats) {
            setClientStats({
              totalClients: data.stats.totalClients || 0,
              activeClients: data.stats.activeClients || 0,
              inactiveClients: data.stats.inactiveClients || 0,
              percentageChange: data.stats.percentageChange || "0%",
              isIncrease: data.stats.isIncrease !== false
            })
          }
        }
      } catch (e) {
        console.error('Error loading client stats:', e)
      } finally {
        setClientStatsLoading(false)
      }
    }
    loadClientStats()
  }, [])

  const handleExportSupportTickets = () => {
    try {
      if (!ticketStats) {
        alert('No ticket data available to export')
        return
      }

      // Prepare data with card headings and values in 2 columns
      const exportData = [
        { "Card Heading": "Total Tickets", "Value": ticketStats.totalTickets || 0 },
        { "Card Heading": "New Tickets", "Value": ticketStats.newTickets || 0 },
        { "Card Heading": "Opened Tickets", "Value": ticketStats.openTickets || 0 },
        { "Card Heading": "Reopened Tickets", "Value": ticketStats.reopenedTickets || 0 },
        { "Card Heading": "Pending Tickets", "Value": ticketStats.pendingTickets || 0 },
        { "Card Heading": "Resolved Tickets", "Value": ticketStats.resolvedTickets || 0 },
        { "Card Heading": "Canceled Tickets", "Value": ticketStats.canceledTickets || 0 },
        { "Card Heading": "Low Priority Tickets", "Value": ticketStats.lowPriorityTickets || 0 },
        { "Card Heading": "Medium Priority Tickets", "Value": ticketStats.mediumPriorityTickets || 0 },
        { "Card Heading": "Urgent Priority Tickets", "Value": ticketStats.urgentPriorityTickets || 0 },
      ]

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths
      ws["!cols"] = [
        { wch: 30 }, // Card Heading
        { wch: 15 }, // Value
      ]

      XLSX.utils.book_append_sheet(wb, ws, "Support & Tickets Stats")

      // Generate and download
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const dateStr = new Date().toISOString().split("T")[0]
      saveAs(blob, `support_tickets_stats_${dateStr}.xlsx`)
    } catch (error) {
      console.error("Error exporting support tickets stats:", error)
      alert("Failed to export support tickets statistics. Please try again.")
    }
  }

  const handleExportRevenue = () => {
    try {
      // Prepare revenue data
      const exportData = [
        { "Metric": "Total Plans Revenue", "Value": "1,900.000 MAD" },
        { "Metric": "Total Users", "Value": partnerStats ? partnerStats.totalPartners : 0 },
        { "Metric": "New Subscriptions", "Value": newSubscriptionsCount },
        { "Metric": "Next Invoices", "Value": "45.000 MAD" },
      ]

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)
      ws["!cols"] = [{ wch: 25 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, ws, "Revenue Stats")

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const dateStr = new Date().toISOString().split("T")[0]
      saveAs(blob, `revenue_stats_${dateStr}.xlsx`)
    } catch (error) {
      console.error("Error exporting revenue stats:", error)
      alert("Failed to export revenue statistics. Please try again.")
    }
  }

  const handleExportServices = () => {
    try {
      if (!servicesStats) {
        alert('No services data available to export')
        return
      }

      // Prepare services data
      const exportData = [
        { "Metric": "Total Partners", "Value": partnerStats ? partnerStats.totalPartners : 0 },
        { "Metric": "Total Staff", "Value": servicesStats.totalStaff || 0 },
        { "Metric": "Total Rooms", "Value": servicesStats.totalRooms || 0 },
        { "Metric": "Total Clients", "Value": servicesStats.totalClients || 0 },
        { "Metric": "Total Clients (Active)", "Value": clientStats ? clientStats.activeClients : 0 },
        { "Metric": "Total Clients (Inactive)", "Value": clientStats ? clientStats.inactiveClients : 0 },
      ]

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)
      ws["!cols"] = [{ wch: 25 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, ws, "Services Stats")

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const dateStr = new Date().toISOString().split("T")[0]
      saveAs(blob, `services_stats_${dateStr}.xlsx`)
    } catch (error) {
      console.error("Error exporting services stats:", error)
      alert("Failed to export services statistics. Please try again.")
    }
  }

  const subscriptionsContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Subscriptions & revenue</h2>
          <p className="text-sm text-muted-foreground">Monitor paying partners, renewals, and recurring revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <DropdownMenu
            trigger={
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
                <span className="text-sm font-medium text-[#212121]">Filter</span>
              </button>
            }
            items={[
              { label: "Today", onClick: () => setRevenueFilter("Today") },
              { label: "This Week", onClick: () => setRevenueFilter("This Week") },
              { label: "This Month", onClick: () => setRevenueFilter("This Month") },
              { label: "This Year", onClick: () => setRevenueFilter("This Year") },
              { label: "All Time", onClick: () => setRevenueFilter("All Time") },
            ]}
          />
          {/* Export Button */}
          <button 
            onClick={handleExportRevenue}
            className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors" 
            style={{ borderRadius: "6px" }}
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
            <span className="text-sm font-medium text-[#212121]">Export</span>
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<RevenueIcon />}
          label="Total Plans Revenue"
          value="1,900.000"
          subtitle="MAD"
          change="+2%"
          changeType="positive"
          changeLabel="vs last month"
        />
        <StatCard
          icon={<StaffIcon />}
          label="Total Users"
          value={partnerStats ? partnerStats.totalPartners : 0}
          isLoading={statsLoading}
          change={totalUsersChange?.change || "0%"}
          changeType={totalUsersChange?.changeType || "neutral"}
          changeLabel="vs last month"
        />
        <StatCard
          icon={<SubscriptionIcon />}
          label="New subscriptions"
          value={newSubscriptionsCount}
          isLoading={newSubscriptionsLoading}
          change={newSubscriptionsChange?.change || "0%"}
          changeType={newSubscriptionsChange?.changeType || "neutral"}
          changeLabel="vs last month"
        />
        <StatCard
          icon={<InvoiceIcon />}
          label="Next Invoices"
          value="45.000"
          subtitle="MAD"
          change="+2%"
          changeType="positive"
          changeLabel="vs last month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <SubscribersChart />
        </div>
      </div>
    </div>
  )

  const partnersContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Partners & Services</h2>
          <p className="text-sm text-muted-foreground">
            Monitor hotel activity, partners, staff, rooms, clients, and service demand.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <DropdownMenu
            trigger={
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
                <span className="text-sm font-medium text-[#212121]">Filter</span>
              </button>
            }
            items={[
              { label: "Today", onClick: () => setServicesFilter("Today") },
              { label: "This Week", onClick: () => setServicesFilter("This Week") },
              { label: "This Month", onClick: () => setServicesFilter("This Month") },
              { label: "This Year", onClick: () => setServicesFilter("This Year") },
              { label: "All Time", onClick: () => setServicesFilter("All Time") },
            ]}
          />
          {/* Export Button */}
          <button 
            onClick={handleExportServices}
            className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors" 
            style={{ borderRadius: "6px" }}
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
            <span className="text-sm font-medium text-[#212121]">Export</span>
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Partners" 
          value={partnerStats ? partnerStats.totalPartners : 0} 
          isLoading={statsLoading} 
          change={partnerStatsChange?.change}
          changeType={partnerStatsChange?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
        />
        <StatCard 
          label="Total Staff" 
          value={servicesStats ? servicesStats.totalStaff : 0} 
          isLoading={servicesStatsLoading} 
          change={servicesStats?.changes?.totalStaff?.change}
          changeType={servicesStats?.changes?.totalStaff?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
        />
        <StatCard 
          label="Total Rooms" 
          value={servicesStats ? servicesStats.totalRooms : 0} 
          isLoading={servicesStatsLoading} 
          change={servicesStats?.changes?.totalRooms?.change}
          changeType={servicesStats?.changes?.totalRooms?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
        />
        <StatCard 
          label="Total Clients" 
          value={servicesStats ? servicesStats.totalClients : 0} 
          isLoading={servicesStatsLoading} 
          change={servicesStats?.changes?.totalClients?.change}
          changeType={servicesStats?.changes?.totalClients?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total Requests Card */}
        <div className="flex flex-col w-full justify-between">
          {/* Header */}
          <div 
            className="flex py-[12px] px-4 w-full"
            style={{
              height: "65px",
              flexShrink: 0,
              fill: "#FCFCFC",
              strokeWidth: "1px",
              stroke: "#E9EAEB",
              background: "#FCFCFC",
              border: "1px solid #E9EAEB",
              borderRadius: "12px 12px 0 0"
            }}
          >
            <h3 className="text-sm font-semibold text-[#212121]">Total requests</h3>
          </div>
          {/* Content */}
          <div className="h-[370px] flex flex-col  pt-[120px] bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px]">
            <div className="text-center items-center">
              {clientStatsLoading ? (
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-label="loading" />
                </div>
              ) : (
                <>
                  <p className="text-4xl font-semibold text-[#212121] mb-3">
                    {clientStats ? clientStats.totalClients.toLocaleString() : 0} Clients
                  </p>
                  <p className={`text-medium font-medium ${clientStats?.isIncrease ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    <span>{clientStats?.percentageChange || "0%"}</span> vs yesterday
                  </p>
                </>
              )}
            </div>

            {/* Half Circle Progress Chart with Legend Inside */}
            <div className="w-full flex flex-col justify-center items-center relative" style={{ marginTop: '29px' }}>
              {clientStatsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-label="loading" />
                </div>
              ) : (() => {
                const totalClients = clientStats?.totalClients || 0
                const activeClients = clientStats?.activeClients || 0
                const inactiveClients = clientStats?.inactiveClients || 0
                
                // Calculate semi-circle segments
                const totalCircumference = 471.2 // Full semicircle circumference
                const activePercentage = totalClients > 0 ? activeClients / totalClients : 0
                const inactivePercentage = totalClients > 0 ? inactiveClients / totalClients : 0
                
                const activeLength = totalCircumference * activePercentage
                const inactiveLength = totalCircumference * inactivePercentage
                const activeOffset = 0
                const inactiveOffset = -activeLength

                return (
                  <>
                    <svg className="w-4/5 h-38" viewBox="0 0 400 180">
                      {/* Background semicircle */}
                      <path
                        d="M 50 160 A 150 150 0 0 1 350 160"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="20"
                      />
                      {/* Active clients segment (left/blue) */}
                      {activeClients > 0 && (
                        <path
                          d="M 50 160 A 150 150 0 0 1 350 160"
                          fill="none"
                          stroke="#56C6FF"
                          strokeWidth="20"
                          strokeDasharray={`${activeLength} 10000`}
                          strokeDashoffset={activeOffset}
                          strokeLinecap="round"
                        />
                      )}
                      {/* Inactive clients segment (right/gray) */}
                      {inactiveClients > 0 && (
                        <path
                          d="M 50 160 A 150 150 0 0 1 350 160"
                          fill="none"
                          stroke="#EFEFEF"
                          strokeWidth="20"
                          strokeDasharray={`${inactiveLength} 10000`}
                          strokeDashoffset={inactiveOffset}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <p className="text-center text-[#000000] mt-[-80px]">
                      {totalClients.toLocaleString()} Requests
                    </p>
                  </>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Services Card */}
        <div className="flex flex-col w-full">
          {/* Header */}
          <div 
            className="flex py-[12px] px-4 w-full"
            style={{
              height: "65px",
              flexShrink: 0,
              fill: "#FCFCFC",
              strokeWidth: "1px",
              stroke: "#E9EAEB",
              background: "#FCFCFC",
              border: "1px solid #E9EAEB",
              borderRadius: "12px 12px 0 0"
            }}
          >
            <h3 className="text-sm font-semibold text-[#212121]">Services</h3>
          </div>
          
          {/* Content */}
          <div 
            className="flex flex-col p-4 w-full overflow-y-auto"
            style={{
              height: "370px",
              marginTop: "-15px",
              flexShrink: 0,
              background: "#FFF",
              border: "1px solid #E9EAEB",
              borderRadius: "14px"
            }}
          >
            <div className="space-y-0">
              {[
                {
                  name: "Kayaking Adventure",
                  requests: 80,
                  archived: 55,
                  image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/587978734.jpg?k=2e9f4bc2a6a8f574e14cb70b1392ece864fa25e4042172dcf3b0ce83315a3b87&o=&hp=1"
                },
                {
                  name: "Relaxing Massage",
                  requests: 80,
                  archived: 55,
                  image: "https://img.freepik.com/free-photo/forehead-massage_23-2147638154.jpg"
                },
                {
                  name: "Facial Treatment",
                  requests: 80,
                  archived: 55,
                  image: "https://img.grouponcdn.com/iam_raw/tVdtift3qfeHqDLvAZE6/zs-5616x3744/v1/t2124x1284.webp"
                },
                {
                  name: "Room Service Dinner",
                  requests: 80,
                  archived: 55,
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoV7hzmu6HKh30hkUevHJeecGWNiY254TyCA&s"
                },
                {
                  name: "Wine Tasting",
                  requests: 80,
                  archived: 55,
                  image: "https://images.squarespace-cdn.com/content/v1/5f24290fd0d0910ecab2b02e/b2b65c78-ad81-42a1-a304-8b696750716d/shutterstock_611011652-222.jpg"
                },
                {
                  name: "Hot Stone Therapy",
                  requests: 80,
                  archived: 55,
                  image: "https://img.freepik.com/free-photo/person-enjoying-time-nature_23-2151262753.jpg?semt=ais_hybrid&w=740&q=80"
                },
              ].map((service, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 py-3">
                    <div className="flex-1 min-w-0">
                      <p 
                        className="truncate"
                        style={{
                          color: "#414651",
                          fontFamily: "Inter",
                          fontSize: "12px",
                          fontStyle: "normal",
                          fontWeight: "500",
                          lineHeight: "18px"
                        }}
                      >
                        {service.name}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Requests: <span className="font-semibold">{service.requests}</span> | Archived:{" "}
                        <span className="font-semibold">{service.archived}</span>
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 overflow-hidden">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {index < 5 && (
                    <div 
                      className="w-full"
                      style={{
                        height: "0.5px",
                        background: "#E9ECF1"
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Time Card */}
        <div className="flex flex-col w-full">
          {/* Header */}
          <div 
            className="flex py-[12px] px-4 w-full"
            style={{
              height: "65px",
              flexShrink: 0,
              fill: "#FCFCFC",
              strokeWidth: "1px",
              stroke: "#E9EAEB",
              background: "#FCFCFC",
              border: "1px solid #E9EAEB",
              borderRadius: "12px 12px 0 0"
            }}
          >
            <h3 className="text-sm font-semibold text-[#212121]">Order Time</h3>
          </div>
          {/* Content */}
          <div className="h-[370px] flex flex-col items-center justify-center p-6 bg-white border border-[#E9EAEB] rounded-[14px] mt-[-15px]">
            {/* Donut Chart */}
            <div className="relative w-48 h-48 mb-6 group">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                {orderTimeData.map((segment, index) => (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="35"
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#212121]">234</p>
                  <p className="text-xs text-[#6B7280]">Total Requests</p>
                </div>
              </div>
              
              {/* Individual Circular Percentage Labels - Show on hover */}
              {orderTimeData.map((segment, index) => (
                <div 
                  key={index}
                  className="absolute flex items-center justify-center rounded-full text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    width: "60.75px",
                    height: "60.75px",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 0.49px 26.33px 0px rgba(0, 0, 0, 0.1)",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translate(${segment.position.x}px, ${segment.position.y}px)`,
                    color: "#000000"
                  }}
                >
                  {segment.percentage}%
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-2 w-full">
              {orderTimeData.map((segment, index) => (
                <div key={index} className="flex items-center justify-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-sm text-[#6B7280]">{segment.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const supportContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Support & Tickets</h2>
          <p className="text-sm text-muted-foreground">
            Track ticket volume, workload, and quality for the selected period.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <DropdownMenu
            trigger={
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
                <span className="text-sm font-medium text-[#212121]">Filter</span>
              </button>
            }
            items={[
              { label: "Today", onClick: () => setSupportFilter("Today") },
              { label: "This Week", onClick: () => setSupportFilter("This Week") },
              { label: "This Month", onClick: () => setSupportFilter("This Month") },
              { label: "This Year", onClick: () => setSupportFilter("This Year") },
              { label: "All Time", onClick: () => setSupportFilter("All Time") },
            ]}
          />
          {/* Export Button */}
          <button 
            onClick={handleExportSupportTickets}
            disabled={!ticketStats}
            className="flex py-[8.52px] px-5 justify-center items-center gap-1.5 rounded-md border border-[#CED4DA] bg-[#FBFAFA] hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ borderRadius: "6px" }}
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
            <span className="text-sm font-medium text-[#212121]">Export</span>
          </button>
        </div>
      </div>

      <div className="h-px flex-shrink-0 self-stretch w-full">
        <div className="w-full h-px bg-black/[0.08]"></div>
      </div>

      {/* Tickets Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Tickets" 
          value={ticketStats ? ticketStats.totalTickets.toString() : "0"} 
          change={ticketStats?.changes?.totalTickets?.change}
          changeType={ticketStats?.changes?.totalTickets?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
          isLoading={ticketStatsLoading}
        />
        <StatCard 
          label="New Tickets" 
          value={ticketStats ? ticketStats.newTickets.toString() : "0"} 
          change={ticketStats?.changes?.newTickets?.change}
          changeType={ticketStats?.changes?.newTickets?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
          isLoading={ticketStatsLoading}
        />
        <StatCard 
          label="Opened Tickets" 
          value={ticketStats ? ticketStats.openTickets.toString() : "0"} 
          change={ticketStats?.changes?.openTickets?.change}
          changeType={ticketStats?.changes?.openTickets?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
          isLoading={ticketStatsLoading}
        />
        <StatCard 
          label="Reopened Tickets" 
          value={ticketStats ? ticketStats.reopenedTickets.toString() : "0"} 
          change={ticketStats?.changes?.reopenedTickets?.change}
          changeType={ticketStats?.changes?.reopenedTickets?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
          isLoading={ticketStatsLoading}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Pending Tickets" 
          value={ticketStats ? ticketStats.pendingTickets.toString() : "0"} 
          change={ticketStats?.changes?.pendingTickets?.change}
          changeType={ticketStats?.changes?.pendingTickets?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
          isLoading={ticketStatsLoading}
        />
        <StatCard 
          label="Resolved Tickets" 
          value={ticketStats ? ticketStats.resolvedTickets.toString() : "0"} 
          change={ticketStats?.changes?.resolvedTickets?.change}
          changeType={ticketStats?.changes?.resolvedTickets?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
          isLoading={ticketStatsLoading}
        />
        <StatCard 
          label="Canceled Tickets" 
          value={ticketStats ? ticketStats.canceledTickets.toString() : "0"} 
          change={ticketStats?.changes?.canceledTickets?.change}
          changeType={ticketStats?.changes?.canceledTickets?.changeType || "neutral"}
          changeLabel="vs yesterday"
          showHeadingBorder={true}
          isLoading={ticketStatsLoading}
        />
        <div className="flex p-[19px_16px] flex-col justify-center items-start gap-2.5 flex-1 rounded-lg bg-white shadow-[0_12px_24px_0_rgba(18,38,63,0.03)]">
          <h3 className="text-sm font-medium text-[#000000] pb-3 border-b border-[rgba(0,0,0,0.06)] self-stretch">
            Tickets Priority
          </h3>
          {ticketStatsLoading ? (
            <div className="flex items-center justify-center w-full py-4">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-label="loading" />
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="rounded-full"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#56C6FF"
                    }}
                  ></div>
                  <span className="text-sm" style={{ color: "#535862" }}>Low</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">
                  {ticketStats?.lowPriorityTickets?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="rounded-full"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#D1924F"
                    }}
                  ></div>
                  <span className="text-sm" style={{ color: "#535862" }}>Medium</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">
                  {ticketStats?.mediumPriorityTickets?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="rounded-full"
                    style={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "#FE0D19"
                    }}
                  ></div>
                  <span className="text-sm" style={{ color: "#535862" }}>Urgent</span>
                </div>
                <span className="text-sm font-semibold text-[#212121]">
                  {ticketStats?.urgentPriorityTickets?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4">
      {/* Navigation Buttons (like original tabs but always visible) */}
      <div className="w-full border-b border-black/[0.06]">
        <div className="flex max-w-[1180px] p-5 justify-end items-center gap-4">
          <button 
            onClick={() => {
              setActiveSection("subscriptions")
              document.getElementById("subscriptions")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex p-[10px_30px] flex-col justify-center items-center gap-2.5 flex-1 border-b-2 border-black/10 transition-colors ${
              activeSection === "subscriptions" 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Subscriptions & revenue
          </button>
          <button 
            onClick={() => {
              setActiveSection("partners")
              document.getElementById("partners")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex p-[10px_30px] flex-col justify-center items-center gap-2.5 flex-1 border-b-2 border-black/10 transition-colors ${
              activeSection === "partners" 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Partners & Services
          </button>
          <button 
            onClick={() => {
              setActiveSection("support")
              document.getElementById("support")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex p-[10px_30px] flex-col justify-center items-center gap-2.5 flex-1 border-b-2 border-black/10 transition-colors ${
              activeSection === "support" 
                ? "text-foreground font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Support & Tickets
          </button>
        </div>
      </div>

      {/* All Sections in Vertical Layout */}
      <div className="space-y-12 mt-6">
        {/* Subscriptions Section */}
        <div id="subscriptions">
          {subscriptionsContent}
        </div>

        {/* Partners Section */}
        <div id="partners">
          {partnersContent}
        </div>

        {/* Support Section */}
        <div id="support">
          {supportContent}
        </div>
      </div>
    </div>
  )
}
