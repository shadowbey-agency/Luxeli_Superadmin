"use client"

import { useState } from "react"
import { RiArrowLeftLine, RiMoreLine, RiEditLine, RiEyeLine, RiDownloadLine,RiHotelBedLine,RiTeamLine,RiUserLine } from "react-icons/ri"
import Link from "next/link"
import StatCard from "@/app/client/components/stat-card"
import DropdownMenu from "@/app/client/components/dropdown-menu"

interface Subscription {
  id: string
  partnerName: string
  startDate: string
  endDate: string
  avatar: string
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

const SubscriptionCard = ({ history }: { history: SubscriptionHistory }) => (
  <div 
    className="rounded-2xl border bg-white flex flex-col"
    style={{ 
      width: "370px", 
      
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
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [plan, setPlan] = useState("Pack Gold")
  const [endDate, setEndDate] = useState("10/01/2026")
  const [showHistorySlide, setShowHistorySlide] = useState(false)
  const [selectedHistorySubscription, setSelectedHistorySubscription] = useState<Subscription | null>(null)

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSubscriptions = subscriptions.slice(startIndex, endIndex)

  const handleEditEndDate = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setShowEditModal(true)
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes for:", selectedSubscription?.id, { plan, endDate })
    setShowEditModal(false)
    setSelectedSubscription(null)
  }

  const handleViewHistory = (subscription: Subscription) => {
    setSelectedHistorySubscription(subscription)
    setShowHistorySlide(true)
  }

  return (
    <div className="p-6 ">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
        <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
      </div>

       {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
              <StatCard
                icon={<RiHotelBedLine className="w-6 h-6 text-primary" />}
                label="Total Plane Revenue"
                value="65"
                change="+2%"
                changeType="positive"
                subtitle="vs last month"
              />
              <StatCard
                icon={<RiTeamLine className="w-6 h-6 text-primary" />}
                label="Total User"
                value="42"
                change="+2%"
                changeType="positive"
                subtitle="vs last month"
              />
              
            </div>

      {/* Pack Gold Section */}
      <div className="bg-card rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4  ">
          <h3 className="text-base font-semibold text-foreground">Pack Gold</h3>
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2  rounded-xl  border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
              <option value={50}>Display 50</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="date"
              className="px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button className="p-2 bg-muted hover:bg-muted/80 rounded-xl border border-border transition-colors">
              <RiDownloadLine className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Partner Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Start date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">End date</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {subscription.avatar}
                      </div>
                      <span className="text-sm text-foreground">{subscription.partnerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{subscription.startDate}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{subscription.endDate}</td>
                  <td className="px-4 py-4">
                    <DropdownMenu
                      trigger={
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <RiMoreLine className="w-5 h-5 text-muted-foreground" />
                        </button>
                      }
                      items={[
                        {
                          label: "Edit and date",
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
        <div className="flex items-center justify-between  py-3 border-t ">
          <p className="text-sm text-muted-foreground">
            Displaying {startIndex + 1}-{Math.min(endIndex, subscriptions.length)} results out of {subscriptions.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
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
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Edit End Date Modal */}
      {showEditModal && (
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
              <h2 className="text-lg font-semibold text-black">Edit end date</h2>
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
              {/* Form Fields in One Row */}
              <div className="flex items-start gap-4">
                {/* Plan Field */}
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-medium text-[#212121]">Plan</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="w-full px-3 py-2 border border-[#CED4DA] rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        padding: "7.52px 12px",
                        border: "1px solid #CED4DA",
                        borderRadius: "4px",
                        background: "#FFF"
                      }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* End Date Field */}
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-sm font-medium text-[#212121]">End date</label>
                  <div className="relative">
                    <input
                      type="text"
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
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {/* Calendar icon */}
                      <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                        <path d="M7.25 9.65723H11M5 9.65723H5.00674M8.75 12.6572H5M11 12.6572H10.9933" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.5 1.40723V2.90723M3.5 1.40723V2.90723" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M0.875 9.08966C0.875 5.82168 0.875 4.18769 1.81409 3.17246C2.75318 2.15723 4.26462 2.15723 7.2875 2.15723H8.7125C11.7354 2.15723 13.2468 2.15723 14.1859 3.17246C15.125 4.18769 15.125 5.82168 15.125 9.08966V9.47479C15.125 12.7428 15.125 14.3768 14.1859 15.392C13.2468 16.4072 11.7354 16.4072 8.7125 16.4072H7.2875C4.26462 16.4072 2.75318 16.4072 1.81409 15.392C0.875 14.3768 0.875 12.7428 0.875 9.47479V9.08966Z" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1.25 5.90723H14.75" stroke="#141B34" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {/* X icon */}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M9 3L3 9M3 3L9 9" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
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
                Annuler
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription History Slide-out */}
      {showHistorySlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="bg-white w-[50vw] h-full flex flex-col">
            {/* Slide Header */}
              <div className="flex items-center justify-between border-b py-5 px-6 w-full">
                <h2 className="text-xl font-semibold text-black">Subscription History</h2>
                <button 
                  onClick={() => setShowHistorySlide(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M18 6.52441L6 18.5244M6 6.52441L18 18.5244" stroke="#525866" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            <div className="p-5 border-b border-gray-200 flex-shrink-0">
              
              {/* Sub Header with Filter */}
              <div className=" flex items-center justify-between">
                <h3 
                  className="text-base font-medium"
                  style={{ 
                    color: "rgba(0, 0, 0, 0.50)",
                    fontSize: "15px",
                    fontWeight: "500",
                    lineHeight: "21px"
                  }}
                >
                  Subscription History
                </h3>
                <button 
                  className="flex items-center justify-center gap-1.5 rounded border"
                  style={{
                    width: "33.04px",
                    padding: "8.52px 20px",
                    borderRadius: "6px",
                    border: "1px solid #CED4DA",
                    background: "#FBFAFA"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M4.47949 8.52002H12.4795M2.47949 4.52002H14.4795M6.47949 12.52H10.4795" stroke="black" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Subscription History Cards - Scrollable */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div 
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                {subscriptionHistoryData.map((history) => (
                  <SubscriptionCard key={history.id} history={history} />
                ))}
              </div>
            </div>

            {/* Fixed Pagination at Bottom */}
            <div className="p-5 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-end gap-2">
                <button className="w-8 h-8 rounded-full text-sm font-medium bg-primary text-white">1</button>
                <button className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">2</button>
                <button className="w-8 h-8 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">3</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
