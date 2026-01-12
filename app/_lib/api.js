// _lib/api.js
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://real-estatemanagement-backend-api.onrender.com/api/v1";

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// export async function fetchAPI(endpoint, options = {}) {
//   // const url = `${API_URL}${endpoint}`;

//   // // Debug logging (remove in production)
//   // console.log(`API Call: ${url}`, options.method || "GET");

//   // // Merge options with default credentials
//   // const fetchOptions = {
//   //   credentials: "include", // CRITICAL: Send cookies
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //     ...(options.headers || {}),
//   //   },
//   //   ...options,
//   // };
//   const url = `${API_URL}${endpoint}`;

//   // Get auth token from localStorage or cookies if needed
//   // const token = localStorage.getItem("token") || getCookie("token");

//   const fetchOptions = {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       // Add Authorization header if using tokens
//       // ...(token ? { Authorization: `${token}` } : {}),
//       // ...(options.headers || {}),
//     },
//     ...options,
//   };

//   // Debug all headers
//   console.log("Request Headers:", fetchOptions.headers);
//   console.log("Request Cookies:", document.cookie);

//   // Remove duplicate headers if they exist
//   if (options.headers && options.headers["Content-Type"]) {
//     delete fetchOptions.headers["Content-Type"];
//     fetchOptions.headers = {
//       "Content-Type": "application/json",
//       ...options.headers,
//     };
//   }

//   try {
//     const response = await fetch(url, fetchOptions);

//     // Debug response status
//     console.log(`Response Status: ${response.status} ${response.statusText}`);

//     // Handle no-content responses (204)
//     if (response.status === 204) {
//       return null;
//     }

//     const data = await response.json();

//     if (!response.ok) {
//       throw new APIError(
//         data.message || `Error ${response.status}: ${response.statusText}`,
//         response.status
//       );
//     }

//     return data;
//   } catch (error) {
//     // Network errors or JSON parsing errors
//     if (error instanceof TypeError) {
//       throw new APIError("Network error. Please check your connection.", 0);
//     }
//     throw error;
//   }
// }

// Auth-specific API calls

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const token = localStorage.getItem("token");
  const isAuthEndpoint =
    endpoint.includes("/login") || endpoint.includes("/signup");

  // DON'T auto-add token - let each call handle it
  const fetchOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // ✅ Add token to ALL requests except auth endpoints
      ...(token && !isAuthEndpoint ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}), // Manual headers only
    },
    ...options,
  };

  console.log("📋 Headers:", fetchOptions.headers);

  try {
    console.log("📤 [fetchAPI] Making request...");
    const response = await fetch(url, fetchOptions);

    console.log(
      `📥 [fetchAPI] Response Status: ${response.status} ${response.statusText}`
    );

    // Handle no-content responses (204)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || `Error ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    console.log("✅ [fetchAPI] Request successful");
    return data;
  } catch (error) {
    console.log("❌ [fetchAPI] Error:", error);

    if (error instanceof TypeError) {
      throw new APIError("Network error. Please check your connection.", 0);
    }
    throw error;
  }
}

export const authAPI = {
  signup: async (userData) => {
    return fetchAPI("/users/signup", {
      // credentials: "include",
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    const data = await fetchAPI("/users/login", {
      // credentials: "include",
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // MOVE THIS BEFORE RETURN
    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log(
        "Token saved to localStorage:",
        data.token.substring(0, 20) + "..."
      );
    }

    return data; // Return at the END
  },

  logout: async () => {
    return fetchAPI("/users/logout", {
      credentials: "include",
      method: "GET",
    });
  },

  getCurrentUser: async () => {
    console.log("🔄 [authAPI] getCurrentUser() called");
    const token = localStorage.getItem("token");
    console.log("🔑 Token from localStorage:", token ? "Exists" : "Missing");

    return fetchAPI("/users/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

// Agent Application API calls
export const agentAPI = {
  applyForAgent: async (agentData) => {
    return fetchAPI("/agent-applications/apply", {
      method: "POST",
      body: JSON.stringify(agentData),
    });
  },

  getPendingAgents: async () => {
    return fetchAPI("/agent-applications/pending", {
      method: "GET",
    });
  },

  approveAgent: async (userId) => {
    return fetchAPI(`/agent-applications/${userId}/approve`, {
      method: "PATCH",
    });
  },

  rejectAgent: async (userId) => {
    return fetchAPI(`/agent-applications/${userId}/reject`, {
      method: "PATCH",
    });
  },
};

// Wishlist API calls
export const wishlistAPI = {
  checkWishlist: async (propertyId) => {
    return fetchAPI(`/wishlist/check/${propertyId}`);
  },

  toggleWishlist: async (propertyId) => {
    return fetchAPI("/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ property: propertyId }),
    });
  },

  getWishlist: async () => {
    const token = localStorage.getItem("token");
    return fetchAPI("/wishlist", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  addToWishlist: async (propertyId) => {
    return fetchAPI("/wishlist/add", {
      method: "POST",
      body: JSON.stringify({ property: propertyId }),
    });
  },

  removeFromWishlist: async (propertyId) => {
    return fetchAPI(`/wishlist/remove/${propertyId}`, {
      method: "DELETE",
    });
  },

  clearWishlist: async () => {
    return fetchAPI("/wishlist/clear", {
      method: "DELETE",
    });
  },
};

// Properties API calls
export const propertyAPI = {
  getAllProperties: async (queryParams = {}) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const endpoint = queryString ? `/properties?${queryString}` : "/properties";
    return fetchAPI(endpoint);
  },

  getProperty: async (propertyId) => {
    return fetchAPI(`/properties/${propertyId}`);
  },

  createProperty: async (propertyData) => {
    return fetchAPI("/properties", {
      method: "POST",
      body: JSON.stringify(propertyData),
    });
  },

  updateProperty: async (propertyId, propertyData) => {
    return fetchAPI(`/properties/${propertyId}`, {
      method: "PATCH",
      body: JSON.stringify(propertyData),
    });
  },

  deleteProperty: async (propertyId) => {
    return fetchAPI(`/properties/${propertyId}`, {
      method: "DELETE",
    });
  },
};

// Utility function to check authentication status
export const checkAuthStatus = async () => {
  try {
    await fetchAPI("/users/me");
    return true;
  } catch (error) {
    if (error.status === 401) {
      return false;
    }
    throw error;
  }
};

// Payment API calls
export const paymentAPI = {
  // Initialize payment for rental
  initializeRentalPayment: async (bookingId, userEmail) => {
    return fetchAPI(`/payments/initialize/${bookingId}`, {
      method: "POST",
      body: JSON.stringify({
        email: userEmail,
        type: "rental",
      }),
    });
  },

  // Initialize payment for purchase
  initializePurchasePayment: async (bookingId, userEmail) => {
    return fetchAPI(`/payments/initialize/${bookingId}`, {
      method: "POST",
      body: JSON.stringify({
        email: userEmail,
        type: "purchase",
      }),
    });
  },

  // Verify payment
  verifyPayment: async (reference) => {
    return fetchAPI(`/payments/verify/${reference}`);
  },

  // Get payment history
  getPaymentHistory: async () => {
    return fetchAPI("/payments/history");
  },

  // Get payment by ID
  getPayment: async (paymentId) => {
    return fetchAPI(`/payments/${paymentId}`);
  },
};
