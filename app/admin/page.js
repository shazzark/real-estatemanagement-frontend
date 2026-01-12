"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { agentAPI } from "../_lib/api";

const AdminAgentDashboard = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use your agentAPI helper
      const response = await agentAPI.getPendingAgents();
      setAgents(response.data.agents);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError(err.message || "Failed to fetch pending agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingAgents();
    }
  }, [user]);

  const handleApprove = async (id) => {
    try {
      await agentAPI.approveAgent(id);
      fetchPendingAgents(); // Refresh the list
    } catch (err) {
      console.error("Error approving agent:", err);
      alert(err.message || "Failed to approve agent");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this agent application?"))
      return;

    try {
      await agentAPI.rejectAgent(id);
      fetchPendingAgents(); // Refresh the list
    } catch (err) {
      console.error("Error rejecting agent:", err);
      alert(err.message || "Failed to reject agent");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need to be an admin to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading pending applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPendingAgents}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage agent applications</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Agent Applications
            </h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {agents.length} Pending
            </span>
          </div>

          {agents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📋</div>
              <p className="text-gray-500 text-lg">
                No pending agent applications
              </p>
              <p className="text-gray-400 mt-2">
                All agent applications have been processed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {agent.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-500">{agent.email}</p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Pending Review
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">
                            {agent.phone || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Agency</p>
                          <p className="font-medium">
                            {agent.agency || "Independent"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Specialization
                          </p>
                          <p className="font-medium capitalize">
                            {agent.specialization || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Applied On</p>
                          <p className="font-medium">
                            {new Date(agent.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {agent.bio && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Bio / Experience
                          </p>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded">
                            {agent.bio}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2 min-w-50">
                      <button
                        onClick={() => handleApprove(agent._id)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Approve Agent
                      </button>
                      <button
                        onClick={() => handleReject(agent._id)}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Reject Application
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAgentDashboard;
