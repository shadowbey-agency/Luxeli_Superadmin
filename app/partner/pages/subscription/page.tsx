"use client"

import { useState } from "react"
import { RiDownloadLine, RiDeleteBinLine, RiAddLine } from "react-icons/ri"
import { LeftArrow, RightArrow } from "@/app/superadmin/components/pagination-arrows"
import PlanIcon from "@/app/superadmin/components/plan-icon"
import AddPaymentMethodModal from "@/app/partner/components/add-payment-method-modal"
import PaySubscriptionModal from "@/app/partner/components/pay-subscription-modal"

interface Invoice {
  id: string
  plan: string
  description: string
  amount: string
  paymentMethod: {
    type: string
    number: string
  }
}

interface PaymentMethod {
  id: string
  type: string
  number: string
  expiry: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    plan: "Personal Plan - May 2025",
    description: "Pack Gold",
    amount: "USD $19.00",
    paymentMethod: {
      type: "Visa",
      number: "***8806"
    }
  },
  {
    id: "2",
    plan: "Personal Plan - April 2025",
    description: "Pack Gold",
    amount: "USD $19.00",
    paymentMethod: {
      type: "Visa",
      number: "***8809"
    }
  },
  {
    id: "3",
    plan: "Personal Plan - March 2025",
    description: "Pack Gold",
    amount: "USD $19.00",
    paymentMethod: {
      type: "Visa",
      number: "***8806"
    }
  }
]

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "Visa",
    number: "8806",
    expiry: "03/27"
  },
  {
    id: "2", 
    type: "Visa",
    number: "6652",
    expiry: "03/27"
  }
]

