"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; // Adjust path as needed
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
              Luxe Estates
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "Dashboard", href: "/dashboard", auth: true },
    { name: "Contact", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight transition-all duration-300 group-hover:text-primary">
              Luxe
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-primary ml-1 tracking-tight">
              Estates
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center w-full justify-between">
            <div className="flex items-center gap-8 justify-center flex-1">
              {navLinks.map(
                (link) =>
                  (!link.auth || isAuthenticated) && (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`nav-link px-3 py-2 rounded-md font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
              )}
            </div>

            {/* Auth section */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1 px-4 py-2 rounded-md bg-muted/50 hover:bg-muted/70 transition-all duration-200"
                  >
                    {user?.name || user?.email}
                    <ChevronDown size={16} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border/50 rounded-md shadow-lg overflow-hidden z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>

                      {/* Only show if user is a regular user */}
                      {user?.role === "user" && (
                        <Link
                          href="/apply-agent"
                          className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Apply as Agent
                        </Link>
                      )}

                      {/* Only show if user is an agent */}
                      {user?.role === "agent" && (
                        <Link
                          href="/agentDashboard"
                          className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Agent Dashboard
                        </Link>
                      )}

                      {/* Only show if user is an admin */}
                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="nav-link px-3 py-2 rounded-md font-medium hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link href="/signup">
                    <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md hover:bg-primary/90 transition-all duration-300 cursor-pointer font-medium text-sm shadow-sm hover:shadow-md">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground p-2 hover:bg-muted/50 rounded-md transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-300 space-y-1">
            {navLinks.map(
              (link) =>
                (!link.auth || isAuthenticated) && (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block w-full px-4 py-2 rounded-md hover:bg-muted/50"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
            )}

            <div className="pt-3 border-t border-border/50 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-foreground/60">
                    Hi, {user?.name || user?.email}
                  </div>
                  <Link
                    href="/profile"
                    className="block w-full px-4 py-2 rounded-md hover:bg-muted/50"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>

                  {user?.role === "user" && (
                    <Link
                      href="/apply-agent"
                      className="block w-full px-4 py-2 rounded-md hover:bg-muted/50"
                      onClick={() => setIsOpen(false)}
                    >
                      Apply as Agent
                    </Link>
                  )}

                  {user?.role === "agent" && (
                    <Link
                      href="/agent-dashboard"
                      className="block w-full px-4 py-2 rounded-md hover:bg-muted/50"
                      onClick={() => setIsOpen(false)}
                    >
                      Agent Dashboard
                    </Link>
                  )}

                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block w-full px-4 py-2 rounded-md hover:bg-muted/50"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-red-50 text-red-600 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full px-4 py-2 rounded-md hover:bg-muted/50"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full mt-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-all duration-300 font-medium shadow-sm">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
