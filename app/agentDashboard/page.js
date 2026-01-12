"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../_lib/api";
import { useAuth } from "../hooks/useAuth";
import BookingCard from "./bookingCard";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Home,
  Filter,
  RefreshCw,
  TrendingUp,
  Users,
  Building,
  AlertCircle,
  BarChart3,
} from "lucide-react";

// Stats card component
function StatsCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-1 ${
                trest > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

// Filter button component
function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function AgentDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  // Filter options
  const statusFilters = [
    { value: "all", label: "All Status", icon: <Filter size={16} /> },
    { value: "pending", label: "Pending", icon: <Clock size={16} /> },
    {
      value: "agent_confirmed",
      label: "Confirmed",
      icon: <CheckCircle size={16} />,
    },
    { value: "rejected", label: "Rejected", icon: <XCircle size={16} /> },
    {
      value: "completed",
      label: "Completed",
      icon: <CalendarDays size={16} />,
    },
    { value: "paid", label: "Paid", icon: <DollarSign size={16} /> },
  ];

  const bookingTypeFilters = [
    { value: "all", label: "All Types", icon: <Building size={16} /> },
    { value: "viewing", label: "Viewings", icon: <Home size={16} /> },
    { value: "rental", label: "Rentals", icon: <DollarSign size={16} /> },
    { value: "purchase", label: "Purchases", icon: <TrendingUp size={16} /> },
  ];

  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" },
  ];

  // Check if user is agent/admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        toast.error("Please login to access dashboard");
        router.push("/login");
        return;
      }

      if (user?.role !== "agent" && user?.role !== "admin") {
        toast.error("Access denied. Agent privileges required.");
        router.push("/");
        return;
      }
    }
  }, [user, isAuthenticated, authLoading, router]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      let url = `/bookings`;
      const params = new URLSearchParams();

      if (filter !== "all") params.append("status", filter);
      if (bookingTypeFilter !== "all")
        params.append("bookingType", bookingTypeFilter);

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const bookingsData = await fetchAPI(fullUrl);
      setBookings(bookingsData.data.bookings);

      // Fetch stats
      const statsData = await fetchAPI("/bookings/stats/summary");
      setStats(statsData.data.stats);
    } catch (err) {
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    if (user && (user.role === "agent" || user.role === "admin")) {
      fetchDashboardData();
    }
  }, [filter, bookingTypeFilter, dateRange, user]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authorized, don't render
  if (!isAuthenticated || (user?.role !== "agent" && user?.role !== "admin")) {
    return null;
  }

  // Calculate filtered bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filter !== "all" && booking.status !== filter) return false;
    if (
      bookingTypeFilter !== "all" &&
      booking.bookingType !== bookingTypeFilter
    )
      return false;

    // Filter by date range if needed
    if (booking.date && dateRange !== "all") {
      const bookingDate = new Date(booking.date);
      const today = new Date();

      switch (dateRange) {
        case "today":
          return bookingDate.toDateString() === today.toDateString();
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return bookingDate >= weekAgo;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return bookingDate >= monthAgo;
        default:
          return true;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Agent Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-gray-600">
                    Welcome back,{" "}
                    <span className="font-semibold">{user?.name}</span>
                  </span>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>

              {user?.role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Bookings"
              value={stats?.totalBookings || "0"}
              icon={<CalendarDays size={24} />}
              color="bg-blue-50 text-blue-600"
            />
            <StatsCard
              title="Pending Actions"
              value={stats?.pendingBookings || "0"}
              icon={<Clock size={24} />}
              color="bg-yellow-50 text-yellow-600"
            />
            <StatsCard
              title="Confirmed"
              value={stats?.confirmedBookings || "0"}
              icon={<CheckCircle size={24} />}
              color="bg-green-50 text-green-600"
            />
            <StatsCard
              title="Upcoming"
              value={stats?.upcomingBookings || "0"}
              icon={<TrendingUp size={24} />}
              color="bg-purple-50 text-purple-600"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filterOption) => (
                  <FilterButton
                    key={filterOption.value}
                    active={filter === filterOption.value}
                    onClick={() => setFilter(filterOption.value)}
                  >
                    <div className="flex items-center gap-2">
                      {filterOption.icon}
                      <span>{filterOption.label}</span>
                    </div>
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Booking Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Filter by Type
              </label>
              <div className="flex flex-wrap gap-2">
                {bookingTypeFilters.map((type) => (
                  <FilterButton
                    key={type.value}
                    active={bookingTypeFilter === type.value}
                    onClick={() => setBookingTypeFilter(type.value)}
                  >
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span>{type.label}</span>
                    </div>
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date Range
              </label>
              <div className="flex flex-wrap gap-2">
                {dateRanges.map((range) => (
                  <FilterButton
                    key={range.value}
                    active={dateRange === range.value}
                    onClick={() => setDateRange(range.value)}
                  >
                    {range.label}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filter !== "all" ||
            bookingTypeFilter !== "all" ||
            dateRange !== "all") && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {filter !== "all" && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                      {statusFilters.find((f) => f.value === filter)?.label}
                      <button
                        onClick={() => setFilter("all")}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {bookingTypeFilter !== "all" && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                      {
                        bookingTypeFilters.find(
                          (f) => f.value === bookingTypeFilter
                        )?.label
                      }
                      <button
                        onClick={() => setBookingTypeFilter("all")}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {dateRange !== "all" && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                      {dateRanges.find((f) => f.value === dateRange)?.label}
                      <button
                        onClick={() => setDateRange("all")}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setFilter("all");
                      setBookingTypeFilter("all");
                      setDateRange("all");
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Bookings
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {loading
                    ? "Loading bookings..."
                    : `Showing ${filteredBookings.length} booking${
                        filteredBookings.length !== 1 ? "s" : ""
                      }`}
                </p>
              </div>

              {filteredBookings.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total Revenue: </span>₦
                  {filteredBookings
                    .filter((b) => b.price && b.paymentStatus === "paid")
                    .reduce((sum, b) => sum + (b.price || 0), 0)
                    .toLocaleString()}
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Loading your bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {filter === "all" &&
                  bookingTypeFilter === "all" &&
                  dateRange === "all"
                    ? "You don't have any bookings yet. They will appear here when clients book your properties."
                    : "No bookings match your current filters. Try adjusting your filters."}
                </p>
                {(filter !== "all" ||
                  bookingTypeFilter !== "all" ||
                  dateRange !== "all") && (
                  <button
                    onClick={() => {
                      setFilter("all");
                      setBookingTypeFilter("all");
                      setDateRange("all");
                    }}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Clear filters to see all bookings
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    refresh={refreshData}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredBookings.length > 0 && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                <div>
                  Showing{" "}
                  <span className="font-medium">{filteredBookings.length}</span>{" "}
                  of <span className="font-medium">{bookings.length}</span>{" "}
                  bookings
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => window.print()}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Print Report
                  </button>
                  <button
                    onClick={refreshData}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-blue-800 font-medium">Quick Tips:</p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>
                  • Respond to pending bookings within 24 hours for better
                  client satisfaction
                </li>
                <li>
                  • Confirm payments promptly to avoid delays in property
                  transactions
                </li>
                <li>
                  • Use the filters to organize bookings by status, type, or
                  date
                </li>
                {user?.role === "agent" && (
                  <li>
                    • Update your property listings regularly to attract more
                    bookings
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
