// Simple API service without complex error handling
const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = `${API_URL}/api`;

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  
  return response.json();
};

// API functions
export const getTrips = () => apiCall('/trips');

export const checkAvailability = (date) => 
  apiCall('/check-availability', {
    method: 'POST',
    body: JSON.stringify({ date }),
  });

export const createBooking = (bookingData) =>
  apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });

export const getBookings = () => apiCall('/bookings');

export const getBookingById = (id) => apiCall(`/bookings/${id}`);

export const updateBookingStatus = (id, status) =>
  apiCall(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

export const deleteBooking = (id) =>
  apiCall(`/bookings/${id}`, {
    method: 'DELETE',
  });