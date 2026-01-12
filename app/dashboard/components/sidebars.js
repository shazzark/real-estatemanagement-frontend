// app/dashboard/components/Sidebar.js
"use client";

import { useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
  DollarSign,
  Key,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "bookings", label: "Bookings", icon: <Calendar size={20} /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart size={20} /> },
    { id: "purchases", label: "Purchases", icon: <DollarSign size={20} /> },
    { id: "rentals", label: "Rentals", icon: <Key size={20} /> },
    // { id: "profile", label: "Profile", icon: <User size={20} /> },
    // { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const handleNavigation = (id) => {
    setActiveSection(id);
    if (isMobile) setIsOpen(false); // close sidebar on mobile after navigation
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      {/* Hamburger / Close Icon */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            className="fixed lg:relative z-50 w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col"
            initial={{ x: isMobile ? -300 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? -300 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Brand */}
            <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
                LE
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                  <Link href="/">Luxe Estates</Link>
                </div>
                <p className="text-xs text-muted-foreground">Real Estate</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        activeSection === item.id
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-sidebar-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
