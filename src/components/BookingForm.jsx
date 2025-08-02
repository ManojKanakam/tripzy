import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrips, checkAvailability, createBooking } from '../services/api';

const BookingForm = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    date: ''
  });
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const loadTrip = async () => {
    try {
      const trips = await getTrips();
      const selectedTrip = trips.find(t => t.id === parseInt(tripId));
      setTrip(selectedTrip);
    } catch (error) {
      setError('Failed to load trip');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'date') setAvailability(null); // Reset when date changes
  };

  const handleCheckAvailability = async () => {
    if (!formData.date) {
      setError('Please select a date first');
      return;
    }

    try {
      const result = await checkAvailability(formData.date);
      setAvailability(result);
      setError('');
    } catch (error) {
      setError('Failed to check availability');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!formData.userName || !formData.userEmail || !formData.date) {
      setError('Please fill all required fields');
      return;
    }

    if (!availability?.available) {
      setError('Please check availability first');
      return;
    }

    setLoading(true);
    try {
      const result = await createBooking({
        tripId: parseInt(tripId),
        ...formData
      });
      navigate(`/confirmation/${result.booking.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return <div className="text-center py-12">Loading trip details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img src={trip.image} alt={trip.title} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{trip.title}</h2>
            <p className="text-gray-600 mb-4">{trip.description}</p>
            <div className="flex justify-between mb-6">
              <span>Duration: {trip.duration}</span>
              <span className="font-bold text-green-600">Price: ${trip.price}</span>
            </div>

            {/* Availability Check */}
            <div className="border-t pt-4">
              <div className="flex gap-4 mb-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={handleCheckAvailability}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Check Availability
                </button>
              </div>

              {availability && (
                <div className={`p-4 rounded-lg ${
                  availability.available 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {availability.available ? (
                    <p>✅ Available! {availability.availableVans} vans available out of {availability.totalVans}</p>
                  ) : (
                    <p>❌ No vans available. Please choose another date.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Book Your Trip</h3>
          
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Mock Payment Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Payment Information</h4>
              <div className="bg-yellow-50 p-4 rounded mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Demo Mode:</strong> This is a mock payment. No actual charges will be made.
                </p>
              </div>

              <input
                type="text"
                value="**** **** **** 1234"
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-50 mb-2"
                placeholder="Card Number"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value="12/26"
                  readOnly
                  className="px-3 py-2 border rounded-md bg-gray-50"
                  placeholder="MM/YY"
                />
                <input
                  type="text"
                  value="***"
                  readOnly
                  className="px-3 py-2 border rounded-md bg-gray-50"
                  placeholder="CVV"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-green-600">${trip.price}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!availability?.available || loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold text-lg"
            >
              {loading ? 'Processing...' : `Pay $${trip.price} & Book Trip`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;