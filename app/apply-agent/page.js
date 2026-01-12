// app/apply-agent/page.js
"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/authContext";
import ApplyAgentForm from "./applyAgentForm";
import Link from "next/link";
import { agentAPI } from "../_lib/api";

export default function ApplyAgentPage() {
  const { user, updateUser } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already an agent
  if (user?.role === "agent") {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome, Agent!
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              You are already registered as a verified agent. Access your
              dashboard to manage properties and connect with clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/agent-dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Go to Agent Dashboard
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is admin
  if (user?.role === "admin") {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Admin Access
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              As an administrator, you have full access to the platform. You can
              manage agent applications, users, and properties.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  Agent Applications
                </h3>
                <p className="text-sm text-gray-500">
                  Review and approve pending agent applications
                </p>
              </Link>
              <Link
                href="/admin/users"
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 mb-2">
                  User Management
                </h3>
                <p className="text-sm text-gray-500">
                  Manage all users, agents, and administrators
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has pending application
  if (user?.agentStatus === "pending") {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Application Under Review
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                Your application to become an agent is currently being reviewed
                by our admin team.
              </p>

              <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Estimated review time: 24-48 hours
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">
                  What happens next?
                </h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Our team will review your application details</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      You'll receive an email notification once processed
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 mt-0.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      If approved, you'll gain access to the Agent Dashboard
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Back to Dashboard
                </Link>
                <button
                  onClick={async () => {
                    if (
                      confirm(
                        "Withdraw your application? You can reapply later."
                      )
                    ) {
                      try {
                        await agentAPI.withdrawApplication();
                        updateUser({ ...user, agentStatus: null });
                        alert("Application withdrawn successfully");
                      } catch (error) {
                        alert("Failed to withdraw application");
                      }
                    }
                  }}
                  className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Withdraw Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If application was rejected
  if (user?.agentStatus === "rejected") {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Application Not Approved
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Your previous application was not approved. You can reapply with
                updated information.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Common reasons for rejection include incomplete information,
                insufficient experience, or agency verification issues.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Tips for a successful application
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <span>
                    Provide detailed information about your real estate
                    experience
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <span>
                    Include a valid agency name and contact information
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <span>Ensure your phone number is correct and active</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                  <span>
                    Write a compelling bio that highlights your expertise
                  </span>
                </li>
              </ul>
            </div>

            <ApplyAgentForm />
          </div>
        </div>
      </div>
    );
  }

  // Regular user - show the form
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Our <span className="text-blue-600">Agent</span> Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Unlock powerful tools to grow your real estate business. List
            properties, connect with buyers, and manage your portfolio.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>List Unlimited Properties</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Direct Client Connections</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Advanced Analytics Dashboard</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Benefits */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Join as an Agent?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Increased Visibility
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get your properties featured to thousands of potential
                    buyers
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Lead Generation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receive qualified leads from interested buyers
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Professional Tools
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access advanced CRM and property management tools
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Commission Control
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set and manage your commission rates transparently
                  </p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Requirements
              </h2>
              <ul className="space-y-3">
                {[
                  "Valid real estate license (if applicable in your region)",
                  "Professional agency affiliation or independent certification",
                  "Minimum 1 year of real estate experience (preferred)",
                  "Clean professional record",
                  "Active phone number and email for verification",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">Apply Now</h2>
                  <p className="text-blue-100">
                    Complete your application in 5 minutes
                  </p>
                </div>
                <div className="p-6">
                  <ApplyAgentForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "How long does the approval process take?",
                a: "Typically 24-48 hours. Our admin team reviews applications daily.",
              },
              {
                q: "Is there a fee to become an agent?",
                a: "No, joining our platform as an agent is completely free.",
              },
              {
                q: "Can I apply as an independent agent?",
                a: "Yes, independent agents are welcome. Just enter 'Independent' as your agency.",
              },
              {
                q: "What happens after I'm approved?",
                a: "You'll gain access to the Agent Dashboard where you can start listing properties immediately.",
              },
            ].map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
