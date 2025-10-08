"use client"

import { type ReactNode, useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: "default" | "danger"
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
}

export default function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function updatePosition() {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 8, left: rect.right, width: rect.width, height: rect.height })
    }

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      updatePosition()
      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const menu =
    isOpen && position
      ? createPortal(
          <div
            ref={containerRef}
            className="z-50"
            style={{ position: "fixed", top: position.top, left: position.left, transform: "translateX(-100%)" }}
          >
            <div className="w-56 max-h-[280px] overflow-auto bg-white rounded-[8px] shadow-lg border border-border">
              <div className="py-1">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick()
                      setIsOpen(false)
                    }}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors ${
                      item.variant === "danger" ? "text-error" : "text-foreground"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="inline-block" ref={triggerRef} onClick={() => setIsOpen((v) => !v)}>
      {trigger}
      {menu}
    </div>
  )
}
