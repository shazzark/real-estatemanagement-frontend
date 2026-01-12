"use client";

import {
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  Home,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAPI } from "../../_lib/api";
import { Skeleton } from "../../_components/_ui/skeleton";

const DashboardSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user data
      const userData = await fetchAPI("/users/me");
      const userId = userData.data?.user?._id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      // Fetch user's properties
      const propertiesResponse = await fetchAPI(
        `/properties?agent=${userId}&limit=100`
      );
      const properties = propertiesResponse.data?.properties || [];

      // Get different property types
      const totalProperties = properties.length;
      const forSaleProperties = properties.filter(
        (p) => p.status === "for sale"
      ).length;
      const forRentProperties = properties.filter(
        (p) => p.status === "for rent"
      ).length;
      const featuredProperties = properties.filter((p) => p.featured).length;

      // Fetch user's bookings
      const bookingsResponse = await fetchAPI(`/bookings?user=${userId}`);
      const bookings = bookingsResponse.data?.bookings || [];

      // Calculate revenue from completed bookings/purchases
      const totalRevenue = bookings
        .filter(
          (booking) =>
            booking.status === "completed" || booking.status === "paid"
        )
        .reduce((sum, booking) => sum + (booking.price || 0), 0);

      // Get recent activity from bookings
      const recentActivity = bookings.slice(0, 5).map((booking) => ({
        activity: `${
          booking.bookingType === "purchase" ? "Purchase" : "Booking"
        } for ${booking.property?.title || "Property"}`,
        time: formatTimeAgo(booking.createdAt),
        status: booking.status,
        type: booking.bookingType,
      }));

      setStats({
        // Property statistics
        totalProperties,
        forSaleProperties,
        forRentProperties,
        featuredProperties,

        // Booking statistics
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        completedBookings: bookings.filter(
          (b) => b.status === "completed" || b.status === "paid"
        ).length,
        totalRevenue,
        recentActivity,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <TrendingUp className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load dashboard
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors text-sm font-medium"
        >
          <Calendar size={16} />
          Refresh Data
        </button>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <div className="bg-linear-to-br from-blue-50 to-white p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              +{stats.pendingBookings || 0} pending
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Properties
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalProperties || 0}
            </p>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.forSaleProperties || 0} for sale •{" "}
            {stats.forRentProperties || 0} for rent
          </p>
        </div>

        {/* Total Bookings */}
        <div className="bg-linear-to-br from-green-50 to-white p-6 rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Completed</div>
              <div className="text-sm font-bold text-green-700">
                {stats.completedBookings || 0}
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Bookings
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalBookings || 0}
            </p>
            <span className="text-sm text-blue-600 font-medium">All time</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Booking requests received
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-linear-to-br from-purple-50 to-white p-6 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(stats.totalRevenue || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            From completed transactions
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-linear-to-br from-orange-50 to-white p-6 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Home className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Featured</div>
              <div className="text-sm font-bold text-orange-700">
                {stats.featuredProperties || 0}
              </div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Success Rate
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalBookings > 0
              ? `${Math.round(
                  (stats.completedBookings / stats.totalBookings) * 100
                )}%`
              : "0%"}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Booking to completion ratio
          </p>
        </div>
      </div>

      {/* Property Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-r from-blue-50 to-white p-5 rounded-xl border border-blue-100">
          <h4 className="font-medium text-gray-900 mb-2">Property Breakdown</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">For Sale</span>
              <span className="font-medium text-blue-600">
                {stats.forSaleProperties || 0}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">For Rent</span>
              <span className="font-medium text-green-600">
                {stats.forRentProperties || 0}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Featured</span>
              <span className="font-medium text-orange-600">
                {stats.featuredProperties || 0}
              </span>
            </li>
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden md:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <p className="text-sm text-gray-600">
              Latest updates on your properties and bookings
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((item, index) => (
                <div
                  key={index}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          item.type === "purchase"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {item.type === "purchase" ? (
                          <DollarSign size={16} />
                        ) : (
                          <Calendar size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.activity}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">
                            {item.time}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.status === "completed" ||
                              item.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  No recent activity
                </h4>
                <p className="text-gray-600 text-sm">
                  Your recent bookings and purchases will appear here
                </p>
              </div>
            )}
          </div>

          {stats.recentActivity && stats.recentActivity.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <a
                href="/dashboard/bookings"
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center justify-center gap-2"
              >
                View all activity
                <ArrowRight size={16} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Quick Insights</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Active listings</span>
              <span className="font-medium">{stats.totalProperties || 0}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Pending bookings</span>
              <span className="font-medium text-yellow-600">
                {stats.pendingBookings || 0}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Completion rate</span>
              <span className="font-medium">
                {stats.totalBookings > 0
                  ? `${Math.round(
                      (stats.completedBookings / stats.totalBookings) * 100
                    )}%`
                  : "0%"}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-linear-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">
            Performance Summary
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Based on your recent activity, your properties are performing well
            in the market. Consider adding more photos to boost engagement.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (stats.completedBookings /
                        Math.max(stats.totalBookings, 1)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Completion rate</span>
                <span>
                  {stats.totalBookings > 0
                    ? `${Math.round(
                        (stats.completedBookings / stats.totalBookings) * 100
                      )}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
