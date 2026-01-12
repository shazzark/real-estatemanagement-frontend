"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  X,
  CreditCard,
  Shield,
  FileText,
  AlertCircle,
  DollarSign,
  Home,
  Building,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchAPI } from "../../_lib/api";

export default function PurchasePaymentModal({
  isOpen,
  onClose,
  purchase,
  userEmail,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);

  const handlePayment = async () => {
    if (!agreementAccepted) {
      toast.error("Please accept the purchase agreement");
      return;
    }

    if (!documentsConfirmed) {
      toast.error("Please confirm you have the required documents ready");
      return;
    }

    setLoading(true);
    try {
      // Initialize payment for purchase
      const paymentRes = await fetchAPI(
        `/payments/initialize/${purchase._id}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: userEmail,
            type: "purchase",
          }),
        }
      );

      if (paymentRes.status === "success" && paymentRes.data.authorizationUrl) {
        // Redirect to payment URL
        window.location.href = paymentRes.data.authorizationUrl;
        onSuccess();
      } else {
        throw new Error(paymentRes.message || "Failed to initialize payment");
      }
    } catch (err) {
      toast.error(err.message || "Payment initialization failed");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const requiredDocuments = [
    "Valid Means of Identification (Passport, Driver's License, National ID)",
    "Proof of Funds",
    "Tax Clearance Certificate",
    "Passport Photographs",
    "Purchase Agreement (to be signed after payment)",
    "Survey Plan and Title Documents",
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
                    Complete Property Purchase
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
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={
                          purchase.property?.images?.[0]?.url ||
                          "/placeholder.jpg"
                        }
                        alt={purchase.property?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {purchase.property?.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <Home size={14} />
                          <span>
                            {purchase.property?.bedrooms} beds,{" "}
                            {purchase.property?.bathrooms} baths
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building size={14} />
                          <span>{purchase.property?.area} sq ft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="mb-6">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">
                        Total Purchase Price
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        ₦{purchase.price?.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign size={32} className="text-green-600" />
                  </div>
                </div>

                {/* Required Documents */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Required Documents for Property Transfer
                  </h4>
                  <div className="space-y-2">
                    {requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0" />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={documentsConfirmed}
                        onChange={(e) =>
                          setDocumentsConfirmed(e.target.checked)
                        }
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that I have all required documents ready for
                        property transfer
                      </span>
                    </label>
                  </div>
                </div>

                {/* Purchase Agreement */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Shield size={18} />
                    Purchase Agreement
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700">
                      By proceeding with this payment, you agree to purchase the
                      property "{purchase.property?.title}" for ₦
                      {purchase.price?.toLocaleString()}. This payment initiates
                      the property transfer process. After payment, your agent
                      will contact you to complete documentation and transfer of
                      ownership. All payments are final and non-refundable
                      except as required by law.
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
                        I have read and accept the purchase agreement terms
                      </span>
                    </label>
                  </div>
                </div>

                {/* Agent Information */}
                {purchase.agent && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <User size={18} />
                      Your Property Agent
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{purchase.agent.name}</p>
                        <p className="text-sm text-blue-700">
                          {purchase.agent.email}
                        </p>
                        {purchase.agent.phone && (
                          <p className="text-sm text-blue-700">
                            📞 {purchase.agent.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-blue-800 mt-3">
                      Your agent will contact you after payment to complete the
                      property transfer.
                    </p>
                  </div>
                )}

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
                          After payment, your agent will contact you within 24
                          hours
                        </li>
                        <li>Payment receipt will be sent to your email</li>
                        <li>
                          Property transfer typically takes 30-60 days after
                          payment
                        </li>
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
                      loading || !agreementAccepted || !documentsConfirmed
                    }
                    className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                      loading || !agreementAccepted || !documentsConfirmed
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
                        Pay Now (₦{purchase.price?.toLocaleString()})
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
}
