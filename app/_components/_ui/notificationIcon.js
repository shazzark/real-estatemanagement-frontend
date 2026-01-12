"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { fetchAPI } from "../../_lib/api"; // ✅ Import your fetchAPI

export default function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const data = await fetchAPI("/notifications?limit=5"); // ✅ Use fetchAPI

        if (data.data) {
          setNotifications(data.data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        // Handle error gracefully
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await fetchAPI(`/notifications/${id}/read`, {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(c - 1, 0));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-md hover:bg-secondary"
        disabled={loading}
      >
        <Bell className="w-6 h-6" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Loading state */}
      {loading && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-muted-foreground">
            Loading notifications...
          </p>
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-3 border-b font-semibold">Notifications</div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">
                  No notifications
                </p>
              )}

              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-3 cursor-pointer border-b hover:bg-secondary ${
                    !n.read ? "bg-secondary/40" : ""
                  }`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>

                  {n.actionUrl && (
                    <Link
                      href={n.actionUrl}
                      className="text-xs text-primary mt-1 inline-block"
                    >
                      View
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/dashboard?section=notifications"
              className="block text-center text-sm p-2 hover:bg-secondary"
            >
              View all
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
