"use client"

import { type ReactNode, useState } from "react"
import { RiMoreLine, RiFilterLine, RiDownloadLine } from "react-icons/ri"

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  actions?: (row: any) => ReactNode
  onRowClick?: (row: any) => void
  emptyState?: ReactNode
  showFilters?: boolean
  showExport?: boolean
}

export default function DataTable({
  columns,
  data,
  actions,
  onRowClick,
  emptyState,
  showFilters = true,
  showExport = true,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Table Actions */}
      {(showFilters || showExport) && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 bg-muted border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={8}>Display 8</option>
              <option value={10}>Display 10</option>
              <option value={20}>Display 20</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 bg-muted border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            {showFilters && (
              <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
                <RiFilterLine className="w-4 h-4" />
                Filtre
              </button>
            )}
            {showExport && (
              <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
                <RiDownloadLine className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input type="checkbox" className="rounded" />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {actions && <th className="w-12 px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-16">
                  {emptyState || (
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
                          <circle cx="100" cy="90" r="20" fill="currentColor" opacity="0.2" />
                          <path
                            d="M90 85L95 90L105 80"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-muted/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 text-sm text-foreground">
                      {row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-4">
                      <button className="p-1 hover:bg-muted rounded transition-colors">
                        <RiMoreLine className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Displaying {startIndex + 1}-{Math.min(endIndex, data.length)} results out of {data.length}
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
  )
}
