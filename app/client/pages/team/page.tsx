"use client"

import { useState } from "react"
import {
  RiMoreLine,
  RiEditLine,
  RiLockPasswordLine,
  RiDeleteBinLine,
  RiUserSettingsLine,
  RiAddLine,
} from "react-icons/ri"
import ToggleSwitch from "@/app/client/components/toggle-switch"
import DropdownMenu from "@/app/client/components/dropdown-menu"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  dateAdded: string
  isActive: boolean
  avatar: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "2",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "3",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: true,
    avatar: "FN",
  },
  {
    id: "4",
    name: "Full Name",
    email: "contact@maghrebcom.store",
    phone: "+212 632-002529",
    dateAdded: "15 juin 2025",
    isActive: false,
    avatar: "FN",
  },
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const handleToggleActive = (id: string) => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)))
  }

  const totalPages = Math.ceil(teamMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMembers = teamMembers.slice(startIndex, endIndex)

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Team</h1>
        <p className="text-sm text-muted-foreground">Last updated on 09/15/2025, 12AM</p>
      </div>

      {/* Members Section */}
      <div className="bg-card rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4  border-border">
          <h3 className="text-base font-semibold text-foreground">Members</h3>
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-border  rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
              <option value={50}>Display 50</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2  border border-border  rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-medium transition-colors">
              <RiAddLine className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full rounded-lg">
            <thead className="bg-muted/50 border-b rounded-lg">
              <tr>
                <th className="w-12 px-4 py-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Member Name
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Phone number
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Date added
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Complete</th>
                <th className="w-12 px-4 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                        {member.avatar}
                      </div>
                      <span className="text-sm text-foreground">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">{member.email}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{member.phone}</td>
                  <td className="px-4 py-4 text-sm text-foreground">{member.dateAdded}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{member.isActive ? "Active" : "Disable"}</span>
                      <ToggleSwitch checked={member.isActive} onChange={() => handleToggleActive(member.id)} />
                    </div>
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
                          label: "Edit",
                          icon: <RiEditLine className="w-4 h-4" />,
                          onClick: () => console.log("Edit", member.id),
                        },
                        {
                          label: "User Permissions",
                          icon: <RiUserSettingsLine className="w-4 h-4" />,
                          onClick: () => console.log("Permissions", member.id),
                        },
                        {
                          label: "Reset password",
                          icon: <RiLockPasswordLine className="w-4 h-4" />,
                          onClick: () => console.log("Reset password", member.id),
                        },
                        {
                          label: "Supprimer",
                          icon: <RiDeleteBinLine className="w-4 h-4" />,
                          onClick: () => console.log("Delete", member.id),
                          variant: "danger",
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
            Displaying {startIndex + 1}-{Math.min(endIndex, teamMembers.length)} results out of {teamMembers.length}
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
