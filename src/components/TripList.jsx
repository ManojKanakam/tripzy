import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrips } from '../services/api';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading trips...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Adventure
        </h1>
        <p className="text-xl text-gray-600">
          Book your perfect trip today and create unforgettable memories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={trip.image}
              alt={trip.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {trip.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {trip.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">{trip.duration}</span>
                <span className="text-lg font-bold text-green-600">${trip.price}</span>
              </div>
              <Link
                to={`/book/${trip.id}`}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold text-center block"
              >
                Book This Trip
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripList;