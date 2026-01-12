"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../_lib/api";
import PayNowButton from "../../_components/_ui/paynowButton";
import {
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function UserPurchasesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetchPurchases();
  }, [isAuthenticated]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await fetchAPI("/bookings?bookingType=purchase");
      setPurchases(data.data.bookings);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status, paymentStatus) => {
    if (status === "paid")
      return <CheckCircle className="text-green-600" size={20} />;
    if (status === "agent_confirmed" && paymentStatus === "pending")
      return <AlertCircle className="text-yellow-600" size={20} />;
    if (status === "pending")
      return <Clock className="text-blue-600" size={20} />;
    if (status === "rejected" || status === "cancelled")
      return <XCircle className="text-red-600" size={20} />;
    return <Clock className="text-gray-600" size={20} />;
  };

  const getStatusText = (status, paymentStatus) => {
    if (status === "paid") return "Purchase Completed";
    if (status === "agent_confirmed" && paymentStatus === "pending")
      return "Awaiting Payment";
    if (status === "agent_confirmed" && paymentStatus === "paid")
      return "Payment Confirmed";
    if (status === "pending") return "Awaiting Agent Confirmation";
    return status.replace("_", " ");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Property Purchases
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage your property purchase requests
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Purchases</p>
                <p className="text-2xl font-bold">{purchases.length}</p>
              </div>
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Awaiting Payment</p>
                <p className="text-2xl font-bold">
                  {
                    purchases.filter(
                      (p) =>
                        p.status === "agent_confirmed" &&
                        p.paymentStatus === "pending"
                    ).length
                  }
                </p>
              </div>
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">
                  {purchases.filter((p) => p.status === "paid").length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Confirmation</p>
                <p className="text-2xl font-bold">
                  {purchases.filter((p) => p.status === "pending").length}
                </p>
              </div>
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Purchases List */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Purchase Requests</h2>
            <p className="text-sm text-gray-600">
              {purchases.length} purchase request
              {purchases.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="p-6">
            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No purchase requests yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't made any property purchase requests yet.
                </p>
                <button
                  onClick={() => router.push("/properties")}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div
                    key={purchase._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      {/* Property Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
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
                            <h3 className="font-semibold text-lg">
                              {purchase.property?.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {purchase.property?.address?.city},{" "}
                              {purchase.property?.address?.state}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <DollarSign
                                  size={16}
                                  className="text-gray-500"
                                />
                                <span className="font-bold text-lg text-primary">
                                  ₦{purchase.price?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex items-center gap-2 mb-3">
                          {getStatusIcon(
                            purchase.status,
                            purchase.paymentStatus
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              purchase.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : purchase.status === "agent_confirmed" &&
                                  purchase.paymentStatus === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : purchase.status === "pending"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {getStatusText(
                              purchase.status,
                              purchase.paymentStatus
                            )}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {purchase.status === "agent_confirmed" &&
                            purchase.paymentStatus === "pending" && (
                              <PayNowButton
                                booking={purchase}
                                userEmail={user.email}
                                refresh={fetchPurchases}
                              />
                            )}

                          {purchase.status === "pending" && (
                            <button
                              onClick={async () => {
                                try {
                                  await fetchAPI(
                                    `/bookings/${purchase._id}/cancel`,
                                    {
                                      method: "PATCH",
                                    }
                                  );
                                  toast.success("Purchase request cancelled");
                                  fetchPurchases();
                                } catch (err) {
                                  toast.error(err.message);
                                }
                              }}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                            >
                              Cancel Request
                            </button>
                          )}

                          <button
                            onClick={() =>
                              router.push(
                                `/properties/${purchase.property?._id}`
                              )
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            View Property
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">
            How to complete your purchase:
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
            <li>Agent confirms your purchase request</li>
            <li>Click "Pay Now" to complete payment</li>
            <li>Agent verifies payment confirmation</li>
            <li>Property ownership transfer begins</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
