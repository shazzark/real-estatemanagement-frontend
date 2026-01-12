"use client";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-serif font-bold mb-2">
              Luxe Estates
            </div>
            <p className="text-background/70">
              Premium real estate for discerning buyers
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-background/70">
                Email: info@luxeestates.com
              </li>
              <li className="text-background/70">Phone: (555) 123-4567</li>
              <li className="text-background/70">New York, NY 10001</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <FaFacebook className="w-6 h-6 hover:text-blue-600" />
              </Link>
              <Link
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <FaInstagram className="w-6 h-6 hover:text-pink-600" />
              </Link>
              <Link
                href="#"
                className="text-background/70 hover:text-background transition-colors"
              >
                <FaLinkedin className="w-6 h-6 hover:text-blue-700" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60">
          <p>&copy; 2025 Luxe Estates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
