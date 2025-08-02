import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingById } from '../services/api';

const Confirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      const data = await getBookingById(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadTicket = () => {
    const ticketContent = `
===========================================
           TRIPVAN BOOKING TICKET
===========================================

Booking ID: ${booking.id}
Trip: ${booking.tripName}
Customer: ${booking.userName}
Email: ${booking.userEmail}
Date: ${formatDate(booking.date)}
Price: $${booking.price}
Status: ${booking.status.toUpperCase()}

===========================================
Please present this ticket on your trip day.
Contact us: support@tripvan.com
===========================================
    `;

    const element = document.createElement('a');
    const file = new Blob([ticketContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `tripvan-ticket-${booking.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <div className="text-center py-12">Loading booking details...</div>;
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Booking not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-lg text-gray-600">
          Your trip has been successfully booked. Get ready for an amazing adventure!
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Booking Details</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Trip</p>
                <p className="font-semibold text-gray-900">{booking.tripName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{booking.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{booking.userEmail}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Trip Date</p>
                <p className="font-semibold text-gray-900">{formatDate(booking.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-green-600 capitalize">{booking.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="font-semibold text-gray-900">${booking.price}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
              <p className="font-mono text-lg font-semibold text-gray-900">{booking.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          onClick={downloadTicket}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold"
        >
          📥 Download Ticket
        </button>
        
        <Link
          to="/"
          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 font-semibold text-center"
        >
          Book Another Trip
        </Link>
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          Important Information
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• Please arrive 15 minutes before departure time</li>
          <li>• Bring a valid ID and your booking confirmation</li>
          <li>• Check weather conditions and dress appropriately</li>
          <li>• For cancellations, contact us 24 hours in advance</li>
        </ul>
      </div>

      <div className="text-center mt-8 text-gray-600">
        <p>Need help? Contact us at: support@tripvan.com | +1 (555) 123-4567</p>
      </div>
    </div>
  );
};

export default Confirmation;