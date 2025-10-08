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

  const handleToggleActive = (id: string) => {
    setPartners(partners.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
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
        <div className="overflow-x-auto rounded-[4px]  ">
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
                          { label: "View Details", icon: <RiEyeLine className="w-4 h-4" />, onClick: () => console.log("View", partner.id) },
                          { label: "Edit Partner", icon: <RiEditLine className="w-4 h-4" />, onClick: () => console.log("Edit", partner.id) },
                          { label: "Supprimer", icon: <RiDeleteBinLine className="w-4 h-4 text-error" />, onClick: () => console.log("Delete", partner.id), variant: "danger" },
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
    </div>
  )
}
