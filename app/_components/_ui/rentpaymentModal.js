"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  CreditCard,
  Shield,
  FileText,
  Check,
  AlertCircle,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { paymentAPI } from "../../_lib/api"; // ✅ Import paymentAPI

export default function RentPaymentModal({
  isOpen,
  onClose,
  rental,
  paymentBreakdown,
  userEmail,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);

  // ✅ Fixed payment function using paymentAPI
  const handlePayment = async () => {
    if (!agreementAccepted) {
      toast.error("Please accept the rental agreement");
      return;
    }

    if (!documentsUploaded) {
      toast.error("Please confirm you have uploaded required documents");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting payment for booking:", rental._id);
      console.log("User email:", userEmail);

      // ✅ Use paymentAPI instead of direct fetchAPI
      const paymentRes = await paymentAPI.initializeRentalPayment(
        rental._id,
        userEmail
      );

      console.log("Payment response:", paymentRes);

      if (paymentRes.status === "success" && paymentRes.data.authorizationUrl) {
        console.log("Redirecting to:", paymentRes.data.authorizationUrl);
        window.location.href = paymentRes.data.authorizationUrl;
        onSuccess();
      } else {
        throw new Error(paymentRes.message || "Failed to initialize payment");
      }
    } catch (err) {
      console.error("Full payment error:", err);
      toast.error(err.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const requiredDocuments = [
    "Valid ID Card (International Passport, Driver's License, or National ID)",
    "Proof of Income (3 months bank statement or employment letter)",
    "Passport Photograph",
    "Reference Letter",
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-900"
                  >
                    Complete Your Rental Payment
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Property Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {rental.property?.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{getRentalDurationText(rental)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>₦{rental.price?.toLocaleString()}/month</span>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Payment Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Security Deposit (1.5x rent)
                      </span>
                      <span className="font-medium">
                        ₦{paymentBreakdown.securityDeposit.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">First Month's Rent</span>
                      <span className="font-medium">
                        ₦{paymentBreakdown.firstMonthRent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Processing Fee</span>
                      <span className="font-medium">
                        ₦{paymentBreakdown.processingFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Total Amount
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ₦{paymentBreakdown.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Required Documents
                  </h4>
                  <div className="space-y-2">
                    {requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check
                          size={16}
                          className="text-green-500 mt-0.5 shrink-0"
                        />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={documentsUploaded}
                        onChange={(e) => setDocumentsUploaded(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that I have uploaded all required documents to
                        my agent
                      </span>
                    </label>
                  </div>
                </div>

                {/* Rental Agreement */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={18} />
                    Rental Agreement
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700">
                      By proceeding with this payment, you agree to the terms of
                      the rental agreement, including: 1) Security deposit
                      refundable at end of tenancy, 2) 30-day notice for
                      termination, 3) Maintenance responsibilities, 4) No
                      subletting without permission, 5) Compliance with building
                      rules and regulations.
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={agreementAccepted}
                        onChange={(e) => setAgreementAccepted(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I have read and accept the rental agreement terms
                      </span>
                    </label>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={18}
                      className="text-yellow-600 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">
                        Important Notes:
                      </p>
                      <ul className="text-sm text-yellow-700 mt-1 space-y-1 ml-4 list-disc">
                        <li>Payment is processed securely via Paystack</li>
                        <li>You will be redirected to Paystack payment page</li>
                        <li>
                          After payment, your agent will contact you for next
                          steps
                        </li>
                        <li>Payment receipt will be sent to your email</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={
                      loading || !agreementAccepted || !documentsUploaded
                    }
                    className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                      loading || !agreementAccepted || !documentsUploaded
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Pay Now (₦{paymentBreakdown.total.toLocaleString()})
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  function getRentalDurationText(rental) {
    if (rental.duration) {
      return `${rental.duration} months`;
    }
    return "Not specified";
  }
}
