"use client"

import { useState } from "react"
import { RiUserLine, RiNotification3Line, RiEyeLine, RiEyeOffLine, RiArrowDownSLine } from "react-icons/ri"
import ToggleSwitch from "@/app/superadmin/components/toggle-switch"
import Image from "next/image"

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "notifications">("account")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "partner-status",
      title: "Partner status change",
      description: "Notify me when a hotel is approved, suspended, or reactivated.",
      enabled: true,
    },
    {
      id: "payment-failed",
      title: "Payment failed",
      description: "Inform me when a charge fails; include retry link.",
      enabled: false,
    },
    {
      id: "subscription-expiring",
      title: "Subscription expiring",
      description: "Remind me 14 days before a hotel's plan renews.",
      enabled: true,
    },
    {
      id: "new-support",
      title: "New support ticket",
      description: "Alert me for tickets P1–P2 created by partners.",
      enabled: true,
    },
    {
      id: "plan-changed",
      title: "Plan changed",
      description: "Notify on upgrade/downgrade of a partner's plan.",
      enabled: true,
    },
    {
      id: "account-deletion",
      title: "Account deletion request",
      description: "Alert me if a hotel requests data deletion.",
      enabled: true,
    },
  ])

  const handleToggle = (id: string) => {
    setNotificationSettings(
      notificationSettings.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  return (
    <div className="p-6 min-h-screen  ">
      <div className="mb-6">
        <div className="flex items-center  border-b-2 border-[#EDEDED]">
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "account"
                ? "text-foreground border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RiUserLine className="w-5 h-5" />
            Account
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "notifications"
                ? "text-foreground border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RiNotification3Line className="w-5 h-5" />
            Notifications
          </button>
        </div>
      </div>

      <div>
        {activeTab === "account" && (
          <div
            className=" bg-white rounded-lg border border-[rgba(0,0,0,0.08)]"
            style={{ flexShrink: 0 }}
          >
            <div className="flex w-full p-4 justify-between items-center rounded-t-lg border-b border-[rgba(33,33,33,0.08)] bg-[#FBFAFA]">
              <div>
                <h2 className="text-lg font-semibold text-[#212121] mb-1">Manage your account</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal information, contact details, and password to keep your account secure and up to
                  date.
                </p>
              </div>
              <button className="px-6 py-2.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 rounded-lg text-sm font-medium transition-colors">
                Save Changes
              </button>
            </div>

            <div className="p-6 bg-white rounded-b-lg space-y-6">
              <div className="flex flex-col lg:flex-row items-start gap-5">
                {/* Personal Information Section */}
                <div className="flex-1 flex p-4 flex-col items-start gap-3.5 rounded-xl border border-dashed border-[rgba(0,0,0,0.12)]">
                  <div className="flex pb-3 items-center gap-3 self-stretch border-b border-[rgba(0,0,0,0.12)]">
                    <h3 className="text-base font-semibold text-[#212121]">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-2">Full name</label>
                      <input
                        type="text"
                        defaultValue="MaghrebEcom"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue="contact@maghrebecom.store"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#212121] mb-2">
                        Phone number <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        defaultValue="+212 632-002529"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex max-w-[327px] h-[142px] p-[22px] items-center gap-5 rounded-[11px] border border-dashed border-[rgba(0,0,0,0.12)] bg-white">
                  {/* Profile Circle */}
                  <div className="flex w-[84px] h-[84px] justify-center items-center flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src="/placeholder.svg?height=84&width=84"
                      alt="Profile"
                      width={84}
                      height={84}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Profile Content */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h4 className="text-sm font-semibold text-[#212121]">Profile Picture</h4>
                    <p className="text-xs text-muted-foreground">Update your profile picture.</p>
                    <button className="flex h-7 px-[11.5px] py-[1px] justify-center items-center rounded-[5px] border border-[#E5E7EB] bg-white text-sm font-medium text-[#212121] hover:bg-gray-50 transition-colors w-fit">
                      Change Picture
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex p-4 flex-col items-start gap-3.5 rounded-xl border border-dashed border-[rgba(0,0,0,0.12)]">
                <div className="flex pb-3 items-center gap-3 self-stretch border-b border-[rgba(0,0,0,0.12)]">
                  <h3 className="text-base font-semibold text-[#212121]">Password</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Current password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">New password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Confirm password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212121] focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <RiEyeOffLine className="w-5 h-5" /> : <RiEyeLine className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex p-4 flex-col items-start gap-3.5 rounded-xl border border-dashed border-[rgba(0,0,0,0.12)]">
                <div className="flex pb-3 items-center gap-3 self-stretch border-b border-[rgba(0,0,0,0.12)]">
                  <h3 className="text-base font-semibold text-[#212121]">Language</h3>
                </div>

                <div className="w-full flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language for the interface and system messages.
                  </p>

                  <div className="relative gap-2">
                    <select className="flex h-[37px] px-5 items-center gap-1.5 rounded-md border border-[#EFF0F6] bg-[#FBFAFA] text-sm text-[#212121] appearance-none pr-10 pl-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                      <option value="es">Spanish</option>
                    </select>

                    {/* Flag Icon */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="16"
                        viewBox="0 0 16 17"
                        fill="none"
                        className="flex-shrink-0"
                      >
                        <g clipPath="url(#clip0_1_18483)">
                          <path
                            d="M8 16.5601C12.4183 16.5601 16 12.9783 16 8.56006C16 4.14178 12.4183 0.560059 8 0.560059C3.58172 0.560059 0 4.14178 0 8.56006C0 12.9783 3.58172 16.5601 8 16.5601Z"
                            fill="#F0F0F0"
                          />
                          <path
                            d="M7.65234 8.56011H16.0002C16.0002 7.83805 15.9039 7.13855 15.7246 6.47314H7.65234V8.56011Z"
                            fill="#D80027"
                          />
                          <path
                            d="M7.65234 4.38616H14.826C14.3362 3.58704 13.7101 2.88069 12.98 2.29919H7.65234V4.38616Z"
                            fill="#D80027"
                          />
                          <path
                            d="M7.99941 16.56C9.88219 16.56 11.6127 15.9093 12.9793 14.8209H3.01953C4.38609 15.9093 6.11663 16.56 7.99941 16.56Z"
                            fill="#D80027"
                          />
                          <path
                            d="M1.17398 12.7339H14.8256C15.2188 12.0924 15.5237 11.3912 15.7242 10.647H0.275391C0.475922 11.3912 0.780828 12.0924 1.17398 12.7339Z"
                            fill="#D80027"
                          />
                          <path
                            d="M3.70575 1.80937H4.43478L3.75666 2.30203L4.01569 3.09918L3.33759 2.60653L2.6595 3.09918L2.88325 2.41053C2.28619 2.90787 1.76287 3.49056 1.33162 4.13981H1.56522L1.13356 4.4534C1.06631 4.56559 1.00181 4.67956 0.94 4.79521L1.14612 5.42962L0.761563 5.15021C0.665969 5.35275 0.578531 5.55984 0.499938 5.77125L0.727031 6.47025H1.56522L0.887094 6.9629L1.14612 7.76006L0.468031 7.2674L0.0618437 7.56253C0.0211875 7.88934 0 8.22221 0 8.56006H8C8 4.14181 8 3.62093 8 0.560059C6.41963 0.560059 4.94641 1.0185 3.70575 1.80937ZM4.01569 7.76006L3.33759 7.2674L2.6595 7.76006L2.91853 6.9629L2.24041 6.47025H3.07859L3.33759 5.67309L3.59659 6.47025H4.43478L3.75666 6.9629L4.01569 7.76006ZM3.75666 4.63246L4.01569 5.42962L3.33759 4.93696L2.6595 5.42962L2.91853 4.63246L2.24041 4.13981H3.07859L3.33759 3.34265L3.59659 4.13981H4.43478L3.75666 4.63246ZM6.88525 7.76006L6.20716 7.2674L5.52906 7.76006L5.78809 6.9629L5.10997 6.47025H5.94816L6.20716 5.67309L6.46616 6.47025H7.30434L6.62622 6.9629L6.88525 7.76006ZM6.62622 4.63246L6.88525 5.42962L6.20716 4.93696L5.52906 5.42962L5.78809 4.63246L5.10997 4.13981H5.94816L6.20716 3.34265L6.46616 4.13981H7.30434L6.62622 4.63246ZM6.62622 2.30203L6.88525 3.09918L6.20716 2.60653L5.52906 3.09918L5.78809 2.30203L5.10997 1.80937H5.94816L6.20716 1.01221L6.46616 1.80937H7.30434L6.62622 2.30203Z"
                            fill="#0052B4"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1_18483">
                            <rect width="16" height="16" fill="white" transform="translate(0 0.560059)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>

                    {/* Chevron Icon */}
                    <RiArrowDownSLine className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div
            className=" bg-white rounded-lg border border-[rgba(0,0,0,0.08)]"
            style={{ flexShrink: 0 }}
          >
            <div className="flex w-full p-4 justify-between items-center rounded-t-lg border-b border-[rgba(33,33,33,0.08)] bg-[#FBFAFA]">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Notification settings</h2>
                <p className="text-sm text-muted-foreground">Choose what I receive as platform owner.</p>
              </div>
              <button className="px-6 py-2.5 bg-[#1F2A44] text-white hover:bg-[#1F2A44]/90 rounded-lg text-sm font-medium transition-colors">
                Save Changes
              </button>
            </div>

            <div className="p-6 bg-white rounded-b-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notificationSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">{setting.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{setting.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <ToggleSwitch checked={setting.enabled} onChange={() => handleToggle(setting.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
