import { apiRequest } from './apiClient';

const toApiStatus = (status) => {
  if (status === 'checked-in') return 'checked_in';
  if (status === 'checked-out') return 'checked_out';
  return status;
};

const toUiStatus = (status) => {
  if (status === 'checked_in') return 'checked-in';
  if (status === 'checked_out') return 'checked-out';
  return status;
};

const normalizeBooking = (booking) => ({
  ...booking,
  created_at: booking.createdAt ?? booking.created_at,
  status: toUiStatus(booking.status),
  cabins: booking.cabins || booking.cabin,
  guests: booking.guests || booking.guest,
});

export const getBookings = async ({ filter, sortBy, page }) => {
  const params = new URLSearchParams();

  if (filter?.field === 'status') {
    params.set('status', toApiStatus(filter.value));
  }

  if (sortBy?.field && sortBy?.direction) {
    params.set('sortBy', `${sortBy.field}-${sortBy.direction}`);
  }

  if (page) params.set('page', String(page));

  const response = await apiRequest(`/bookings?${params.toString()}`);
  const bookings = (response?.data?.bookings || []).map(normalizeBooking);

  return { data: bookings, count: response?.count ?? 0 };
};

export const getBooking = async (id) => {
  const response = await apiRequest(`/bookings/${id}`);
  return normalizeBooking(response?.data?.booking);
};

export const getBookingsAfterDate = async (date) => {
  const response = await apiRequest(
    `/bookings/after-date?date=${encodeURIComponent(date)}`,
  );

  return (response?.data?.bookings || []).map((booking) => ({
    ...booking,
    created_at: booking.createdAt ?? booking.created_at,
  }));
};

export const getStaysAfterDate = async (date) => {
  const response = await apiRequest(
    `/bookings/stays-after-date?date=${encodeURIComponent(date)}`,
  );

  return (response?.data?.bookings || []).map(normalizeBooking);
};

export const getStaysTodayActivity = async () => {
  const response = await apiRequest('/bookings/today-activity');
  return (response?.data?.bookings || []).map(normalizeBooking);
};

export const updateBooking = async (id, obj) => {
  const payload = {
    ...obj,
    ...(obj.status ? { status: toApiStatus(obj.status) } : {}),
  };

  const response = await apiRequest(`/bookings/${id}`, {
    method: 'PATCH',
    body: payload,
  });

  return normalizeBooking(response?.data?.booking);
};

export const deleteBooking = async (id) => {
  await apiRequest(`/bookings/${id}`, { method: 'DELETE' });
  return null;
};

export const createBooking = async (data) => {
  const response = await apiRequest('/bookings', {
    method: 'POST',
    body: data,
  });
  return normalizeBooking(response?.data?.booking);
};

export const checkCabinAvailability = async ({
  cabinId,
  startDate,
  endDate,
}) => {
  const params = new URLSearchParams({
    cabinId: String(cabinId),
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
  });
  const response = await apiRequest(
    `/bookings/check-availability?${params.toString()}`,
  );
  return response?.data?.available ?? true;
};
