import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingAPI } from "../_lib/bookings";

export const useBookings = () => {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery("bookings", bookingAPI.getAll);

  const createMutation = useMutation(bookingAPI.create, {
    onSuccess: () => queryClient.invalidateQueries("bookings"),
  });

  const updateMutation = useMutation(
    ({ id, updates }) => bookingAPI.update(id, updates),
    {
      onSuccess: () => queryClient.invalidateQueries("bookings"),
    }
  );

  const cancelMutation = useMutation(
    ({ id, reason }) => bookingAPI.cancel(id, reason),
    {
      onSuccess: () => queryClient.invalidateQueries("bookings"),
    }
  );

  const confirmMutation = useMutation((id) => bookingAPI.confirm(id), {
    onSuccess: () => queryClient.invalidateQueries("bookings"),
  });

  return {
    bookingsQuery,
    createMutation,
    updateMutation,
    cancelMutation,
    confirmMutation,
  };
};
