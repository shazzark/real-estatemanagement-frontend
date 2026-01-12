import { fetchAPI } from "./api";

export const bookingAPI = {
  getAll: async () => {
    const data = await fetchAPI("/bookings");
    return data.data.bookings;
  },

  getById: async (id) => {
    const data = await fetchAPI(`/bookings/${id}`);
    return data.data.booking;
  },

  create: async (bookingData) => {
    const data = await fetchAPI("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    });
    return data.data.booking;
  },

  update: async (id, updates) => {
    const data = await fetchAPI(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return data.data.booking;
  },

  cancel: async (id, reason) => {
    const data = await fetchAPI(`/bookings/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ cancellationReason: reason }),
    });
    return data.data.booking;
  },

  confirm: async (id) => {
    const data = await fetchAPI(`/bookings/${id}/confirm`, {
      method: "PATCH",
    });
    return data.data.booking;
  },
};
