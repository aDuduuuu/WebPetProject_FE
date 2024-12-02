import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import clientApi from '../client-api/rest-client';

const DetailPage = ({ type }) => {
  const { id } = useParams(); // Get ID from URL params
  const [detail, setDetail] = useState(null); // Store spa or trainer details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch details on component mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Determine API path based on type
        const apiService = type === 'spa' ? clientApi.service('spas') : clientApi.service('trainers');
        const response = await apiService.get(id);

        if (response.EC === 0) {
          setDetail(response.DT);
        } else {
          setError(response.EM);
        }
      } catch (err) {
        setError('Failed to fetch details');
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  // Render loading state
  if (loading) {
    return (
      <div className="detail-container flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="detail-content p-6">
          <h1 className="text-3xl font-bold text-gray-700">Loading Details...</h1>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="detail-container flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="detail-content p-6">
          <h1 className="text-3xl font-bold text-gray-700">Error</h1>
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Render details page
  return (
    <div className="detail-container flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="detail-content p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Image Section */}
            <div className="md:w-1/3 mb-4 md:mb-0">
              <img
                src={detail.image || 'https://via.placeholder.com/300?text=No+Image'}
                alt={detail.name}
                className="w-full h-auto rounded-lg"
              />
            </div>
            {/* Details Section */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-teal-600 mb-4">{detail.name}</h1>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Location: </span>
                {`${detail.location.street || ''}, ${detail.location.ward || ''}, ${detail.location.district || ''}, ${detail.location.province || ''}`}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Services: </span>
                {detail.services && detail.services.length > 0 ? detail.services.join(', ') : 'No services available'}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Contact: </span>
                {`Phone: ${detail.contactInfo?.phone || 'N/A'}, Email: ${detail.contactInfo?.email || 'N/A'}`}
              </p>
            </div>
          </div>
          {/* Additional Information Section */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Additional Information</h2>
            <p className="text-gray-700">
              {`${detail.description}`}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailPage;