export default function SubscriptionPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showPaySubscriptionModal, setShowPaySubscriptionModal] = useState(false)
  const itemsPerPage = 3

  const totalPages = Math.ceil(mockInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = mockInvoices.slice(startIndex, endIndex)

  return (
    <div>
      {/* Red Alert Banner - Show when 7 days left */}
      {true && ( // Change this condition based on your logic
        <div 
          className="flex items-center justify-between px-4 py-3 text-white"
    style={{ 
      width: "100%", 
            height: "43px",
            background: "#C4090E"
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              Your Pack Gold renews on Jan 30, 2025. To avoid service interruption, please pay now.
            </span>
            <button 
              onClick={() => setShowPaySubscriptionModal(true)}
              className="px-3 py-1 rounded transition-colors"
              style={{
                fontWeight: "700",
                fontSize: "14px",
                lineHeight: "1.25rem",
                letterSpacing: "0%",
                textDecoration: "underline",
                textDecorationStyle: "solid"
              }}
            >
              Pay Subscription
            </button>
      </div>
          <button className="p-1  hover:bg-opacity-20 rounded-full ">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
      </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        <div className="flex gap-6">
        {/* Left Column - Plans and Invoices */}
        <div className="flex-1 space-y-6">
          {/* Plans Section */}
          <div
            className="bg-white rounded-lg border"
            style={{
              width: "900px",
              border: "1px solid #00000014",
              borderRadius: "10px",
              background: "#FFFFFF",
              
            }}
          >
            <div className="rounded-tlg">
              <div className=" px-4 border-b py-4 bg-[#FBFAFA] rounded-t-lg">


              <h2 className="text-xl font-bold text-gray-900 mb-1">Plans</h2>
              <p className="text-sm text-gray-600 ">
                Manage your subscription—choose a plan, cycle, and renewal settings.
              </p>
      </div>

              {/* Plan Boxes */}
              <div className="space-y-3 py-6 px-4 bg-white">
                {/* Starter Pack */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-[10px]">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        display: "flex",
                        width: "40px",
                        height: "40px",
                        padding: "8px",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "7.059px",
                        borderRadius: "70.588px",
                        border: "0.353px solid #000",
                        background: "rgba(0, 0, 0, 0.20)",
                        boxShadow: "0 2.471px 3.882px 0 rgba(0, 0, 0, 0.02)"
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="18"
                        viewBox="0 0 10 12"
                        fill="none"
          style={{ 
                          width: "15px",
                          height: "18px",
                          flexShrink: 0
                        }}
                      >
                        <path d="M1.0085 5.20266C0.825886 4.69725 0.734577 4.44454 0.773513 4.28261C0.816099 4.10549 0.942058 3.96741 1.10306 3.92134C1.25026 3.87923 1.47925 3.981 1.93723 4.18455C2.34231 4.36459 2.54485 4.45461 2.73515 4.4496C2.94468 4.44409 3.14624 4.36006 3.30658 4.21139C3.4522 4.07636 3.54988 3.86119 3.74523 3.43084L4.17575 2.48242C4.53538 1.69019 4.71519 1.29407 4.99994 1.29407C5.28469 1.29407 5.46451 1.69019 5.82413 2.48242L6.25466 3.43084C6.45001 3.86119 6.54768 4.07636 6.69331 4.21139C6.85365 4.36006 7.05521 4.44409 7.26473 4.4496C7.45503 4.45461 7.65758 4.36459 8.06266 4.18455C8.52064 3.981 8.74962 3.87923 8.89682 3.92134C9.05783 3.96741 9.18379 4.10549 9.22637 4.28261C9.26531 4.44454 9.174 4.69725 8.99138 5.20266L8.20643 7.37509C7.87064 8.30441 7.70275 8.76906 7.3514 9.03157C7.00005 9.29407 6.54602 9.29407 5.63795 9.29407H4.36194C3.45387 9.29407 2.99983 9.29407 2.64849 9.03157C2.29714 8.76906 2.12924 8.30441 1.79346 7.37509L1.0085 5.20266Z" stroke="black" strokeWidth="1.4" />
                        <path d="M5 6.94116H5.00423" stroke="black" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2.64648 10.7058H7.35237" stroke="black" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
                    </div>
                    <span className="font-medium text-gray-900">Starter pack</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-1">
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "35px",
                          lineHeight: "35px",
                          color: "#0A0A0A"
                        }}
                      >
                        $10
                      </span>
                      <span
          style={{ 
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "22px",
                          color: "#5C5C5C"
                        }}
                      >
                        /month
                      </span>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ 
                        background: "#FBFAFA",
                        border: "1px solid #00000014",
                        color: "#000000"
                      }}
                    >
                      Upgrade
        </button>
                  </div>
      </div>
      
                {/* Pack Gold */}
                <div className="p-4 border border-gray-200 rounded-[10px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          display: "flex",
                          width: "40px",
                          height: "40px",
                          padding: "8px",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "7.059px",
                          borderRadius: "70.588px",
                          border: "0.353px solid #D1924F",
                          background: "rgba(209, 146, 79, 0.20)",
                          boxShadow: "0 2.471px 3.882px 0 rgba(0, 0, 0, 0.02)"
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="18"
                          viewBox="0 0 10 12"
                          fill="none"
                          style={{
                            width: "15px",
                            height: "18px",
                            flexShrink: 0
                          }}
                        >
                          <path d="M1.0085 5.20266C0.825886 4.69725 0.734577 4.44454 0.773513 4.28261C0.816099 4.10549 0.942058 3.96741 1.10306 3.92134C1.25026 3.87923 1.47925 3.981 1.93723 4.18455C2.34231 4.36459 2.54485 4.45461 2.73515 4.4496C2.94468 4.44409 3.14624 4.36006 3.30658 4.21139C3.4522 4.07636 3.54988 3.86119 3.74523 3.43084L4.17575 2.48242C4.53538 1.69019 4.71519 1.29407 4.99994 1.29407C5.28469 1.29407 5.46451 1.69019 5.82413 2.48242L6.25466 3.43084C6.45001 3.86119 6.54768 4.07636 6.69331 4.21139C6.85365 4.36006 7.05521 4.44409 7.26473 4.4496C7.45503 4.45461 7.65758 4.36459 8.06266 4.18455C8.52064 3.981 8.74962 3.87923 8.89682 3.92134C9.05783 3.96741 9.18379 4.10549 9.22637 4.28261C9.26531 4.44454 9.174 4.69725 8.99138 5.20266L8.20643 7.37509C7.87064 8.30441 7.70275 8.76906 7.3514 9.03157C7.00005 9.29407 6.54602 9.29407 5.63795 9.29407H4.36194C3.45387 9.29407 2.99983 9.29407 2.64849 9.03157C2.29714 8.76906 2.12924 8.30441 1.79346 7.37509L1.0085 5.20266Z" stroke="#D1924F" strokeWidth="1.4" />
                          <path d="M5 6.94116H5.00423" stroke="#D1924F" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2.64648 10.7058H7.35237" stroke="#D1924F" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">Pack Gold</span>
                        <div
        style={{
                            width: "92px",
          height: "22px",
                            borderRadius: "5px",
                            gap: "10px",
                            padding: "2px 10px",
                            background: "#F6F9FF",
                            color: "#5C5C5C",
                            fontWeight: "500",
          fontSize: "12px",
                            lineHeight: "18px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          Current Plan
      </div>
    </div>
    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "22px",
                          color: "#5C5C5C"
                        }}
                      >
                        USD
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "35px",
                          lineHeight: "35px",
                          color: "#0A0A0A"
                        }}
                      >
                        $19
                      </span>
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "22px",
                          color: "#5C5C5C"
                        }}
                      >
                        /month
                      </span>
          </div>
      </div>

                  {/* Progress Section */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">07 Days left</p>
                     <div 
                       className="h-2 rounded-full"
                       style={{
                         width: "100%",
                         height: "8px",
                         borderRadius: "10px",
                         background: "#EEF0F3"
                       }}
                     >
                       <div 
                         className="h-full rounded-full"
                         style={{
                           width: "70%",
                           background: "#4195BF",
                           borderRadius: "10px"
                         }}
            />
          </div>

                     {/* Pay Subscription Button */}
                     <button 
                       className="flex items-center justify-center gap-2 text-white mt-4 w-full"
                style={{
                         height: "37.04px",
                         borderRadius: "6px",
                         gap: "6px",
                         padding: "8.52px 20px",
                         background: "#1F2A44",
                         border: "1px solid #00000014"
                       }}
                     >
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                       </svg>
                       Pay Subscription
                     </button>
                  </div>
                </div>
              </div>
              </div>
            </div>

          {/* Invoices Section */}
          <div
            className="bg-white rounded-lg border"
            style={{
              width: "900px",

              border: "1px solid #00000014",
              borderRadius: "10px",
              background: "#FFFFFF"
            }}
          >
            {/* Header */}
            <div
              className="rounded-t-lg"
              style={{
                background: "#FBFAFA",
                borderBottom: "1px solid #21212114",
                borderLeft: "1px solid #00000014",
                borderRight: "1px solid #00000014",
                borderTop: "1px solid #00000014",
                width: "900px",
                height: "82px",
                padding: "16px",
                borderTopRightRadius: "10px",
                borderTopLeftRadius: "10px"
              }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-1">Invoices</h2>
              <p className="text-sm text-gray-600">View and download all invoices for your account.</p>
        </div>

            {/* Invoice List */}
            <div className="p-6">
              <div className="space-y-1">
                {currentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-1 border-b border-gray-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900" style={{ color: "#0A0A0A" }}>
                        {invoice.plan}
                      </p>
                  </div>
                    <div className="flex items-center gap-5">
                      <p className="text-medium mr-10" style={{ color: "#0A0A0A" }}>{invoice.description}</p>
                      <span className="font-medium text-gray-900" style={{ color: "#0A0A0A" }}>
                        {invoice.amount}
                    </span>
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded"
                        style={{
                          width: "100px",
                          height: "22px",
                          gap: "10px"
                        }}
                      >
                        <div
                          className="flex items-center justify-center rounded"
                          style={{
                            width: "32px",
                            height: "20px",
                            background: "#FFFFFF",
                            border: "0.5px solid #BEBEBE",

                          }}
                        >
                          <span className="text-xs font-bold text-blue-600">VISA</span>
                  </div>
                        <span
                          className="text-sm"
                          style={{
                            color: "#5C5C5C",
                            fontSize: "14px",
                        fontWeight: "400",
                            lineHeight: "22px"
                          }}
                        >
                          {invoice.paymentMethod.number}
                      </span>
                    </div>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <RiDownloadLine className="w-4 h-4" style={{ color: "#797979" }} />
                    </button>
                    </div>
                  </div>
              ))}
            </div>

        {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, mockInvoices.length)} of {mockInvoices.length} invoices
          </p>
          <div className="flex items-center gap-2">
            <button 
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LeftArrow />
            </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${currentPage === i + 1 ? "text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      style={{
                        background: currentPage === i + 1 ? "#1F2A44" : "transparent"
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
            <button 
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RightArrow />
            </button>
          </div>
        </div>
      </div>
                </div>
              </div>

        {/* Right Column - Payment Methods */}
        <div className="w-96">
          <div
            className=""
                style={{
              background: "transparent"
            }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
            <div className="border-b border-gray-200 mb-6"></div>

            {/* Payment Method Cards */}
            <div className="space-y-4 mb-6">
              {mockPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{
                    width: "400px",
                    height: "74px",
                    border: "1px solid #E7E7E7",
                    borderRadius: "10px",
                    gap: "15px",
                    padding: "15px 20px"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center rounded"
                      style={{
                        width: "74px",
                        height: "44px",
                        borderRadius: "5px",
                        background: "linear-gradient(45deg, #141B34 0%, #3C56B3 100%)",
                        boxShadow: "0.92px 1.15px 1.84px 0px #0000000D"
                      }}
                    >
                      <span className="text-white font-bold text-sm">VISA</span>
                    </div>
                    <div
                style={{
                        width: "220px",
                        height: "44px"
                      }}
                    >
                      <p className="font-medium text-gray-900">Visa ending {method.number}</p>
                      <p className="text-sm text-gray-600">Expires {method.expiry}</p>
          </div>
        </div>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <RiDeleteBinLine className="w-4 h-4 text-gray-400" />
                  </button>
                    </div>
              ))}
        </div>

            {/* Add Payment Method Button */}
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              style={{
                width: "400px",
                height: "37.04px",
                borderRadius: "10px",
                gap: "6px",
                padding: "8.52px 20px",
                background: "#E9EAEC",
                border: "1px solid #00000014"
              }}
            >
              <RiAddLine className="w-4 h-4" />
              Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
      />

      {/* Pay Subscription Modal */}
      <PaySubscriptionModal
        isOpen={showPaySubscriptionModal}
        onClose={() => setShowPaySubscriptionModal(false)}
      />
    </div>
  )
}
