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

const mockSubscriptions: Subscription[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  partnerName: "Partner Name",
  startDate: "15 juin 2025",
  endDate: "15 juin 2026",
  avatar: "P",
}))

export default function SubscriptionPage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSubscriptions = subscriptions.slice(startIndex, endIndex)

  return (
    <div className="p-6 ">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
        <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
      </div>

       {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                          onClick: () => console.log("Edit", subscription.id),
                        },
                        {
                          label: "Subscription History",
                          icon: <RiEyeLine className="w-4 h-4" />,
                          onClick: () => console.log("History", subscription.id),
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
    </div>
  )
}
