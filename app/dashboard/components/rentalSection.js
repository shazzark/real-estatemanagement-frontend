"use client";

import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingAPI } from "../../_lib/bookings";
import { AuthContext } from "../../context/authContext";
import PayNowButton from "../../_components/_ui/paynowButton";
import RentPaymentModal from "../../_components/_ui/rentpaymentModal"; // We'll create this
import {
  Home,
  Key,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  Receipt,
  FileText,
  ArrowRight,
  MapPin,
  CreditCard,
  Shield,
} from "lucide-react";

export default function RentalsSection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRental, setSelectedRental] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Add this helper function:
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
  // Fetch only rental bookings
  const {
    data: rentals = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["rentals"],
    queryFn: async () => {
      const data = await bookingAPI.getAll();
      // Filter only rental bookings
      return data.filter((booking) => booking.bookingType === "rental");
    },
  });

  // Filter rentals based on status
  const filteredRentals = rentals.filter((rental) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return rental.status === "pending";
    if (activeFilter === "confirmed")
      return rental.status === "agent_confirmed";
    if (activeFilter === "completed") return rental.status === "completed";
    if (activeFilter === "rejected") return rental.status === "rejected";
    if (activeFilter === "awaiting_payment")
      return (
        rental.status === "agent_confirmed" && rental.paymentStatus !== "paid"
      );
    return true;
  });

  const stats = {
    total: rentals.length,
    pending: rentals.filter((b) => b.status === "pending").length,
    confirmed: rentals.filter((b) => b.status === "agent_confirmed").length,
    awaitingPayment: rentals.filter(
      (b) => b.status === "agent_confirmed" && b.paymentStatus !== "paid"
    ).length,
    completed: rentals.filter((b) => b.status === "completed").length,
    rejected: rentals.filter((b) => b.status === "rejected").length,
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (status === "completed") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
          <CheckCircle size={14} />
          Completed
        </span>
      );
    }
    if (status === "agent_confirmed" && paymentStatus === "paid") {
      return (
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
          <CreditCard size={14} />
          Payment Complete
        </span>
      );
    }
    if (status === "agent_confirmed" && paymentStatus === "pending") {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
          <DollarSign size={14} />
          Awaiting Payment
        </span>
      );
    }
    if (status === "agent_confirmed") {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
          <Key size={14} />
          Confirmed
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
          <Clock size={14} />
          Pending
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
          <AlertCircle size={14} />
          Rejected
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
        {status}
      </span>
    );
  };

  const getRentalDurationText = (rental) => {
    if (rental.duration) {
      return `${rental.duration} months`;
    }
    return "Not specified";
  };

  const calculateRentalPayment = (rental) => {
    const monthlyRent = rental.price || rental.property?.price || 0;
    const securityDeposit = monthlyRent * 1.5; // Typically 1.5x monthly rent
    const firstMonthRent = monthlyRent;
    const processingFee = 10000; // ₦10,000 processing fee
    const total = securityDeposit + firstMonthRent + processingFee;

    return {
      monthlyRent,
      securityDeposit,
      firstMonthRent,
      processingFee,
      total,
    };
  };

  const handlePayNow = (rental) => {
    setSelectedRental(rental);
    setPaymentModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading your rentals...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Rental Requests
          </h2>
          <p className="text-muted-foreground mt-1">
            Track and manage your property rental requests
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Key className="text-blue-600" size={20} />
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
              <DollarSign className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold mt-1">{stats.confirmed}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold mt-1">{stats.completed}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Home className="text-purple-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold mt-1">{stats.pending}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <Clock className="text-gray-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Rentals" },
          { value: "awaiting_payment", label: "Awaiting Payment" },
          { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" },
          { value: "completed", label: "Completed" },
          { value: "rejected", label: "Rejected" },
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

      {/* Rentals List */}
      <div className="space-y-4">
        {filteredRentals.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Key className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No rental requests found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFilter === "all"
                ? "You haven't made any rental requests yet."
                : "No rental requests match your current filter."}
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
          filteredRentals.map((rental) => {
            const paymentBreakdown = calculateRentalPayment(rental);

            return (
              <div
                key={rental._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={getPropertyImage(rental.property)}
                          alt={rental.property?.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1613490493576-7fde63acd811";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {rental.property?.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <MapPin size={14} />
                              <span>
                                {rental.property?.address?.city},{" "}
                                {rental.property?.address?.state}
                              </span>
                            </div>
                          </div>

                          {rental.price && (
                            <div className="flex items-center gap-1">
                              <DollarSign size={16} className="text-gray-500" />
                              <span className="font-bold text-lg text-primary">
                                ₦{rental.price?.toLocaleString()}/month
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Payment Breakdown (if confirmed) */}
                        {rental.status === "agent_confirmed" && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">
                              Payment Required:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div>
                                <p className="text-xs text-blue-700">
                                  Security Deposit
                                </p>
                                <p className="font-semibold">
                                  ₦
                                  {paymentBreakdown.securityDeposit.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-blue-700">
                                  First Month Rent
                                </p>
                                <p className="font-semibold">
                                  ₦
                                  {paymentBreakdown.firstMonthRent.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-blue-700">
                                  Processing Fee
                                </p>
                                <p className="font-semibold">
                                  ₦
                                  {paymentBreakdown.processingFee.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-blue-700">Total</p>
                                <p className="font-semibold text-lg">
                                  ₦{paymentBreakdown.total.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rental Details */}
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Home size={14} className="text-gray-500" />
                            <span className="text-sm">
                              {rental.property?.bedrooms || "N/A"} beds
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" />
                            <span className="text-sm">
                              {getRentalDurationText(rental)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-gray-500" />
                            <span className="text-sm">
                              {rental.contactPreference || "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {rental.numberOfPersons || "1"} person
                              {rental.numberOfPersons !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Message */}
                        {rental.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">
                                Your message:{" "}
                              </span>
                              {rental.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusBadge(rental.status, rental.paymentStatus)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {rental.status === "agent_confirmed" &&
                        rental.paymentStatus !== "paid" && (
                          <button
                            onClick={() => handlePayNow(rental)}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                          >
                            <CreditCard size={18} />
                            Pay Now
                          </button>
                        )}

                      {rental.status === "pending" && (
                        <button
                          onClick={async () => {
                            try {
                              await bookingAPI.cancel(
                                rental._id,
                                "User cancelled rental request"
                              );
                              refetch();
                            } catch (err) {
                              console.error("Failed to cancel rental:", err);
                            }
                          }}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          Cancel Request
                        </button>
                      )}

                      <a
                        href={`/properties/${rental.property?._id}`}
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
                        <Calendar size={14} />
                        <span>
                          Requested:{" "}
                          {new Date(rental.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rental.agent && (
                        <div className="flex items-center gap-1">
                          <span>Agent:</span>
                          <span className="font-medium">
                            {rental.agent?.name}
                          </span>
                          {rental.agent?.phone && (
                            <span className="ml-2">
                              📞 {rental.agent.phone}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      ID: {rental._id?.substring(0, 8)}...
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {selectedRental && (
        <RentPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedRental(null);
          }}
          rental={selectedRental}
          paymentBreakdown={calculateRentalPayment(selectedRental)}
          userEmail={user?.email}
          onSuccess={() => {
            refetch();
            setPaymentModalOpen(false);
            setSelectedRental(null);
          }}
        />
      )}

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Key size={18} />
          Rental Process Guide:
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 ml-6 list-decimal">
          <li>Submit rental request for your desired property</li>
          <li>Agent reviews and confirms your request</li>
          <li>Click "Pay Now" to pay security deposit + first month's rent</li>
          <li>Sign rental agreement and submit required documents</li>
          <li>Receive keys and move into your new home!</li>
        </ol>
        <div className="mt-3 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-900 flex items-center gap-2">
            <Shield size={16} />
            <span className="font-medium">Note:</span> Payment includes security
            deposit (1.5x monthly rent) + first month's rent + ₦10,000
            processing fee
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <a
          href="/properties?listingType=rent"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Home size={16} />
          Find More Rentals
        </a>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Receipt size={16} />
          Print Rental History
        </button>
      </div>
    </div>
  );
}
