"use client";

import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingAPI } from "../../_lib/bookings";
import { AuthContext } from "../../context/authContext";
import PurchasePaymentModal from "../../_components/_ui/purchasePaymentModal";
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Home,
  Receipt,
  TrendingUp,
  ArrowRight,
  CreditCard,
} from "lucide-react";

export default function PurchasesSection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Helper function for property images
  const getPropertyImage = (property) => {
    if (!property?.images || property.images.length === 0) {
      return "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
    }

    const firstImage = property.images[0];

    if (firstImage?.filename) {
      return `${API_URL}/img/properties/${firstImage.filename}`;
    }

    return (
      firstImage?.url ||
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811"
    );
  };

  // Fetch only purchase bookings
  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const data = await bookingAPI.getAll();
      // Filter only purchase bookings
      const purchases = data.filter(
        (booking) => booking.bookingType === "purchase"
      );
      console.log(
        "Fetched purchases:",
        purchases.map((p) => ({
          id: p._id,
          status: p.status,
          paymentStatus: p.paymentStatus,
          price: p.price,
          agentConfirmed: p.status === "agent_confirmed",
        }))
      );
      return purchases;
    },
  });

  // Filter purchases based on status
  const filteredPurchases = bookings.filter((purchase) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return purchase.status === "pending";
    if (activeFilter === "awaiting_payment")
      return (
        purchase.status === "agent_confirmed" &&
        purchase.paymentStatus !== "paid"
      );
    if (activeFilter === "completed")
      return purchase.status === "paid" || purchase.status === "completed";
    return true;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    awaitingPayment: bookings.filter(
      (b) => b.status === "agent_confirmed" && b.paymentStatus !== "paid"
    ).length,
    completed: bookings.filter(
      (b) => b.status === "paid" || b.status === "completed"
    ).length,
    totalValue: bookings.reduce((sum, b) => sum + (b.price || 0), 0),
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (status === "paid") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
          <CheckCircle size={14} />
          Paid
        </span>
      );
    }
    if (status === "agent_confirmed" && paymentStatus === "pending") {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
          <AlertCircle size={14} />
          Awaiting Payment
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
          <Clock size={14} />
          Pending Confirmation
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
        {status}
      </span>
    );
  };

  // Add this function
  const handlePurchasePayment = async (purchase) => {
    console.log("Payment button clicked for purchase:", {
      id: purchase._id,
      status: purchase.status,
      paymentStatus: purchase.paymentStatus,
      price: purchase.price,
    });
    setSelectedPurchase(purchase);
    setPaymentModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading your purchases...</span>
      </div>
    );
  }

  console.log("Rendering PurchasesSection:", {
    userRole: user?.role,
    totalPurchases: bookings.length,
    awaitingPayment: stats.awaitingPayment,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Property Purchases
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and manage your property purchase requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Purchases</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Receipt className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Awaiting Payment</p>
              <p className="text-2xl font-bold mt-1">{stats.awaitingPayment}</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold mt-1">
                ₦{stats.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Purchases" },
          { value: "pending", label: "Pending Confirmation" },
          { value: "awaiting_payment", label: "Awaiting Payment" },
          { value: "completed", label: "Completed" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              activeFilter === filter.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white hover:bg-gray-50 border-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No purchases found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilter === "all"
                ? "You haven't made any purchase requests yet."
                : "No purchases match your current filter."}
            </p>
            <a
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Properties
              <ArrowRight size={16} />
            </a>
          </div>
        ) : (
          filteredPurchases.map((purchase) => {
            console.log("Rendering purchase item:", {
              id: purchase._id,
              status: purchase.status,
              paymentStatus: purchase.paymentStatus,
              shouldShowPayButton:
                user?.role === "user" &&
                purchase.status === "agent_confirmed" &&
                purchase.paymentStatus !== "paid",
            });

            return (
              <div
                key={purchase._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={getPropertyImage(purchase.property)}
                          alt={purchase.property?.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {purchase.property?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {purchase.property?.address?.city},{" "}
                          {purchase.property?.address?.state}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} className="text-gray-500" />
                            <span className="font-bold text-lg text-primary">
                              ₦{purchase.price?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Home size={16} className="text-gray-500" />
                            <span className="text-sm">
                              {purchase.property?.bedrooms} beds •{" "}
                              {purchase.property?.bathrooms} baths
                            </span>
                          </div>
                        </div>

                        {/* Payment Note - Add this */}
                        {purchase.status === "agent_confirmed" &&
                          purchase.paymentStatus === "pending" && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertCircle
                                  size={16}
                                  className="text-yellow-600"
                                />
                                <p className="text-sm text-yellow-800">
                                  <span className="font-medium">
                                    Payment Required:
                                  </span>
                                  Click "Pay Now" to complete your property
                                  purchase
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusBadge(purchase.status, purchase.paymentStatus)}
                    </div>

                    {/* Action Buttons - FIXED VERSION */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* PAY NOW BUTTON - This is the key fix */}
                      {user?.role === "user" &&
                        purchase.status === "agent_confirmed" &&
                        purchase.paymentStatus !== "paid" && (
                          <button
                            onClick={() => handlePurchasePayment(purchase)}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                          >
                            <CreditCard size={18} />
                            Pay Now
                          </button>
                        )}

                      {/* CANCEL BUTTON - Only for pending purchases */}
                      {purchase.status === "pending" && (
                        <button
                          onClick={async () => {
                            try {
                              await bookingAPI.cancel(
                                purchase._id,
                                "User cancelled purchase request"
                              );
                              refetch();
                            } catch (err) {
                              console.error("Failed to cancel purchase:", err);
                            }
                          }}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          Cancel Request
                        </button>
                      )}

                      {/* VIEW PROPERTY BUTTON - Always show */}
                      <a
                        href={`/properties/${purchase.property?._id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                      >
                        View Property
                      </a>
                    </div>
                  </div>
                </div>

                {/* Timeline & Agent Info */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          Requested:{" "}
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {purchase.agent && (
                        <div className="flex items-center gap-1">
                          <span>Agent:</span>
                          <span className="font-medium">
                            {purchase.agent?.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      ID: {purchase._id?.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal - Make sure this is rendered */}
      {selectedPurchase && (
        <PurchasePaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedPurchase(null);
          }}
          purchase={selectedPurchase}
          userEmail={user?.email}
          onSuccess={() => {
            refetch();
            setPaymentModalOpen(false);
            setSelectedPurchase(null);
          }}
        />
      )}

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          How to complete your purchase:
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 ml-6 list-decimal">
          <li>
            Agent confirms your purchase request (status changes to "Confirmed")
          </li>
          <li>Click "Pay Now" to complete payment via Paystack</li>
          <li>Agent verifies payment confirmation</li>
          <li>Property ownership transfer begins</li>
          <li>Contact your agent for next steps after payment</li>
        </ol>
      </div>
    </div>
  );
}
