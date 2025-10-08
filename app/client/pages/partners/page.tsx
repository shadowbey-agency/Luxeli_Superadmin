"use client"

import { useState } from "react"
import {
  RiHotelBedLine,
  RiTeamLine,
  RiUserLine,
  RiMoreLine,
  RiFilterLine,
  RiDownloadLine,
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri"
import StatCard from "@/app/client/components/stat-card"
import ToggleSwitch from "@/app/client/components/toggle-switch"
import DropdownMenu from "@/app/client/components/dropdown-menu"

interface Partner {
  id: string
  hotelName: string
  email: string
  phone: string
  city: string
  services: string[]
  plan: string
  createdAt: string
  isActive: boolean
}

const mockPartners: Partner[] = [
  {
    id: "1",
    hotelName: "Hotel Name",
    email: "Hotel@email.com",
    phone: "+212 532-002529",
    city: "Casablanca",
    services: ["Housekeeping", "Bookings interns", "Customized Services"],
    plan: "Plan name",
    createdAt: "15 juin 2025",
    isActive: true,
  },
  {
    id: "2",
    hotelName: "Hotel Name",
    email: "Hotel@email.com",
    phone: "+212 532-002529",
    city: "Casablanca",
    services: ["Housekeeping", "Bookings interns"],
    plan: "Plan name",
    createdAt: "15 juin 2025",
    isActive: false,
  },
  {
    id: "3",
    hotelName: "Hotel Name",
    email: "Hotel@email.com",
    phone: "+212 532-002529",
    city: "Casablanca",
    services: ["Housekeeping"],
    plan: "Plan name",
    createdAt: "15 juin 2025",
    isActive: true,
  },
]

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners)
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [showServicesDropdown, setShowServicesDropdown] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null)
  const [showViewDetail, setShowViewDetail] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [activeTab, setActiveTab] = useState<'partner-info' | 'subscription' | 'room-api'>('partner-info')

  const handleToggleActive = (id: string) => {
    setPartners(partners.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const handleDeletePartner = (partner: Partner) => {
    setPartnerToDelete(partner)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (partnerToDelete) {
      setPartners(partners.filter((p) => p.id !== partnerToDelete.id))
      setShowDeleteModal(false)
      setPartnerToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setPartnerToDelete(null)
  }

  const handleViewDetails = (partner: Partner) => {
    setSelectedPartner(partner)
    setShowViewDetail(true)
    setActiveTab('partner-info')
  }

  const closeViewDetail = () => {
    setShowViewDetail(false)
    setSelectedPartner(null)
    setActiveTab('partner-info')
  }

  const totalPages = Math.ceil(partners.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPartners = partners.slice(startIndex, endIndex)

  const overviewContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between " >
        <div>
          <h2 className="text-xl font-bold text-foreground mb-1">Overview of Partner Performance</h2>
          <p className="text-sm text-muted-foreground">Key indicators to monitor hotel partners and their activity.</p>
        </div>
        <div className="flex items-center " style={{ border: "0.925px solid #CED4DA" }}>
          <button className="px-4 py-2 bg-primary text-white rounded-[1px] text-sm font-medium hover:bg-primary/90 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Semaine
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Mois
          </button>
          <button className="px-4 py-2 bg-[#FFF] text-[rgba(33,33,33,0.60)] rounded-[1px] text-sm font-medium hover:bg-muted/80 transition-colors" style={{ borderRight: "0.925px solid #CED4DA" }}>
            Plage de dates
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<RiHotelBedLine className="w-6 h-6 text-primary" />}
          label="Total Partners"
          value="65"
          change="+2%"
          changeType="positive"
          subtitle="vs last week"
        />
        <StatCard
          icon={<RiTeamLine className="w-6 h-6 text-primary" />}
          label="Total Staff"
          value="42"
          change="+2%"
          changeType="positive"
          subtitle="vs last week"
        />
        <StatCard
          icon={<RiUserLine className="w-6 h-6 text-success" />}
          label="Active Partners"
          value="23"
          change="+2%"
          changeType="positive"
          subtitle="vs last week"
        />
      </div>

      {/* Partners List */}
     

      <div className="bg-card rounded-[4px]  p-4 ">
        {/* Table Header */}
        <div className="flex items-center justify-between  pb-4  ">
          <h3 className="text-base font-semibold text-foreground">Partners list</h3>
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 bg-[#FFF] border border-[#CED4DA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value={8}>Display 8</option>
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 bg-[#FFF] border border-[#CED4DA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <button className="flex items-center gap-2 px-4 py-2 bg-[#FBFAFA] border border-[#CED4DA] hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors">
              <RiFilterLine className="w-4 h-4" />
              Filtre
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#FBFAFA] border border-[#CED4DA] hover:bg-muted/80 rounded-xl text-sm font-medium transition-colors">
              <RiDownloadLine className="w-4 h-4" />
              Export
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-medium transition-colors">
              <RiAddLine className="w-5 h-5" />
              Add new Partner
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto  rounded-[4px]  ">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-4 py-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Hotel Name
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Phone number
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">City</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Services</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Plan</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Create at</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Account</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentPartners.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-32 h-32 mb-4 opacity-50">
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect
                            x="40"
                            y="60"
                            width="120"
                            height="80"
                            rx="4"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M60 100L100 130L140 100"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                          H
                        </div>
                        <span className="text-sm text-foreground">{partner.hotelName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">{partner.email}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{partner.phone}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{partner.city}</td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowServicesDropdown(showServicesDropdown === partner.id ? null : partner.id)
                          }
                          className="text-sm text-primary hover:underline"
                        >
                          {partner.services.length} ~
                        </button>
                        {showServicesDropdown === partner.id && (
                          <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-50">
                            <div className="py-2 px-3">
                              {partner.services.map((service, index) => (
                                <div key={index} className="py-1 text-sm text-foreground">
                                  {service}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">{partner.plan}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{partner.createdAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{partner.isActive ? "Active" : "Disable"}</span>
                        <ToggleSwitch checked={partner.isActive} onChange={() => handleToggleActive(partner.id)} />
                      </div>
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
                          { label: "Edit Partner", icon: <RiEditLine className="w-4 h-4" />, onClick: () => console.log("Edit", partner.id) },
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
              Displaying {startIndex + 1}-{Math.min(endIndex, partners.length)} results out of {partners.length}
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
        )}
      </div>
    
    </div>
  )

  return (
    <div className="p-6">
     
      

      {/* Content */}
      {overviewContent}

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
                gap: "72px"
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
                className={`px-12 py-5 flex-1 text-center border-b-2 transition-colors ${
                  activeTab === 'partner-info' 
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
                className={`px-12 py-5 flex-1 text-center border-b-2 transition-colors ${
                  activeTab === 'subscription' 
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
                className={`px-12 py-5 flex-1 text-center border-b-2 transition-colors ${
                  activeTab === 'room-api' 
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
                      <span className="text-sm font-medium text-gray-700">Plan: Gold</span>
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
                      <p className="text-2xl font-bold text-black">120</p>
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
                      <p className="text-2xl font-bold text-black">24</p>
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
                      <p className="text-2xl font-bold text-black">169</p>
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
                        <span className="text-sm text-black">123456 - Casablanca</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">ICE</span>
                        </div>
                        <span className="text-sm text-black">65561655668978</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">Identifiant Fiscal</span>
                        </div>
                        <span className="text-sm text-black">112356489</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-700">Nº Taxe Professionnelle</span>
                        </div>
                        <span className="text-sm text-black">03264863</span>
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
                        <span className="text-sm text-black">{selectedPartner.email}</span>
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
                        <span className="text-sm text-black">{selectedPartner.services.join(", ")}</span>
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
                        <span className="text-sm text-black">{selectedPartner.email}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-sm text-gray-700">Password</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black">***********</span>
                          <svg className="w-4 h-4 text-gray-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-semibold">Subscription Details</h3>
                  <p className="text-gray-600">Subscription information will be displayed here.</p>
                </div>
              )}

              {activeTab === 'room-api' && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-semibold">Room API Data</h3>
                  <p className="text-gray-600">Room API data will be displayed here.</p>
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
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                  <path d="M7.3335 2.36343H4.5335C3.41339 2.36343 2.85334 2.36343 2.42552 2.58142C2.04919 2.77317 1.74323 3.07913 1.55148 3.45545C1.3335 3.88328 1.3335 4.44333 1.3335 5.56343V11.1634C1.3335 12.2835 1.3335 12.8436 1.55148 13.2714C1.74323 13.6477 2.04919 13.9537 2.42552 14.1454C2.85334 14.3634 3.41339 14.3634 4.5335 14.3634H10.1335C11.2536 14.3634 11.8137 14.3634 12.2415 14.1454C12.6178 13.9537 12.9238 13.6477 13.1155 13.2714C13.3335 12.8436 13.3335 12.2835 13.3335 11.1634V8.36343M5.33348 10.3634H6.44984C6.77596 10.3634 6.93902 10.3634 7.09247 10.3266C7.22852 10.2939 7.35858 10.2401 7.47788 10.167C7.61243 10.0845 7.72773 9.9692 7.95834 9.7386L14.3335 3.36343C14.8858 2.81115 14.8858 1.91572 14.3335 1.36343C13.7812 0.811148 12.8858 0.811147 12.3335 1.36343L5.95832 7.73859C5.72772 7.9692 5.61242 8.0845 5.52996 8.21905C5.45685 8.33835 5.40298 8.46841 5.37032 8.60446C5.33348 8.75791 5.33348 8.92097 5.33348 9.24709V10.3634Z" stroke="#525866" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M6 2.69629H10M2 4.69629H14M12.6667 4.69629L12.1991 11.7092C12.129 12.7613 12.0939 13.2874 11.8667 13.6863C11.6666 14.0375 11.3648 14.3198 11.0011 14.4961C10.588 14.6963 10.0607 14.6963 9.00623 14.6963H6.99377C5.93927 14.6963 5.41202 14.6963 4.99889 14.4961C4.63517 14.3198 4.33339 14.0375 4.13332 13.6863C3.90607 13.2874 3.871 12.7613 3.80086 11.7092L3.33333 4.69629" stroke="#FF0D0D" strokeWidth="1.11333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
